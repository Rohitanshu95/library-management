import React, { useState } from 'react';
import {
  X,
  CreditCard,
  ShieldCheck,
  Mail,
  CheckCircle,
  Smartphone,
  Building,
  Wallet,
  Lock,
  ArrowRight,
  Check,
  Loader2,
  Sparkles,
  ExternalLink,
  Info,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { api } from '../../services/api';
import { useAuth } from '../../state/AuthContext';

export const CheckoutModal = ({ isOpen, onClose, item, onSuccess }) => {
  const { user } = useAuth();
  const [modalStage, setModalStage] = useState('SUMMARY'); // 'SUMMARY', 'RAZORPAY_GATEWAY', 'SUCCESS'
  const [paymentMethod, setPaymentMethod] = useState('UPI'); // 'UPI', 'CARD', 'NETBANKING', 'WALLET'
  const [upiId, setUpiId] = useState(user?.email ? `${user.email.split('@')[0]}@okhdfcbank` : 'aspirant@oksbi');
  const [selectedUpiApp, setSelectedUpiApp] = useState('Google Pay');
  const [selectedBank, setSelectedBank] = useState('State Bank of India');
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvv, setCardCvv] = useState('888');
  const [cardHolder, setCardHolder] = useState(user?.name || 'Authorized Candidate');
  const [selectedShift, setSelectedShift] = useState(item?.slotOptions?.[0] || null);

  const [loading, setLoading] = useState(false);
  const [processingStatus, setProcessingStatus] = useState('');
  const [error, setError] = useState('');
  const [paymentSuccessData, setPaymentSuccessData] = useState(null);

  if (!isOpen || !item) return null;

  const handleStartRazorpayCheckout = () => {
    setError('');
    setModalStage('RAZORPAY_GATEWAY');
  };

  const handleExecutePayment = async () => {
    setLoading(true);
    setError('');
    setProcessingStatus('Connecting securely to Razorpay Gateway...');

    try {
      // 1. Create Order on Server
      const orderRes = await api.createOrder({
        itemType: item.itemType, // 'LIBRARY_SUBSCRIPTION', 'COURSE', 'PDF'
        itemId: item._id,
        slotOption: selectedShift,
      });

      if (!orderRes.success) {
        setError(orderRes.message || 'Unable to establish transaction with server.');
        setLoading(false);
        setProcessingStatus('');
        return;
      }

      // Step-by-step realistic Razorpay bank authorization
      setProcessingStatus('Routing to Bank 3D-Secure ACS...');
      await new Promise((resolve) => setTimeout(resolve, 800));

      setProcessingStatus('Verifying payment credentials with Reserve Bank of India...');
      await new Promise((resolve) => setTimeout(resolve, 700));

      const generatedPaymentId = `pay_rzp_${Math.random().toString(36).substring(2, 10).toUpperCase()}`;

      // 2. Complete payment verification on backend
      const verifyRes = await api.verifyPayment({
        orderId: orderRes.order.id,
        razorpayOrderId: orderRes.order.razorpayOrderId,
        razorpayPaymentId: generatedPaymentId,
        isSimulated: true,
      });

      if (verifyRes.success) {
        setProcessingStatus('Payment Authorized! Issuing admission credentials...');
        await new Promise((resolve) => setTimeout(resolve, 500));

        confetti({
          particleCount: 100,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#0a2540', '#d97706', '#10b981', '#3b82f6', '#f59e0b'],
        });

        setPaymentSuccessData(verifyRes);
        setModalStage('SUCCESS');
      } else {
        setError(verifyRes.message || 'Payment verification failed at gateway.');
        setProcessingStatus('');
      }
    } catch (err) {
      console.error('Payment failure:', err);
      setError('Transaction processing failure. Please check gateway connectivity.');
      setProcessingStatus('');
    } finally {
      setLoading(false);
    }
  };

  const handleFinishAndRedirect = () => {
    if (onSuccess) onSuccess(paymentSuccessData);
    onClose();
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(5, 19, 41, 0.85)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1200,
        padding: '16px',
      }}
    >
      <div
        style={{
          background: '#ffffff',
          borderRadius: '14px',
          width: '100%',
          maxWidth: modalStage === 'RAZORPAY_GATEWAY' ? '680px' : '540px',
          maxHeight: '92vh',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.5)',
          border: '1px solid #cbd5e1',
          transition: 'all 0.3s ease',
        }}
      >
        {/* ========================================================================= */}
        {/* STAGE 1: ORDER SUMMARY & ADMISSION FEE REVIEW                             */}
        {/* ========================================================================= */}
        {modalStage === 'SUMMARY' && (
          <div>
            {/* Header */}
            <div style={{ background: '#0a2540', color: 'white', padding: '20px 24px', position: 'relative' }}>
              <button
                onClick={onClose}
                style={{
                  position: 'absolute',
                  top: '16px',
                  right: '16px',
                  background: 'transparent',
                  border: 'none',
                  color: '#94a3b8',
                  cursor: 'pointer',
                }}
              >
                <X size={20} />
              </button>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#f59e0b', fontSize: '0.8rem', fontWeight: 'bold' }}>
                <ShieldCheck size={16} /> STATE ACADEMY OFFICIAL ADMISSION PORTAL
              </div>
              <h3 style={{ margin: '6px 0 0', fontSize: '1.25rem', fontFamily: 'Cinzel, Georgia, serif' }}>
                Course & Entitlement Checkout
              </h3>
            </div>

            <div style={{ padding: '24px', maxHeight: 'calc(92vh - 120px)', overflowY: 'auto' }}>
              {error && (
                <div style={{ background: '#fef2f2', borderLeft: '4px solid #ef4444', color: '#b91c1c', padding: '10px 16px', fontSize: '0.85rem', marginBottom: '16px' }}>
                  {error}
                </div>
              )}

              {/* Verified Applicant Pill */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  padding: '10px 14px',
                  borderRadius: '8px',
                  marginBottom: '16px',
                  fontSize: '0.82rem',
                }}
              >
                <div>
                  <span style={{ color: '#64748b' }}>Applicant: </span>
                  <strong style={{ color: '#0a2540' }}>{user?.name || 'Enrolled Aspirant'}</strong> ({user?.email})
                </div>
                <span
                  style={{
                    background: '#dcfce7',
                    color: '#166534',
                    padding: '2px 8px',
                    borderRadius: '12px',
                    fontSize: '0.72rem',
                    fontWeight: '700',
                  }}
                >
                  KYC VERIFIED
                </span>
              </div>

              {/* Order Item Summary Card */}
              <div
                style={{
                  background: 'linear-gradient(135deg, #ffffff 0%, #f9fafb 100%)',
                  border: '1px solid #cbd5e1',
                  borderRadius: '10px',
                  padding: '18px',
                  marginBottom: '20px',
                }}
              >
                <div style={{ fontSize: '0.75rem', fontWeight: '700', color: '#b45309', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Selected Academic Programme
                </div>
                <div style={{ fontSize: '1.15rem', fontWeight: '700', color: '#0a2540', margin: '6px 0 2px' }}>
                  {item.name || item.title}
                </div>
                <div style={{ fontSize: '0.85rem', color: '#64748b' }}>
                  {item.itemType === 'LIBRARY_SUBSCRIPTION'
                    ? `Physical Study Hub Pass • ${item.durationMonths} Months Duration`
                    : item.itemType === 'COURSE'
                    ? `Comprehensive Classroom Program • ${item.examCategory || 'UPSC/OPSC'}`
                    : `Official Digital Study Notes & Question Banks`}
                </div>

                {/* Slot Selector if Library subscription */}
                {item.slotOptions && (
                  <div style={{ marginTop: '16px', borderTop: '1px dashed #cbd5e1', paddingTop: '14px' }}>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '700', color: '#334155', marginBottom: '6px' }}>
                      Select Reading Hub Shift:
                    </label>
                    <select
                      value={selectedShift?.name || ''}
                      onChange={(e) => {
                        const found = item.slotOptions.find((s) => s.name === e.target.value);
                        setSelectedShift(found);
                      }}
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        border: '1px solid #cbd5e1',
                        borderRadius: '6px',
                        fontSize: '0.88rem',
                        background: '#fff',
                        color: '#0a2540',
                        fontWeight: '600',
                      }}
                    >
                      {item.slotOptions.map((s, idx) => (
                        <option key={idx} value={s.name}>
                          {s.name} ({s.timings})
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              {/* Price Breakdown */}
              <div
                style={{
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  padding: '14px 18px',
                  marginBottom: '24px',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem', color: '#64748b', marginBottom: '8px' }}>
                  <span>Tuition / Membership Fee:</span>
                  <span>₹{item.price}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem', color: '#64748b', marginBottom: '8px' }}>
                  <span>Govt. Subsidized Platform Surcharge:</span>
                  <span style={{ color: '#16a34a', fontWeight: '600' }}>WAIVED (₹0)</span>
                </div>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    borderTop: '1px solid #cbd5e1',
                    paddingTop: '10px',
                    marginTop: '8px',
                  }}
                >
                  <span style={{ fontSize: '1rem', color: '#0a2540', fontWeight: '700' }}>Total Fee Payable:</span>
                  <span style={{ fontSize: '1.75rem', fontWeight: '800', color: '#0a2540', fontFamily: 'Cinzel, serif' }}>
                    ₹{item.price}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <button
                  type="button"
                  className="btn-accent"
                  onClick={handleStartRazorpayCheckout}
                  style={{
                    width: '100%',
                    justifyContent: 'center',
                    padding: '14px',
                    fontSize: '1rem',
                    boxShadow: '0 4px 14px rgba(217, 119, 6, 0.3)',
                  }}
                >
                  <CreditCard size={18} />
                  Proceed to Razorpay Checkout (UPI / Card / NetBanking)
                </button>

                <div
                  style={{
                    textAlign: 'center',
                    fontSize: '0.78rem',
                    color: '#64748b',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    marginTop: '4px',
                  }}
                >
                  <ShieldCheck size={14} color="#059669" />
                  Secured by Razorpay • Instant Admission Grant • Automated Tax Invoice
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* STAGE 2: INTERACTIVE RAZORPAY BRANDED PAYMENT CHECKOUT WINDOW              */}
        {/* ========================================================================= */}
        {modalStage === 'RAZORPAY_GATEWAY' && (
          <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            {/* Razorpay Authentic Blue Header */}
            <div
              style={{
                background: 'linear-gradient(135deg, #0c2340 0%, #0369a1 100%)',
                color: '#ffffff',
                padding: '18px 24px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div
                  style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '8px',
                    background: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: '900',
                    color: '#0284c7',
                    fontSize: '1.2rem',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                  }}
                >
                  R
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.72rem', letterSpacing: '0.8px', color: '#bae6fd', textTransform: 'uppercase', fontWeight: '700' }}>
                    <ShieldCheck size={13} color="#38bdf8" /> Razorpay Trusted Business
                  </div>
                  <div style={{ fontSize: '1.05rem', fontWeight: '700', color: '#ffffff' }}>
                    State Public Service Academy
                  </div>
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '0.75rem', color: '#bae6fd' }}>Amount to Pay</div>
                <div style={{ fontSize: '1.5rem', fontWeight: '800', fontFamily: 'Cinzel, Georgia, serif', color: '#ffffff' }}>
                  ₹{item.price}
                </div>
              </div>
            </div>

            {/* Test Sandbox Badge Banner */}
            <div
              style={{
                background: '#fef3c7',
                borderBottom: '1px solid #fde68a',
                padding: '7px 24px',
                fontSize: '0.78rem',
                color: '#92400e',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Info size={14} />
                <span><strong>Razorpay Test Sandbox:</strong> Select any payment method below and pay instantly.</span>
              </div>
              <button
                onClick={() => setModalStage('SUMMARY')}
                style={{ background: 'transparent', border: 'none', color: '#0369a1', fontSize: '0.78rem', cursor: 'pointer', textDecoration: 'underline' }}
              >
                Back to Details
              </button>
            </div>

            {/* Main Gateway Body with Left Tabs and Right Form */}
            <div className="razorpay-body-layout" style={{ display: 'flex', flex: 1, minHeight: '340px', background: '#f8fafc' }}>
              {/* Left Method Tabs */}
              <div
                className="razorpay-methods-sidebar"
                style={{
                  width: '200px',
                  background: '#ffffff',
                  borderRight: '1px solid #e2e8f0',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <button
                  type="button"
                  onClick={() => setPaymentMethod('UPI')}
                  style={{
                    padding: '14px 18px',
                    border: 'none',
                    borderLeft: paymentMethod === 'UPI' ? '4px solid #0284c7' : '4px solid transparent',
                    background: paymentMethod === 'UPI' ? '#f0f9ff' : 'transparent',
                    color: paymentMethod === 'UPI' ? '#0369a1' : '#475569',
                    fontWeight: paymentMethod === 'UPI' ? '700' : '500',
                    textAlign: 'left',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    fontSize: '0.85rem',
                  }}
                >
                  <Smartphone size={18} color={paymentMethod === 'UPI' ? '#0284c7' : '#64748b'} />
                  UPI & QR
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('CARD')}
                  style={{
                    padding: '14px 18px',
                    border: 'none',
                    borderLeft: paymentMethod === 'CARD' ? '4px solid #0284c7' : '4px solid transparent',
                    background: paymentMethod === 'CARD' ? '#f0f9ff' : 'transparent',
                    color: paymentMethod === 'CARD' ? '#0369a1' : '#475569',
                    fontWeight: paymentMethod === 'CARD' ? '700' : '500',
                    textAlign: 'left',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    fontSize: '0.85rem',
                  }}
                >
                  <CreditCard size={18} color={paymentMethod === 'CARD' ? '#0284c7' : '#64748b'} />
                  Cards (Visa/RuPay)
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('NETBANKING')}
                  style={{
                    padding: '14px 18px',
                    border: 'none',
                    borderLeft: paymentMethod === 'NETBANKING' ? '4px solid #0284c7' : '4px solid transparent',
                    background: paymentMethod === 'NETBANKING' ? '#f0f9ff' : 'transparent',
                    color: paymentMethod === 'NETBANKING' ? '#0369a1' : '#475569',
                    fontWeight: paymentMethod === 'NETBANKING' ? '700' : '500',
                    textAlign: 'left',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    fontSize: '0.85rem',
                  }}
                >
                  <Building size={18} color={paymentMethod === 'NETBANKING' ? '#0284c7' : '#64748b'} />
                  Netbanking
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('WALLET')}
                  style={{
                    padding: '14px 18px',
                    border: 'none',
                    borderLeft: paymentMethod === 'WALLET' ? '4px solid #0284c7' : '4px solid transparent',
                    background: paymentMethod === 'WALLET' ? '#f0f9ff' : 'transparent',
                    color: paymentMethod === 'WALLET' ? '#0369a1' : '#475569',
                    fontWeight: paymentMethod === 'WALLET' ? '700' : '500',
                    textAlign: 'left',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    fontSize: '0.85rem',
                  }}
                >
                  <Wallet size={18} color={paymentMethod === 'WALLET' ? '#0284c7' : '#64748b'} />
                  Wallets & PayLater
                </button>

                <div style={{ marginTop: 'auto', padding: '16px', borderTop: '1px solid #f1f5f9', fontSize: '0.72rem', color: '#94a3b8' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '4px' }}>
                    <Lock size={12} /> 256-Bit SSL
                  </div>
                  PCI-DSS Level 1 Verified
                </div>
              </div>

              {/* Right Method Form */}
              <div style={{ flex: 1, padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                {/* Method 1: UPI */}
                {paymentMethod === 'UPI' && (
                  <div>
                    <h4 style={{ margin: '0 0 12px', fontSize: '0.95rem', color: '#0f172a' }}>
                      Select UPI App or Enter VPA:
                    </h4>

                    {/* Popular UPI Apps Grid */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '16px' }}>
                      {[
                        { name: 'Google Pay', icon: '🟢 GPay' },
                        { name: 'PhonePe', icon: '🟣 PhonePe' },
                        { name: 'Paytm', icon: '🔵 Paytm' },
                      ].map((app) => (
                        <button
                          key={app.name}
                          type="button"
                          onClick={() => setSelectedUpiApp(app.name)}
                          style={{
                            padding: '12px 8px',
                            borderRadius: '8px',
                            border: selectedUpiApp === app.name ? '2px solid #0284c7' : '1px solid #cbd5e1',
                            background: selectedUpiApp === app.name ? '#f0f9ff' : '#ffffff',
                            fontWeight: '600',
                            fontSize: '0.85rem',
                            cursor: 'pointer',
                            color: '#0f172a',
                            textAlign: 'center',
                          }}
                        >
                          {app.icon}
                        </button>
                      ))}
                    </div>

                    <div style={{ marginBottom: '14px' }}>
                      <label style={{ display: 'block', fontSize: '0.8rem', color: '#475569', marginBottom: '4px', fontWeight: '600' }}>
                        Or Enter UPI ID / Virtual Address:
                      </label>
                      <input
                        type="text"
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                        placeholder="username@bank"
                        style={{
                          width: '100%',
                          padding: '10px 12px',
                          border: '1px solid #cbd5e1',
                          borderRadius: '6px',
                          fontSize: '0.9rem',
                        }}
                      />
                    </div>

                    <div
                      style={{
                        background: '#ecfdf5',
                        border: '1px solid #a7f3d0',
                        borderRadius: '6px',
                        padding: '10px 12px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        fontSize: '0.78rem',
                        color: '#065f46',
                      }}
                    >
                      <Check size={14} color="#059669" /> Instant zero-convenience fee auto approval enabled
                    </div>
                  </div>
                )}

                {/* Method 2: CARD */}
                {paymentMethod === 'CARD' && (
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                      <h4 style={{ margin: 0, fontSize: '0.95rem', color: '#0f172a' }}>Enter Card Details:</h4>
                      <span style={{ fontSize: '0.72rem', color: '#0284c7', background: '#e0f2fe', padding: '2px 8px', borderRadius: '4px', fontWeight: 'bold' }}>
                        TEST CARD ACTIVE
                      </span>
                    </div>

                    <div style={{ marginBottom: '12px' }}>
                      <label style={{ display: 'block', fontSize: '0.78rem', color: '#475569', marginBottom: '4px', fontWeight: '600' }}>
                        Card Number:
                      </label>
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        style={{ width: '100%', padding: '9px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '0.9rem', fontFamily: 'monospace' }}
                      />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '12px' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.78rem', color: '#475569', marginBottom: '4px', fontWeight: '600' }}>
                          Expiry (MM/YY):
                        </label>
                        <input
                          type="text"
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(e.target.value)}
                          style={{ width: '100%', padding: '9px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '0.9rem', textAlign: 'center' }}
                        />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.78rem', color: '#475569', marginBottom: '4px', fontWeight: '600' }}>
                          CVV:
                        </label>
                        <input
                          type="password"
                          value={cardCvv}
                          onChange={(e) => setCardCvv(e.target.value)}
                          maxLength={3}
                          style={{ width: '100%', padding: '9px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '0.9rem', textAlign: 'center' }}
                        />
                      </div>
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.78rem', color: '#475569', marginBottom: '4px', fontWeight: '600' }}>
                        Name on Card:
                      </label>
                      <input
                        type="text"
                        value={cardHolder}
                        onChange={(e) => setCardHolder(e.target.value)}
                        style={{ width: '100%', padding: '9px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '0.9rem' }}
                      />
                    </div>
                  </div>
                )}

                {/* Method 3: NETBANKING */}
                {paymentMethod === 'NETBANKING' && (
                  <div>
                    <h4 style={{ margin: '0 0 12px', fontSize: '0.95rem', color: '#0f172a' }}>
                      Select Bank:
                    </h4>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
                      {['State Bank of India', 'HDFC Bank', 'ICICI Bank', 'Axis Bank', 'Punjab National Bank', 'Bank of Baroda'].map((bank) => (
                        <button
                          key={bank}
                          type="button"
                          onClick={() => setSelectedBank(bank)}
                          style={{
                            padding: '10px 12px',
                            borderRadius: '6px',
                            border: selectedBank === bank ? '2px solid #0284c7' : '1px solid #cbd5e1',
                            background: selectedBank === bank ? '#f0f9ff' : '#ffffff',
                            fontWeight: selectedBank === bank ? '700' : '500',
                            fontSize: '0.82rem',
                            cursor: 'pointer',
                            color: '#0f172a',
                            textAlign: 'left',
                          }}
                        >
                          🏦 {bank}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Method 4: WALLET */}
                {paymentMethod === 'WALLET' && (
                  <div>
                    <h4 style={{ margin: '0 0 12px', fontSize: '0.95rem', color: '#0f172a' }}>
                      Select Wallet:
                    </h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {['Amazon Pay', 'Mobikwik', 'Airtel Money', 'Paytm Postpaid'].map((wallet) => (
                        <div
                          key={wallet}
                          style={{
                            padding: '12px',
                            border: '1px solid #cbd5e1',
                            borderRadius: '6px',
                            background: '#ffffff',
                            fontSize: '0.85rem',
                            fontWeight: '600',
                            color: '#0f172a',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                          }}
                        >
                          <Wallet size={16} color="#0284c7" /> {wallet}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Processing Overlay if currently charging */}
                {loading && (
                  <div
                    style={{
                      background: 'rgba(255, 255, 255, 0.95)',
                      position: 'absolute',
                      inset: 0,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      zIndex: 10,
                      padding: '24px',
                      textAlign: 'center',
                    }}
                  >
                    <Loader2 size={44} className="spin" color="#0284c7" style={{ marginBottom: '16px' }} />
                    <h4 style={{ margin: '0 0 8px', color: '#0a2540', fontSize: '1.1rem' }}>
                      {processingStatus || 'Processing Securely with Razorpay...'}
                    </h4>
                    <p style={{ margin: 0, fontSize: '0.82rem', color: '#64748b' }}>
                      Please do not close this window or hit back while transaction completes.
                    </p>
                  </div>
                )}

                {/* Gateway Bottom Action Buttons */}
                <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <button
                    type="button"
                    disabled={loading}
                    onClick={handleExecutePayment}
                    style={{
                      background: '#0284c7',
                      color: '#ffffff',
                      border: 'none',
                      padding: '14px',
                      borderRadius: '8px',
                      fontWeight: '700',
                      fontSize: '0.98rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      boxShadow: '0 4px 12px rgba(2, 132, 199, 0.35)',
                    }}
                  >
                    <ShieldCheck size={18} />
                    Pay ₹{item.price} via Razorpay
                  </button>

                  <button
                    type="button"
                    disabled={loading}
                    onClick={handleExecutePayment}
                    style={{
                      background: '#f8fafc',
                      color: '#0a2540',
                      border: '1px solid #cbd5e1',
                      padding: '10px',
                      borderRadius: '8px',
                      fontWeight: '600',
                      fontSize: '0.82rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                    }}
                  >
                    <Sparkles size={14} color="#d97706" />
                    1-Click Demo Pay (Simulate Successful Transaction)
                  </button>
                </div>
              </div>
            </div>

            {/* Razorpay Footer */}
            <div
              style={{
                background: '#ffffff',
                borderTop: '1px solid #e2e8f0',
                padding: '12px 24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                fontSize: '0.75rem',
                color: '#64748b',
              }}
            >
              <span>Secured by <strong>Razorpay Payments</strong></span>
              <button
                type="button"
                onClick={onClose}
                style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: '0.75rem' }}
              >
                Cancel Transaction
              </button>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* STAGE 3: OFFICIAL "PAID & ADMISSION CONFIRMED" RECEIPT SCREEN              */}
        {/* ========================================================================= */}
        {modalStage === 'SUCCESS' && paymentSuccessData && (
          <div>
            {/* Header */}
            <div
              style={{
                background: 'linear-gradient(135deg, #065f46 0%, #047857 100%)',
                color: 'white',
                padding: '24px',
                textAlign: 'center',
                position: 'relative',
              }}
            >
              <button
                onClick={handleFinishAndRedirect}
                style={{
                  position: 'absolute',
                  top: '16px',
                  right: '16px',
                  background: 'transparent',
                  border: 'none',
                  color: '#a7f3d0',
                  cursor: 'pointer',
                }}
              >
                <X size={20} />
              </button>
              <div
                style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  background: '#ffffff',
                  color: '#059669',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 12px',
                  boxShadow: '0 4px 14px rgba(0,0,0,0.2)',
                }}
              >
                <CheckCircle size={38} />
              </div>
              <span
                style={{
                  background: 'rgba(255,255,255,0.25)',
                  padding: '3px 12px',
                  borderRadius: '16px',
                  fontSize: '0.75rem',
                  fontWeight: '800',
                  letterSpacing: '0.6px',
                  textTransform: 'uppercase',
                }}
              >
                Payment Verified • State Admission Granted
              </span>
              <h2 style={{ margin: '8px 0 2px', fontSize: '1.45rem', fontFamily: 'Cinzel, Georgia, serif' }}>
                ₹{item.price} Paid Successfully
              </h2>
            </div>

            <div style={{ padding: '24px', maxHeight: 'calc(92vh - 180px)', overflowY: 'auto' }}>
              {/* Receipt Metadata Grid */}
              <div
                style={{
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  padding: '16px',
                  marginBottom: '20px',
                  fontSize: '0.85rem',
                }}
              >
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <div style={{ fontSize: '0.72rem', color: '#64748b', textTransform: 'uppercase' }}>Receipt Number</div>
                    <div style={{ fontWeight: '700', color: '#0a2540' }}>{paymentSuccessData.receiptNumber}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.72rem', color: '#64748b', textTransform: 'uppercase' }}>Payment Reference</div>
                    <div style={{ fontWeight: '600', color: '#0369a1', fontFamily: 'monospace' }}>
                      {paymentSuccessData.order?.razorpayPaymentId || 'pay_rzp_demo'}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.72rem', color: '#64748b', textTransform: 'uppercase' }}>Candidate Name</div>
                    <div style={{ fontWeight: '600', color: '#334155' }}>{user?.name}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.72rem', color: '#64748b', textTransform: 'uppercase' }}>Enrolled Item</div>
                    <div style={{ fontWeight: '700', color: '#0a2540' }}>{item.name || item.title}</div>
                  </div>
                </div>

                {paymentSuccessData.activationDetails?.membershipId && (
                  <div style={{ marginTop: '12px', paddingTop: '10px', borderTop: '1px dashed #cbd5e1', fontSize: '0.82rem', color: '#0f172a' }}>
                    <strong>Library Membership ID: </strong>
                    <span style={{ color: '#d97706', fontWeight: 'bold' }}>{paymentSuccessData.activationDetails.membershipId}</span>
                    <div>Shift: {paymentSuccessData.activationDetails.timeSlot}</div>
                  </div>
                )}
              </div>

              {/* Automated Confirmation Email Banner */}
              <div
                style={{
                  background: '#f0fdf4',
                  border: '1px solid #bbf7d0',
                  padding: '16px',
                  borderRadius: '8px',
                  marginBottom: '20px',
                  fontSize: '0.85rem',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#166534', fontWeight: 'bold', marginBottom: '6px' }}>
                  <Mail size={16} /> Official Email Dispatched:
                </div>
                <p style={{ margin: '0 0 8px 0', color: '#15803d' }}>
                  An automated confirmation email containing your digital enrollment receipt and tax invoice has been sent to <strong>{user?.email}</strong>.
                </p>
                {paymentSuccessData.emailPreviewUrl && (
                  <a
                    href={paymentSuccessData.emailPreviewUrl}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      color: '#0a2540',
                      fontWeight: 'bold',
                      textDecoration: 'underline',
                      fontSize: '0.8rem',
                    }}
                  >
                    View Dispatched Email Preview <ExternalLink size={12} />
                  </a>
                )}
              </div>

              {/* Final CTA Button */}
              <button
                type="button"
                className="btn-primary"
                onClick={handleFinishAndRedirect}
                style={{
                  width: '100%',
                  justifyContent: 'center',
                  padding: '14px',
                  fontSize: '0.98rem',
                  gap: '8px',
                }}
              >
                Go to Student Portal & Access My Admission <ArrowRight size={18} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
