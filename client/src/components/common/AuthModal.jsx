import React, { useState } from 'react';
import { X, Lock, Mail, User, Phone, CheckCircle, ShieldCheck, Sparkles } from 'lucide-react';
import { api } from '../../services/api';
import { useAuth } from '../../state/AuthContext';

export const AuthModal = ({ isOpen, onClose }) => {
  const { loginUser } = useAuth();
  const [mode, setMode] = useState('SIGNIN'); // 'SIGNIN' | 'REGISTER'
  const [roleTab, setRoleTab] = useState('STUDENT'); // 'STUDENT' | 'ADMIN'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (mode === 'SIGNIN') {
        const res = await api.login(email, password, roleTab);
        if (res.success) {
          loginUser(res.token, res.user);
          onClose();
        } else {
          setError(res.message || 'Login failed.');
        }
      } else {
        const res = await api.register({ name, email, phone, password, role: 'STUDENT' });
        if (res.success) {
          loginUser(res.token, res.user);
          onClose();
        } else {
          setError(res.message || 'Registration failed.');
        }
      }
    } catch (err) {
      setError('Connection failure. Ensure backend server is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="responsive-modal-overlay">
      <div
        className="responsive-modal-box"
        style={{
          maxWidth: '460px',
          border: '1px solid #cbd5e1',
          overflow: 'hidden',
        }}
      >
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
            <ShieldCheck size={16} /> OFFICIAL GOVERNMENT PORTAL
          </div>
          <h3 style={{ margin: '4px 0 0', fontSize: '1.25rem', fontFamily: 'Cinzel, Georgia, serif' }}>
            {mode === 'SIGNIN' ? 'Portal Authentication' : 'New Aspirant Registration'}
          </h3>
        </div>

        {/* Tab 1: Student vs Admin Login Toggle */}
        {mode === 'SIGNIN' && (
          <div style={{ display: 'flex', background: '#f1f5f9', borderBottom: '1px solid #e2e8f0' }}>
            <button
              onClick={() => { setRoleTab('STUDENT'); setError(''); }}
              style={{
                flex: 1,
                padding: '12px',
                border: 'none',
                background: roleTab === 'STUDENT' ? '#ffffff' : 'transparent',
                fontWeight: '600',
                fontSize: '0.88rem',
                color: roleTab === 'STUDENT' ? '#0a2540' : '#64748b',
                borderBottom: roleTab === 'STUDENT' ? '3px solid #d97706' : 'none',
                cursor: 'pointer',
              }}
            >
              Student / Aspirant Login
            </button>
            <button
              onClick={() => { setRoleTab('ADMIN'); setError(''); }}
              style={{
                flex: 1,
                padding: '12px',
                border: 'none',
                background: roleTab === 'ADMIN' ? '#ffffff' : 'transparent',
                fontWeight: '600',
                fontSize: '0.88rem',
                color: roleTab === 'ADMIN' ? '#0a2540' : '#64748b',
                borderBottom: roleTab === 'ADMIN' ? '3px solid #d97706' : 'none',
                cursor: 'pointer',
              }}
            >
              Official / Staff Login
            </button>
          </div>
        )}

        {/* Error Alert */}
        {error && (
          <div style={{ background: '#fef2f2', borderLeft: '4px solid #ef4444', color: '#b91c1c', padding: '10px 16px', fontSize: '0.85rem' }}>
            {error}
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} style={{ padding: '24px' }}>
          {mode === 'REGISTER' && (
            <>
              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '600', color: '#334155', marginBottom: '4px' }}>
                  Candidate Full Name
                </label>
                <div style={{ position: 'relative' }}>
                  <User size={16} color="#94a3b8" style={{ position: 'absolute', top: '12px', left: '12px' }} />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Aakash Pattnaik"
                    style={{ width: '100%', padding: '10px 12px 10px 36px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '0.9rem' }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '600', color: '#334155', marginBottom: '4px' }}>
                  Mobile Number (for SMS & Verification)
                </label>
                <div style={{ position: 'relative' }}>
                  <Phone size={16} color="#94a3b8" style={{ position: 'absolute', top: '12px', left: '12px' }} />
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. 9861012345"
                    style={{ width: '100%', padding: '10px 12px 10px 36px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '0.9rem' }}
                  />
                </div>
              </div>
            </>
          )}

          <div style={{ marginBottom: '14px' }}>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '600', color: '#334155', marginBottom: '4px' }}>
              Official Email Address
            </label>
            <div style={{ position: 'relative' }}>
              <Mail size={16} color="#94a3b8" style={{ position: 'absolute', top: '12px', left: '12px' }} />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={roleTab === 'ADMIN' ? 'admin@stateacademy.gov.in' : 'candidate@email.com'}
                style={{ width: '100%', padding: '10px 12px 10px 36px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '0.9rem' }}
              />
            </div>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '600', color: '#334155', marginBottom: '4px' }}>
              Portal Password
            </label>
            <div style={{ position: 'relative' }}>
              <Lock size={16} color="#94a3b8" style={{ position: 'absolute', top: '12px', left: '12px' }} />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                style={{ width: '100%', padding: '10px 12px 10px 36px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '0.9rem' }}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary"
            style={{ width: '100%', justifyContent: 'center', padding: '12px', fontSize: '0.95rem' }}
          >
            {loading ? 'Processing Authentications...' : mode === 'SIGNIN' ? 'Secure Sign In' : 'Complete Registration'}
          </button>

          {/* Toggle Sign In / Register */}
          <div style={{ textAlign: 'center', marginTop: '16px', fontSize: '0.85rem', color: '#64748b' }}>
            {mode === 'SIGNIN' ? (
              <span>
                New candidate?{' '}
                <button
                  type="button"
                  onClick={() => { setMode('REGISTER'); setError(''); }}
                  style={{ background: 'none', border: 'none', color: '#0a2540', fontWeight: 'bold', cursor: 'pointer', textDecoration: 'underline' }}
                >
                  Create Student Account
                </button>
              </span>
            ) : (
              <span>
                Already registered?{' '}
                <button
                  type="button"
                  onClick={() => { setMode('SIGNIN'); setError(''); }}
                  style={{ background: 'none', border: 'none', color: '#0a2540', fontWeight: 'bold', cursor: 'pointer', textDecoration: 'underline' }}
                >
                  Sign In to Account
                </button>
              </span>
            )}
          </div>

          {/* Official Secretariat Helper for Admin Login */}
          {roleTab === 'ADMIN' && mode === 'SIGNIN' && (
            <div
              style={{
                marginTop: '20px',
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                padding: '12px 14px',
                fontSize: '0.8rem',
                color: '#475569',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <div>
                <strong style={{ color: '#0a2540', display: 'block' }}>Official Administrative Credentials:</strong>
                <span>admin@stateacademy.gov.in</span>
              </div>
              <button
                type="button"
                onClick={() => {
                  setEmail('admin@stateacademy.gov.in');
                  setPassword('adminpassword123');
                }}
                style={{
                  background: '#0a2540',
                  color: '#ffffff',
                  border: 'none',
                  padding: '6px 12px',
                  borderRadius: '4px',
                  fontSize: '0.75rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                }}
              >
                Auto-Fill
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};
