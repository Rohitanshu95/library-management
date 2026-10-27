import React, { useState, useEffect } from 'react';
import { Library, Check, ShieldCheck, Clock, Users, ArrowRight } from 'lucide-react';
import { api } from '../../services/api';
import { useAuth } from '../../state/AuthContext';

export const LibraryPlansPage = ({ onApplyPlan }) => {
  const { user } = useAuth();
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const res = await api.getLibraryPlans();
        if (res.success) {
          setPlans(res.plans);
        }
      } catch (err) {
        console.error('Error fetching library plans:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPlans();
  }, []);

  return (
    <div style={{ maxWidth: '1200px', margin: '40px auto 80px', padding: '0 24px' }}>
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <div style={{ color: '#059669', fontWeight: '700', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
          PHYSICAL READING HALLS & STUDY CUBICLES
        </div>
        <h1 style={{ fontFamily: 'Cinzel, Georgia, serif', fontSize: '2.2rem', color: '#0a2540', marginTop: '6px' }}>
          Central Reference Library Membership Plans
        </h1>
        <p style={{ color: '#64748b', fontSize: '0.95rem', maxWidth: '650px', margin: '8px auto 0' }}>
          State-of-the-art academic reading spaces with biometric & QR code gate access, dedicated high-speed WiFi, air-conditioned chambers, and flexible shifts.
        </p>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px', color: '#64748b' }}>
          Loading official library membership tiers...
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(270px, 1fr))', gap: '24px' }}>
          {plans.map((plan, index) => {
            const isPopular = plan.durationMonths === 3;
            return (
              <div
                key={plan._id}
                className="gov-card"
                style={{
                  padding: '30px',
                  display: 'flex',
                  flexDirection: 'column',
                  position: 'relative',
                  border: isPopular ? '2px solid #d97706' : '1px solid #cbd5e1',
                  boxShadow: isPopular ? '0 10px 25px -5px rgba(217, 119, 6, 0.2)' : 'var(--shadow-sm)',
                }}
              >
                {isPopular && (
                  <div
                    style={{
                      position: 'absolute',
                      top: '0',
                      right: '24px',
                      background: '#d97706',
                      color: 'white',
                      fontSize: '0.7rem',
                      fontWeight: '800',
                      padding: '4px 10px',
                      borderBottomLeftRadius: '6px',
                      borderBottomRightRadius: '6px',
                      letterSpacing: '0.5px',
                    }}
                  >
                    MOST POPULAR FOR PRELIMS
                  </div>
                )}

                <h3 style={{ color: '#0a2540', fontSize: '1.25rem', marginBottom: '8px' }}>
                  {plan.name}
                </h3>
                <p style={{ fontSize: '0.82rem', color: '#64748b', minHeight: '40px', marginBottom: '16px' }}>
                  {plan.description}
                </p>

                <div style={{ marginBottom: '20px' }}>
                  <span style={{ fontSize: '2rem', fontWeight: '800', color: '#0a2540', fontFamily: 'Cinzel, serif' }}>
                    ₹{plan.price}
                  </span>
                  <span style={{ color: '#64748b', fontSize: '0.85rem' }}> / {plan.durationMonths} {plan.durationMonths === 1 ? 'Month' : 'Months'}</span>
                </div>

                <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '16px', marginBottom: '24px', flex: 1 }}>
                  <div style={{ fontSize: '0.8rem', fontWeight: '700', color: '#334155', marginBottom: '10px', textTransform: 'uppercase' }}>
                    Included Privileges:
                  </div>
                  <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {plan.features?.map((feat, fIdx) => (
                      <li key={fIdx} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '0.82rem', color: '#475569' }}>
                        <Check size={16} color="#059669" style={{ flexShrink: 0, marginTop: '2px' }} />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '6px', marginBottom: '20px', fontSize: '0.78rem', color: '#64748b' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: '600', color: '#0a2540', marginBottom: '4px' }}>
                    <Clock size={14} color="#d97706" /> Available Shifts:
                  </div>
                  {plan.slotOptions?.map((s, sIdx) => (
                    <div key={sIdx}>• {s.name} ({s.timings})</div>
                  ))}
                </div>

                <button
                  className={isPopular ? 'btn-accent' : 'btn-primary'}
                  onClick={() => onApplyPlan(plan)}
                  style={{ width: '100%', justifyContent: 'center' }}
                >
                  Apply & Reserve Seat Pass
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
