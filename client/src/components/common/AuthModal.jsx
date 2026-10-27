import React, { useState } from 'react';
import { X, Lock, Mail, User, Phone, CheckCircle, ShieldCheck, Sparkles } from 'lucide-react';
import { api } from '../../services/api';
import { useAuth } from '../../state/AuthContext';

export const AuthModal = ({ isOpen, onClose }) => {
  const { loginUser, switchDemoRole } = useAuth();
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

  const handleQuickDemo = async (role) => {
    await switchDemoRole(role);
    onClose();
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(5, 19, 41, 0.75)',
        backdropFilter: 'blur(5px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: '20px',
      }}
    >
      <div
        style={{
          background: '#ffffff',
          borderRadius: '12px',
          width: '100%',
          maxWidth: '460px',
          overflow: 'hidden',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          border: '1px solid #cbd5e1',
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

          {/* Showcase Demo 1-Click Evaluation Buttons */}
          <div style={{ marginTop: '24px', borderTop: '1px dashed #cbd5e1', paddingTop: '16px', textAlign: 'center' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: '700', color: '#d97706', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
              <Sparkles size={14} /> Client Showcase 1-Click Persona Access
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
              <button
                type="button"
                onClick={() => handleQuickDemo('STUDENT')}
                style={{ background: '#f8fafc', border: '1px solid #cbd5e1', padding: '8px 4px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: '600', color: '#0a2540', cursor: 'pointer' }}
              >
                🎓 As Student
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemo('SUPER_ADMIN')}
                style={{ background: '#f8fafc', border: '1px solid #cbd5e1', padding: '8px 4px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: '600', color: '#0a2540', cursor: 'pointer' }}
              >
                🏛️ As Director
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemo('LIBRARY_OPERATOR')}
                style={{ background: '#f8fafc', border: '1px solid #cbd5e1', padding: '8px 4px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: '600', color: '#0a2540', cursor: 'pointer' }}
              >
                📋 Library Desk
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
