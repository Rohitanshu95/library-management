import { User } from '../models/User.js';
import { Inquiry } from '../models/Inquiry.js';
import { LibrarySubscription } from '../models/Library.js';
import { Order, Expense } from '../models/Order.js';
import { Course } from '../models/Course.js';
import { MockTest } from '../models/Test.js';

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
