import React, { useState, useEffect } from 'react';
import { Clock, Award, CheckCircle, AlertTriangle, Play } from 'lucide-react';
import { api } from '../../services/api';

export const TestsCatalogPage = ({ onStartTest }) => {
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTests = async () => {
      try {
        const res = await api.getMockTests();
        if (res.success) {
          setTests(res.tests);
        }
      } catch (err) {
        console.error('Error fetching mock tests:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchTests();
  }, []);

  return (
    <div style={{ maxWidth: '1200px', margin: '40px auto 80px', padding: '0 24px' }}>
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <div style={{ color: '#b45309', fontWeight: '700', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
          COMPUTER-BASED EXAMINATION ENGINE
        </div>
        <h1 style={{ fontFamily: 'Cinzel, Georgia, serif', fontSize: '2.2rem', color: '#0a2540', marginTop: '6px' }}>
          State Civil Services Online Mock Test Series
        </h1>
        <p style={{ color: '#64748b', fontSize: '0.95rem', maxWidth: '600px', margin: '8px auto 0' }}>
          Real examination environment with question navigation palettes, negative marking rules, and instantaneous score analysis.
        </p>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px', color: '#64748b' }}>
          Loading mock tests...
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
          {tests.map((test) => (
            <div key={test._id} className="gov-card" style={{ padding: '28px', display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                <span
                  style={{
                    background: '#eff6ff',
                    color: '#1e40af',
                    fontSize: '0.72rem',
                    fontWeight: '700',
                    padding: '4px 10px',
                    borderRadius: '4px',
                  }}
                >
                  {test.examCategory}
                </span>
                <span style={{ fontSize: '0.75rem', color: '#059669', fontWeight: '700' }}>
                  {test.isFree ? 'FREE ASSESSMENT' : `₹${test.price}`}
                </span>
              </div>

              <h3 style={{ color: '#0a2540', fontSize: '1.2rem', lineHeight: '1.4', marginBottom: '8px' }}>
                {test.title}
              </h3>
              <p style={{ fontSize: '0.85rem', color: '#64748b', lineHeight: '1.6', marginBottom: '20px', flex: 1 }}>
                {test.description}
              </p>

              {/* Test Specs */}
              <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '6px', marginBottom: '20px', display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px', fontSize: '0.8rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#475569' }}>
                  <Clock size={14} color="#d97706" />
                  <span><strong>{test.durationMinutes}</strong> Mins Duration</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#475569' }}>
                  <Award size={14} color="#059669" />
                  <span><strong>{test.totalMarks}</strong> Total Marks</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#475569' }}>
                  <CheckCircle size={14} color="#16a34a" />
                  <span>+{test.positiveMarks} Correct Mark</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#475569' }}>
                  <AlertTriangle size={14} color="#dc2626" />
                  <span>-{test.negativeMarks} Negative Mark</span>
                </div>
              </div>

              <button
                className="btn-accent"
                onClick={() => onStartTest(test)}
                style={{ width: '100%', justifyContent: 'center' }}
              >
                <Play size={16} /> Enter Examination Room
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
