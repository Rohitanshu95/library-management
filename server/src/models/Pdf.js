import mongoose from 'mongoose';

// PDF Study Material Catalog
const pdfMaterialSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    examCategory: {
      type: String,
      enum: ['OPSC / OAS', 'UPSC / IAS', 'Banking / RBI', 'Staff Selection (SSC)', 'Railway (RRB)', 'General Knowledge'],
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      default: 0, // 0 means Free to download/view
    },
    totalPages: {
      type: Number,
      default: 45,
    },
    fileSizeMb: {
      type: String,
      default: '4.2 MB',
    },
    fileUrl: {
      type: String,
      required: true,
    },
    previewPages: {
      type: Number,
      default: 5,
    },
    downloadCount: {
      type: Number,
      default: 0,
    },
    isPublished: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export const PdfMaterial = mongoose.model('PdfMaterial', pdfMaterialSchema);

// Student PDF Purchase / Entitlement
const pdfPurchaseSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    pdf: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'PdfMaterial',
      required: true,
    },
    purchasedAt: {
      type: Date,
      default: Date.now,
    },
    downloadCount: {
      type: Number,
      default: 0,
    },
    lastDownloadedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

export const PdfPurchase = mongoose.model('PdfPurchase', pdfPurchaseSchema);
