import mongoose from 'mongoose';

// Individual Lesson in Course
const lessonSchema = new mongoose.Schema({
  title: { type: String, required: true },
  chapter: { type: String, required: true },
  videoUrl: { type: String, required: true },
  durationMinutes: { type: Number, default: 45 },
  isFreePreview: { type: Boolean, default: false },
  notesAttachmentUrl: { type: String, default: '' },
  orderIndex: { type: Number, default: 1 },
});

// Main Course Model
const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    examCategory: {
      type: String,
      enum: ['OPSC / OAS', 'UPSC / IAS', 'Banking / RBI', 'Staff Selection (SSC)', 'Railway (RRB)', 'State Police'],
      required: true,
    },
    instructor: {
      name: { type: String, required: true },
      designation: { type: String, default: 'Ex-Civil Servant & Faculty' },
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    originalPrice: {
      type: Number,
      default: 0,
    },
    validityMonths: {
      type: Number,
      default: 12,
    },
    thumbnail: {
      type: String,
      default: '',
    },
    badge: {
      type: String,
      default: 'Comprehensive Batch',
    },
    syllabus: [String],
    lessons: [lessonSchema],
    isPublished: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export const Course = mongoose.model('Course', courseSchema);

// Course Enrollment & Student Progress
const courseEnrollmentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: true,
    },
    completedLessons: [
      {
        type: mongoose.Schema.Types.ObjectId,
      },
    ],
    lastWatchedLesson: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
    },
    progressPercent: {
      type: Number,
      default: 0,
    },
    enrolledAt: {
      type: Date,
      default: Date.now,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);

export const CourseEnrollment = mongoose.model('CourseEnrollment', courseEnrollmentSchema);
