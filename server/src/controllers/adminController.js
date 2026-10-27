import { User } from '../models/User.js';
import { Inquiry } from '../models/Inquiry.js';
import { LibrarySubscription, LibraryAttendance } from '../models/Library.js';
import { Order, Expense } from '../models/Order.js';
import { Course, CourseEnrollment } from '../models/Course.js';
import { PdfPurchase } from '../models/Pdf.js';
import { TestAttempt } from '../models/Test.js';

// @desc    Get High-Level Administrative Metrics
// @route   GET /api/admin/metrics
// @access  Private (Super Admin / Staff)
export const getAdminMetrics = async (req, res) => {
  try {
    const totalStudents = await User.countDocuments({ role: 'STUDENT' });
    const activeMemberships = await LibrarySubscription.countDocuments({ status: 'ACTIVE' });
    const pendingInquiries = await Inquiry.countDocuments({ status: { $in: ['NEW', 'FOLLOW_UP'] } });
    
    // Revenue Collections
    const paidOrders = await Order.find({ paymentStatus: 'PAID' });
    const totalRevenue = paidOrders.reduce((sum, ord) => sum + (ord.amount || 0), 0);

    // Revenue by module
    const revenueByModule = {
      LIBRARY: paidOrders.filter((o) => o.itemType === 'LIBRARY_SUBSCRIPTION').reduce((sum, o) => sum + o.amount, 0),
      COURSE: paidOrders.filter((o) => o.itemType === 'COURSE').reduce((sum, o) => sum + o.amount, 0),
      PDF: paidOrders.filter((o) => o.itemType === 'PDF').reduce((sum, o) => sum + o.amount, 0),
      MOCK_TEST: paidOrders.filter((o) => o.itemType === 'MOCK_TEST').reduce((sum, o) => sum + o.amount, 0),
    };

    // Total Expenses
    const expenses = await Expense.find();
    const totalExpenses = expenses.reduce((sum, exp) => sum + (exp.amount || 0), 0);

    return res.status(200).json({
      success: true,
      metrics: {
        totalStudents,
        activeMemberships,
        pendingInquiries,
        totalRevenue,
        totalExpenses,
        netBalance: totalRevenue - totalExpenses,
        revenueByModule,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get All Registered Aspirants (with search & filters)
// @route   GET /api/admin/users
// @access  Private (Super Admin)
export const getAllUsers = async (req, res) => {
  try {
    const { search, targetExam, status } = req.query;
    const filter = { role: 'STUDENT' };

    if (status && status !== 'ALL') {
      filter.status = status;
    }

    if (targetExam && targetExam !== 'ALL') {
      filter['profile.targetExam'] = targetExam;
    }

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
        { 'profile.idProofNumber': { $regex: search, $options: 'i' } },
      ];
    }

    const users = await User.find(filter).select('-password').sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: users.length,
      users,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get In-Depth Student Dossier (Profile, Pass, Enrollments, Tests, Orders)
// @route   GET /api/admin/users/:id
// @access  Private (Super Admin)
export const getUserDossier = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ success: false, message: 'Student file not found.' });
    }

    const [subscriptions, enrollments, pdfPurchases, testAttempts, orders, attendanceLogs] = await Promise.all([
      LibrarySubscription.find({ user: user._id }).populate('plan').sort({ createdAt: -1 }),
      CourseEnrollment.find({ user: user._id }).populate('course').sort({ enrolledAt: -1 }),
      PdfPurchase.find({ user: user._id }).populate('pdf').sort({ purchasedAt: -1 }),
      TestAttempt.find({ user: user._id }).populate('test', 'title examCategory totalMarks durationMinutes').sort({ submitTime: -1 }),
      Order.find({ user: user._id }).sort({ createdAt: -1 }),
      LibraryAttendance.find({ user: user._id }).sort({ checkInTime: -1 }).limit(15),
    ]);

    return res.status(200).json({
      success: true,
      user,
      dossier: {
        subscriptions,
        enrollments,
        pdfPurchases,
        testAttempts,
        orders,
        attendanceLogs,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Toggle Student Account Status (ACTIVE vs SUSPENDED)
// @route   PUT /api/admin/users/:id/status
// @access  Private (Super Admin)
export const updateUserStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'Student account not found.' });
    }

    user.status = status;
    await user.save();

    return res.status(200).json({
      success: true,
      message: `Account status updated to ${status}.`,
      user: { id: user._id, name: user.name, status: user.status },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get All Transactions & Collections
// @route   GET /api/admin/transactions
// @access  Private (Admin / Finance)
export const getAllTransactions = async (req, res) => {
  try {
    const orders = await Order.find().populate('user', 'name email phone').sort({ createdAt: -1 });
    return res.status(200).json({ success: true, count: orders.length, orders });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Record Operating Expense
// @route   POST /api/admin/expenses
// @access  Private (Admin / Finance)
export const recordExpense = async (req, res) => {
  try {
    const { category, amount, description, receiptReference } = req.body;
    const expense = await Expense.create({
      category,
      amount: Number(amount),
      description,
      receiptReference,
      recordedBy: req.user._id,
    });
    return res.status(201).json({ success: true, message: 'Operating expense recorded.', expense });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
