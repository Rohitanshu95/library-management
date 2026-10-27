import { PdfMaterial, PdfPurchase } from '../models/Pdf.js';

// @desc    Get all study notes (PDFs)
// @route   GET /api/pdfs
// @access  Public
export const getPdfs = async (req, res) => {
  try {
    const { category } = req.query;
    const filter = { isPublished: true };
    if (category && category !== 'ALL') {
      filter.examCategory = category;
    }

    const pdfs = await PdfMaterial.find(filter);
    return res.status(200).json({ success: true, count: pdfs.length, pdfs });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get Student's Purchased / Unlocked PDFs
// @route   GET /api/pdfs/my/purchased
// @access  Private (Student)
export const getMyPurchasedPdfs = async (req, res) => {
  try {
    const purchases = await PdfPurchase.find({ user: req.user._id })
      .populate('pdf')
      .sort({ purchasedAt: -1 });

    return res.status(200).json({ success: true, count: purchases.length, purchases });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Record PDF Download action
// @route   POST /api/pdfs/:id/download
// @access  Private (Student)
export const recordPdfDownload = async (req, res) => {
  try {
    const pdf = await PdfMaterial.findById(req.params.id);
    if (!pdf) {
      return res.status(404).json({ success: false, message: 'PDF study note not found.' });
    }

    // Free notes are open; paid notes require entitlement
    if (pdf.price > 0) {
      const purchase = await PdfPurchase.findOne({ user: req.user._id, pdf: pdf._id });
      if (!purchase) {
        return res.status(403).json({
          success: false,
          message: 'Access Restricted: You must purchase this study material before downloading.',
        });
      }
      purchase.downloadCount += 1;
      purchase.lastDownloadedAt = new Date();
      await purchase.save();
    }

    pdf.downloadCount += 1;
    await pdf.save();

    return res.status(200).json({
      success: true,
      message: 'Download authorized.',
      fileUrl: pdf.fileUrl,
      title: pdf.title,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
