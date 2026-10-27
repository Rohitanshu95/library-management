# Implementation Plan: Role-Specific User Portals, Comprehensive Admin Controls & Native Razorpay UI

Based on the [Website Project Requirements & Client Confirmation](file:///c:/Users/rohitanshu.dhar/Desktop/demo-study-platform/Website_Project_Requirements_Client_Confirmation.pdf), this plan outlines the enhancements to make the platform strictly **user-specific**, give the **Administrator total supervision and control** (including viewing all registered users and their in-depth profile files), and embed the **interactive Razorpay checkout window** (UPI / Cards / Net Banking) that finishes with a realistic "Paid" confirmation.

---

## 1. User-Specific Portals Architecture

### 1.1 Portal Isolation & Routing
- Each logged-in persona enters their own dedicated portal interface:
  - **Student Portal (`/student/*`)**: Exclusively shows their enrolled courses, their active library QR ticket, their test scores, their purchased PDFs, and their personal admission file.
  - **Super Admin Command Center (`/admin/*`)**: Full root authority across all platform data:
    - User Management Directory (Search, inspect complete applicant dossiers, toggle account status).
    - Physical Library Operations (Seat capacity meter, real-time desk occupancy, gate attendance logs).
    - Course & Video Content Manager (Enrollment tracking, student progress inspection).
    - Inquiries & CRM Desk (Full audit trails and internal counselor remarks).
    - Financial Accounting & Revenue Ledger (All Razorpay orders, breakdown by module, and operational expense logs).
  - **Library Desk Operator Portal (`/library-desk/*`)**: Focused front-reception view for scanning entry passes, looking up membership IDs, and logging gate attendance without unrestricted financial access.

---

## 2. Comprehensive Administrator Management & User Inspection

### 2.1 Backend Endpoints (`server/src/controllers/adminController.js`, `adminRoutes.js`)
- `GET /api/admin/users`: Fetch all registered aspirants with filters (exam target, enrollment status, profile completion status).
- `GET /api/admin/users/:id`: Retrieve an applicant's complete dossier:
  - Personal Details (Full Name, Father/Guardian Name, DOB, Gender).
  - Government ID Proof & verified address.
  - Active Library Subscriptions & QR pass status.
  - Enrolled courses with completion percentage.
  - Purchased study notes & download history.
  - Mock exam attempts with score analysis.
  - Order & transaction ledger.
- `PUT /api/admin/users/:id/status`: Toggle user status (`ACTIVE` vs `SUSPENDED`).

### 2.2 Frontend Admin UI (`client/src/pages/admin/AdminDashboard.jsx`)
- **Aspirants Directory Tab**:
  - Searchable, filterable candidate table with instant indicators (Target Exam, Active Pass Badge, KYC Status).
  - **"View Complete Dossier"** modal displaying the student's official admission form, attendance logs, and purchased courses.
- **Enhanced Overview & Financial Reporting**:
  - Real-time KPI counters derived directly from live database collections.
  - Exportable transaction ledger with Razorpay payment references.

---

## 3. Interactive Razorpay Payment Experience

### 3.1 Native Razorpay Checkout Modal Flow
- When a student clicks to buy a course, reserve a library pass, or purchase PDF notes:
  1. **Pre-check**: Verifies if the one-time application profile is completed (if not, prompts modal).
  2. **Order Creation**: Calls `POST /api/payment/create-order` to generate a verified server order.
  3. **Razorpay Modal Launch**:
     - Initializes `new window.Razorpay(options)` using the official Razorpay Checkout SDK.
     - Presents the authentic Razorpay checkout interface:
       - **UPI (GPay / PhonePe / Paytm / QR scan)**
       - **Credit & Debit Cards**
       - **Net Banking & Wallets**
     - Provides an automated test card / 1-click test simulation toggle inside the Razorpay modal flow.
  4. **Payment Completion & Status Update**:
     - On successful payment callback (`razorpay_payment_id`, `razorpay_order_id`, `razorpay_signature`):
     - Displays the verified **Green "Paid & Confirmed"** receipt screen with celebratory confetti.
     - Dispatches the transactional email notification with the activated pass/course link.
     - Redirects the student directly to their portal with their newly unlocked access.

---

## 4. Execution Phases

| Phase | Milestone | Key Deliverables | Status |
|---|---|---|---|
| **Phase A** | **Backend Admin APIs** | Build `/api/admin/users` and `/api/admin/users/:id` to expose full user dossiers, orders, and subscriptions to admins. | ✅ **COMPLETED** |
| **Phase B** | **Admin Directory UI** | Add Aspirants Management tab to `AdminDashboard.jsx` with search, KYC inspection modal, and account controls. | ✅ **COMPLETED** |
| **Phase C** | **Interactive Razorpay UI** | Upgrade `CheckoutModal.jsx` to launch authentic Razorpay popup window with UPI, Card, Netbanking tabs, bank processing simulation, and instant Paid state. | ✅ **COMPLETED** |
| **Phase D** | **Role Portal Isolation** | Ensure student, admin, and unauthenticated personas are strictly compartmentalized with protective route & dashboard guards. | ✅ **COMPLETED** |
| **Phase E** | **Validation & Clean Seeding** | End-to-end purchasing, payment verification, admin dossier inspection, production build verification, and clean catalog reset. | ✅ **COMPLETED** |

