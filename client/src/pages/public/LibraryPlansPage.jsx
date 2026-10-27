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

      {/* Interactive Live Floor Plan & Desk Map Visualizer */}
      <div style={{ marginTop: '50px' }}>
        <div
          className="gov-card"
          style={{
            padding: '32px',
            background: '#ffffff',
            border: '1px solid #cbd5e1',
            borderRadius: '12px',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', marginBottom: '24px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#059669', fontSize: '0.8rem', fontWeight: 'bold' }}>
                <ShieldCheck size={16} /> LIVE PHYSICAL CAPACITY MONITOR
              </div>
              <h2 style={{ fontSize: '1.45rem', color: '#0a2540', margin: '4px 0 6px', fontFamily: 'Cinzel, Georgia, serif' }}>
                Main Reading Hall • Floor 1 Desk Map
              </h2>
              <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748b' }}>
                Click any numbered desk cubicle to inspect amenities, orientation, and current availability status.
              </p>
            </div>

            {/* Legend */}
            <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', background: '#f8fafc', padding: '10px 16px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '0.78rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <div style={{ width: '14px', height: '14px', borderRadius: '3px', background: '#dcfce7', border: '1px solid #86efac' }} />
                <span>Available</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <div style={{ width: '14px', height: '14px', borderRadius: '3px', background: '#fee2e2', border: '1px solid #fca5a5' }} />
                <span>Occupied</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <div style={{ width: '14px', height: '14px', borderRadius: '3px', background: '#fef3c7', border: '1px solid #fde68a' }} />
                <span>Silent Zone</span>
              </div>
            </div>
          </div>

          {/* Floor Layout Rows */}
          <div style={{ background: '#f8fafc', padding: '24px', borderRadius: '8px', border: '1px solid #e2e8f0', marginBottom: '20px', overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
            {/* Row A: Silent Cubicles */}
            <div style={{ marginBottom: '16px', minWidth: '560px' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 'bold', color: '#64748b', textTransform: 'uppercase', marginBottom: '8px' }}>
                Row A — North Wing Silent Cubicles (A-01 to A-10)
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(10, 1fr)', gap: '8px' }}>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => {
                  const isOccupied = [2, 4, 5, 8].includes(num);
                  return (
                    <div
                      key={`A-${num}`}
                      title={`Desk A-${String(num).padStart(2, '0')}: ${isOccupied ? 'Occupied' : 'Available'}`}
                      style={{
                        padding: '10px 4px',
                        textAlign: 'center',
                        fontSize: '0.75rem',
                        fontWeight: '700',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        background: isOccupied ? '#fee2e2' : '#fef3c7',
                        border: isOccupied ? '1px solid #fca5a5' : '1px solid #fde68a',
                        color: isOccupied ? '#991b1b' : '#92400e',
                        transition: 'transform 0.15s ease',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.08)')}
                      onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                    >
                      A-{String(num).padStart(2, '0')}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Row B: General Reading Desks */}
            <div style={{ marginBottom: '16px', minWidth: '560px' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 'bold', color: '#64748b', textTransform: 'uppercase', marginBottom: '8px' }}>
                Row B — Central Air-Conditioned Hall (B-01 to B-10)
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(10, 1fr)', gap: '8px' }}>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => {
                  const isOccupied = [1, 3, 6, 7, 9, 10].includes(num);
                  return (
                    <div
                      key={`B-${num}`}
                      title={`Desk B-${String(num).padStart(2, '0')}: ${isOccupied ? 'Occupied' : 'Available'}`}
                      style={{
                        padding: '10px 4px',
                        textAlign: 'center',
                        fontSize: '0.75rem',
                        fontWeight: '700',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        background: isOccupied ? '#fee2e2' : '#dcfce7',
                        border: isOccupied ? '1px solid #fca5a5' : '1px solid #86efac',
                        color: isOccupied ? '#991b1b' : '#166534',
                        transition: 'transform 0.15s ease',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.08)')}
                      onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                    >
                      B-{String(num).padStart(2, '0')}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Row C: Digital Workstation Desks */}
            <div style={{ minWidth: '560px' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 'bold', color: '#64748b', textTransform: 'uppercase', marginBottom: '8px' }}>
                Row C — LAN & Power Workstations (C-01 to C-10)
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(10, 1fr)', gap: '8px' }}>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => {
                  const isOccupied = [2, 5, 7].includes(num);
                  return (
                    <div
                      key={`C-${num}`}
                      title={`Desk C-${String(num).padStart(2, '0')}: ${isOccupied ? 'Occupied' : 'Available'}`}
                      style={{
                        padding: '10px 4px',
                        textAlign: 'center',
                        fontSize: '0.75rem',
                        fontWeight: '700',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        background: isOccupied ? '#fee2e2' : '#dcfce7',
                        border: isOccupied ? '1px solid #fca5a5' : '1px solid #86efac',
                        color: isOccupied ? '#991b1b' : '#166534',
                        transition: 'transform 0.15s ease',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.08)')}
                      onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                    >
                      C-{String(num).padStart(2, '0')}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', fontSize: '0.85rem', color: '#475569' }}>
            <div>
              Current Shift Status: <strong>Morning Shift (06:00 AM - 01:00 PM)</strong>
            </div>
            <div style={{ display: 'flex', gap: '16px' }}>
              <span>Total Stations: <strong>30</strong></span>
              <span style={{ color: '#dc2626' }}>Occupied: <strong>13</strong></span>
              <span style={{ color: '#16a34a', fontWeight: 'bold' }}>Available Now: 17</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
