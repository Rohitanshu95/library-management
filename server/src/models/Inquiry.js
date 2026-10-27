import mongoose from 'mongoose';

const inquirySchema = new mongoose.Schema(
  {
    inquiryNumber: {
      type: String,
      unique: true,
      required: true,
    },
    name: {
      type: String,
      required: [true, 'Candidate name is required'],
      trim: true,
    },
    phone: {
      type: String,
      required: [true, 'Contact number is required'],
      trim: true,
    },
    email: {
      type: String,
      lowercase: true,
      trim: true,
      default: '',
    },
    areaOfInterest: {
      type: String,
      enum: ['Physical Library', 'OPSC / OAS Preparation', 'UPSC / IAS Foundation', 'Banking & SSC', 'Mock Test Series', 'Study Notes / PDFs', 'General Admission'],
      default: 'Physical Library',
    },
    message: {
      type: String,
      required: [true, 'Message / Query is required'],
      trim: true,
    },
    status: {
      type: String,
      enum: ['NEW', 'CONTACTED', 'FOLLOW_UP', 'CONVERTED', 'CLOSED'],
      default: 'NEW',
    },
    notes: [
      {
        note: String,
        author: String,
        createdAt: { type: Date, default: Date.now },
      },
    ],
    assignedStaff: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
  },
  { timestamps: true }
);

export const Inquiry = mongoose.model('Inquiry', inquirySchema);
