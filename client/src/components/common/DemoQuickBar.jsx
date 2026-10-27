import React from 'react';
import { Sparkles, User, ShieldCheck, Library } from 'lucide-react';
import { useAuth } from '../../state/AuthContext';

export const DemoQuickBar = ({ onOpenAuth }) => {
  const { user, switchDemoRole } = useAuth();

  return (
    <div className="demo-quickbar">
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 'bold', color: '#f59e0b' }}>
        <Sparkles size={14} /> Client Demo Switcher:
      </div>

      <button
        className="demo-chip-btn"
        onClick={() => switchDemoRole('STUDENT')}
        style={{ background: user?.role === 'STUDENT' ? '#d97706' : undefined }}
      >
        🎓 Student Portal
      </button>

      <button
        className="demo-chip-btn"
        onClick={() => switchDemoRole('SUPER_ADMIN')}
        style={{ background: user?.role === 'SUPER_ADMIN' ? '#d97706' : undefined }}
      >
        🏛️ Admin Console
      </button>

      <button
        className="demo-chip-btn"
        onClick={() => switchDemoRole('LIBRARY_OPERATOR')}
        style={{ background: user?.role === 'LIBRARY_OPERATOR' ? '#d97706' : undefined }}
      >
        📋 Library Gate Desk
      </button>
    </div>
  );
};
