import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: 6,
      select: false,
    },
    role: {
      type: String,
      enum: ['STUDENT', 'SUPER_ADMIN', 'LIBRARY_OPERATOR', 'CONTENT_MANAGER', 'TEST_MANAGER'],
      default: 'STUDENT',
    },
    avatar: {
      type: String,
      default: '',
    },
    isProfileComplete: {
      type: Boolean,
      default: false,
    },
    // Persistent Student Profile Fields (Required once before library application or course purchase)
    profile: {
      fatherName: { type: String, default: '' },
      dob: { type: String, default: '' },
      gender: { type: String, enum: ['Male', 'Female', 'Other', ''], default: '' },
      idProofType: {
        type: String,
        enum: ['Aadhaar', 'Voter ID', 'PAN Card', 'College/Govt ID', 'Passport', ''],
        default: '',
      },
      idProofNumber: { type: String, default: '' },
      address: {
        street: { type: String, default: '' },
        city: { type: String, default: '' },
        state: { type: String, default: 'Odisha' },
        pinCode: { type: String, default: '' },
      },
      targetExam: {
        type: String,
        enum: ['OPSC / OAS', 'UPSC / IAS', 'Banking / RBI', 'Staff Selection (SSC)', 'Railway (RRB)', 'State Police / Defense', 'General'],
        default: 'OPSC / OAS',
      },
      emergencyContact: { type: String, default: '' },
      educationQualification: { type: String, default: '' },
    },
    status: {
      type: String,
      enum: ['ACTIVE', 'SUSPENDED', 'PENDING_VERIFICATION'],
      default: 'ACTIVE',
    },
  },
  { timestamps: true }
);

// Hash password before saving
userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Compare password method
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

export const User = mongoose.model('User', userSchema);
