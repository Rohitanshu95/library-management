import mongoose from 'mongoose';

// Unified Order & Transaction Model
const orderSchema = new mongoose.Schema(
  {
    orderNumber: {
      type: String,
      unique: true,
      required: true, // e.g. "ORD-2026-8819"
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    itemType: {
      type: String,
      enum: ['LIBRARY_SUBSCRIPTION', 'COURSE', 'PDF', 'MOCK_TEST'],
      required: true,
    },
    itemId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    itemTitle: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      default: 'INR',
    },
    paymentGateway: {
      type: String,
      enum: ['RAZORPAY', 'OFFLINE_CASH', 'SIMULATED'],
      default: 'RAZORPAY',
    },
    razorpayOrderId: {
      type: String,
      default: '',
    },
    razorpayPaymentId: {
      type: String,
      default: '',
    },
    razorpaySignature: {
      type: String,
      default: '',
    },
    paymentStatus: {
      type: String,
      enum: ['PENDING', 'PAID', 'FAILED', 'REFUNDED'],
      default: 'PENDING',
    },
    receiptNumber: {
      type: String,
      unique: true,
      sparse: true,
    },
    emailNotificationSent: {
      type: Boolean,
      default: false,
    },
    metadata: {
      type: Object,
      default: {},
    },
  },
  { timestamps: true }
);

export const Order = mongoose.model('Order', orderSchema);

// Operating Expense Model (Section 4.4 & 5.2 in requirements document)
const expenseSchema = new mongoose.Schema(
  {
    category: {
      type: String,
      enum: ['Rent', 'Electricity & AC', 'Faculty Honorarium', 'Library Supplies & Books', 'Software & IT Infrastructure', 'Maintenance & Cleaning', 'Miscellaneous'],
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    expenseDate: {
      type: Date,
      default: Date.now,
    },
    receiptReference: {
      type: String,
      default: '',
    },
    recordedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

export const Expense = mongoose.model('Expense', expenseSchema);
