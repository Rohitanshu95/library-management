import mongoose from 'mongoose';

// Question Schema
const questionSchema = new mongoose.Schema({
  questionText: { type: String, required: true },
  options: [{ type: String, required: true }], // 4 multiple choice options
  correctOptionIndex: { type: Number, required: true }, // 0, 1, 2, or 3
  explanation: { type: String, default: '' },
  subjectTopic: { type: String, default: 'General Studies' },
  difficulty: { type: String, enum: ['Easy', 'Moderate', 'Hard'], default: 'Moderate' },
});

// Mock Test Schema
const mockTestSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    examCategory: {
      type: String,
      enum: ['OPSC / OAS', 'UPSC / IAS', 'Banking / RBI', 'Staff Selection (SSC)', 'Railway (RRB)'],
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    durationMinutes: {
      type: Number,
      required: true,
      default: 60,
    },
    totalMarks: {
      type: Number,
      required: true,
      default: 100,
    },
    positiveMarks: {
      type: Number,
      default: 2,
    },
    negativeMarks: {
      type: Number,
      default: 0.66,
    },
    passMarks: {
      type: Number,
      default: 33,
    },
    isFree: {
      type: Boolean,
      default: false,
    },
    price: {
      type: Number,
      default: 0,
    },
    questions: [questionSchema],
    isPublished: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export const MockTest = mongoose.model('MockTest', mockTestSchema);

// Student Exam Attempt
const testAttemptSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    test: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'MockTest',
      required: true,
    },
    startTime: {
      type: Date,
      default: Date.now,
    },
    submitTime: {
      type: Date,
      default: null,
    },
    answers: [
      {
        questionIndex: Number,
        selectedOption: { type: Number, default: -1 }, // -1 means unattempted
        isMarkedForReview: { type: Boolean, default: false },
        isCorrect: { type: Boolean, default: false },
      },
    ],
    score: {
      type: Number,
      default: 0,
    },
    totalCorrect: {
      type: Number,
      default: 0,
    },
    totalIncorrect: {
      type: Number,
      default: 0,
    },
    totalUnattempted: {
      type: Number,
      default: 0,
    },
    percentage: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ['IN_PROGRESS', 'SUBMITTED', 'AUTO_SUBMITTED'],
      default: 'IN_PROGRESS',
    },
    topicBreakdown: [
      {
        topic: String,
        correct: Number,
        total: Number,
      },
    ],
  },
  { timestamps: true }
);

export const TestAttempt = mongoose.model('TestAttempt', testAttemptSchema);
