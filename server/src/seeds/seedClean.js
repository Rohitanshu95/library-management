import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

import { connectDB } from '../config/db.js';
import { User } from '../models/User.js';
import { Inquiry } from '../models/Inquiry.js';
import { LibraryPlan, LibrarySubscription, LibraryAttendance } from '../models/Library.js';
import { Course, CourseEnrollment } from '../models/Course.js';
import { PdfMaterial, PdfPurchase } from '../models/Pdf.js';
import { MockTest, TestAttempt } from '../models/Test.js';
import { Order, Expense } from '../models/Order.js';

const seedCleanCatalogOnly = async () => {
  try {
    await connectDB();
    console.log('[Clean Seeder] Purging dummy user activity while preserving official catalog...');

    // 1. Wipe all candidate activity, past orders, test attempts, and mock inquiries
    await User.deleteMany({});
    await Inquiry.deleteMany({});
    await LibraryPlan.deleteMany({});
    await LibrarySubscription.deleteMany({});
    await LibraryAttendance.deleteMany({});
    await Course.deleteMany({});
    await CourseEnrollment.deleteMany({});
    await PdfMaterial.deleteMany({});
    await PdfPurchase.deleteMany({});
    await MockTest.deleteMany({});
    await TestAttempt.deleteMany({});
    await Order.deleteMany({});
    await Expense.deleteMany({});

    console.log('[Clean Seeder] Cleaned all collections.');

    // 2. Create ONLY the Official Staff / Admin Account (clean director profile)
    await User.create({
      name: 'Director General',
      email: 'admin@stateacademy.gov.in',
      phone: '9861000001',
      password: 'adminpassword123',
      role: 'SUPER_ADMIN',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250',
      isProfileComplete: true,
      profile: {
        fatherName: 'State Administrative Service',
        dob: '1975-01-01',
        gender: 'Male',
        idProofType: 'Aadhaar',
        idProofNumber: 'OD-GOVT-0001',
        address: { street: 'Sachivalaya Marg, Unit 3', city: 'Bhubaneswar', state: 'Odisha', pinCode: '751001' },
        targetExam: 'OPSC / OAS',
        educationQualification: 'IAS / Academy Director',
      },
    });

    console.log('[Clean Seeder] Created Clean Admin account: admin@stateacademy.gov.in / adminpassword123');

    // 3. Physical Library Membership Plans (Clean catalog)
    await LibraryPlan.insertMany([
      {
        name: 'Monthly Study Pass',
        durationMonths: 1,
        price: 800,
        description: 'Ideal for trial preparation and short revision cycles with reserved ergonomic desk space.',
        features: [
          'High-Speed Gov-WiFi Access (1 Gbps)',
          'Air-conditioned reading hall with charging dock',
          'Access to physical state & central reference volumes',
          'Discussion room allocation (2 hrs/week)',
        ],
        allowedDays: 'Monday to Sunday (06:00 AM - 11:00 PM)',
        slotOptions: [
          { name: 'Morning Shift', timings: '06:00 AM - 01:00 PM', capacity: 100, occupiedSeats: 0 },
          { name: 'Afternoon Shift', timings: '01:00 PM - 07:00 PM', capacity: 100, occupiedSeats: 0 },
          { name: 'Night Owl Shift', timings: '07:00 PM - 11:30 PM', capacity: 60, occupiedSeats: 0 },
          { name: 'Full Day Dedicated Pass', timings: '07:00 AM - 10:00 PM', capacity: 80, occupiedSeats: 0 },
        ],
      },
      {
        name: 'Quarterly Dedicated Plan',
        durationMonths: 3,
        price: 2200,
        description: 'Recommended for Prelims exam preparation with locker facility and reserved seat allocation.',
        features: [
          'Dedicated Personal Locker',
          'Priority seat reservation in Silent Zone',
          'Unlimited digital newspaper & magazine archive',
          'Free access to monthly mock test printouts',
        ],
        allowedDays: 'All 7 Days including State Holidays',
        slotOptions: [
          { name: 'Morning Shift', timings: '06:00 AM - 01:00 PM', capacity: 100, occupiedSeats: 0 },
          { name: 'Full Day Dedicated Pass', timings: '07:00 AM - 10:00 PM', capacity: 80, occupiedSeats: 0 },
        ],
      },
      {
        name: 'Half-Yearly Foundation Pass',
        durationMonths: 6,
        price: 4200,
        description: 'Long-term package covering both Prelims and Mains study periods.',
        features: [
          'All Quarterly benefits included',
          'Personal book deposit rack',
          'Counseling session with senior civil servants',
          '50% discount on test series evaluation',
        ],
        allowedDays: 'All 7 Days (365 Days)',
        slotOptions: [
          { name: 'Full Day Dedicated Pass', timings: '07:00 AM - 10:00 PM', capacity: 80, occupiedSeats: 0 },
        ],
      },
      {
        name: 'Annual Officer Aspirant Fellowship',
        durationMonths: 12,
        price: 7500,
        description: 'Comprehensive 1-year unlimited access with institutional membership perks.',
        features: [
          'Fixed Personal Cubicle with Nameplate',
          '24x7 study room access during exam week',
          'Unlimited mock test series & personalized mentorship',
          'Official Academy Gold Member ID Card',
        ],
        allowedDays: '24x7 Access',
        slotOptions: [
          { name: 'Full Day Dedicated Pass', timings: '07:00 AM - 11:00 PM', capacity: 50, occupiedSeats: 0 },
        ],
      },
    ]);

    console.log('[Clean Seeder] Library plans catalog seeded.');

    // 4. Government Exam Online Courses (Clean catalog)
    await Course.insertMany([
      {
        title: 'OPSC / OAS 2026: Integrated Prelims & Mains Comprehensive Batch',
        examCategory: 'OPSC / OAS',
        instructor: {
          name: 'Shri B. K. Jena, OAS (Retd.)',
          designation: 'Ex-Additional Secretary & Chief Mentor',
        },
        description: 'Complete syllabus coverage for Odisha Civil Services Examination. Includes Odisha History, Geography, Polity, General Studies I & II with bilingual lecture notes.',
        price: 4999,
        originalPrice: 9999,
        validityMonths: 12,
        badge: 'Top Rated Batch',
        thumbnail: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80&w=600',
        syllabus: [
          'Unit 1: Odisha History, Architecture & Freedom Struggle',
          'Unit 2: Physical & Socio-Economic Geography of Odisha',
          'Unit 3: Indian Polity & Odisha State Administrative Structure',
          'Unit 4: Public Finance, Economy & NITI Aayog Reports',
          'Unit 5: Answer Writing Pedagogy for GS Papers I, II & III',
        ],
        lessons: [
          {
            title: 'Orientation & Exam Pattern Strategy for OPSC OAS 2026',
            chapter: 'Orientation',
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
            durationMinutes: 45,
            isFreePreview: true,
            orderIndex: 1,
          },
          {
            title: 'Ancient & Medieval History of Kalinga & Utkal',
            chapter: 'Odisha Heritage',
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
            durationMinutes: 52,
            isFreePreview: true,
            orderIndex: 2,
          },
          {
            title: 'Odisha Temple Architecture & Cultural Legacy',
            chapter: 'Odisha Heritage',
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
            durationMinutes: 60,
            isFreePreview: false,
            orderIndex: 3,
          },
          {
            title: 'Constitution of India: Preamble, Fundamental Rights & DPSP',
            chapter: 'Polity',
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
            durationMinutes: 58,
            isFreePreview: false,
            orderIndex: 4,
          },
        ],
      },
      {
        title: 'UPSC / IAS: General Studies Foundation & Current Affairs Module',
        examCategory: 'UPSC / IAS',
        instructor: {
          name: 'Prof. Alok Sharma',
          designation: 'Senior Faculty & UPSC Mentor',
        },
        description: 'Analytical coverage of Indian Constitution, International Relations, Economic Survey, and Ecology & Biodiversity.',
        price: 6999,
        originalPrice: 12999,
        validityMonths: 18,
        badge: 'All India Batch',
        thumbnail: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&q=80&w=600',
        syllabus: [
          'Indian Economy & Budget 2026-27 Analysis',
          'International Relations & Strategic Affairs',
          'Modern Indian History & Post-Independence Consolidation',
          'Science, Technology & Space Missions',
        ],
        lessons: [
          {
            title: 'Understanding UPSC Syllabus Micro-Themes',
            chapter: 'Strategy',
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
            durationMinutes: 40,
            isFreePreview: true,
            orderIndex: 1,
          },
          {
            title: 'Monetary Policy & Inflation Dynamics',
            chapter: 'Economy',
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4',
            durationMinutes: 55,
            isFreePreview: false,
            orderIndex: 2,
          },
        ],
      },
      {
        title: 'Banking & Staff Selection: Quantitative Aptitude & Reasoning Mastery',
        examCategory: 'Banking / RBI',
        instructor: {
          name: 'Smt. Minati Sahu',
          designation: 'Quant Specialist & Speed Math Author',
        },
        description: 'Short-cut techniques, Data Interpretation, High-Level Puzzles, and English Comprehension for SBI PO, IBPS & SSC CGL.',
        price: 1999,
        originalPrice: 3999,
        validityMonths: 6,
        badge: 'Speed Batch',
        thumbnail: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=600',
        syllabus: [
          'Speed Calculation & Mental Arithmetic',
          'Arithmetic Mastery: Percentages, Profit-Loss, Time-Work',
          'Advanced Analytical & Logical Puzzles',
        ],
        lessons: [
          {
            title: 'Vedic Math Shortcuts for Simplification',
            chapter: 'Quant Foundations',
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
            durationMinutes: 35,
            isFreePreview: true,
            orderIndex: 1,
          },
        ],
      },
    ]);

    console.log('[Clean Seeder] Course catalogue seeded.');

    // 5. PDF Study Notes & Documents Catalog (Clean catalog)
    await PdfMaterial.insertMany([
      {
        title: 'Odisha General Knowledge & State Heritage Handbook 2026',
        examCategory: 'OPSC / OAS',
        description: 'Comprehensive static GK notes covering state demographics, rivers, national parks, mineral resources, and tribal culture.',
        price: 0,
        totalPages: 124,
        fileSizeMb: '5.4 MB',
        fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        previewPages: 10,
        downloadCount: 0,
      },
      {
        title: 'Indian Polity & Constitutional Amendments Quick Revision Chart',
        examCategory: 'UPSC / IAS',
        description: 'High-yield tabular summary of all 106 constitutional amendments, landmark Supreme Court verdicts, and key articles.',
        price: 99,
        totalPages: 68,
        fileSizeMb: '3.1 MB',
        fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        previewPages: 6,
        downloadCount: 0,
      },
      {
        title: 'Economic Survey of Odisha & Budget Highlights 2025-26',
        examCategory: 'OPSC / OAS',
        description: 'Official statistical summary of state GDP, agricultural schemes (KALIA, BSKY), industrial corridors, and fiscal deficit analysis.',
        price: 149,
        totalPages: 85,
        fileSizeMb: '4.8 MB',
        fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        previewPages: 8,
        downloadCount: 0,
      },
      {
        title: 'Banking & Quantitative Aptitude 1000 High-Frequency Questions',
        examCategory: 'Banking / RBI',
        description: 'Solved practice questions for DI sets, series, quadratic equations, and arithmetic word problems with detailed shortcuts.',
        price: 0,
        totalPages: 160,
        fileSizeMb: '8.2 MB',
        fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        previewPages: 15,
        downloadCount: 0,
      },
    ]);

    console.log('[Clean Seeder] PDF catalog seeded.');

    // 6. Online Mock Examination (Clean CBT)
    await MockTest.create({
      title: 'OPSC OAS Prelims Mock Exam 1: General Studies Paper I',
      examCategory: 'OPSC / OAS',
      description: 'Official standard simulation of Odisha Civil Services Prelims Exam. Covers History, Geography, Polity, Science, Environment & Odisha GK.',
      durationMinutes: 45,
      totalMarks: 40,
      positiveMarks: 2.0,
      negativeMarks: 0.66,
      passMarks: 16.0,
      isFree: true,
      price: 0,
      questions: [
        {
          questionText: 'Who was the leader of the famous Paika Rebellion (1817) against the British East India Company in Odisha?',
          options: ['Bakshi Jagabandhu Bidyadhara', 'Surendra Sai', 'Chakhi Khuntia', 'Madhu Sudan Das'],
          correctOptionIndex: 0,
          explanation: 'Bakshi Jagabandhu Bidyadhara was the military commander of the king of Khurda and led the famous Paika Rebellion in 1817.',
          subjectTopic: 'Odisha History',
          difficulty: 'Easy',
        },
        {
          questionText: 'Under which Article of the Constitution of India is the High Court of a State established?',
          options: ['Article 124', 'Article 214', 'Article 226', 'Article 324'],
          correctOptionIndex: 1,
          explanation: 'Article 214 of the Constitution provides that there shall be a High Court for each State.',
          subjectTopic: 'Indian Polity',
          difficulty: 'Moderate',
        },
        {
          questionText: 'Which wetland of Odisha was designated as the first Ramsar site of India in 1981?',
          options: ['Bhitarkanika Mangroves', 'Chilika Lake', 'Ansupa Lake', 'Tampara Lake'],
          correctOptionIndex: 1,
          explanation: 'Chilika Lake and Keoladeo National Park (Rajasthan) were recognized as the first Ramsar sites of India in 1981.',
          subjectTopic: 'Environment & Ecology',
          difficulty: 'Easy',
        },
        {
          questionText: 'What was the primary recommendation of the Sarkaria Commission (1983)?',
          options: [
            'Judicial Reforms and National Judicial Appointments Commission',
            'Centre-State Relations and Federal Governance Structure',
            'Electoral Financing and Political Party Transparency',
            'Reorganization of North-Eastern States',
          ],
          correctOptionIndex: 1,
          explanation: 'The Sarkaria Commission was set up in 1983 to examine the relationship and balance of power between State and Central governments.',
          subjectTopic: 'Indian Polity',
          difficulty: 'Moderate',
        },
        {
          questionText: 'In which year did the historic Kalinga War take place during the reign of Emperor Ashoka?',
          options: ['261 BCE', '321 BCE', '185 BCE', '232 BCE'],
          correctOptionIndex: 0,
          explanation: 'The Kalinga War was fought in 261 BCE, leading Ashoka to embrace Buddhism and preach Dhamma.',
          subjectTopic: 'Ancient History',
          difficulty: 'Easy',
        },
        {
          questionText: 'Which waterfall in Odisha is the second-highest waterfall in India, located in Similipal National Park?',
          options: ['Duduma Waterfall', 'Barehipani Waterfall', 'Khandadhar Waterfall', 'Sanaghagara Waterfall'],
          correctOptionIndex: 1,
          explanation: 'Barehipani Falls is situated in Mayurbhanj district inside Similipal National Park with a total height of 399 metres.',
          subjectTopic: 'Odisha Geography',
          difficulty: 'Moderate',
        },
        {
          questionText: 'Which constitutional body is responsible for recommending the distribution of net tax proceeds between the Union and the States?',
          options: ['NITI Aayog', 'Finance Commission (Article 280)', 'Goods and Services Tax Council', 'Comptroller and Auditor General'],
          correctOptionIndex: 1,
          explanation: 'The Finance Commission is constituted under Article 280 of the Constitution to recommend devolution of taxes.',
          subjectTopic: 'Indian Economy & Polity',
          difficulty: 'Moderate',
        },
        {
          questionText: 'Who composed the state anthem of Odisha, "Bande Utkala Janani"?',
          options: ['Radhanath Ray', 'Kantakabi Laxmikanta Mohapatra', 'Fakir Mohan Senapati', 'Gopabandhu Das'],
          correctOptionIndex: 1,
          explanation: 'Kantakabi Laxmikanta Mohapatra composed "Bande Utkala Janani" in 1912, officially adopted as the state anthem in 2020.',
          subjectTopic: 'Odisha Culture',
          difficulty: 'Easy',
        },
        {
          questionText: 'Which Schedule of the Indian Constitution contains the division of legislative powers between Union, State, and Concurrent Lists?',
          options: ['5th Schedule', '6th Schedule', '7th Schedule', '8th Schedule'],
          correctOptionIndex: 2,
          explanation: 'The Seventh Schedule specifies allocation of powers and functions between Union and State through the three legislative lists.',
          subjectTopic: 'Indian Polity',
          difficulty: 'Easy',
        },
        {
          questionText: 'Which mangrove forest in Odisha is renowned as the second-largest mangrove ecosystem in India and a designated wildlife sanctuary?',
          options: ['Bhitarkanika National Park', 'Mahanadi Delta Mangroves', 'Rushikulya Estuary', 'Puri Coastal Reserve'],
          correctOptionIndex: 0,
          explanation: 'Bhitarkanika is famous for its saltwater crocodiles, white crocodiles, and migratory birds.',
          subjectTopic: 'Environment & Ecology',
          difficulty: 'Moderate',
        },
      ],
    });

    console.log('[Clean Seeder] Mock examination engine seeded.');
    console.log('\n======================================================');
    console.log('✅ DATABASE PURGED: ALL DUMMY USER DATA REMOVED!');
    console.log('Official Administration Account:');
    console.log(' - Email:    admin@stateacademy.gov.in');
    console.log(' - Password: adminpassword123');
    console.log('All candidate registrations, orders, and passes are reset to 0.');
    console.log('======================================================\n');

    process.exit(0);
  } catch (error) {
    console.error('[Clean Seeder Error]:', error);
    process.exit(1);
  }
};

seedCleanCatalogOnly();
