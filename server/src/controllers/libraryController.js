import QRCode from 'qrcode';
import { LibraryPlan, LibrarySubscription, LibraryAttendance } from '../models/Library.js';
import { User } from '../models/User.js';

// @desc    Get all active Library Plans
// @route   GET /api/library/plans
// @access  Public
export const getLibraryPlans = async (req, res) => {
  try {
    const plans = await LibraryPlan.find({ isActive: true });
    return res.status(200).json({ success: true, count: plans.length, plans });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get Current Student's Active/History Library Subscriptions
// @route   GET /api/library/my-subscription
// @access  Private (Student)
export const getMyLibrarySubscription = async (req, res) => {
  try {
    const subscription = await LibrarySubscription.findOne({
      user: req.user._id,
      status: { $in: ['ACTIVE', 'EXPIRING_SOON'] },
    }).populate('plan');

    let qrDataUrl = '';
    if (subscription) {
      // Generate live visual QR Data URL for student pass
      qrDataUrl = await QRCode.toDataURL(subscription.qrCodeData, {
        width: 256,
        margin: 2,
        color: { dark: '#0a2540', light: '#ffffff' },
      });
    }

    // Fetch student's attendance history
    const attendanceHistory = subscription
      ? await LibraryAttendance.find({ subscription: subscription._id }).sort({ checkInTime: -1 }).limit(10)
      : [];

    return res.status(200).json({
      success: true,
      hasActiveSubscription: Boolean(subscription),
      subscription,
      qrDataUrl,
      attendanceHistory,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Front-Desk QR Verification & Attendance Check-In / Out
// @route   POST /api/library/verify-ticket
// @access  Private (Library Operator / Admin)
export const verifyTicketAndCheckIn = async (req, res) => {
  try {
    const { qrData, membershipId } = req.body;

    if (!qrData && !membershipId) {
      return res.status(400).json({
        success: false,
        message: 'QR Code payload or Membership ID is required.',
      });
    }

    const query = qrData ? { qrCodeData: qrData } : { membershipId: membershipId.trim() };
    const subscription = await LibrarySubscription.findOne(query)
      .populate('user', 'name email phone avatar profile')
      .populate('plan', 'name slotOptions');

    if (!subscription) {
      return res.status(404).json({
        success: false,
        valid: false,
        message: 'Invalid Pass: No active subscription found for this ticket.',
      });
    }

    // Check expiration
    const isExpired = new Date() > new Date(subscription.endDate);
    if (isExpired) {
      subscription.status = 'EXPIRED';
      await subscription.save();
      return res.status(200).json({
        success: true,
        valid: false,
        status: 'EXPIRED',
        message: `Membership expired on ${new Date(subscription.endDate).toLocaleDateString('en-IN')}. Renewal required.`,
        subscription,
      });
    }

    // Record Attendance
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let attendance = await LibraryAttendance.findOne({
      subscription: subscription._id,
      checkInTime: { $gte: today },
    });

    let actionTaken = 'ENTRY_LOGGED';
    if (!attendance) {
      attendance = await LibraryAttendance.create({
        subscription: subscription._id,
        user: subscription.user._id,
        checkInTime: new Date(),
        verifiedBy: req.user?._id || null,
        notes: `Checked in at Gate 1 for ${subscription.timeSlot?.name || 'General Access'}`,
      });
    } else {
      actionTaken = 'ALREADY_CHECKED_IN';
    }

    return res.status(200).json({
      success: true,
      valid: true,
      actionTaken,
      message: `Verified: Access granted for ${subscription.user.name}.`,
      subscription,
      attendance,
    });
  } catch (error) {
    console.error('Verify Ticket Error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};
