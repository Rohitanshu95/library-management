import { Inquiry } from '../models/Inquiry.js';

// @desc    Submit candidate inquiry / lead
// @route   POST /api/inquiries
// @access  Public
export const submitInquiry = async (req, res) => {
  try {
    const { name, phone, email, areaOfInterest, message } = req.body;

    if (!name || !phone || !message) {
      return res.status(400).json({
        success: false,
        message: 'Name, phone number, and query message are required.',
      });
    }

    const count = await Inquiry.countDocuments();
    const inquiryNumber = `INQ-${new Date().getFullYear()}-${String(count + 101).padStart(4, '0')}`;

    const inquiry = await Inquiry.create({
      inquiryNumber,
      name: name.trim(),
      phone: phone.trim(),
      email: email?.trim() || '',
      areaOfInterest: areaOfInterest || 'Physical Library',
      message: message.trim(),
      status: 'NEW',
    });

    return res.status(201).json({
      success: true,
      message: 'Your inquiry has been submitted successfully. An admission officer will follow up with you shortly.',
      inquiryNumber: inquiry.inquiryNumber,
      inquiry,
    });
  } catch (error) {
    console.error('Submit Inquiry Error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error submitting inquiry.',
    });
  }
};

// @desc    Get all inquiries (with search & status filter)
// @route   GET /api/inquiries
// @access  Private (Staff / Admin)
export const getInquiries = async (req, res) => {
  try {
    const { status, search } = req.query;
    const filter = {};

    if (status && status !== 'ALL') {
      filter.status = status;
    }

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
        { inquiryNumber: { $regex: search, $options: 'i' } },
      ];
    }

    const inquiries = await Inquiry.find(filter).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: inquiries.length,
      inquiries,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update inquiry status & add internal officer note
// @route   PUT /api/inquiries/:id/status
// @access  Private (Staff / Admin)
export const updateInquiryStatus = async (req, res) => {
  try {
    const { status, note } = req.body;
    const inquiry = await Inquiry.findById(req.params.id);

    if (!inquiry) {
      return res.status(404).json({ success: false, message: 'Inquiry not found.' });
    }

    if (status) {
      inquiry.status = status;
    }

    if (note) {
      inquiry.notes.push({
        note,
        author: req.user?.name || 'Duty Officer',
        createdAt: new Date(),
      });
    }

    await inquiry.save();

    return res.status(200).json({
      success: true,
      message: 'Inquiry status and notes updated.',
      inquiry,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
