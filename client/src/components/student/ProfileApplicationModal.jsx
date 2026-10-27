import React, { useState } from 'react';
import { X, ShieldCheck, User, Calendar, MapPin, Award, CheckCircle } from 'lucide-react';
import { api } from '../../services/api';
import { useAuth } from '../../state/AuthContext';

export const ProfileApplicationModal = ({ isOpen, onClose, onComplete, targetItemName }) => {
  const { user, setUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    fatherName: user?.profile?.fatherName || '',
    dob: user?.profile?.dob || '',
    gender: user?.profile?.gender || 'Male',
    idProofType: user?.profile?.idProofType || 'Aadhaar',
    idProofNumber: user?.profile?.idProofNumber || '',
    street: user?.profile?.address?.street || '',
    city: user?.profile?.address?.city || 'Bhubaneswar',
    state: user?.profile?.address?.state || 'Odisha',
    pinCode: user?.profile?.address?.pinCode || '',
    targetExam: user?.profile?.targetExam || 'OPSC / OAS',
    emergencyContact: user?.profile?.emergencyContact || '',
    educationQualification: user?.profile?.educationQualification || 'Graduate',
  });

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await api.updateProfile(formData);
      if (res.success) {
        setUser(res.user);
        onComplete();
      } else {
        setError(res.message || 'Failed to save application profile.');
      }
    } catch (err) {
      setError('Connection failure updating profile.');
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
        zIndex: 1100,
        padding: '20px',
      }}
    >
      <div
        style={{
          background: '#ffffff',
          borderRadius: '12px',
          width: '100%',
          maxWidth: '620px',
          maxHeight: '90vh',
          overflowY: 'auto',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.3)',
          border: '1px solid #cbd5e1',
        }}
      >
        {/* Header */}
        <div style={{ background: '#0a2540', color: 'white', padding: '20px 24px', position: 'sticky', top: 0, zIndex: 10 }}>
          <button
            onClick={onClose}
            style={{ position: 'absolute', top: '16px', right: '16px', background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
          >
            <X size={20} />
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#f59e0b', fontSize: '0.8rem', fontWeight: 'bold' }}>
            <ShieldCheck size={16} /> ONE-TIME STUDENT APPLICATION RECORD
          </div>
          <h3 style={{ margin: '4px 0 0', fontSize: '1.25rem', fontFamily: 'Cinzel, Georgia, serif' }}>
            Complete Your Admission Profile
          </h3>
          <p style={{ margin: '4px 0 0', fontSize: '0.82rem', color: '#94a3b8' }}>
            Applying for: <strong style={{ color: '#ffffff' }}>{targetItemName || 'Academy Admission'}</strong>. This information is saved permanently to your student file.
          </p>
        </div>

        {error && (
          <div style={{ background: '#fef2f2', borderLeft: '4px solid #ef4444', color: '#b91c1c', padding: '10px 16px', fontSize: '0.85rem' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ padding: '24px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px', marginBottom: '14px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '600', color: '#334155', marginBottom: '4px' }}>
                Father's / Guardian Name *
              </label>
              <input
                type="text"
                required
                value={formData.fatherName}
                onChange={(e) => setFormData({ ...formData, fatherName: e.target.value })}
                placeholder="e.g. Bipin Bihari Pattnaik"
                style={{ width: '100%', padding: '9px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '0.88rem' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '600', color: '#334155', marginBottom: '4px' }}>
                Date of Birth *
              </label>
              <input
                type="date"
                required
                value={formData.dob}
                onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                style={{ width: '100%', padding: '9px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '0.88rem' }}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '14px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '600', color: '#334155', marginBottom: '4px' }}>
                Gender *
              </label>
              <select
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                style={{ width: '100%', padding: '9px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '0.88rem', background: '#fff' }}
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '600', color: '#334155', marginBottom: '4px' }}>
                Govt ID Proof Type *
              </label>
              <select
                value={formData.idProofType}
                onChange={(e) => setFormData({ ...formData, idProofType: e.target.value })}
                style={{ width: '100%', padding: '9px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '0.88rem', background: '#fff' }}
              >
                <option value="Aadhaar">Aadhaar Card</option>
                <option value="Voter ID">Voter ID</option>
                <option value="PAN Card">PAN Card</option>
                <option value="College/Govt ID">College / Govt ID</option>
                <option value="Passport">Passport</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '600', color: '#334155', marginBottom: '4px' }}>
                ID Card Number *
              </label>
              <input
                type="text"
                required
                value={formData.idProofNumber}
                onChange={(e) => setFormData({ ...formData, idProofNumber: e.target.value })}
                placeholder="e.g. 7654-3210-9876"
                style={{ width: '100%', padding: '9px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '0.88rem' }}
              />
            </div>
          </div>

          <div style={{ marginBottom: '14px' }}>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '600', color: '#334155', marginBottom: '4px' }}>
              Residential Street Address *
            </label>
            <input
              type="text"
              required
              value={formData.street}
              onChange={(e) => setFormData({ ...formData, street: e.target.value })}
              placeholder="e.g. Plot No. 142/B, Saheed Nagar"
              style={{ width: '100%', padding: '9px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '0.88rem' }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '14px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '600', color: '#334155', marginBottom: '4px' }}>
                City *
              </label>
              <input
                type="text"
                required
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                placeholder="Bhubaneswar"
                style={{ width: '100%', padding: '9px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '0.88rem' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '600', color: '#334155', marginBottom: '4px' }}>
                State *
              </label>
              <input
                type="text"
                required
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                placeholder="Odisha"
                style={{ width: '100%', padding: '9px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '0.88rem' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '600', color: '#334155', marginBottom: '4px' }}>
                Postal PIN Code *
              </label>
              <input
                type="text"
                required
                value={formData.pinCode}
                onChange={(e) => setFormData({ ...formData, pinCode: e.target.value })}
                placeholder="751007"
                style={{ width: '100%', padding: '9px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '0.88rem' }}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px', marginBottom: '20px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '600', color: '#334155', marginBottom: '4px' }}>
                Primary Target Examination *
              </label>
              <select
                value={formData.targetExam}
                onChange={(e) => setFormData({ ...formData, targetExam: e.target.value })}
                style={{ width: '100%', padding: '9px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '0.88rem', background: '#fff' }}
              >
                <option value="OPSC / OAS">OPSC / OAS (Odisha Civil Services)</option>
                <option value="UPSC / IAS">UPSC / IAS (Civil Services Examination)</option>
                <option value="Banking / RBI">Banking (SBI / IBPS / RBI Grade B)</option>
                <option value="Staff Selection (SSC)">Staff Selection Commission (SSC CGL / CHSL)</option>
                <option value="Railway (RRB)">Railway Recruitment Board (RRB NTPC)</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '600', color: '#334155', marginBottom: '4px' }}>
                Emergency Contact Phone *
              </label>
              <input
                type="tel"
                required
                value={formData.emergencyContact}
                onChange={(e) => setFormData({ ...formData, emergencyContact: e.target.value })}
                placeholder="Parent / Guardian phone"
                style={{ width: '100%', padding: '9px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '0.88rem' }}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-accent"
            style={{ width: '100%', justifyContent: 'center', padding: '12px', fontSize: '0.95rem' }}
          >
            {loading ? 'Saving Student Record...' : 'Confirm Details & Proceed to Checkout'}
          </button>
        </form>
      </div>
    </div>
  );
};
