# Step-by-Step Development Roadmap: Government Study & Physical Library Platform

Based on the [Project Requirements Document](file:///c:/Users/rohitanshu.dhar/Desktop/demo-study-platform/Website_Project_Requirements_Client_Confirmation.pdf), this roadmap breaks down the entire project build into **8 sequential phases**, following our 4 key milestones: **Project Structure**, **Backend & DB**, **Frontend**, and **Full Setup**.

---

## 🏛️ Phase 1: Foundation & Project Folder Structure Setup (COMPLETED)
- [x] Monorepo orchestration with root `package.json` (`concurrently` to run client & server).
- [x] Node.js backend workspace (`server/`) with Express, Mongoose, JWT, Nodemailer, Razorpay, QRCode.
- [x] Frontend workspace (`client/`) initialized with Vite, React, Lucide icons, and Razorpay Checkout SDK.
- [x] Environment files configured with MongoDB URI, Razorpay test keys, and SMTP settings.
- [x] Modular directory hierarchy created (`models`, `controllers`, `routes`, `middleware`, `components`, `pages`).

---

## 🗄️ Phase 2: Database Modeling & MongoDB Connection Setup (COMPLETED)
- [x] Database configuration (`server/src/config/db.js`) connected to local MongoDB (`govt_study_platform`).
- [x] `User.js`: Authentication (`name`, `email`, `phone`, `password`, `role`) with **persistent student profile fields** (`fatherName`, `dob`, `idProofType`, `idProofNumber`, `address`, `targetExam`).
- [x] `Inquiry.js`: Student lead tracker with status (`NEW`, `CONTACTED`, `CONVERTED`, `CLOSED`) and timestamped officer notes.
- [x] `Library.js`: `LibraryPlan`, `LibrarySubscription` (QR token, membership ID), and `LibraryAttendance` (gate check-in logs).
- [x] `Course.js` & `CourseEnrollment.js`: Exam courses (OAS, OPSC, UPSC, Banking), syllabus, video lessons, and completion percentage.
- [x] `Pdf.js`: `PdfMaterial` & `PdfPurchase` for free and paid study notes.
- [x] `Test.js`: `MockTest`, `Question`, and `TestAttempt` with CBT scoring and topic analysis.
- [x] `Order.js` & `Expense.js`: Razorpay orders, transaction references, receipts, and operational expenses.
- [x] `models/index.js`: Consolidated barrel export, verified against active MongoDB service.

---

## 🔐 Phase 3: Authentication, RBAC & Student Profile API (COMPLETED)
- [x] JWT authentication middleware (`server/src/middleware/auth.js`) with bearer token validation and role guards.
- [x] Student registration (`POST /api/auth/register`) with automatic role sanitization and token issuance.
- [x] Dual-purpose login (`POST /api/auth/login`) supporting student portal vs administrative command center validation.
- [x] Persistent student application profile endpoint (`PUT /api/auth/profile`) saving Father's name, DOB, ID proof, address, and target exam.
- [x] Fast showcase demo login endpoint (`POST /api/auth/demo-login`) enabling instantaneous 1-click persona switching.
- [x] Express app initialization (`app.js`, `server.js`) with health check and CORS setup.

---

## 💳 Phase 4: Core Module APIs, Razorpay & Email Dispatch Engine (COMPLETED)
- [x] Inquiries CRM API (`inquiryRoutes.js`, `inquiryController.js`): Lead capture, officer notes, status updates.
- [x] Physical Library & QR Pass API (`libraryRoutes.js`, `libraryController.js`): Tiered plans, student QR pass, gate attendance check-in.
- [x] Courses & Lessons API (`courseRoutes.js`, `courseController.js`): Exam categories, syllabus, and progress tracking.
- [x] PDF Study Notes API (`pdfRoutes.js`, `pdfController.js`): Free/paid catalogs, download authorization.
- [x] Computer-Based Test (CBT) Mock Engine (`testRoutes.js`, `testController.js`): Attempt persistence, timer deadline, automatic scoring & topic analytics.
- [x] Razorpay Order & Payment API (`paymentRoutes.js`, `paymentController.js`): Order creation, signature verification, and instant entitlement provisioning.
- [x] Nodemailer Email Notification Service (`utils/mailer.js`): Automated dispatch of payment receipt and activated access pass upon payment verification.
- [x] Administrative Metrics API (`adminRoutes.js`, `adminController.js`): Revenue breakdown by module, pending inquiries, active library seats, and expense logging.

---

## 🌱 Phase 5: Database Seeder Script (Showcase Data) (COMPLETED)
- [x] Automated MongoDB seeder (`server/src/seeds/seed.js`) created and verified.
- [x] Core personas pre-configured:
  - **Student**: `student@demo.gov.in` / `password123` (Aakash Pattnaik, with complete profile).
  - **Super Admin**: `admin@demo.gov.in` / `password123` (Dr. Sanjeev Mohanty, Director).
  - **Library Desk**: `library@demo.gov.in` / `password123` (Ramesh Nayak).
- [x] 4 Physical Library Plans seeded (Monthly ₹800, Quarterly ₹2,200, Half-Yearly ₹4,200, Annual ₹7,500) with Morning, Afternoon, Night Owl, and Full-Day shifts.
- [x] Demo student active library membership pass generated (`LIB-2026-0042`) with QR payload and logged entry attendance.
- [x] 3 Government exam courses (OPSC/OAS Comprehensive Batch, UPSC General Studies Foundation, Banking & SSC Speed Quant).
- [x] 4 PDF study note materials (Odisha Heritage Handbook, Indian Polity Tabular Amendments, Economic Survey, 1000 High-Frequency Quant Questions).
- [x] 1 Complete 10-Question OPSC Prelims Mock Exam with positive/negative grading, explanations, and topic breakdown.
- [x] 4 Citizen inquiries seeded in the CRM pipeline (`NEW`, `CONTACTED`, `FOLLOW_UP`, `CONVERTED`).
- [x] Past Razorpay transaction orders and operational expenses ledger seeded for financial reporting.

---

## 🎨 Phase 6: Frontend - Government Portal Design System & Public Website (COMPLETED)
- [x] Client REST API Connector (`client/src/services/api.js`) for all endpoints.
- [x] Global Session & Auth State Management (`client/src/state/AuthContext.jsx`).
- [x] Government Educational Portal Design System (`client/src/index.css`) with Deep Navy (`#0a2540`), Saffron (`#d97706`), Emerald accents, serif typography (`Cinzel`), and card hover micro-animations.
- [x] Official Header & Accessibility Banner (`Navbar.jsx`): Text sizing (`A-`, `A`, `A+`), government emblem, helpline, and live marquee announcements ticker.
- [x] Official Secretariat Footer (`Footer.jsx`) with contact details, RTI links, SSL badges, and statutory disclaimers.
- [x] Unified Dual Authentication Modal (`AuthModal.jsx`): Sign In vs Aspirant Registration, separate Student/Admin role validation, and 1-click evaluation shortcuts.
- [x] Public Homepage (`HomePage.jsx`) with key stats counters, facility photo cards, and 6 core modules gateway.
- [x] Public Library Membership Plans Page (`LibraryPlansPage.jsx`) with shift details and pricing.
- [x] Courses Catalogue Page (`CoursesCatalogPage.jsx`) with exam filter pills and syllabus highlights.
- [x] Digital PDF Vault Page (`PdfsCatalogPage.jsx`) with free/paid indicators.
- [x] Online Mock Examination Page (`TestsCatalogPage.jsx`) with CBT rules.
- [x] Citizen Inquiry Counseling Desk (`InquiryPage.jsx`) generating unique tracking IDs.
- [x] Floating Demo Quick Switcher (`DemoQuickBar.jsx`) for client presentations.
   - Includes 1-Click Showcase Demo Quick Buttons for instant evaluation.

---

## 🎓 Phase 7: Frontend - Student Dashboard & Pre-Checkout Application Profile (COMPLETED)
- [x] Persistent Pre-Checkout Application Modal (`ProfileApplicationModal.jsx`): Captures Father's name, DOB, ID proof, address, and target exam; stored permanently to student profile.
- [x] Razorpay Checkout Modal (`CheckoutModal.jsx`): Shift selector, simulated payment verification, celebratory confetti, and automated email confirmation preview.
- [x] Full Student Portal (`StudentDashboard.jsx`):
  - **My Digital Library Card**: Displays photo, Membership ID, assigned shift, live scannable QR ticket, and gate attendance logs.
  - **My Courses**: Enrolled course progress bars, lesson counts, and learning room launcher.
  - **Digital Document Vault**: Permanent access and downloads for purchased PDF study notes.
  - **Mock Exam Scores**: Evaluated scorecards with total correct, wrong, and percentage metrics.
  - **Fee Invoices**: Official transaction history and receipt numbers.
  - **Permanent Student Profile**: Overview of stored admission records.
- [x] Interactive Computer-Based Test (CBT) Room (`ExamRoomPage.jsx`): Countdown clock, question navigation palette, mark for review, and instant evaluation scorecard with topic-wise breakdown.
- [x] Integrated Course Video Player Modal (`CourseVideoModal.jsx`): Full lecture video streaming with syllabus selector and auto-progress synchronization.

---

## 🏛️ Phase 8: Frontend - Administrative Command Center & Full Demo Integration (COMPLETED)
- [x] Administrative Dashboard (AdminDashboard.jsx):
  - **KPI Metrics**: Total registered aspirants, active library seat allocations, pending candidate inquiries, total collections, and operating expense surplus.
  - **Reception & QR Gate Validator**: Instant membership ID and QR data check-in with live entrance logging and expiration check.
  - **Inquiry CRM Pipeline**: Manage citizen queries across statuses (NEW, CONTACTED, FOLLOW_UP, CONVERTED), append internal officer observations.
  - **Operational Expenses Ledger**: Record facility costs (Power, rent, books, internet) to maintain balance sheet accuracy.
- [x] Full Single-Page Application Integration (App.jsx):
  - Unified routing connecting Public Homepage, Library, Courses, PDFs, CBT Test Room, Student Portal, and Admin Command Center.
  - One-time persistent student application form integration before checkout.
  - Razorpay payment simulation with confetti and transactional email dispatch.
  - Floating 1-Click Showcase Demo QuickBar for seamless client presentations.
- [x] Production build validated with 
pm run build exiting code 0.
