import React, { useState, useEffect } from 'react';
import {
  Library,
  BookOpen,
  FileText,
  Clock,
  QrCode,
  Calendar,
  CheckCircle,
  Download,
  Play,
  User,
  ShieldCheck,
  CreditCard,
  MapPin,
  Sparkles,
  Printer,
  X,
  Award,
} from 'lucide-react';
import { api } from '../../services/api';
import { useAuth } from '../../state/AuthContext';

export const StudentDashboard = ({ onOpenTestRoom, onOpenVideoPlayer }) => {
  const { user, setActiveTab: setGlobalTab } = useAuth();
  const [activeTab, setActiveTab] = useState('library_pass'); // 'library_pass', 'courses', 'pdfs', 'tests', 'profile', 'receipts'
  const [subData, setSubData] = useState(null);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [purchasedPdfs, setPurchasedPdfs] = useState([]);
  const [testHistory, setTestHistory] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modals for Printable Credentials
  const [showIdCardModal, setShowIdCardModal] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [subRes, courseRes, pdfRes, testRes, txRes] = await Promise.all([
          api.getMyLibrarySubscription(),
          api.getMyEnrolledCourses(),
          api.getMyPurchasedPdfs(),
          api.getMyTestHistory(),
          api.getMyTransactions(),
        ]);

        if (subRes.success) setSubData(subRes);
        if (courseRes.success) setEnrolledCourses(courseRes.enrollments);
        if (pdfRes.success) setPurchasedPdfs(pdfRes.purchases);
        if (testRes.success) setTestHistory(testRes.attempts);
        if (txRes.success) setTransactions(txRes.orders);
      } catch (err) {
        console.error('Error loading student dashboard:', err);
      } finally {
        setLoading(false);
      }
    };
    if (user && user.role === 'STUDENT') {
      fetchDashboardData();
    } else {
      setLoading(false);
    }
  }, [user]);

  if (!user) {
    return (
      <div style={{ maxWidth: '560px', margin: '80px auto', padding: '36px 24px', textAlign: 'center', background: '#ffffff', borderRadius: '12px', border: '1px solid #cbd5e1', boxShadow: '0 20px 40px -10px rgba(0,0,0,0.08)' }}>
        <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: '#e0f2fe', color: '#0369a1', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
          <User size={32} />
        </div>
        <h3 style={{ fontSize: '1.3rem', color: '#0a2540', fontFamily: 'Cinzel, Georgia, serif', marginBottom: '8px' }}>
          Candidate Authentication Required
        </h3>
        <p style={{ color: '#64748b', fontSize: '0.9rem', lineHeight: '1.6', marginBottom: '20px' }}>
          Please sign in to your registered student account to access your digital library passes, enrolled courses, and exam scorecards.
        </p>
      </div>
    );
  }

  if (user.role !== 'STUDENT') {
    return (
      <div style={{ maxWidth: '580px', margin: '80px auto', padding: '36px 28px', textAlign: 'center', background: '#ffffff', borderRadius: '14px', border: '1px solid #bfdbfe', boxShadow: '0 20px 40px -10px rgba(0,0,0,0.08)' }}>
        <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: '#eff6ff', color: '#1d4ed8', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
          <ShieldCheck size={36} />
        </div>
        <h3 style={{ fontSize: '1.35rem', color: '#0a2540', fontFamily: 'Cinzel, Georgia, serif', marginBottom: '8px' }}>
          Official Administrator Account Active
        </h3>
        <p style={{ color: '#64748b', fontSize: '0.9rem', lineHeight: '1.6', marginBottom: '24px' }}>
          You are currently signed in as a C2S Administrative Officer (<strong>{user.email}</strong>). Student learning records and library desk passes are scoped exclusively to registered student accounts.
        </p>
        <button
          className="btn-primary"
          style={{ margin: '0 auto' }}
          onClick={() => setGlobalTab('admin_dashboard')}
        >
          Open Secretariat Command Console
        </button>
      </div>
    );
  }

  return (
    <div className="page-container">
      {/* Student Profile Overview Header */}
      <div
        className="responsive-banner"
        style={{
          background: 'linear-gradient(135deg, #0a2540 0%, #0f3460 100%)',
          color: '#ffffff',
        }}
      >
        <div className="responsive-banner-left">
          <img
            src={user?.avatar || 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=250'}
            alt={user?.name}
            style={{ width: '64px', height: '64px', borderRadius: '50%', border: '3px solid #f59e0b', objectFit: 'cover', flexShrink: 0 }}
          />
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <h2 style={{ fontSize: '1.4rem', fontFamily: 'Cinzel, Georgia, serif', margin: 0 }}>
                {user?.name}
              </h2>
              <span style={{ background: 'rgba(52, 211, 153, 0.2)', border: '1px solid #34d399', color: '#a7f3d0', fontSize: '0.72rem', fontWeight: 'bold', padding: '2px 8px', borderRadius: '12px' }}>
                ACTIVE ASPIRANT
              </span>
            </div>
            <p style={{ margin: '4px 0 0', fontSize: '0.85rem', color: '#cbd5e1' }}>
              Target: <strong style={{ color: '#f59e0b' }}>{user?.profile?.targetExam || 'OPSC / OAS'}</strong> • ID: {user?.profile?.idProofNumber || 'OD-Aadhaar-7654'} • Roll: STU-2026-0042
            </p>
          </div>
        </div>

        <div className="responsive-banner-right">
          <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>Registered Contact</div>
          <div style={{ fontSize: '0.9rem', fontWeight: '600', color: '#ffffff' }}>{user?.email}</div>
          <div style={{ fontSize: '0.85rem', color: '#cbd5e1' }}>+91 {user?.phone}</div>
        </div>
      </div>

      {/* Sub-Navigation Tabs */}
      <div className="responsive-tabs-bar">
        {[
          { id: 'library_pass', label: 'My Library QR Pass', icon: Library },
          { id: 'courses', label: 'My Courses & Lessons', icon: BookOpen },
          { id: 'pdfs', label: 'Digital Document Vault', icon: FileText },
          { id: 'tests', label: 'Mock Exam Scores', icon: Clock },
          { id: 'receipts', label: 'Fee Invoices', icon: CreditCard },
          { id: 'profile', label: 'Application Profile', icon: User },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="responsive-tab-btn"
              style={{
                background: isActive ? '#0a2540' : 'transparent',
                color: isActive ? '#ffffff' : '#64748b',
              }}
            >
              <Icon size={16} color={isActive ? '#f59e0b' : '#64748b'} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* TAB CONTENT 1: LIBRARY QR PASS */}
      {activeTab === 'library_pass' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '30px' }}>
          {subData?.hasActiveSubscription ? (
            <div
              className="gov-card"
              style={{
                padding: '30px',
                borderTop: '6px solid #059669',
                background: '#ffffff',
                boxShadow: 'var(--shadow-md)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
                <div>
                  <div style={{ fontSize: '0.75rem', fontWeight: 'bold', color: '#059669', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    OFFICIAL C2S DIGITAL LIBRARY CARD
                  </div>
                  <h3 style={{ fontSize: '1.3rem', color: '#0a2540', margin: '4px 0 0' }}>
                    {subData.subscription?.plan?.name || 'Quarterly Dedicated Plan'}
                  </h3>
                  <div style={{ fontSize: '0.85rem', color: '#64748b' }}>
                    Membership ID: <strong style={{ color: '#0a2540' }}>{subData.subscription?.membershipId}</strong>
                  </div>
                </div>

                <span style={{ background: '#dcfce7', color: '#166534', padding: '4px 10px', borderRadius: '4px', fontWeight: 'bold', fontSize: '0.75rem' }}>
                  ACTIVE PASS
                </span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px', background: '#f8fafc', padding: '16px', borderRadius: '8px', marginBottom: '24px', fontSize: '0.85rem' }}>
                <div>
                  <span style={{ color: '#64748b', display: 'block', fontSize: '0.78rem' }}>Assigned Shift:</span>
                  <strong style={{ color: '#0a2540' }}>{subData.subscription?.timeSlot?.name || 'Morning Shift'}</strong>
                  <div style={{ fontSize: '0.78rem', color: '#475569' }}>{subData.subscription?.timeSlot?.timings || '06:00 AM - 01:00 PM'}</div>
                </div>

                <div>
                  <span style={{ color: '#64748b', display: 'block', fontSize: '0.78rem' }}>Validity Expiry:</span>
                  <strong style={{ color: '#dc2626' }}>
                    {new Date(subData.subscription?.endDate).toLocaleDateString('en-IN', { dateStyle: 'long' })}
                  </strong>
                  <div style={{ fontSize: '0.78rem', color: '#059669' }}>Renewable online</div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '20px', borderTop: '1px solid #f1f5f9', paddingTop: '20px' }}>
                {subData.qrDataUrl ? (
                  <img
                    src={subData.qrDataUrl}
                    alt="Digital Pass QR"
                    style={{ width: '130px', height: '130px', borderRadius: '8px', border: '1px solid #cbd5e1', padding: '4px' }}
                  />
                ) : (
                  <div style={{ width: '130px', height: '130px', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <QrCode size={48} color="#94a3b8" />
                  </div>
                )}
                <div style={{ fontSize: '0.82rem', color: '#475569', lineHeight: '1.6' }}>
                  <p style={{ margin: '0 0 6px 0', fontWeight: 'bold', color: '#0a2540' }}>Gate Entry Instructions:</p>
                  <p style={{ margin: '0 0 4px 0' }}>• Show this authenticated QR code to the scanner terminal at Library Gate 1.</p>
                  <p style={{ margin: '0 0 4px 0' }}>• Access is strictly limited to your assigned shift timing.</p>
                  <p style={{ margin: 0, color: '#059669' }}>✓ Verified biometric identity token linked.</p>
                </div>
              </div>

              {/* Action Button: Print Official ID Card */}
              <div style={{ marginTop: '18px', paddingTop: '16px', borderTop: '1px dashed #cbd5e1', display: 'flex', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  onClick={() => setShowIdCardModal(true)}
                  className="btn-primary"
                  style={{ padding: '9px 18px', fontSize: '0.85rem', gap: '8px' }}
                >
                  <Printer size={16} /> View & Print Official Student ID Card
                </button>
              </div>
            </div>
          ) : (
            <div className="gov-card" style={{ padding: '40px', textAlign: 'center' }}>
              <Library size={48} color="#94a3b8" style={{ marginBottom: '16px' }} />
              <h3 style={{ color: '#0a2540', marginBottom: '8px' }}>No Active Physical Library Subscription</h3>
              <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '24px' }}>
                You do not currently hold an active seat reservation in the central reading hall.
              </p>
              <button className="btn-accent" onClick={() => setActiveTab('library')}>
                Browse Available Library Plans
              </button>
            </div>
          )}

          {/* Gate Attendance Log */}
          <div className="gov-card" style={{ padding: '24px' }}>
            <h4 style={{ color: '#0a2540', fontSize: '1rem', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Clock size={18} color="#d97706" /> Gate Attendance Logs
            </h4>
            {subData?.attendanceHistory?.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {subData.attendanceHistory.map((att, aIdx) => (
                  <div key={aIdx} style={{ background: '#f8fafc', padding: '10px 14px', borderRadius: '6px', fontSize: '0.8rem', borderLeft: '3px solid #059669' }}>
                    <div style={{ fontWeight: '600', color: '#0a2540' }}>
                      {new Date(att.checkInTime).toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric' })}
                    </div>
                    <div style={{ color: '#64748b', fontSize: '0.75rem' }}>
                      Checked in: {new Date(att.checkInTime).toLocaleTimeString('en-IN', { timeStyle: 'short' })} • {att.notes}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ fontSize: '0.82rem', color: '#94a3b8' }}>
                No recent gate entries logged. Scan your QR pass at the entrance terminal.
              </p>
            )}
          </div>
        </div>
      )}

      {/* TAB CONTENT 2: COURSES & LESSONS */}
      {activeTab === 'courses' && (
        <div>
          {enrolledCourses.length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '24px' }}>
              {enrolledCourses.map((enr) => (
                <div key={enr._id} className="gov-card" style={{ padding: '24px' }}>
                  <img
                    src={enr.course?.thumbnail}
                    alt={enr.course?.title}
                    style={{ width: '100%', height: '160px', objectFit: 'cover', borderRadius: '6px', marginBottom: '16px' }}
                  />
                  <div style={{ fontSize: '0.75rem', color: '#2563eb', fontWeight: 'bold' }}>
                    {enr.course?.examCategory}
                  </div>
                  <h3 style={{ color: '#0a2540', fontSize: '1.1rem', margin: '4px 0 12px' }}>
                    {enr.course?.title}
                  </h3>

                  {/* Progress Bar */}
                  <div style={{ marginBottom: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: '#64748b', marginBottom: '4px' }}>
                      <span>Course Progress:</span>
                      <strong>{enr.progressPercent}% Completed</strong>
                    </div>
                    <div style={{ width: '100%', height: '8px', background: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{ width: `${enr.progressPercent}%`, height: '100%', background: '#059669', transition: 'width 0.3s' }} />
                    </div>
                  </div>

                  <button
                    className="btn-primary"
                    onClick={() => onOpenVideoPlayer(enr.course)}
                    style={{ width: '100%', justifyContent: 'center' }}
                  >
                    <Play size={16} /> Continue Learning & Watch Lessons
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="gov-card" style={{ padding: '40px', textAlign: 'center' }}>
              <BookOpen size={48} color="#94a3b8" style={{ marginBottom: '16px' }} />
              <h3 style={{ color: '#0a2540', marginBottom: '8px' }}>No Courses Enrolled Yet</h3>
              <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '24px' }}>
                Join an OPSC, OAS, or UPSC preparation batch to start streaming video lectures.
              </p>
            </div>
          )}
        </div>
      )}

      {/* TAB CONTENT 3: DIGITAL DOCUMENT VAULT */}
      {activeTab === 'pdfs' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
          {purchasedPdfs.length > 0 ? (
            purchasedPdfs.map((p) => (
              <div key={p._id} className="gov-card" style={{ padding: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: '#fffbeb', color: '#d97706', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <FileText size={20} />
                  </div>
                  <div>
                    <h4 style={{ color: '#0a2540', fontSize: '1rem', margin: 0 }}>{p.pdf?.title}</h4>
                    <span style={{ fontSize: '0.75rem', color: '#059669', fontWeight: 'bold' }}>✓ Entitlement Active</span>
                  </div>
                </div>
                <div style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '16px' }}>
                  Purchased on: {new Date(p.purchasedAt).toLocaleDateString('en-IN')} • Downloaded: {p.downloadCount} times
                </div>
                <a
                  href={p.pdf?.fileUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-outline"
                  style={{ width: '100%', justifyContent: 'center', textDecoration: 'none', fontSize: '0.85rem' }}
                >
                  <Download size={14} /> Download PDF Note
                </a>
              </div>
            ))
          ) : (
            <div className="gov-card" style={{ padding: '40px', textAlign: 'center', gridColumn: '1 / -1' }}>
              <FileText size={48} color="#94a3b8" style={{ marginBottom: '16px' }} />
              <h3 style={{ color: '#0a2540', marginBottom: '8px' }}>Document Vault Empty</h3>
              <p style={{ color: '#64748b', fontSize: '0.9rem' }}>
                Browse our study materials catalogue to unlock official civil services notes and revision charts.
              </p>
            </div>
          )}
        </div>
      )}

      {/* TAB CONTENT 4: MOCK EXAM SCORES */}
      {activeTab === 'tests' && (
        <div>
          {testHistory.length > 0 ? (
            <div className="gov-card" style={{ padding: '24px' }}>
              <h3 style={{ color: '#0a2540', marginBottom: '16px' }}>Evaluated Mock Test Attempts</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {testHistory.map((att) => (
                  <div key={att._id} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <h4 style={{ color: '#0a2540', fontSize: '1.05rem', margin: '0 0 4px 0' }}>{att.test?.title}</h4>
                      <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
                        Submitted on: {new Date(att.submitTime).toLocaleDateString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '1.3rem', fontWeight: '800', color: att.score >= 16 ? '#059669' : '#dc2626' }}>
                        {att.score} / {att.test?.totalMarks}
                      </div>
                      <div style={{ fontSize: '0.78rem', color: '#475569' }}>
                        {att.percentage}% • {att.totalCorrect} Correct • {att.totalIncorrect} Wrong
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="gov-card" style={{ padding: '40px', textAlign: 'center' }}>
              <Clock size={48} color="#94a3b8" style={{ marginBottom: '16px' }} />
              <h3 style={{ color: '#0a2540', marginBottom: '8px' }}>No Exam Attempts Yet</h3>
              <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '20px' }}>
                Take our timed OPSC GS Prelims mock test to gauge your performance and topic proficiency.
              </p>
              <button className="btn-accent" onClick={() => onOpenTestRoom()}>
                Start First Mock Test
              </button>
            </div>
          )}
        </div>
      )}

      {/* TAB CONTENT 5: INVOICES & RECEIPTS */}
      {activeTab === 'receipts' && (
        <div className="gov-card" style={{ padding: '24px' }}>
          <h3 style={{ color: '#0a2540', marginBottom: '16px' }}>Fee Receipts & Payment Ledger</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {transactions.map((tx) => (
              <div key={tx._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px', background: '#f8fafc', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                <div>
                  <div style={{ fontWeight: 'bold', color: '#0a2540', fontSize: '0.95rem' }}>{tx.itemTitle}</div>
                  <div style={{ fontSize: '0.78rem', color: '#64748b' }}>
                    Receipt: {tx.receiptNumber || 'RCPT-ONLINE'} • Order: {tx.orderNumber} • {new Date(tx.createdAt).toLocaleDateString('en-IN')}
                  </div>
                </div>
                <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '6px' }}>
                  <div style={{ fontWeight: 'bold', color: '#047857', fontSize: '1.1rem' }}>₹{tx.amount}</div>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.72rem', background: '#dcfce7', color: '#166534', padding: '2px 8px', borderRadius: '4px', fontWeight: 'bold' }}>
                      PAID / CONFIRMED
                    </span>
                    <button
                      type="button"
                      onClick={() => setSelectedInvoice(tx)}
                      className="btn-outline"
                      style={{ padding: '3px 8px', fontSize: '0.72rem', gap: '4px' }}
                    >
                      <Printer size={12} /> Tax Invoice
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB CONTENT 6: PERSISTENT PROFILE */}
      {activeTab === 'profile' && (
        <div className="gov-card" style={{ padding: '32px' }}>
          <h3 style={{ color: '#0a2540', marginBottom: '8px' }}>Permanent Student Admission File</h3>
          <p style={{ color: '#64748b', fontSize: '0.85rem', marginBottom: '24px' }}>
            These details were recorded during your initial application and automatically attach to all library and course registrations.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px', fontSize: '0.88rem' }}>
            <div>
              <span style={{ color: '#64748b', display: 'block', fontSize: '0.78rem' }}>Candidate Full Name:</span>
              <strong style={{ color: '#0a2540' }}>{user?.name}</strong>
            </div>
            <div>
              <span style={{ color: '#64748b', display: 'block', fontSize: '0.78rem' }}>Father's / Guardian Name:</span>
              <strong style={{ color: '#0a2540' }}>{user?.profile?.fatherName || 'Bipin Bihari Pattnaik'}</strong>
            </div>
            <div>
              <span style={{ color: '#64748b', display: 'block', fontSize: '0.78rem' }}>Date of Birth:</span>
              <strong style={{ color: '#0a2540' }}>{user?.profile?.dob || '2000-06-18'}</strong>
            </div>
            <div>
              <span style={{ color: '#64748b', display: 'block', fontSize: '0.78rem' }}>ID Proof Type & Number:</span>
              <strong style={{ color: '#0a2540' }}>{user?.profile?.idProofType || 'Aadhaar'}: {user?.profile?.idProofNumber || '7654-3210-9876'}</strong>
            </div>
            <div>
              <span style={{ color: '#64748b', display: 'block', fontSize: '0.78rem' }}>Residential Address:</span>
              <strong style={{ color: '#0a2540' }}>{user?.profile?.address?.street}, {user?.profile?.address?.city}, {user?.profile?.address?.state} - {user?.profile?.address?.pinCode}</strong>
            </div>
            <div>
              <span style={{ color: '#64748b', display: 'block', fontSize: '0.78rem' }}>Target Examination:</span>
              <strong style={{ color: '#d97706' }}>{user?.profile?.targetExam || 'OPSC / OAS'}</strong>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 1: OFFICIAL GOVERNMENT STUDENT IDENTITY CARD MODAL                   */}
      {/* ========================================================================= */}
      {showIdCardModal && (
        <div className="responsive-modal-overlay">
          <div
            className="responsive-modal-box"
            style={{
              maxWidth: '520px',
              overflow: 'hidden',
              boxShadow: '0 25px 60px -15px rgba(0,0,0,0.5)',
              border: '2px solid #d97706',
            }}
          >
            {/* ID Card Header */}
            <div
              style={{
                background: 'linear-gradient(135deg, #051329 0%, #0a2540 100%)',
                color: '#ffffff',
                padding: '20px 24px',
                textAlign: 'center',
                position: 'relative',
                borderBottom: '3px solid #d97706',
              }}
            >
              <button
                type="button"
                onClick={() => setShowIdCardModal(false)}
                style={{
                  position: 'absolute',
                  top: '14px',
                  right: '14px',
                  background: 'transparent',
                  border: 'none',
                  color: '#94a3b8',
                  cursor: 'pointer',
                }}
              >
                <X size={20} />
              </button>
              <div style={{ fontSize: '0.75rem', color: '#fbbf24', fontWeight: 'bold', letterSpacing: '1px', textTransform: 'uppercase' }}>
                GOVERNMENT OF ODISHA • HIGHER EDUCATION
              </div>
              <h3 style={{ fontSize: '1.25rem', fontFamily: 'Cinzel, Georgia, serif', margin: '4px 0 2px', color: '#ffffff' }}>
                COLLEGE FOR COMPETITIVE STUDIES (C2S)
              </h3>
              <div style={{ fontSize: '0.72rem', color: '#cbd5e1' }}>
                OFFICIAL ASPIRANT IDENTITY & SMART CARD
              </div>
            </div>

            {/* ID Card Body */}
            <div style={{ padding: '24px', background: '#fdfbf7' }}>
              <div style={{ display: 'flex', gap: '20px', marginBottom: '18px' }}>
                {/* Photo & Hologram */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
                  <img
                    src={user?.avatar || 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=250'}
                    alt={user?.name}
                    style={{
                      width: '95px',
                      height: '115px',
                      objectFit: 'cover',
                      borderRadius: '6px',
                      border: '2px solid #d97706',
                      boxShadow: '0 4px 10px rgba(0,0,0,0.15)',
                    }}
                  />
                  <div
                    style={{
                      background: 'linear-gradient(135deg, #fbbf24 0%, #d97706 100%)',
                      color: '#0a2540',
                      fontSize: '0.62rem',
                      fontWeight: '900',
                      padding: '2px 8px',
                      borderRadius: '4px',
                      letterSpacing: '0.5px',
                      textTransform: 'uppercase',
                    }}
                  >
                    ★ VERIFIED 2026 ★
                  </div>
                </div>

                {/* Candidate Particulars */}
                <div style={{ flex: 1, fontSize: '0.82rem', color: '#334155', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <div>
                    <span style={{ fontSize: '0.7rem', color: '#64748b', textTransform: 'uppercase', display: 'block' }}>Candidate Full Name</span>
                    <strong style={{ fontSize: '1.05rem', color: '#0a2540', fontFamily: 'Cinzel, serif' }}>{user?.name}</strong>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
                    <div>
                      <span style={{ fontSize: '0.68rem', color: '#64748b', display: 'block' }}>Roll Number</span>
                      <strong style={{ color: '#0a2540' }}>STU-2026-0042</strong>
                    </div>
                    <div>
                      <span style={{ fontSize: '0.68rem', color: '#64748b', display: 'block' }}>Membership ID</span>
                      <strong style={{ color: '#d97706' }}>{subData?.subscription?.membershipId || 'LIB-2026-0101'}</strong>
                    </div>
                  </div>

                  <div>
                    <span style={{ fontSize: '0.68rem', color: '#64748b', display: 'block' }}>Target Examination</span>
                    <strong style={{ color: '#0369a1' }}>{user?.profile?.targetExam || 'OPSC OAS / UPSC CSE'}</strong>
                  </div>

                  <div>
                    <span style={{ fontSize: '0.68rem', color: '#64748b', display: 'block' }}>Reading Shift</span>
                    <span>{subData?.subscription?.timeSlot?.name || 'General Access'} ({subData?.subscription?.timeSlot?.timings || '08:00 AM - 02:00 PM'})</span>
                  </div>

                  <div>
                    <span style={{ fontSize: '0.68rem', color: '#64748b', display: 'block' }}>Card Validity</span>
                    <strong style={{ color: '#059669' }}>
                      {subData?.subscription?.endDate
                        ? new Date(subData.subscription.endDate).toLocaleDateString('en-IN', { dateStyle: 'medium' })
                        : 'December 31, 2026'}
                    </strong>
                  </div>
                </div>
              </div>

              {/* Barcode & Security Strip */}
              <div
                style={{
                  borderTop: '1px dashed #cbd5e1',
                  paddingTop: '12px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <div>
                  <div style={{ fontFamily: 'monospace', letterSpacing: '3px', fontWeight: 'bold', fontSize: '0.9rem', color: '#0a2540' }}>
                    |||||| | |||||||| |||| | ||||
                  </div>
                  <div style={{ fontSize: '0.65rem', color: '#64748b' }}>STU-ODISHA-2026-AUTH</div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.68rem', fontWeight: 'bold', color: '#0a2540' }}>DIRECTOR GENERAL</div>
                  <div style={{ fontSize: '0.62rem', color: '#64748b' }}>Authorized Signatory</div>
                </div>
              </div>
            </div>

            {/* ID Card Footer Actions */}
            <div style={{ padding: '14px 24px', background: '#ffffff', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Present at physical turnstile gate for entry</span>
              <button
                type="button"
                className="btn-primary"
                onClick={() => window.print()}
                style={{ padding: '8px 16px', fontSize: '0.82rem', gap: '6px' }}
              >
                <Printer size={15} /> Print / Save Card
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: OFFICIAL GOVERNMENT TAX INVOICE & FEE RECEIPT                      */}
      {/* ========================================================================= */}
      {selectedInvoice && (
        <div className="responsive-modal-overlay">
          <div
            className="responsive-modal-box"
            style={{
              maxWidth: '680px',
              border: '1px solid #cbd5e1',
            }}
          >
            {/* Print Header */}
            <div style={{ background: '#0a2540', color: 'white', padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span style={{ fontSize: '0.72rem', color: '#f59e0b', fontWeight: 'bold', letterSpacing: '0.5px' }}>
                  GOVERNMENT OF ODISHA • OFFICIAL FEE RECEIPT
                </span>
                <h3 style={{ margin: '2px 0 0', fontSize: '1.2rem', fontFamily: 'Cinzel, Georgia, serif' }}>
                  College For Competitive Studies (C2S)
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedInvoice(null)}
                style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            <div style={{ padding: '24px' }}>
              {/* Receipt Metadata */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '24px', fontSize: '0.85rem' }}>
                <div>
                  <div style={{ color: '#64748b', fontSize: '0.75rem', textTransform: 'uppercase' }}>Receipt Reference:</div>
                  <strong style={{ color: '#0a2540', fontSize: '1rem' }}>{selectedInvoice.receiptNumber || 'RCPT-ONLINE'}</strong>
                  <div style={{ color: '#64748b', marginTop: '4px' }}>Order: {selectedInvoice.orderNumber}</div>
                  <div style={{ color: '#64748b' }}>Date: {new Date(selectedInvoice.createdAt).toLocaleDateString('en-IN', { dateStyle: 'long' })}</div>
                </div>

                <div>
                  <div style={{ color: '#64748b', fontSize: '0.75rem', textTransform: 'uppercase' }}>Candidate Details:</div>
                  <strong style={{ color: '#0a2540' }}>{user?.name}</strong>
                  <div style={{ color: '#64748b' }}>{user?.email}</div>
                  <div style={{ color: '#64748b' }}>+91 {user?.phone}</div>
                </div>
              </div>

              {/* Itemized Table */}
              <div className="table-responsive">
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem', marginBottom: '24px' }}>
                <thead>
                  <tr style={{ background: '#f8fafc', borderBottom: '2px solid #cbd5e1', textAlign: 'left', color: '#0a2540' }}>
                    <th style={{ padding: '10px 12px' }}>Description</th>
                    <th style={{ padding: '10px 12px', textAlign: 'center' }}>SAC Code</th>
                    <th style={{ padding: '10px 12px', textAlign: 'right' }}>Amount (INR)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                    <td style={{ padding: '12px' }}>
                      <strong style={{ color: '#0a2540' }}>{selectedInvoice.itemTitle}</strong>
                      <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Academic Programme & Learning Access Entitlement</div>
                    </td>
                    <td style={{ padding: '12px', textAlign: 'center', color: '#64748b' }}>999293</td>
                    <td style={{ padding: '12px', textAlign: 'right', fontWeight: 'bold' }}>₹{selectedInvoice.amount}</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #e2e8f0', color: '#64748b', fontSize: '0.82rem' }}>
                    <td style={{ padding: '8px 12px' }}>CGST (9.0%) — Subsidized by Govt. of Odisha</td>
                    <td style={{ padding: '8px 12px', textAlign: 'center' }}>—</td>
                    <td style={{ padding: '8px 12px', textAlign: 'right', color: '#16a34a' }}>WAIVED (₹0)</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #e2e8f0', color: '#64748b', fontSize: '0.82rem' }}>
                    <td style={{ padding: '8px 12px' }}>SGST (9.0%) — Subsidized by Govt. of Odisha</td>
                    <td style={{ padding: '8px 12px', textAlign: 'center' }}>—</td>
                    <td style={{ padding: '8px 12px', textAlign: 'right', color: '#16a34a' }}>WAIVED (₹0)</td>
                  </tr>
                  <tr style={{ background: '#f8fafc' }}>
                    <td style={{ padding: '12px', fontWeight: 'bold', color: '#0a2540', fontSize: '0.98rem' }}>Total Fee Paid (Net):</td>
                    <td style={{ padding: '12px' }}></td>
                    <td style={{ padding: '12px', textAlign: 'right', fontWeight: '800', color: '#0a2540', fontSize: '1.2rem', fontFamily: 'Cinzel, serif' }}>
                      ₹{selectedInvoice.amount}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

              {/* Transaction Gateway Audit */}
              <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '8px', padding: '14px 18px', marginBottom: '24px', fontSize: '0.82rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#166534', fontWeight: 'bold', marginBottom: '4px' }}>
                  <ShieldCheck size={16} /> Verified via Razorpay Secure Gateway
                </div>
                <div style={{ color: '#15803d' }}>
                  Payment ID: <strong style={{ fontFamily: 'monospace' }}>{selectedInvoice.razorpayPaymentId || 'pay_rzp_gateway'}</strong> • Status: <strong>PAID & SETTLED</strong>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                <button
                  type="button"
                  className="btn-outline"
                  onClick={() => setSelectedInvoice(null)}
                >
                  Close
                </button>
                <button
                  type="button"
                  className="btn-primary"
                  onClick={() => window.print()}
                  style={{ gap: '6px' }}
                >
                  <Printer size={16} /> Print Tax Invoice
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
