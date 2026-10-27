import React, { useState } from 'react';
import { X, CreditCard, ShieldCheck, Mail, CheckCircle, Smartphone } from 'lucide-react';
import confetti from 'canvas-confetti';
import { api } from '../../services/api';

export const CheckoutModal = ({ isOpen, onClose, item, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedShift, setSelectedShift] = useState(item?.slotOptions?.[0] || null);
  const [paymentSuccessData, setPaymentSuccessData] = useState(null);

  if (!isOpen || !item) return null;

  const handleSimulatePayment = async () => {
    setLoading(true);
    setError('');

    try {
      // 1. Create order on server
      const orderRes = await api.createOrder({
        itemType: item.itemType, // 'LIBRARY_SUBSCRIPTION', 'COURSE', 'PDF'
        itemId: item._id,
        slotOption: selectedShift,
      });

      if (!orderRes.success) {
        setError(orderRes.message || 'Could not initiate transaction.');
        setLoading(false);
        return;
      }

      // 2. Complete payment verification with mock transaction hash
      const verifyRes = await api.verifyPayment({
        orderId: orderRes.order.id,
        razorpayOrderId: orderRes.order.razorpayOrderId,
        razorpayPaymentId: `pay_sim_${Date.now()}`,
        isSimulated: true,
      });

      if (verifyRes.success) {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
        setPaymentSuccessData(verifyRes);
        if (onSuccess) onSuccess(verifyRes);
      } else {
        setError(verifyRes.message || 'Payment verification failed.');
      }
    } catch (err) {
      setError('Transaction processing failure. Check server logs.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(5, 19, 41, 0.8)',
        backdropFilter: 'blur(6px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1200,
        padding: '20px',
      }}
    >
      <div
        style={{
          background: '#ffffff',
          borderRadius: '12px',
          width: '100%',
          maxWidth: '520px',
          overflow: 'hidden',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.3)',
          border: '1px solid #cbd5e1',
        }}
      >
        {/* Header */}
        <div style={{ background: '#0a2540', color: 'white', padding: '20px 24px', position: 'relative' }}>
          <button
            onClick={onClose}
            style={{ position: 'absolute', top: '16px', right: '16px', background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
          >
            <X size={20} />
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#f59e0b', fontSize: '0.8rem', fontWeight: 'bold' }}>
            <ShieldCheck size={16} /> RAZORPAY SECURE PAYMENT GATEWAY
          </div>
          <h3 style={{ margin: '4px 0 0', fontSize: '1.25rem', fontFamily: 'Cinzel, Georgia, serif' }}>
            {paymentSuccessData ? 'Payment & Admission Confirmed' : 'Official Fee Checkout'}
          </h3>
        </div>

        {paymentSuccessData ? (
          <div style={{ padding: '32px 24px', textAlign: 'center' }}>
            <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: '#dcfce7', color: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              <CheckCircle size={40} />
            </div>
            <h3 style={{ color: '#0a2540', fontSize: '1.3rem', marginBottom: '8px' }}>
              Admission Activated!
            </h3>
            <p style={{ color: '#475569', fontSize: '0.9rem', marginBottom: '20px' }}>
              Your payment has been verified. Receipt <strong style={{ color: '#0a2540' }}>{paymentSuccessData.receiptNumber}</strong> has been issued.
            </p>

            <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', padding: '16px', borderRadius: '8px', textAlign: 'left', marginBottom: '20px', fontSize: '0.85rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#166534', fontWeight: 'bold', marginBottom: '8px' }}>
                <Mail size={16} /> Official Email Dispatched:
              </div>
              <p style={{ margin: '0 0 6px 0', color: '#15803d' }}>
                An automated confirmation email with your digital pass & tax invoice has been sent to your registered email address.
              </p>
              {paymentSuccessData.emailPreviewUrl && (
                <a
                  href={paymentSuccessData.emailPreviewUrl}
                  target="_blank"
                  rel="noreferrer"
                  style={{ color: '#0a2540', fontWeight: 'bold', textDecoration: 'underline', fontSize: '0.8rem' }}
                >
                  View Dispatched Email Preview ↗
                </a>
              )}
            </div>

            <button
              className="btn-primary"
              onClick={onClose}
              style={{ width: '100%', justifyContent: 'center', padding: '12px' }}
            >
              Go to Student Dashboard & View Pass
            </button>
          </div>
        ) : (
          <div style={{ padding: '24px' }}>
            {error && (
              <div style={{ background: '#fef2f2', borderLeft: '4px solid #ef4444', color: '#b91c1c', padding: '10px 16px', fontSize: '0.85rem', marginBottom: '16px' }}>
                {error}
              </div>
            )}

            {/* Order Item Summary */}
            <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '16px', marginBottom: '20px' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: '700', color: '#64748b', textTransform: 'uppercase' }}>
                Order Summary:
              </div>
              <div style={{ fontSize: '1.05rem', fontWeight: '700', color: '#0a2540', margin: '4px 0' }}>
                {item.name || item.title}
              </div>
              <div style={{ fontSize: '0.85rem', color: '#64748b' }}>
                {item.itemType === 'LIBRARY_SUBSCRIPTION' ? `Duration: ${item.durationMonths} Months` : item.examCategory}
              </div>

              {/* Slot Selector if Library subscription */}
              {item.slotOptions && (
                <div style={{ marginTop: '14px', borderTop: '1px solid #e2e8f0', paddingTop: '12px' }}>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', color: '#334155', marginBottom: '6px' }}>
                    Select Preferred Reading Shift:
                  </label>
                  <select
                    value={selectedShift?.name || ''}
                    onChange={(e) => {
                      const found = item.slotOptions.find((s) => s.name === e.target.value);
                      setSelectedShift(found);
                    }}
                    style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '0.85rem', background: '#fff' }}
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

            {/* Price Row */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', padding: '0 8px' }}>
              <span style={{ fontSize: '1rem', color: '#475569', fontWeight: '600' }}>Total Fee Payable:</span>
              <span style={{ fontSize: '1.8rem', fontWeight: '800', color: '#0a2540', fontFamily: 'Cinzel, serif' }}>
                ₹{item.price}
              </span>
            </div>

            {/* Payment Actions */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <button
                type="button"
                disabled={loading}
                className="btn-accent"
                onClick={handleSimulatePayment}
                style={{ width: '100%', justifyContent: 'center', padding: '14px', fontSize: '0.95rem' }}
              >
                <CreditCard size={18} />
                {loading ? 'Confirming with Gateway...' : `Pay ₹${item.price} via Razorpay (UPI / Card)`}
              </button>

              <div style={{ textAlign: 'center', fontSize: '0.78rem', color: '#94a3b8', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                <ShieldCheck size={14} color="#059669" />
                RBI Compliant Razorpay Test Sandbox • Instant Admission Activation
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
