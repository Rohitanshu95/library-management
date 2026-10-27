import React, { useState } from 'react';
import { AuthProvider, useAuth } from './state/AuthContext';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { AuthModal } from './components/common/AuthModal';
import { DemoQuickBar } from './components/common/DemoQuickBar';
import { HomePage } from './pages/public/HomePage';
import { LibraryPlansPage } from './pages/public/LibraryPlansPage';
import { CoursesCatalogPage } from './pages/public/CoursesCatalogPage';
import { PdfsCatalogPage } from './pages/public/PdfsCatalogPage';
import { TestsCatalogPage } from './pages/public/TestsCatalogPage';
import { InquiryPage } from './pages/public/InquiryPage';
import { GalleryPage } from './pages/public/GalleryPage';
import { StudentDashboard } from './pages/student/StudentDashboard';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { ExamRoomPage } from './pages/student/ExamRoomPage';
import { ProfileApplicationModal } from './components/student/ProfileApplicationModal';
import { CheckoutModal } from './components/student/CheckoutModal';
import { CourseVideoModal } from './components/student/CourseVideoModal';

const MainApp = () => {
  const { user, activeTab, setActiveTab } = useAuth();
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  // Modals for checkout & application flow
  const [pendingItem, setPendingItem] = useState(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [selectedVideoCourse, setSelectedVideoCourse] = useState(null);
  const [inExamRoom, setInExamRoom] = useState(false);

  // Unified Apply/Purchase trigger:
  // 1. Checks if user is logged in (if not, opens AuthModal)
  // 2. Checks if user profile is complete (if not, opens ProfileApplicationModal)
  // 3. Otherwise, proceeds straight to CheckoutModal
  const handleInitiatePurchase = (item, itemType) => {
    const enrichedItem = { ...item, itemType };
    setPendingItem(enrichedItem);

    if (!user) {
      setIsAuthOpen(true);
      return;
    }

    if (!user.isProfileComplete) {
      setIsProfileModalOpen(true);
    } else {
      setIsCheckoutOpen(true);
    }
  };

  const handleProfileComplete = () => {
    setIsProfileModalOpen(false);
    setIsCheckoutOpen(true);
  };

  const handleCheckoutSuccess = (result) => {
    setIsCheckoutOpen(false);
    setActiveTab('student_dashboard');
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#f8fafc' }}>
      <Navbar onOpenAuth={() => setIsAuthOpen(true)} />

      <main style={{ flex: 1 }}>
        {inExamRoom ? (
          <ExamRoomPage onExit={() => setInExamRoom(false)} />
        ) : (
          <>
            {activeTab === 'home' && <HomePage onOpenAuth={() => setIsAuthOpen(true)} />}
            {activeTab === 'library' && (
              <LibraryPlansPage onApplyPlan={(plan) => handleInitiatePurchase(plan, 'LIBRARY_SUBSCRIPTION')} />
            )}
            {activeTab === 'courses' && (
              <CoursesCatalogPage onEnrollCourse={(course) => handleInitiatePurchase(course, 'COURSE')} />
            )}
            {activeTab === 'pdfs' && (
              <PdfsCatalogPage onPurchasePdf={(pdf) => handleInitiatePurchase(pdf, 'PDF')} />
            )}
            {activeTab === 'tests' && (
              <TestsCatalogPage onStartTest={() => setInExamRoom(true)} />
            )}
            {activeTab === 'gallery' && <GalleryPage />}
            {activeTab === 'inquiry' && <InquiryPage />}
            {activeTab === 'student_dashboard' && (
              <StudentDashboard
                onOpenTestRoom={() => setInExamRoom(true)}
                onOpenVideoPlayer={(course) => setSelectedVideoCourse(course)}
              />
            )}
            {activeTab === 'admin_dashboard' && <AdminDashboard />}
          </>
        )}
      </main>

      <Footer />

      {/* Global Modals */}
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />

      <ProfileApplicationModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        onComplete={handleProfileComplete}
        targetItemName={pendingItem?.name || pendingItem?.title}
      />

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        item={pendingItem}
        onSuccess={handleCheckoutSuccess}
      />

      <CourseVideoModal
        isOpen={Boolean(selectedVideoCourse)}
        onClose={() => setSelectedVideoCourse(null)}
        course={selectedVideoCourse}
      />

      {/* Floating 1-Click Client Showcase Quick Bar */}
      <DemoQuickBar onOpenAuth={() => setIsAuthOpen(true)} />
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}
