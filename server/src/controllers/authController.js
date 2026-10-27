import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';

const generateToken = (userId, role) => {
  return jwt.sign(
    { id: userId, role },
    process.env.JWT_SECRET || 'demo_secret_key_institute_platform_2026',
    { expiresIn: '7d' }
  );
};

// @desc    Register a new student/aspirant
// @route   POST /api/auth/register
// @access  Public
export const register = async (req, res) => {
  try {
    const { name, email, phone, password, role } = req.body;

    if (!name || !email || !phone || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide full name, email, phone number, and password.',
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'A candidate profile already exists with this email address.',
      });
    }

    // Self-registration is restricted to STUDENT role for security
    const assignedRole = role && ['SUPER_ADMIN', 'LIBRARY_OPERATOR', 'CONTENT_MANAGER', 'TEST_MANAGER'].includes(role)
      ? 'STUDENT'
      : (role || 'STUDENT');

    const newUser = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      phone: phone.trim(),
      password,
      role: assignedRole,
    });

    const token = generateToken(newUser._id, newUser.role);

    return res.status(201).json({
      success: true,
      message: 'Candidate registration successful! Welcome to the State Public Academy.',
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone,
        role: newUser.role,
        isProfileComplete: newUser.isProfileComplete,
        profile: newUser.profile,
      },
    });
  } catch (error) {
    console.error('Registration Error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error during registration.',
    });
  }
};

// @desc    Authenticate User (Student or Admin / Staff)
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res) => {
  try {
    const { email, password, requestedRole } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required.',
      });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials. No account found with this email.',
      });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials. Incorrect password.',
      });
    }

    // Role check if the login screen specified a targeted portal (e.g., student vs official admin)
    if (requestedRole === 'ADMIN' && user.role === 'STUDENT') {
      return res.status(403).json({
        success: false,
        message: 'Access restricted: This portal is for authorized administrative staff only. Please use the Student Login tab.',
      });
    }

    if (requestedRole === 'STUDENT' && user.role !== 'STUDENT') {
      // Officials can view student dashboard or admin dashboard
    }

    const token = generateToken(user._id, user.role);

    return res.status(200).json({
      success: true,
      message: `Login successful. Welcome back, ${user.name}!`,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        isProfileComplete: user.isProfileComplete,
        profile: user.profile,
      },
    });
  } catch (error) {
    console.error('Login Error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error during login.',
    });
  }
};

// @desc    Get Current Logged-in User Profile
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    return res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Update Persistent Student Application Profile
// @route   PUT /api/auth/profile
// @access  Private (Student & Admin)
export const updateProfile = async (req, res) => {
  try {
    const {
      fatherName,
      dob,
      gender,
      idProofType,
      idProofNumber,
      street,
      city,
      state,
      pinCode,
      targetExam,
      emergencyContact,
      educationQualification,
    } = req.body;

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found.',
      });
    }

    // Update persistent profile fields
    if (fatherName !== undefined) user.profile.fatherName = fatherName;
    if (dob !== undefined) user.profile.dob = dob;
    if (gender !== undefined) user.profile.gender = gender;
    if (idProofType !== undefined) user.profile.idProofType = idProofType;
    if (idProofNumber !== undefined) user.profile.idProofNumber = idProofNumber;
    if (street !== undefined) user.profile.address.street = street;
    if (city !== undefined) user.profile.address.city = city;
    if (state !== undefined) user.profile.address.state = state;
    if (pinCode !== undefined) user.profile.address.pinCode = pinCode;
    if (targetExam !== undefined) user.profile.targetExam = targetExam;
    if (emergencyContact !== undefined) user.profile.emergencyContact = emergencyContact;
    if (educationQualification !== undefined) user.profile.educationQualification = educationQualification;

    // Validate completeness
    const p = user.profile;
    const isComplete = Boolean(
      p.fatherName && p.dob && p.idProofType && p.idProofNumber && p.address?.city && p.targetExam
    );
    user.isProfileComplete = isComplete;

    await user.save();

    return res.status(200).json({
      success: true,
      message: 'Student application profile updated successfully!',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        isProfileComplete: user.isProfileComplete,
        profile: user.profile,
      },
    });
  } catch (error) {
    console.error('Update Profile Error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error updating profile.',
    });
  }
};

// @desc    Fast Demo Quick-Login (Used for presentation showcase)
// @route   POST /api/auth/demo-login
// @access  Public
export const demoLogin = async (req, res) => {
  try {
    const { role = 'STUDENT' } = req.body;
    let targetEmail = 'student@demo.gov.in';

    if (role === 'SUPER_ADMIN') {
      targetEmail = 'admin@demo.gov.in';
    } else if (role === 'LIBRARY_OPERATOR') {
      targetEmail = 'library@demo.gov.in';
    }

    let user = await User.findOne({ email: targetEmail });

    // Fallback if seeder hasn't run yet
    if (!user) {
      user = await User.create({
        name: role === 'SUPER_ADMIN' ? 'Dr. Sanjeev Mohanty (Director)' : (role === 'LIBRARY_OPERATOR' ? 'Ramesh Nayak (Library Desk)' : 'Aakash Pattnaik (Aspirant)'),
        email: targetEmail,
        phone: '9876543210',
        password: 'password123',
        role: role,
        isProfileComplete: true,
        profile: {
          fatherName: 'B. C. Pattnaik',
          dob: '1999-05-14',
          gender: 'Male',
          idProofType: 'Aadhaar',
          idProofNumber: '7894-5612-3021',
          address: { street: 'Plot 42, Saheed Nagar', city: 'Bhubaneswar', state: 'Odisha', pinCode: '751007' },
          targetExam: 'OPSC / OAS',
          emergencyContact: '9876543211',
          educationQualification: 'B.Tech / Graduate',
        },
      });
    }

    const token = generateToken(user._id, user.role);

    return res.status(200).json({
      success: true,
      message: `Demo Showcase Quick Login as ${user.role}`,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        isProfileComplete: user.isProfileComplete,
        profile: user.profile,
      },
    });
  } catch (error) {
    console.error('Demo Login Error:', error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
