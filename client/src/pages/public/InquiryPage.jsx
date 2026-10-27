import React, { useState } from 'react';
import { Send, CheckCircle, Phone, Mail, User, BookOpen, AlertCircle, Sparkles } from 'lucide-react';
import { api } from '../../services/api';

export const InquiryPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    areaOfInterest: 'Physical Library',
    message: '',
  });

  const [loading, setLoading] = useState(false);
  const [successResponse, setSuccessResponse] = useState(null);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccessResponse(null);

    try {
      const res = await api.submitInquiry(formData);
      if (res.success) {
        setSuccessResponse(res);
        setFormData({
          name: '',
          phone: '',
          email: '',
          areaOfInterest: 'Physical Library',
          message: '',
        });
      } else {
        setError(res.message || 'Failed to submit inquiry.');
      }
    } catch (err) {
      setError('Connection failure with the admissions server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '900px', margin: '40px auto 80px', padding: '0 24px' }}>
      <div style={{ textAlign: 'center', marginBottom: '36px' }}>
        <div style={{ color: '#d97706', fontWeight: '700', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
          CITIZEN ADMISSIONS & CANDIDATE GUIDANCE
        </div>
        <h1 style={{ fontFamily: 'Cinzel, Georgia, serif', fontSize: '2.2rem', color: '#0a2540', marginTop: '6px' }}>
          Candidate Inquiry & Counseling Desk
        </h1>
        <p style={{ color: '#64748b', fontSize: '0.95rem', maxWidth: '600px', margin: '8px auto 0' }}>
          Have questions regarding library seat availability, course schedules, or mock test registrations? Submit your query to receive an official follow-up.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '32px' }}>
        {/* Form Card */}
        <div className="gov-card" style={{ padding: '32px' }}>
          {successResponse ? (
            <div style={{ textAlign: 'center', padding: '30px 10px' }}>
              <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: '#dcfce7', color: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                <CheckCircle size={36} />
              </div>
              <h3 style={{ color: '#0a2540', fontSize: '1.3rem', marginBottom: '8px' }}>
                Inquiry Submitted Successfully
              </h3>
              <p style={{ color: '#475569', fontSize: '0.9rem', marginBottom: '20px' }}>
                Your inquiry has been logged into the Administrative CRM. An admission counselor will reach out to you within 24 working hours.
              </p>
              <div style={{ background: '#f8fafc', border: '1px solid #cbd5e1', padding: '12px', borderRadius: '6px', fontSize: '0.9rem', fontWeight: 'bold', color: '#0a2540' }}>
                Inquiry Reference Number: <span style={{ color: '#d97706' }}>{successResponse.inquiryNumber}</span>
              </div>
              <button
                className="btn-primary"
                onClick={() => setSuccessResponse(null)}
                style={{ marginTop: '24px' }}
              >
                Submit Another Query
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              {error && (
                <div style={{ background: '#fef2f2', borderLeft: '4px solid #ef4444', color: '#b91c1c', padding: '10px 16px', fontSize: '0.85rem', marginBottom: '20px' }}>
                  {error}
                </div>
              )}

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#334155', marginBottom: '6px' }}>
                  Candidate Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Soumya Ranjan Mohanty"
                  style={{ width: '100%', padding: '10px 14px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '0.9rem' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px', marginBottom: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#334155', marginBottom: '6px' }}>
                    Contact Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="e.g. 9861012345"
                    style={{ width: '100%', padding: '10px 14px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '0.9rem' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#334155', marginBottom: '6px' }}>
                    Email ID (Optional)
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="candidate@gmail.com"
                    style={{ width: '100%', padding: '10px 14px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '0.9rem' }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#334155', marginBottom: '6px' }}>
                  Primary Area of Interest *
                </label>
                <select
                  value={formData.areaOfInterest}
                  onChange={(e) => setFormData({ ...formData, areaOfInterest: e.target.value })}
                  style={{ width: '100%', padding: '10px 14px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '0.9rem', background: '#fff' }}
                >
                  <option value="Physical Library">Physical Reading Hall Membership & Desk Allocation</option>
                  <option value="OPSC / OAS Preparation">OPSC / OAS 2026 Integrated Batch</option>
                  <option value="UPSC / IAS Foundation">UPSC / IAS Foundation Programme</option>
                  <option value="Mock Test Series">Online CBT Mock Examination Series</option>
                  <option value="Study Notes / PDFs">Official Research Publications & Study Materials</option>
                  <option value="General Admission">General Educational Guidance & Counseling</option>
                </select>
              </div>

              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#334155', marginBottom: '6px' }}>
                  Specific Query / Message *
                </label>
                <textarea
                  rows={4}
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Detail your question or requirement regarding timings, batch schedules, or fee structures..."
                  style={{ width: '100%', padding: '10px 14px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '0.9rem', resize: 'vertical' }}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-accent"
                style={{ width: '100%', justifyContent: 'center', padding: '12px', fontSize: '0.95rem' }}
              >
                <Send size={18} />
                {loading ? 'Submitting to CRM...' : 'Submit Official Inquiry'}
              </button>
            </form>
          )}
        </div>

        {/* Contact Info Sidebar */}
        <div>
          <div className="gov-card" style={{ padding: '24px', marginBottom: '20px' }}>
            <h3 style={{ fontSize: '1.1rem', color: '#0a2540', marginBottom: '16px' }}>
              Reception Secretariat
            </h3>
            <div style={{ fontSize: '0.85rem', color: '#475569', lineHeight: '1.8' }}>
              <p><strong>Physical Address:</strong></p>
              <p style={{ color: '#64748b', marginBottom: '12px' }}>
                State Academy Central Library Building, Sachivalaya Marg, Unit 3, Bhubaneswar, Odisha 751001
              </p>
              <p><strong>Office Timings:</strong></p>
              <p style={{ color: '#64748b', marginBottom: '12px' }}>
                Monday to Saturday: 09:30 AM - 05:30 PM (Except Gazetted Holidays)
              </p>
              <p><strong>Direct Telephones:</strong></p>
              <p style={{ color: '#0a2540', fontWeight: '600' }}>
                Toll Free: 1800-345-0199 / 0674-2391000
              </p>
            </div>
          </div>

          <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', padding: '20px', borderRadius: '8px', color: '#166534' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 'bold', fontSize: '0.9rem', marginBottom: '6px' }}>
              <Sparkles size={16} /> Official Response Guarantee
            </div>
            <p style={{ fontSize: '0.82rem', lineHeight: '1.6', margin: 0 }}>
              All queries submitted through this digital portal are monitored directly by the Administrative Admissions Directorate to prevent delays.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
