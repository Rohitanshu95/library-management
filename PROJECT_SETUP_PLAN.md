# Implementation Plan: Educational Institute & Physical Library Platform (Client Demo Showcase)

Based on the [Website Project Requirements & Client Confirmation](file:///c:/Users/rohitanshu.dhar/Desktop/demo-study-platform/Website_Project_Requirements_Client_Confirmation.pdf) document, this plan is structured for a **Government Educational Institute & State Public Library / Examination Center** showcase.

---

## Key Core Principles & Requirements Alignment

1. **Unified Public Website with Government Educational Aesthetic**:
   - Designed like a prestigious state/national educational board/academy (e.g., State Civil Services Training & Library Academy / OPSC / OAS / IAS examination resource center).
   - Official national/state color schemes (Deep Navy Blue `#0f2a4a`, Tiranga/Saffron & Emerald accents `#f59e0b`, `#059669`, clean ivory white backgrounds, official emblem badges, accessibility bar, bilingual notice ticker).
   - High accessibility: font size adjuster (A- / A / A+), screen-reader friendly structure, official circulars/notices ticker.

2. **Authentication Flow (Sign In vs Register)**:
   - Public header contains **"Sign In"** and **"Register"** modal triggers.
   - User can register either as a **Student / Aspirant** (with Name, Email, Phone, Password) or sign in.
   - Dedicated **Official / Admin Login** tab for administrative personnel.
   - Seamless role-based redirection: Students to `/student/dashboard`, Officials to `/admin/dashboard`.

3. **Persistent Student Application Profile (One-Time Form Fill)**:
   - When a student applies for the physical library subscription, purchases a course, or buys test series:
     - If required details (Full Name, Father's Name / Guardian, Date of Birth, ID Proof Type & Number, Address, Category/Target Exam) are missing, a structured pre-checkout application modal is displayed.
     - Once submitted, these details are saved directly to the student's `User` document profile.
     - For all subsequent purchases/applications, the form auto-fills from their profile and remains stored until the student explicitly updates it from their Profile Settings.

4. **Automated Post-Payment Email Notifications**:
   - As soon as Razorpay confirms payment verification:
     - The entitlement is activated immediately (Library ticket generated, Course unlocked, or PDF accessible).
     - An official transactional email is dispatched via `nodemailer` containing:
       - Payment Reference / Order ID
       - Amount Paid & GST details (if applicable)
       - Activation details (Membership ID, validity dates, time slot, access instructions)
       - Downloadable/embedded QR access ticket or course link.
     - The email notification log is displayed in the student dashboard and admin audit logs for showcase visibility.

---

## Architecture & Technology Stack Overview

- **Architecture**: Decoupled Client-Server Monorepo (`client/` and `server/`).
- **Backend**: Node.js + Express.js (REST API, JWT Authentication, Nodemailer email notifications, Razorpay gateway integration).
- **Database**: MongoDB with Mongoose ODM (Scalable document storage, flexible schemas, persistent student profile fields).
- **Frontend**: Vite + React with Government Educational Institute Design System (Clean, trustworthy, responsive, modern card layouts, official status badges).

---

## 1. Project Folder Structure Setup

Organize a clean, scalable monorepo structure separating frontend, backend, shared utilities, and seed assets:

```text
demo-study-platform/
├── Website_Project_Requirements_Client_Confirmation.pdf
├── package.json                   # Root package orchestrating client and server scripts
├── README.md                      # Quick start and showcase demo script
├── server/                        # Backend REST API
│   ├── package.json
│   ├── .env.example
│   ├── prisma/                    # Database schema and migrations
│   │   ├── schema.prisma
│   │   └── seed.ts                # Rich seed data (courses, tests, plans, mock users)
│   ├── src/
│   │   ├── app.js                 # Express application initialization
│   │   ├── server.js              # Server entry point
│   │   ├── config/                # Environment, constants, roles
│   │   ├── middleware/            # Auth (JWT), role verification (admin/student/staff), error handler
│   │   ├── controllers/           # Business logic
│   │   │   ├── authController.js
│   │   │   ├── inquiryController.js
│   │   │   ├── libraryController.js
│   │   │   ├── courseController.js
│   │   │   ├── pdfController.js
│   │   │   ├── testController.js
│   │   │   ├── paymentController.js
│   │   │   └── adminController.js
│   │   ├── routes/                # Modular API endpoints
│   │   │   ├── authRoutes.js
│   │   │   ├── inquiryRoutes.js
│   │   │   ├── libraryRoutes.js
│   │   │   ├── courseRoutes.js
│   │   │   ├── pdfRoutes.js
│   │   │   ├── testRoutes.js
│   │   │   ├── paymentRoutes.js
│   │   │   └── adminRoutes.js
│   │   └── utils/                 # QR ticket generator, date/renewal calculators, test scoring engine
│   └── uploads/                   # Stored PDFs, demo video samples, gallery images
└── client/                        # Frontend Application
    ├── index.html
    ├── package.json
    ├── vite.config.js
    ├── public/
    │   ├── assets/
    │   └── favicon.ico
    └── src/
        ├── index.css              # Core Design System (tokens, responsive typography, modern color scheme)
        ├── main.jsx (or main.js)
        ├── App.jsx
        ├── components/
        │   ├── common/            # Navbar, Footer, Modal, QRModal, NotificationBadge, StatCard
        │   ├── public/            # HeroBanner, GalleryGrid, CourseCard, PDFCard, InquiryForm
        │   ├── student/           # LibraryTicketCard, ExamTimer, QuestionPalette, PurchaseHistory
        │   └── admin/             # StatsOverview, AttendanceScanner, InquiriesTable, TestManager
        ├── pages/
        │   ├── public/            # HomePage, GalleryPage, CoursesCatalog, PDFCatalog, InquiryPage
        │   ├── student/           # StudentDashboard, MyLibraryTicket, CourseViewer, TestAttemptRoom, TestResults
        │   └── admin/             # AdminDashboard, LibraryDesk, CourseManager, PDFManager, QuestionBank, FinancialReports
        ├── services/              # API clients (fetch wrappers for auth, orders, tests)
        └── state/                 # Auth context / state management (active role, user session)
```

---

## 2. Backend and Database Setup (MongoDB + Mongoose)

### 2.1 Database Modeling with Mongoose (`server/src/models/`)
Reflecting all 6 core modules and shared workflows:
1. **User Schema (`User.js`)**:
   - `name`, `email`, `phone`, `password`, `role` (`STUDENT`, `SUPER_ADMIN`, `LIBRARY_OPERATOR`, `CONTENT_MANAGER`, `TEST_MANAGER`), `avatar`, `createdAt`.
2. **Student Inquiry Schema (`Inquiry.js`)**:
   - `name`, `phone`, `email`, `areaOfInterest`, `message`, `status` (`NEW`, `CONTACTED`, `FOLLOW_UP`, `CONVERTED`, `CLOSED`), `internalNotes` [array of `{ note, staffId, date }`], `assignedTo`.
3. **Physical Library Management Schemas**:
   - **`LibraryPlan.js`**: `title` (Monthly, Quarterly, Half-Yearly, Annual), `durationMonths`, `price`, `allowedDays`, `slotHours`, `seatCapacity`, `isActive`.
   - **`LibrarySubscription.js`**: `userId`, `planId`, `timeSlot`, `startDate`, `endDate`, `status` (`ACTIVE`, `EXPIRED`, `CANCELLED`), `ticketQrHash`, `ticketNumber`.
   - **`LibraryAttendance.js`**: `subscriptionId`, `userId`, `checkInTime`, `checkOutTime`, `verifiedBy`.
4. **Courses & Online Learning Schemas**:
   - **`Course.js`**: `title`, `examCategory` (OAS, OPSC, UPSC/IAS, Banking, Railway), `description`, `price`, `syllabus`, `accessMonths`, `thumbnail`, `isPublished`, `lessons` [array of `{ title, chapter, videoUrl, duration, isSampleLesson }`].
   - **`CourseEnrollment.js`**: `userId`, `courseId`, `progressPercent`, `completedLessons` [array of lessonIds], `enrolledAt`.
5. **PDF Materials Schema (`PdfMaterial.js`)**:
   - `title`, `examCategory`, `description`, `price` (0 for Free), `fileUrl`, `previewPagesUrl`, `isPublished`, `downloadCount`.
   - **`PdfPurchase.js`**: `userId`, `pdfId`, `purchasedAt`.
6. **Mock Test & Exam Engine Schemas**:
   - **`MockTest.js`**: `title`, `examCategory`, `durationMinutes`, `totalMarks`, `positiveMarks`, `negativeMarks`, `passMarks`, `isPublished`.
   - **`Question.js`**: `testId`, `questionText`, `options` [array of 4 options], `correctOptionIndex`, `explanation`, `subjectTopic`, `difficulty`.
   - **`TestAttempt.js`**: `userId`, `testId`, `startTime`, `submitTime`, `answers` [array of `{ questionId, selectedOption, isMarkedForReview }`], `score`, `totalCorrect`, `totalIncorrect`, `subjectWiseAnalysis`, `status` (`IN_PROGRESS`, `SUBMITTED`, `AUTO_SUBMITTED`).
7. **Order & Financial Reporting Schemas**:
   - **`Order.js`**: `orderNumber`, `userId`, `itemType` (`LIBRARY`, `COURSE`, `PDF`, `TEST`), `itemId`, `itemTitle`, `amount`, `paymentMethod` (`UPI`, `CARD`, `OFFLINE_CASH`), `paymentStatus` (`PENDING`, `PAID`, `FAILED`, `REFUNDED`), `transactionRef`, `receiptNumber`.
   - **`Expense.js`**: `category` (Rent, Electricity, Faculty, Supplies, Maintenance), `amount`, `description`, `date`, `recordedBy`.

### 2.2 API Endpoints & Business Logic
- **Database Connection**: `src/config/db.js` connecting via Mongoose to `MONGODB_URI`.
- **Authentication & RBAC**: JWT login/register, current user endpoint, role switching helper for demo purposes.
- **Library Desk**: Availability check by slot, manual creation of offline subscriptions, entry ticket QR verification.
- **Test Engine**: Server-authoritative timer, auto-submission calculation, instant answer key scoring and topic breakdown.
- **Razorpay Payment Gateway Workflow**:
  - `POST /api/payment/create-order`: Generates a genuine/mock Razorpay Order (`order_id`, `amount` in paise, `currency: INR`).
  - `POST /api/payment/verify`: Verifies Razorpay HMAC-SHA256 signature (`razorpay_order_id`, `razorpay_payment_id`, `razorpay_signature`).
  - Supports both standard Razorpay Checkout modal (cards, UPI, net banking) and a seamless instant-test toggle for client demos.
  - Automatically provisions entitlements: generates digital Library Pass with QR hash, unlocks purchased Course, or grants permanent PDF access.
- **Seeding Script**: Script (`src/seeds/seed.js`) populating realistic sample data into MongoDB (Government exam courses, mock tests with 20 questions, 4 library plans, and sample inquiries).

---

## 3. Frontend Setup (Government Educational Portal Design)

### 3.1 Design System & Aesthetic Foundation
- **Visual Identity**: Official Government Educational Institute / State Academy style:
  - **Top Bar**: National/State emblem, accessibility toggles (`A-` / `A` / `A+`, High Contrast), official portal helpline/email, and a moving "Official Announcements & Circulars" ticker.
  - **Primary Palette**: Deep Navy Blue (`#0a2540`, `#0f3460`), Heritage Gold/Saffron (`#d97706`), Forest Green (`#047857`), clean crisp white containers, dignified typography (`Inter` / serif headings).
  - **Trust Elements**: Official verification badges, secure portal SSL indicators, Gov-standard footer with RTI, privacy policy, copyright, and disclaimer.

### 3.2 Authentication & Role Routing Flow
- **Unified Login Modal / Page**:
  - Accessible directly from top-right navigation of the public website.
  - Toggle switch or tabs: **"Student Login"** | **"Administrative / Staff Login"**.
  - Includes a **"Showcase Demo Quick Login"** button for both roles so that during the client presentation, you can switch personas in 1 second.
- **Redirection Logic**:
  - On Student login $\rightarrow$ Navigate to `/student/dashboard`.
  - On Admin/Staff login $\rightarrow$ Navigate to `/admin/dashboard`.
  - On Logout $\rightarrow$ Return to public homepage.

### 3.3 Key Screen Implementation
1. **Public Government Institute Website**:
   - **Header & Navigation**: Institute branding, Home, About & Photos, Courses (OAS / OPSC / IAS / Banking), Library Subscriptions, Study Notes (PDFs), Online Mock Tests, Inquire / Contact Us, and **"Portal Login / Register"**.
   - **Hero Section**: Official banner with key statistics (e.g. "Over 12,000 Aspirants Trained", "500+ Seating Modern Digital Library", "Certified Exam Center").
   - **Notice Board / Announcements**: Latest updates on exam dates, seat availability, and new test series.
   - **Photo Gallery**: Verified albums (Central Library Reading Halls, Smart Classrooms, Felicitation Ceremony).
   - **Student Inquiry Desk**: Official inquiry form with instant validation, generating a trackable reference ID.
   - **Public Course & PDF Catalogs**: Clear breakdowns of syllabi, faculty, sample PDFs, and mock test schedules.

2. **Student Portal (`/student/*`)**:
   - **My Library Card & Entry Ticket**: Official digital pass displaying student photo, Membership ID, assigned time slot, validity countdown, and a scannable QR code.
   - **Enrolled Courses & Video Lessons**: Structured syllabus viewer with integrated player, chapter progress, and attached study material.
   - **Digital Document Vault**: Purchased & Free PDFs with watermark preview and download option.
   - **Exam Center (Mock Tests)**: Timed computer-based test interface (similar to SSC/UPSC online exams) with Question Palette (Answered, Unanswered, Marked for Review), countdown clock, and instantaneous result scorecard with topic analysis.
   - **Fee Receipts & Transaction History**: Downloadable payment receipts.

3. **Official Administrative Console (`/admin/*`)**:
   - **Command Dashboard**: Total enrolled aspirants, active library seat occupancy, daily collections, pending inquiries.
   - **Library Reception & Gate Entry**: QR Code / Membership ID validator to grant entrance and log attendance.
   - **Student Inquiries CRM**: Filter inquiries by status (`New`, `Contacted`, `Converted`, `Closed`) and record follow-up notes.
   - **Course & PDF Publishing**: Add/edit exam courses, upload study notes, set prices.
   - **Question Bank & Exam Manager**: Build mock tests, define positive/negative marking rules, view candidate rankings.
   - **Financial Audit & Expense Records**: Collection breakdowns by module and daily operational expense log.

---

## 4. Fully Setup & Demonstration Readiness

1. **Integrated End-to-End Workflows**:
   - **Visitor to Inquiry**: Submit inquiry on frontend $\rightarrow$ appears in admin inquiry inbox.
   - **Library Admission**: Student selects time slot $\rightarrow$ completes mock payment $\rightarrow$ receives digital QR ticket $\rightarrow$ staff enters/scans ticket on reception desk.
   - **Online Learning**: Buy course/PDF $\rightarrow$ instant entitlement in student portal.
   - **Mock Test Run**: Student starts exam $\rightarrow$ timer runs $\rightarrow$ answers saved $\rightarrow$ submit $\rightarrow$ instant result analysis report.
2. **Showcase Seed Data & One-Command Launch**:
   - Single command `npm run dev` in root launches both backend and frontend concurrently.
   - Automatic database seeding with pre-configured demo users (`student@example.com`, `admin@example.com`, `library@example.com`).
3. **Showcase Guide**:
   - A step-by-step walkthrough script for the client meeting demonstrating each of the 6 core modules from the requirements document.

---

## 5. Items Required From You (Checklist)

To customize the demo to your client's specific identity, please let me know:

1. **Institute / Academy Name**:
   - e.g., *"Odisha State Administrative Training Academy & Central Library"*, *"National Civil Services Study Center"*, or any specific name your client uses.
2. **Target Exams / Focus**:
   - e.g., OAS, OPSC, UPSC/IAS, SSC, Banking, Railway (or any other state exams).
3. **Physical Library Slots & Fee Structure (for seed data)**:
   - e.g., Morning (08:00 AM - 02:00 PM), Evening (02:00 PM - 08:00 PM), Full Day.
   - Monthly (₹800), Quarterly (₹2,200), Half-Yearly (₹4,200), Annual (₹7,500) — *or your preferred demo pricing*.
4. **MongoDB Connection**:
   - Do you have a local MongoDB running (`mongodb://localhost:27017`), or do you have a free **MongoDB Atlas connection string** you'd like to use?
5. **Razorpay & Email Credentials**:
   - For demo purposes, we will use **Razorpay Test Mode** and **Ethereal / Simulated SMTP Email** (which generates viewable email previews without sending real spam). If you already have your own Razorpay Test Keys (`rzp_test_...`) or real Gmail/SendGrid SMTP credentials, share them and I'll plug them in.
