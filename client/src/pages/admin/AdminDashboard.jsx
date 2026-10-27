import React, { useState, useEffect } from 'react';
import {
  Users,
  Library,
  DollarSign,
  Send,
  CheckCircle,
  QrCode,
  Search,
  PlusCircle,
  TrendingUp,
  Clock,
  Sparkles,
  Eye,
  X,
  BookOpen,
  FileText,
  CreditCard,
  UserCheck,
  ShieldAlert,
  AlertTriangle,
} from 'lucide-react';
import { api } from '../../services/api';
import { useAuth } from '../../state/AuthContext';

export const AdminDashboard = () => {
  const { user, adminSubTab, setAdminSubTab } = useAuth();
  const activeTab = adminSubTab || 'overview';
  const setActiveTab = setAdminSubTab;
  const [metrics, setMetrics] = useState(null);
  const [inquiries, setInquiries] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Users Directory state
  const [students, setStudents] = useState([]);
  const [userSearch, setUserSearch] = useState('');
  const [targetExamFilter, setTargetExamFilter] = useState('ALL');
  const [selectedUserDossier, setSelectedUserDossier] = useState(null);
  const [dossierLoading, setDossierLoading] = useState(false);

  // Gate Scanner state
  const [ticketInput, setTicketInput] = useState('');
  const [scanResult, setScanResult] = useState(null);
  const [scanLoading, setScanLoading] = useState(false);

  // Inquiry update state
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [newStatus, setNewStatus] = useState('CONTACTED');
  const [noteText, setNoteText] = useState('');

  // Expense logging state
  const [expenseForm, setExpenseForm] = useState({
    category: 'Electricity & AC',
    amount: '',
    description: '',
    receiptReference: '',
  });
  const [expenseSuccess, setExpenseSuccess] = useState('');

  useEffect(() => {
    if (user && user.role !== 'STUDENT') {
      fetchAdminData();
    }
  }, [user]);

  if (!user || user.role === 'STUDENT') {
    return (
      <div style={{ maxWidth: '580px', margin: '80px auto', padding: '36px 28px', textAlign: 'center', background: '#ffffff', borderRadius: '14px', border: '1px solid #fecaca', boxShadow: '0 20px 40px -10px rgba(0,0,0,0.1)' }}>
        <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: '#fee2e2', color: '#dc2626', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
          <ShieldAlert size={36} />
        </div>
        <h3 style={{ fontSize: '1.35rem', color: '#991b1b', fontFamily: 'Cinzel, Georgia, serif', marginBottom: '8px' }}>
          Restricted Secretariat Command Console
        </h3>
        <p style={{ color: '#64748b', fontSize: '0.9rem', lineHeight: '1.6', marginBottom: '24px' }}>
          Access to this official administrative console is restricted exclusively to authorized College For Competitive Studies (C2S) administrative officers, examiners, and reception operators.
        </p>
        <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '12px 16px', fontSize: '0.82rem', color: '#475569', marginBottom: '24px' }}>
          Official Admin Account: <strong>admin@stateacademy.gov.in</strong>
        </div>
      </div>
    );
  }

  const fetchAdminData = async () => {
    try {
      const [metricsRes, inqRes, txRes, usersRes] = await Promise.all([
        api.getAdminMetrics(),
        api.getInquiries(),
        api.getAllTransactions(),
        api.getAllUsers(userSearch, targetExamFilter),
      ]);

      if (metricsRes.success) setMetrics(metricsRes.metrics);
      if (inqRes.success) setInquiries(inqRes.inquiries);
      if (txRes.success) setTransactions(txRes.orders);
      if (usersRes.success) setStudents(usersRes.users);
    } catch (err) {
      console.error('Error fetching admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterUsers = async (e) => {
    if (e) e.preventDefault();
    try {
      const res = await api.getAllUsers(userSearch, targetExamFilter);
      if (res.success) setStudents(res.users);
    } catch (err) {
      console.error('Filter users error:', err);
    }
  };

  const handleViewDossier = async (studentId) => {
    setDossierLoading(true);
    setSelectedUserDossier(null);
    try {
      const res = await api.getUserDossier(studentId);
      if (res.success) {
        setSelectedUserDossier(res);
      }
    } catch (err) {
      console.error('Error fetching dossier:', err);
    } finally {
      setDossierLoading(false);
    }
  };

  const handleToggleStatus = async (studentId, currentStatus) => {
    const nextStatus = currentStatus === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';
    try {
      const res = await api.updateUserStatus(studentId, nextStatus);
      if (res.success) {
        fetchAdminData();
        if (selectedUserDossier && selectedUserDossier.user._id === studentId) {
          setSelectedUserDossier({
            ...selectedUserDossier,
            user: { ...selectedUserDossier.user, status: nextStatus },
          });
        }
      }
    } catch (err) {
      console.error('Toggle status error:', err);
    }
  };

  const handleVerifyTicket = async (e) => {
    e.preventDefault();
    setScanLoading(true);
    setScanResult(null);

    try {
      const res = await api.verifyTicket({ membershipId: ticketInput });
      setScanResult(res);
      fetchAdminData();
    } catch (err) {
      setScanResult({ success: false, message: 'Server verification failure.' });
    } finally {
      setScanLoading(false);
    }
  };

  const handleUpdateInquiry = async (e) => {
    e.preventDefault();
    if (!selectedInquiry) return;

    try {
      const res = await api.updateInquiryStatus(selectedInquiry._id, newStatus, noteText);
      if (res.success) {
        setSelectedInquiry(null);
        setNoteText('');
        fetchAdminData();
      }
    } catch (err) {
      console.error('Update inquiry error:', err);
    }
  };

  const handleRecordExpense = async (e) => {
    e.preventDefault();
    try {
      const res = await api.recordExpense(expenseForm);
      if (res.success) {
        setExpenseSuccess('Expense successfully added to operational ledger.');
        setExpenseForm({ category: 'Electricity & AC', amount: '', description: '', receiptReference: '' });
        fetchAdminData();
        setTimeout(() => setExpenseSuccess(''), 4000);
      }
    } catch (err) {
      console.error('Record expense error:', err);
    }
  };

  return (
    <div className="page-container">
      {/* Official Secretariat Header */}
      <div
        className="responsive-banner"
        style={{
          background: 'linear-gradient(135deg, #051329 0%, #0a2540 100%)',
          color: '#ffffff',
        }}
      >
        <div className="responsive-banner-left">
          <div className="gov-seal-icon" style={{ flexShrink: 0 }}>
            <Sparkles size={20} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#f59e0b', fontSize: '0.8rem', fontWeight: 'bold', flexWrap: 'wrap' }}>
              COLLEGE FOR COMPETITIVE STUDIES (C2S) COMMAND CONSOLE
            </div>
            <h2 style={{ fontSize: '1.4rem', fontFamily: 'Cinzel, Georgia, serif', margin: '4px 0 0' }}>
              Officer Command & Monitoring Dashboard
            </h2>
            <p style={{ margin: '4px 0 0', fontSize: '0.85rem', color: '#94a3b8' }}>
              Logged in as: <strong style={{ color: '#ffffff' }}>{user?.name}</strong> ({user?.role})
            </p>
          </div>
        </div>

        <div className="responsive-banner-right">
          <span style={{ background: 'rgba(52, 211, 153, 0.2)', border: '1px solid #34d399', color: '#a7f3d0', fontSize: '0.75rem', fontWeight: 'bold', padding: '4px 12px', borderRadius: '12px' }}>
            PORTAL LIVE & SYNCHRONIZED
          </span>
          <div style={{ fontSize: '0.78rem', color: '#cbd5e1', marginTop: '6px' }}>
            {new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </div>
        </div>
      </div>

      {/* KPI Overview Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '28px' }}>
        <div className="gov-card" style={{ padding: '20px', borderLeft: '4px solid #3b82f6' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: '600' }}>TOTAL REGISTERED ASPIRANTS</div>
              <div style={{ fontSize: '1.8rem', fontWeight: '800', color: '#0a2540', fontFamily: 'Cinzel, serif' }}>
                {metrics?.totalStudents || students.length || 0}
              </div>
            </div>
            <Users size={32} color="#3b82f6" />
          </div>
          <div style={{ fontSize: '0.75rem', color: '#059669', marginTop: '8px' }}>
            ✓ Verified candidate student dossiers
          </div>
        </div>

        <div className="gov-card" style={{ padding: '20px', borderLeft: '4px solid #10b981' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: '600' }}>ACTIVE LIBRARY PASSES</div>
              <div style={{ fontSize: '1.8rem', fontWeight: '800', color: '#0a2540', fontFamily: 'Cinzel, serif' }}>
                {metrics?.activeMemberships || 0}
              </div>
            </div>
            <Library size={32} color="#10b981" />
          </div>
          <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '8px' }}>
            Occupying reading desk shifts
          </div>
        </div>

        <div className="gov-card" style={{ padding: '20px', borderLeft: '4px solid #f59e0b' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: '600' }}>PENDING INQUIRIES</div>
              <div style={{ fontSize: '1.8rem', fontWeight: '800', color: '#0a2540', fontFamily: 'Cinzel, serif' }}>
                {metrics?.pendingInquiries || inquiries.filter(i => i.status === 'NEW').length || 0}
              </div>
            </div>
            <Send size={32} color="#f59e0b" />
          </div>
          <div style={{ fontSize: '0.75rem', color: '#d97706', marginTop: '8px' }}>
            Requires counselor follow-up
          </div>
        </div>

        <div className="gov-card" style={{ padding: '20px', borderLeft: '4px solid #059669' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: '600' }}>TOTAL REVENUE</div>
              <div style={{ fontSize: '1.8rem', fontWeight: '800', color: '#059669', fontFamily: 'Cinzel, serif' }}>
                ₹{metrics?.totalRevenue || 0}
              </div>
            </div>
            <TrendingUp size={32} color="#059669" />
          </div>
          <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '8px' }}>
            Net Surplus: ₹{metrics?.netBalance || 0}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="responsive-tabs-bar">
        {[
          { id: 'overview', label: 'Revenue & Operations Ledger' },
          { id: 'users', label: `Aspirants Directory (${students.length})` },
          { id: 'gate_desk', label: 'Reception & QR Ticket Validator' },
          { id: 'inquiries', label: `Candidate Inquiry CRM (${inquiries.length})` },
          { id: 'finance', label: 'Record Operational Expenses' },
        ].map((tab) => {
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
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* TAB 1: OVERVIEW & REVENUE BREAKDOWN */}
      {activeTab === 'overview' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
          <div className="gov-card" style={{ padding: '24px' }}>
            <h3 style={{ color: '#0a2540', marginBottom: '16px' }}>Recent Verified Orders & Admissions</h3>
            {transactions.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {transactions.slice(0, 8).map((tx) => (
                  <div key={tx._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', background: '#f8fafc', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                    <div>
                      <div style={{ fontWeight: 'bold', color: '#0a2540', fontSize: '0.9rem' }}>{tx.itemTitle}</div>
                      <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                        Student: {tx.user?.name || 'Aspirant'} ({tx.user?.phone || 'N/A'}) • Order: {tx.orderNumber}
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontWeight: 'bold', color: '#059669', fontSize: '1rem' }}>₹{tx.amount}</div>
                      <span style={{ fontSize: '0.7rem', color: '#16a34a', fontWeight: 'bold' }}>PAID VIA RAZORPAY</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>
                No admissions or transactions processed yet. Ready for live candidate registrations.
              </div>
            )}
          </div>

          <div className="gov-card" style={{ padding: '24px' }}>
            <h3 style={{ color: '#0a2540', marginBottom: '16px' }}>Module-Wise Collection Share</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '6px', display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontWeight: '600', color: '#334155' }}>Physical Library Passes:</span>
                <strong style={{ color: '#0a2540' }}>₹{metrics?.revenueByModule?.LIBRARY || 0}</strong>
              </div>
              <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '6px', display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontWeight: '600', color: '#334155' }}>Exam Course Enrollments:</span>
                <strong style={{ color: '#0a2540' }}>₹{metrics?.revenueByModule?.COURSE || 0}</strong>
              </div>
              <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '6px', display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontWeight: '600', color: '#334155' }}>Digital PDF Notes:</span>
                <strong style={{ color: '#0a2540' }}>₹{metrics?.revenueByModule?.PDF || 0}</strong>
              </div>
              <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '6px', display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontWeight: '600', color: '#334155' }}>Online Mock Tests:</span>
                <strong style={{ color: '#0a2540' }}>₹{metrics?.revenueByModule?.MOCK_TEST || 0}</strong>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: ASPIRANTS DIRECTORY & COMPLETE DOSSIER ACCESS */}
      {activeTab === 'users' && (
        <div>
          {/* Filter Bar */}
          <div className="gov-card" style={{ padding: '16px 20px', marginBottom: '20px', display: 'flex', gap: '14px', flexWrap: 'wrap', alignItems: 'center' }}>
            <div style={{ flex: 1, minWidth: '240px', position: 'relative' }}>
              <Search size={16} color="#94a3b8" style={{ position: 'absolute', top: '12px', left: '12px' }} />
              <input
                type="text"
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                placeholder="Search candidate by Name, Phone, Email, ID..."
                style={{ width: '100%', padding: '9px 12px 9px 36px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '0.88rem' }}
              />
            </div>

            <select
              value={targetExamFilter}
              onChange={(e) => setTargetExamFilter(e.target.value)}
              style={{ padding: '9px 14px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '0.88rem', background: '#fff' }}
            >
              <option value="ALL">All Target Examinations</option>
              <option value="OPSC / OAS">OPSC / OAS</option>
              <option value="UPSC / IAS">UPSC / IAS</option>
              <option value="Banking / RBI">Banking / RBI</option>
              <option value="Staff Selection (SSC)">Staff Selection (SSC)</option>
              <option value="Railway (RRB)">Railway (RRB)</option>
            </select>

            <button className="btn-primary" onClick={handleFilterUsers} style={{ padding: '9px 18px', fontSize: '0.85rem' }}>
              Apply Filter
            </button>
          </div>

          {/* Aspirants Table */}
          <div className="gov-card" style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
            <table style={{ width: '100%', minWidth: '700px', borderCollapse: 'collapse', fontSize: '0.88rem', textAlign: 'left' }}>
              <thead>
                <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0', color: '#0a2540' }}>
                  <th style={{ padding: '12px 16px' }}>Candidate Name</th>
                  <th style={{ padding: '12px 16px' }}>Target Exam</th>
                  <th style={{ padding: '12px 16px' }}>Contact Phone</th>
                  <th style={{ padding: '12px 16px' }}>ID Proof</th>
                  <th style={{ padding: '12px 16px' }}>Profile Status</th>
                  <th style={{ padding: '12px 16px' }}>Account Status</th>
                  <th style={{ padding: '12px 16px', textAlign: 'center' }}>Official Actions</th>
                </tr>
              </thead>
              <tbody>
                {students.length > 0 ? (
                  students.map((stu) => (
                    <tr key={stu._id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '14px 16px' }}>
                        <div style={{ fontWeight: 'bold', color: '#0a2540' }}>{stu.name}</div>
                        <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{stu.email}</div>
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <span style={{ background: '#eff6ff', color: '#1d4ed8', padding: '3px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: '600' }}>
                          {stu.profile?.targetExam || 'General'}
                        </span>
                      </td>
                      <td style={{ padding: '14px 16px', color: '#475569' }}>
                        +91 {stu.phone}
                      </td>
                      <td style={{ padding: '14px 16px', fontSize: '0.8rem', color: '#64748b' }}>
                        {stu.profile?.idProofType ? `${stu.profile.idProofType}: ${stu.profile.idProofNumber}` : 'Pending Submission'}
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <span style={{ fontSize: '0.72rem', fontWeight: 'bold', color: stu.isProfileComplete ? '#059669' : '#d97706' }}>
                          {stu.isProfileComplete ? '✓ Complete File' : '• Incomplete'}
                        </span>
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <span style={{ fontSize: '0.72rem', fontWeight: 'bold', padding: '2px 8px', borderRadius: '4px', background: stu.status === 'ACTIVE' ? '#dcfce7' : '#fee2e2', color: stu.status === 'ACTIVE' ? '#166534' : '#991b1b' }}>
                          {stu.status}
                        </span>
                      </td>
                      <td style={{ padding: '14px 16px', textAlign: 'center' }}>
                        <div style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
                          <button
                            onClick={() => handleViewDossier(stu._id)}
                            className="btn-outline"
                            style={{ padding: '6px 12px', fontSize: '0.78rem' }}
                          >
                            <Eye size={14} /> View File
                          </button>
                          <button
                            onClick={() => handleToggleStatus(stu._id, stu.status)}
                            style={{
                              padding: '6px 10px',
                              borderRadius: '4px',
                              border: '1px solid #cbd5e1',
                              background: stu.status === 'ACTIVE' ? '#fef2f2' : '#f0fdf4',
                              color: stu.status === 'ACTIVE' ? '#dc2626' : '#16a34a',
                              fontSize: '0.78rem',
                              fontWeight: 'bold',
                              cursor: 'pointer',
                            }}
                          >
                            {stu.status === 'ACTIVE' ? 'Suspend' : 'Activate'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>
                      No aspirant student records found matching search filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Dossier Inspection Modal */}
          {selectedUserDossier && (
            <div
              style={{
                position: 'fixed',
                inset: 0,
                backgroundColor: 'rgba(5, 19, 41, 0.85)',
                backdropFilter: 'blur(6px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 1400,
                padding: '20px',
              }}
            >
              <div
                style={{
                  background: '#ffffff',
                  borderRadius: '12px',
                  width: '100%',
                  maxWidth: '780px',
                  maxHeight: '90vh',
                  overflowY: 'auto',
                  boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.4)',
                }}
              >
                <div style={{ background: '#0a2540', color: 'white', padding: '20px 24px', position: 'sticky', top: 0, zIndex: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <span style={{ fontSize: '0.75rem', color: '#f59e0b', fontWeight: 'bold' }}>OFFICIAL ASPIRANT DOSSIER</span>
                    <h3 style={{ margin: '2px 0 0', fontSize: '1.25rem', fontFamily: 'Cinzel, serif' }}>
                      {selectedUserDossier.user.name}
                    </h3>
                  </div>
                  <button onClick={() => setSelectedUserDossier(null)} style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
                    <X size={20} />
                  </button>
                </div>

                <div style={{ padding: '24px' }}>
                  {/* Personal & ID Verification */}
                  <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '8px', marginBottom: '20px', border: '1px solid #e2e8f0' }}>
                    <h4 style={{ color: '#0a2540', marginBottom: '10px' }}>Identity & Residential Details</h4>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px', fontSize: '0.85rem' }}>
                      <div>Father/Guardian: <strong>{selectedUserDossier.user.profile?.fatherName || 'N/A'}</strong></div>
                      <div>Date of Birth: <strong>{selectedUserDossier.user.profile?.dob || 'N/A'}</strong></div>
                      <div>ID Proof: <strong>{selectedUserDossier.user.profile?.idProofType} ({selectedUserDossier.user.profile?.idProofNumber || 'N/A'})</strong></div>
                      <div>Target Exam: <strong>{selectedUserDossier.user.profile?.targetExam || 'N/A'}</strong></div>
                      <div style={{ gridColumn: '1 / -1' }}>
                        Address: <strong>{selectedUserDossier.user.profile?.address?.street}, {selectedUserDossier.user.profile?.address?.city}, {selectedUserDossier.user.profile?.address?.state} - {selectedUserDossier.user.profile?.address?.pinCode}</strong>
                      </div>
                    </div>
                  </div>

                  {/* Active Library Passes */}
                  <div style={{ marginBottom: '20px' }}>
                    <h4 style={{ color: '#0a2540', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Library size={16} color="#059669" /> Physical Library Memberships ({selectedUserDossier.dossier?.subscriptions?.length || 0})
                    </h4>
                    {selectedUserDossier.dossier?.subscriptions?.map((sub) => (
                      <div key={sub._id} style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', padding: '12px', borderRadius: '6px', fontSize: '0.82rem', marginBottom: '6px' }}>
                        Pass ID: <strong>{sub.membershipId}</strong> • Shift: {sub.timeSlot?.name} ({sub.timeSlot?.timings}) • Status: <strong>{sub.status}</strong> • Valid until: {new Date(sub.endDate).toLocaleDateString('en-IN')}
                      </div>
                    ))}
                  </div>

                  {/* Enrolled Courses */}
                  <div style={{ marginBottom: '20px' }}>
                    <h4 style={{ color: '#0a2540', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <BookOpen size={16} color="#2563eb" /> Enrolled Video Batches ({selectedUserDossier.dossier?.enrollments?.length || 0})
                    </h4>
                    {selectedUserDossier.dossier?.enrollments?.map((enr) => (
                      <div key={enr._id} style={{ background: '#eff6ff', border: '1px solid #bfdbfe', padding: '12px', borderRadius: '6px', fontSize: '0.82rem', marginBottom: '6px' }}>
                        Course: <strong>{enr.course?.title}</strong> • Progress: <strong>{enr.progressPercent}%</strong>
                      </div>
                    ))}
                  </div>

                  {/* Orders & Payments */}
                  <div>
                    <h4 style={{ color: '#0a2540', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <CreditCard size={16} color="#d97706" /> Order & Fee Payments ({selectedUserDossier.dossier?.orders?.length || 0})
                    </h4>
                    {selectedUserDossier.dossier?.orders?.map((ord) => (
                      <div key={ord._id} style={{ display: 'flex', justifyContent: 'space-between', background: '#f8fafc', padding: '10px 14px', borderRadius: '6px', border: '1px solid #e2e8f0', fontSize: '0.8rem', marginBottom: '6px' }}>
                        <span>{ord.itemTitle} (Order: {ord.orderNumber})</span>
                        <strong style={{ color: '#059669' }}>₹{ord.amount} • {ord.paymentStatus}</strong>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: LIBRARY GATE ENTRY SCANNER */}
      {activeTab === 'gate_desk' && (
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div className="gov-card" style={{ padding: '32px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: '#ecfdf5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <QrCode size={22} />
              </div>
              <div>
                <h3 style={{ color: '#0a2540', fontSize: '1.2rem', margin: 0 }}>Gate Entry & QR Ticket Validator</h3>
                <p style={{ margin: 0, fontSize: '0.8rem', color: '#64748b' }}>
                  Scan the candidate's digital pass or enter their Membership ID to verify active subscription and log attendance.
                </p>
              </div>
            </div>

            <form onSubmit={handleVerifyTicket} style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
              <input
                type="text"
                required
                value={ticketInput}
                onChange={(e) => setTicketInput(e.target.value)}
                placeholder="Enter Membership ID (e.g. LIB-2026-0042)"
                style={{ flex: 1, padding: '12px 16px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '0.95rem' }}
              />
              <button type="submit" disabled={scanLoading} className="btn-primary" style={{ padding: '12px 24px' }}>
                {scanLoading ? 'Checking...' : 'Validate & Log Entry'}
              </button>
            </form>

            {/* Scan Feedback */}
            {scanResult && (
              <div
                style={{
                  background: scanResult.valid ? '#f0fdf4' : '#fef2f2',
                  border: scanResult.valid ? '1px solid #bbf7d0' : '1px solid #fecaca',
                  borderRadius: '8px',
                  padding: '24px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                  <CheckCircle size={24} color={scanResult.valid ? '#16a34a' : '#dc2626'} />
                  <h4 style={{ margin: 0, color: scanResult.valid ? '#166534' : '#991b1b', fontSize: '1.1rem' }}>
                    {scanResult.message}
                  </h4>
                </div>

                {scanResult.subscription && (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', fontSize: '0.85rem', color: '#334155', marginTop: '14px', borderTop: '1px solid rgba(0,0,0,0.06)', paddingTop: '12px' }}>
                    <div>
                      <strong>Student Name:</strong> {scanResult.subscription.user?.name}
                    </div>
                    <div>
                      <strong>Membership ID:</strong> {scanResult.subscription.membershipId}
                    </div>
                    <div>
                      <strong>Shift Time:</strong> {scanResult.subscription.timeSlot?.name} ({scanResult.subscription.timeSlot?.timings})
                    </div>
                    <div>
                      <strong>Expiry Date:</strong> {new Date(scanResult.subscription.endDate).toLocaleDateString('en-IN')}
                    </div>
                    <div style={{ gridColumn: '1 / -1', color: '#15803d', fontWeight: 'bold' }}>
                      Status: Gate attendance record created successfully!
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 4: INQUIRY CRM PIPELINE */}
      {activeTab === 'inquiries' && (
        <div style={{ display: 'grid', gridTemplateColumns: selectedInquiry ? 'repeat(auto-fit, minmax(300px, 1fr))' : '1fr', gap: '24px' }}>
          <div className="gov-card" style={{ padding: '24px' }}>
            <h3 style={{ color: '#0a2540', marginBottom: '16px' }}>Student Inquiry CRM Inbox ({inquiries.length})</h3>
            {inquiries.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {inquiries.map((inq) => {
                  const isSelected = selectedInquiry?._id === inq._id;
                  let badgeBg = '#f1f5f9';
                  let badgeColor = '#475569';
                  if (inq.status === 'NEW') { badgeBg = '#fee2e2'; badgeColor = '#b91c1c'; }
                  if (inq.status === 'CONTACTED') { badgeBg = '#eff6ff'; badgeColor = '#1d4ed8'; }
                  if (inq.status === 'CONVERTED') { badgeBg = '#dcfce7'; badgeColor = '#15803d'; }

                  return (
                    <div
                      key={inq._id}
                      onClick={() => { setSelectedInquiry(inq); setNewStatus(inq.status); }}
                      style={{
                        padding: '14px',
                        borderRadius: '8px',
                        background: isSelected ? '#f8fafc' : '#ffffff',
                        border: isSelected ? '2px solid #0a2540' : '1px solid #e2e8f0',
                        cursor: 'pointer',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontWeight: 'bold', color: '#0a2540', fontSize: '0.95rem' }}>{inq.name}</span>
                          <span style={{ background: badgeBg, color: badgeColor, fontSize: '0.7rem', fontWeight: 'bold', padding: '2px 8px', borderRadius: '4px' }}>
                            {inq.status}
                          </span>
                        </div>
                        <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '2px' }}>
                          {inq.phone} • Area: {inq.areaOfInterest} • Ref: {inq.inquiryNumber}
                        </div>
                        <p style={{ margin: '4px 0 0', fontSize: '0.82rem', color: '#475569' }}>
                          "{inq.message}"
                        </p>
                      </div>

                      <div style={{ textAlign: 'right', fontSize: '0.75rem', color: '#94a3b8' }}>
                        {new Date(inq.createdAt).toLocaleDateString('en-IN')}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>
                No candidate inquiries currently pending. All queries resolved.
              </div>
            )}
          </div>

          {/* CRM Details & Notes Pane */}
          {selectedInquiry && (
            <div className="gov-card" style={{ padding: '24px', alignSelf: 'start' }}>
              <h4 style={{ color: '#0a2540', marginBottom: '8px' }}>Follow-Up on {selectedInquiry.name}</h4>
              <p style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '16px' }}>
                Phone: <strong>{selectedInquiry.phone}</strong> • Email: {selectedInquiry.email || 'N/A'}
              </p>

              <form onSubmit={handleUpdateInquiry}>
                <div style={{ marginBottom: '14px' }}>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', color: '#334155', marginBottom: '4px' }}>
                    Update Status:
                  </label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                    style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '0.85rem', background: '#fff' }}
                  >
                    <option value="NEW">NEW</option>
                    <option value="CONTACTED">CONTACTED</option>
                    <option value="FOLLOW_UP">FOLLOW_UP</option>
                    <option value="CONVERTED">CONVERTED (ADMISSION CONFIRMED)</option>
                    <option value="CLOSED">CLOSED</option>
                  </select>
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', color: '#334155', marginBottom: '4px' }}>
                    Internal Officer Note:
                  </label>
                  <textarea
                    rows={3}
                    value={noteText}
                    onChange={(e) => setNoteText(e.target.value)}
                    placeholder="Enter counselor follow-up observations..."
                    style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '0.85rem' }}
                  />
                </div>

                <button type="submit" className="btn-accent" style={{ width: '100%', justifyContent: 'center' }}>
                  Save CRM Follow-Up
                </button>
              </form>
            </div>
          )}
        </div>
      )}

      {/* TAB 5: OPERATING EXPENSE LOGGING */}
      {activeTab === 'finance' && (
        <div style={{ maxWidth: '700px', margin: '0 auto' }}>
          <div className="gov-card" style={{ padding: '32px' }}>
            <h3 style={{ color: '#0a2540', fontSize: '1.2rem', marginBottom: '6px' }}>Record Operating Expenses</h3>
            <p style={{ fontSize: '0.82rem', color: '#64748b', marginBottom: '24px' }}>
              Log institutional overhead expenditures (power, lease, faculty honoraria, library books) to maintain an auditable balance sheet.
            </p>

            {expenseSuccess && (
              <div style={{ background: '#f0fdf4', borderLeft: '4px solid #16a34a', color: '#15803d', padding: '10px 16px', fontSize: '0.85rem', marginBottom: '20px' }}>
                {expenseSuccess}
              </div>
            )}

            <form onSubmit={handleRecordExpense}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '600', color: '#334155', marginBottom: '4px' }}>
                    Expense Category *
                  </label>
                  <select
                    value={expenseForm.category}
                    onChange={(e) => setExpenseForm({ ...expenseForm, category: e.target.value })}
                    style={{ width: '100%', padding: '9px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '0.88rem', background: '#fff' }}
                  >
                    <option value="Electricity & AC">Electricity & Air Conditioning</option>
                    <option value="Rent">Campus / Facility Rent</option>
                    <option value="Faculty Honorarium">Faculty Honorarium</option>
                    <option value="Library Supplies & Books">Library Supplies & Reference Books</option>
                    <option value="Software & IT Infrastructure">Software & IT Infrastructure</option>
                    <option value="Maintenance & Cleaning">Maintenance & Cleaning</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '600', color: '#334155', marginBottom: '4px' }}>
                    Amount (INR) *
                  </label>
                  <input
                    type="number"
                    required
                    value={expenseForm.amount}
                    onChange={(e) => setExpenseForm({ ...expenseForm, amount: e.target.value })}
                    placeholder="e.g. 12500"
                    style={{ width: '100%', padding: '9px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '0.88rem' }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '600', color: '#334155', marginBottom: '4px' }}>
                  Bill / Voucher Reference Number
                </label>
                <input
                  type="text"
                  value={expenseForm.receiptReference}
                  onChange={(e) => setExpenseForm({ ...expenseForm, receiptReference: e.target.value })}
                  placeholder="e.g. TPCODL-INV-9921"
                  style={{ width: '100%', padding: '9px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '0.88rem' }}
                />
              </div>

              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '600', color: '#334155', marginBottom: '4px' }}>
                  Expense Description *
                </label>
                <textarea
                  rows={3}
                  required
                  value={expenseForm.description}
                  onChange={(e) => setExpenseForm({ ...expenseForm, description: e.target.value })}
                  placeholder="Details of the expenditure..."
                  style={{ width: '100%', padding: '9px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '0.88rem' }}
                />
              </div>

              <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '12px' }}>
                Post Expense to Ledger
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
