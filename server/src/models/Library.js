import mongoose from 'mongoose';

// Library Membership Tier / Plan
const libraryPlanSchema = new mongoose.Schema(
  {
    name: {
      type: String, // Monthly, Quarterly, Half-Yearly, Annual
      required: true,
      unique: true,
    },
    durationMonths: {
      type: Number,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      default: '',
    },
    features: [String],
    allowedDays: {
      type: String,
      default: 'Monday to Sunday (All Days)',
    },
    slotOptions: [
      {
        name: { type: String, required: true }, // e.g. "Morning Slot", "Evening Slot", "Full Day Access"
        timings: { type: String, required: true }, // e.g. "08:00 AM - 02:00 PM"
        capacity: { type: Number, default: 80 },
        occupiedSeats: { type: Number, default: 0 },
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export const LibraryPlan = mongoose.model('LibraryPlan', libraryPlanSchema);

// Student Library Subscription
const librarySubscriptionSchema = new mongoose.Schema(
  {
    membershipId: {
      type: String,
      unique: true,
      required: true, // e.g. "LIB-2026-0041"
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    plan: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'LibraryPlan',
      required: true,
    },
    timeSlot: {
      name: String,
      timings: String,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    amountPaid: {
      type: Number,
      required: true,
    },
    qrCodeData: {
      type: String, // Verification token / string encoded inside QR
      required: true,
    },
    status: {
      type: String,
      enum: ['ACTIVE', 'EXPIRING_SOON', 'EXPIRED', 'SUSPENDED'],
      default: 'ACTIVE',
    },
    paymentId: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

export const LibrarySubscription = mongoose.model('LibrarySubscription', librarySubscriptionSchema);

// Physical Gate Entry / Attendance Log
const libraryAttendanceSchema = new mongoose.Schema(
  {
    subscription: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'LibrarySubscription',
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    checkInTime: {
      type: Date,
      default: Date.now,
    },
    checkOutTime: {
      type: Date,
      default: null,
    },
    verifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    notes: {
      type: String,
      default: 'QR Verification Gate 1',
    },
  },
  { timestamps: true }
);

export const LibraryAttendance = mongoose.model('LibraryAttendance', libraryAttendanceSchema);
