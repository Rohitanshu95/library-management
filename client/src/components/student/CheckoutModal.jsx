import React, { useState } from 'react';
import {
  X,
  CreditCard,
  ShieldCheck,
  CheckCircle,
  Clock,
  ArrowRight,
  Mail,
  ExternalLink,
  Loader,
  AlertCircle,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { api } from '../../services/api';
import { useAuth } from '../../state/AuthContext';

export const CheckoutModal = ({ isOpen, onClose, item, onSuccess }) => {
  const { user } = useAuth();
  const [selectedShift, setSelectedShift] = useState(
    item?.slotOptions ? item.slotOptions[0] : null
  );

  const [loading, setLoading] = useState(false);
  const [processingStatus, setProcessingStatus] = useState('');
  const [error, setError] = useState('');
  const [paymentSuccessData, setPaymentSuccessData] = useState(null);
  const [isSuccessStage, setIsSuccessStage] = useState(false);

  if (!isOpen || !item) return null;

  // Invokes the OFFICIAL Razorpay Checkout Gateway
  const handleOpenOfficialRazorpay = async () => {
    setLoading(true);
    setError('');
    setProcessingStatus('Initiating official Razorpay Gateway transaction...');

    try {
      // 1. Create Order on Server using Razorpay SDK
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

      const orderData = orderRes.order;

      // 2. Ensure Razorpay Checkout SDK is loaded from index.html
      if (typeof window.Razorpay === 'undefined') {
        setError('Official Razorpay Checkout SDK is still loading. Please check your internet connection.');
        setLoading(false);
        setProcessingStatus('');
        return;
      }

      // 3. Configure Razorpay Official Checkout Options
      const options = {
        key: orderData.razorpayKeyId || 'rzp_test_TspMUewlZ9hPxg',
        amount: Math.round(orderData.amount * 100), // paise
        currency: orderData.currency || 'INR',
        name: 'State Academy of Civil Services',
        description: `${orderData.itemTitle} (Govt. of Odisha)`,
        image: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png',
        order_id: orderData.razorpayOrderId.startsWith('order_sim_') ? undefined : orderData.razorpayOrderId,
        handler: async function (response) {
          // Triggered by Razorpay on successful authorization
          setLoading(true);
          setProcessingStatus('Payment Authorized! Verifying signature and generating credentials...');

          try {
            const verifyRes = await api.verifyPayment({
              orderId: orderData.id,
              razorpayOrderId: response.razorpay_order_id || orderData.razorpayOrderId,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
              isSimulated: orderData.razorpayOrderId.startsWith('order_sim_'),
            });

            if (verifyRes.success) {
              confetti({
                particleCount: 120,
                spread: 85,
                origin: { y: 0.6 },
                colors: ['#0a2540', '#d97706', '#10b981', '#3b82f6', '#f59e0b'],
              });

              setPaymentSuccessData(verifyRes);
              setIsSuccessStage(true);
            } else {
              setError(verifyRes.message || 'Signature verification failed.');
            }
          } catch (err) {
            console.error('Payment verification error:', err);
            setError('Payment verification failure on server.');
          } finally {
            setLoading(false);
            setProcessingStatus('');
          }
        },
        prefill: {
          name: user?.name || '',
          email: user?.email || '',
          contact: user?.phone || '',
        },
        notes: {
          itemType: item.itemType,
          studentName: user?.name,
          studentEmail: user?.email,
          orderNumber: orderData.orderNumber,
        },
        theme: {
          color: '#0a2540',
        },
        modal: {
          ondismiss: function () {
            setLoading(false);
            setProcessingStatus('');
            console.log('Razorpay official checkout dismissed by applicant.');
          },
        },
      };

      const rzpInstance = new window.Razorpay(options);
      rzpInstance.on('payment.failed', function (resp) {
        console.error('Razorpay payment failed:', resp.error);
        setError(`Payment failed: ${resp.error.description} (Reason: ${resp.error.reason})`);
        setLoading(false);
        setProcessingStatus('');
      });

      // Launch Razorpay popup
      rzpInstance.open();
      setLoading(false);
      setProcessingStatus('');
    } catch (err) {
      console.error('Razorpay checkout launch error:', err);
      setError('Failed to launch official Razorpay gateway. Please try again.');
      setLoading(false);
      setProcessingStatus('');
    }
  };

  const handleFinishAndRedirect = () => {
    if (onSuccess) onSuccess(paymentSuccessData);
    onClose();
  };

  return (
    <div className="responsive-modal-overlay">
      <div
        className="responsive-modal-box"
        style={{
          maxWidth: '560px',
          overflow: 'hidden',
          border: '1px solid #cbd5e1',
        }}
      >
        {!isSuccessStage ? (
          /* ========================================================================= */
          /* STAGE 1: ORDER SUMMARY & ADMISSION FEE REVIEW                             */
          /* ========================================================================= */
          <div>
            {/* Header */}
            <div style={{ background: '#0a2540', color: 'white', padding: '20px 24px', position: 'relative' }}>
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
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
                Admission & Fee Checkout
              </h3>
            </div>

            <div style={{ padding: '24px', maxHeight: 'calc(92vh - 120px)', overflowY: 'auto' }}>
              {error && (
                <div style={{ background: '#fef2f2', borderLeft: '4px solid #ef4444', color: '#b91c1c', padding: '10px 16px', fontSize: '0.85rem', marginBottom: '16px', borderRadius: '4px' }}>
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
                        padding: '9px 12px',
                        border: '1px solid #cbd5e1',
                        borderRadius: '6px',
                        fontSize: '0.88rem',
                        background: '#ffffff',
                      }}
                    >
                      {item.slotOptions.map((slot) => (
                        <option key={slot.name} value={slot.name}>
                          {slot.name} ({slot.timings})
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              {/* Fee Breakdown */}
              <div style={{ background: '#f8fafc', borderRadius: '8px', padding: '16px', marginBottom: '20px', fontSize: '0.88rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', color: '#475569' }}>
                  <span>Base Tuition / Membership Fee:</span>
                  <span>₹{item.price}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', color: '#16a34a', fontSize: '0.82rem' }}>
                  <span>CGST (9.0%) + SGST (9.0%) — Odisha Govt. Subsidy:</span>
                  <span>WAIVED (₹0)</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', color: '#16a34a', fontSize: '0.82rem' }}>
                  <span>Digital Processing & Biometric ID Fee:</span>
                  <span>FREE</span>
                </div>
                <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <strong style={{ color: '#0a2540', fontSize: '1rem' }}>Total Fee Payable:</strong>
                  <span style={{ fontSize: '1.45rem', fontWeight: '800', color: '#0a2540', fontFamily: 'Cinzel, Georgia, serif' }}>
                    ₹{item.price}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <button
                  type="button"
                  className="btn-accent"
                  onClick={handleOpenOfficialRazorpay}
                  disabled={loading}
                  style={{
                    width: '100%',
                    justifyContent: 'center',
                    padding: '14px',
                    fontSize: '1rem',
                    boxShadow: '0 4px 14px rgba(217, 119, 6, 0.3)',
                    opacity: loading ? 0.7 : 1,
                  }}
                >
                  {loading ? (
                    <>
                      <Loader size={18} className="spin-animate" />
                      {processingStatus || 'Connecting to Razorpay...'}
                    </>
                  ) : (
                    <>
                      <CreditCard size={18} />
                      Pay ₹{item.price} via Razorpay Gateway (UPI / Card / NetBanking)
                    </>
                  )}
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
                  Opens official Razorpay Checkout popup • 256-bit encrypted
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* ========================================================================= */
          /* STAGE 2: ADMISSION ACTIVATION & OFFICIAL GOVERNMENT RECEIPT               */
          /* ========================================================================= */
          <div>
            {/* Success Header Banner */}
            <div
              style={{
                background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
                color: '#ffffff',
                padding: '28px 24px',
                textAlign: 'center',
                position: 'relative',
              }}
            >
              <button
                type="button"
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
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
                  <div>
                    <div style={{ fontSize: '0.72rem', color: '#64748b', textTransform: 'uppercase' }}>Receipt Number</div>
                    <div style={{ fontWeight: '700', color: '#0a2540' }}>{paymentSuccessData?.receiptNumber}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.72rem', color: '#64748b', textTransform: 'uppercase' }}>Razorpay Payment ID</div>
                    <div style={{ fontWeight: '600', color: '#0369a1', fontFamily: 'monospace' }}>
                      {paymentSuccessData?.order?.razorpayPaymentId || 'pay_rzp_gateway'}
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

                {paymentSuccessData?.activationDetails?.membershipId && (
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
                {paymentSuccessData?.emailPreviewUrl && (
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
