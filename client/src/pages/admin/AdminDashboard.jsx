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
} from 'lucide-react';
import { api } from '../../services/api';
import { useAuth } from '../../state/AuthContext';

export const AdminDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview'); // 'overview', 'gate_desk', 'inquiries', 'finance'
  const [metrics, setMetrics] = useState(null);
  const [inquiries, setInquiries] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

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
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      const [metricsRes, inqRes, txRes] = await Promise.all([
        api.getAdminMetrics(),
        api.getInquiries(),
        api.getAllTransactions(),
      ]);

      if (metricsRes.success) setMetrics(metricsRes.metrics);
      if (inqRes.success) setInquiries(inqRes.inquiries);
      if (txRes.success) setTransactions(txRes.orders);
    } catch (err) {
      console.error('Error fetching admin data:', err);
    } finally {
      setLoading(false);
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
    <div style={{ maxWidth: '1200px', margin: '30px auto 80px', padding: '0 24px' }}>
      {/* Official Secretariat Header */}
      <div
        style={{
          background: 'linear-gradient(135deg, #051329 0%, #0a2540 100%)',
          color: '#ffffff',
          borderRadius: '12px',
          padding: '24px 30px',
          marginBottom: '30px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          boxShadow: 'var(--shadow-md)',
          borderBottom: '3px solid #d97706',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#f59e0b', fontSize: '0.8rem', fontWeight: 'bold' }}>
            <Sparkles size={16} /> STATE ACADEMY ADMINISTRATIVE COMMAND CONSOLE
          </div>
          <h2 style={{ fontSize: '1.4rem', fontFamily: 'Cinzel, Georgia, serif', margin: '4px 0 0' }}>
            Officer Command & Monitoring Dashboard
          </h2>
          <p style={{ margin: '4px 0 0', fontSize: '0.85rem', color: '#94a3b8' }}>
            Logged in as: <strong style={{ color: '#ffffff' }}>{user?.name}</strong> ({user?.role})
          </p>
        </div>

        <div style={{ textAlign: 'right' }}>
          <span style={{ background: 'rgba(52, 211, 153, 0.2)', border: '1px solid #34d399', color: '#a7f3d0', fontSize: '0.75rem', fontWeight: 'bold', padding: '4px 12px', borderRadius: '12px' }}>
            PORTAL LIVE & SYNCHRONIZED
          </span>
          <div style={{ fontSize: '0.78rem', color: '#cbd5e1', marginTop: '6px' }}>
            {new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </div>
        </div>
      </div>

      {/* KPI Overview Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '30px' }}>
        <div className="gov-card" style={{ padding: '20px', borderLeft: '4px solid #3b82f6' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: '600' }}>TOTAL ASPIRANTS</div>
              <div style={{ fontSize: '1.8rem', fontWeight: '800', color: '#0a2540', fontFamily: 'Cinzel, serif' }}>
                {metrics?.totalStudents || 0}
              </div>
            </div>
            <Users size={32} color="#3b82f6" />
          </div>
          <div style={{ fontSize: '0.75rem', color: '#059669', marginTop: '8px' }}>
            ✓ Verified candidate registrations
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
                {metrics?.pendingInquiries || 0}
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
      <div style={{ display: 'flex', gap: '8px', borderBottom: '2px solid #e2e8f0', marginBottom: '28px' }}>
        {[
          { id: 'overview', label: 'Revenue & Operations Ledger' },
          { id: 'gate_desk', label: 'Reception & QR Ticket Validator' },
          { id: 'inquiries', label: 'Candidate Inquiry CRM' },
          { id: 'finance', label: 'Record Operational Expenses' },
        ].map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: '10px 18px',
                border: 'none',
                background: isActive ? '#0a2540' : 'transparent',
                color: isActive ? '#ffffff' : '#64748b',
                fontWeight: '600',
                fontSize: '0.88rem',
                borderRadius: '6px',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* TAB 1: OVERVIEW & REVENUE BREAKDOWN */}
      {activeTab === 'overview' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '28px' }}>
          <div className="gov-card" style={{ padding: '24px' }}>
            <h3 style={{ color: '#0a2540', marginBottom: '16px' }}>Recent Verified Orders & Admissions</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {transactions.slice(0, 8).map((tx) => (
                <div key={tx._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', background: '#f8fafc', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                  <div>
                    <div style={{ fontWeight: 'bold', color: '#0a2540', fontSize: '0.9rem' }}>{tx.itemTitle}</div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                      Student: {tx.user?.name} ({tx.user?.phone}) • Order: {tx.orderNumber}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: 'bold', color: '#059669', fontSize: '1rem' }}>₹{tx.amount}</div>
                    <span style={{ fontSize: '0.7rem', color: '#16a34a', fontWeight: 'bold' }}>PAID VIA RAZORPAY</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="gov-card" style={{ padding: '24px' }}>
            <h3 style={{ color: '#0a2540', marginBottom: '16px' }}>Module-Wise Collection Share</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '6px', display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontWeight: '600', color: '#334155' }}>Physical Library Passes:</span>
                <strong style={{ color: '#0a2540' }}>₹{metrics?.revenueByModule?.LIBRARY || 2200}</strong>
              </div>
              <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '6px', display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontWeight: '600', color: '#334155' }}>Exam Course Enrollments:</span>
                <strong style={{ color: '#0a2540' }}>₹{metrics?.revenueByModule?.COURSE || 0}</strong>
              </div>
              <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '6px', display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontWeight: '600', color: '#334155' }}>Digital PDF Notes:</span>
                <strong style={{ color: '#0a2540' }}>₹{metrics?.revenueByModule?.PDF || 99}</strong>
              </div>
              <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '6px', display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontWeight: '600', color: '#334155' }}>Online Mock Tests:</span>
                <strong style={{ color: '#0a2540' }}>₹{metrics?.revenueByModule?.MOCK_TEST || 0}</strong>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: LIBRARY GATE ENTRY SCANNER */}
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

      {/* TAB 3: INQUIRY CRM PIPELINE */}
      {activeTab === 'inquiries' && (
        <div style={{ display: 'grid', gridTemplateColumns: selectedInquiry ? '1fr 380px' : '1fr', gap: '24px' }}>
          <div className="gov-card" style={{ padding: '24px' }}>
            <h3 style={{ color: '#0a2540', marginBottom: '16px' }}>Student Inquiry CRM Inbox ({inquiries.length})</h3>
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

      {/* TAB 4: OPERATING EXPENSE LOGGING */}
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
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px', marginBottom: '14px' }}>
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
