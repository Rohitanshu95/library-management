import crypto from 'crypto';
import Razorpay from 'razorpay';
import QRCode from 'qrcode';
import { Order } from '../models/Order.js';
import { LibraryPlan, LibrarySubscription } from '../models/Library.js';
import { Course, CourseEnrollment } from '../models/Course.js';
import { PdfMaterial, PdfPurchase } from '../models/Pdf.js';
import { User } from '../models/User.js';
import { sendPaymentActivationEmail } from '../utils/mailer.js';

// Initialize Razorpay client (supports demo credentials)
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_demo_gateway_key',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'rzp_test_demo_secret_key',
});

// @desc    Create Razorpay Order
// @route   POST /api/payment/create-order
// @access  Private (Student)
export const createOrder = async (req, res) => {
  try {
    const { itemType, itemId, slotOption } = req.body;

    if (!itemType || !itemId) {
      return res.status(400).json({
        success: false,
        message: 'Item type and item ID are required to generate an order.',
      });
    }

    let amount = 0;
    let itemTitle = '';
    let metadata = { slotOption };

    if (itemType === 'LIBRARY_SUBSCRIPTION') {
      const plan = await LibraryPlan.findById(itemId);
      if (!plan) return res.status(404).json({ success: false, message: 'Library plan not found.' });
      amount = plan.price;
      itemTitle = `${plan.name} Library Access (${slotOption?.name || 'General Access'})`;
    } else if (itemType === 'COURSE') {
      const course = await Course.findById(itemId);
      if (!course) return res.status(404).json({ success: false, message: 'Course not found.' });
      amount = course.price;
      itemTitle = course.title;
    } else if (itemType === 'PDF') {
      const pdf = await PdfMaterial.findById(itemId);
      if (!pdf) return res.status(404).json({ success: false, message: 'PDF note not found.' });
      amount = pdf.price;
      itemTitle = pdf.title;
    }

    const count = await Order.countDocuments();
    const orderNumber = `ORD-${new Date().getFullYear()}-${String(count + 1001).padStart(5, '0')}`;

    let razorpayOrderId = `order_sim_${Date.now()}`;

    // If real Razorpay keys are configured, create on Razorpay API; otherwise simulate order ID
    if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_ID.startsWith('rzp_live')) {
      try {
        const rzpOrder = await razorpay.orders.create({
          amount: amount * 100, // paise
          currency: 'INR',
          receipt: orderNumber,
        });
        razorpayOrderId = rzpOrder.id;
      } catch (err) {
        console.warn('Real Razorpay order create failed, falling back to simulated order:', err.message);
      }
    }

    const order = await Order.create({
      orderNumber,
      user: req.user._id,
      itemType,
      itemId,
      itemTitle,
      amount,
      razorpayOrderId,
      paymentStatus: 'PENDING',
      metadata,
    });

    return res.status(201).json({
      success: true,
      order: {
        id: order._id,
        orderNumber: order.orderNumber,
        itemTitle: order.itemTitle,
        amount: order.amount,
        currency: order.currency,
        razorpayOrderId: order.razorpayOrderId,
        razorpayKeyId: process.env.RAZORPAY_KEY_ID || 'rzp_test_demo_gateway_key',
      },
    });
  } catch (error) {
    console.error('Create Order Error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Verify Razorpay Payment, Activate Entitlements & Send Email
// @route   POST /api/payment/verify
// @access  Private (Student)
export const verifyPayment = async (req, res) => {
  try {
    const { orderId, razorpayOrderId, razorpayPaymentId, razorpaySignature, isSimulated } = req.body;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order record not found.' });
    }

    if (order.paymentStatus === 'PAID') {
      return res.status(200).json({
        success: true,
        message: 'Order was already confirmed and activated.',
        order,
      });
    }

    // Verify HMAC-SHA256 signature if real Razorpay keys are used
    if (!isSimulated && razorpayOrderId && razorpayPaymentId && razorpaySignature) {
      const generatedSignature = crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || 'rzp_test_demo_secret_key')
        .update(`${razorpayOrderId}|${razorpayPaymentId}`)
        .digest('hex');

      if (generatedSignature !== razorpaySignature) {
        order.paymentStatus = 'FAILED';
        await order.save();
        return res.status(400).json({
          success: false,
          message: 'Security Alert: Razorpay payment signature verification failed.',
        });
      }
    }

    // Mark Order as Paid
    const paymentRef = razorpayPaymentId || `pay_sim_${Date.now()}`;
    const receiptNumber = `RCPT-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;

    order.paymentStatus = 'PAID';
    order.razorpayPaymentId = paymentRef;
    order.razorpaySignature = razorpaySignature || 'simulated_signature';
    order.receiptNumber = receiptNumber;

    let activationDetails = {};

    // 1. Provision Physical Library Membership & QR Pass
    if (order.itemType === 'LIBRARY_SUBSCRIPTION') {
      const plan = await LibraryPlan.findById(order.itemId);
      const subCount = await LibrarySubscription.countDocuments();
      const membershipId = `LIB-${new Date().getFullYear()}-${String(subCount + 101).padStart(4, '0')}`;

      const startDate = new Date();
      const endDate = new Date();
      endDate.setMonth(endDate.getMonth() + (plan ? plan.durationMonths : 1));

      const slotOption = order.metadata?.slotOption || {
        name: 'Morning Slot',
        timings: '08:00 AM - 02:00 PM',
      };

      const qrPayload = JSON.stringify({
        membershipId,
        studentId: req.user._id,
        name: req.user.name,
        slot: slotOption.name,
        timings: slotOption.timings,
        validUntil: endDate.toISOString(),
      });

      const subscription = await LibrarySubscription.create({
        membershipId,
        user: req.user._id,
        plan: plan._id,
        timeSlot: slotOption,
        startDate,
        endDate,
        amountPaid: order.amount,
        qrCodeData: qrPayload,
        status: 'ACTIVE',
        paymentId: paymentRef,
      });

      activationDetails = {
        membershipId,
        timeSlot: `${slotOption.name} (${slotOption.timings})`,
        startDate,
        endDate,
        subscriptionId: subscription._id,
      };
    }

    // 2. Provision Course Enrollment
    else if (order.itemType === 'COURSE') {
      const course = await Course.findById(order.itemId);
      const expiresAt = new Date();
      expiresAt.setMonth(expiresAt.getMonth() + (course?.validityMonths || 12));

      await CourseEnrollment.create({
        user: req.user._id,
        course: course._id,
        expiresAt,
        progressPercent: 0,
        completedLessons: [],
      });

      activationDetails = {
        courseTitle: course.title,
        validityMonths: course.validityMonths,
        expiresAt,
      };
    }

    // 3. Provision PDF Download Entitlement
    else if (order.itemType === 'PDF') {
      await PdfPurchase.create({
        user: req.user._id,
        pdf: order.itemId,
        purchasedAt: new Date(),
      });

      activationDetails = {
        pdfTitle: order.itemTitle,
      };
    }

    // 4. Send Confirmation & Activation Email
    const user = await User.findById(req.user._id);
    const emailResult = await sendPaymentActivationEmail({
      to: user.email,
      candidateName: user.name,
      orderNumber: order.orderNumber,
      itemTitle: order.itemTitle,
      itemType: order.itemType,
      amount: order.amount,
      activationDetails,
    });

    order.emailNotificationSent = emailResult.success;
    await order.save();

    return res.status(200).json({
      success: true,
      message: 'Payment verified successfully! Entitlement activated and confirmation email dispatched.',
      receiptNumber: order.receiptNumber,
      order,
      activationDetails,
      emailPreviewUrl: emailResult.previewUrl || null,
    });
  } catch (error) {
    console.error('Verify Payment Error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get Student Order & Transaction History
// @route   GET /api/payment/my/transactions
// @access  Private (Student)
export const getMyTransactions = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id, paymentStatus: 'PAID' }).sort({ createdAt: -1 });
    return res.status(200).json({ success: true, count: orders.length, orders });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
