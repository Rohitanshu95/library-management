import React, { useState } from 'react';
import {
  Landmark,
  BookOpen,
  Library,
  FileText,
  Clock,
  Send,
  UserCheck,
  ShieldAlert,
  LogOut,
  User,
  ChevronRight,
  Sparkles,
  Menu,
  X,
  Image as ImageIcon,
} from 'lucide-react';
import { useAuth } from '../../state/AuthContext';

export const Navbar = ({ onOpenAuth }) => {
  const { user, activeTab, setActiveTab, logoutUser } = useAuth();
  const [fontSizeLevel, setFontSizeLevel] = useState(1);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleFontSize = (delta) => {
    const next = Math.max(0, Math.min(2, fontSizeLevel + delta));
    setFontSizeLevel(next);
    if (next === 0) document.documentElement.style.fontSize = '14px';
    if (next === 1) document.documentElement.style.fontSize = '16px';
    if (next === 2) document.documentElement.style.fontSize = '18px';
  };

  const handleNavClick = (tabId) => {
    setActiveTab(tabId);
    setMobileMenuOpen(false);
  };

  return (
    <>
      {/* Accessibility & Government Identity Top Bar */}
      <div className="gov-top-bar">
        <div className="gov-top-bar-left">
          <span className="gov-emblem-badge">
            <Landmark size={14} color="#f59e0b" />
            GOVERNMENT OF ODISHA
          </span>
          <span className="hide-mobile" style={{ color: '#475569' }}>|</span>
          <span className="hide-mobile" style={{ fontSize: '0.74rem' }}>National Civil Services & Public Library Portal</span>
        </div>
        <div className="gov-top-bar-right">
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Font:</span>
            <button className="accessibility-btn" onClick={() => handleFontSize(-1)}>A-</button>
            <button className="accessibility-btn" onClick={() => handleFontSize(0)}>A</button>
            <button className="accessibility-btn" onClick={() => handleFontSize(1)}>A+</button>
          </div>
          <span className="hide-mobile" style={{ color: '#475569' }}>|</span>
          <span className="hide-mobile" style={{ fontSize: '0.74rem', color: '#94a3b8' }}>Helpline: 1800-345-0199</span>
        </div>
      </div>

      {/* National Tricolor Stripe */}
      <div className="tiranga-stripe" />

      {/* Main Government Portal Header */}
      <header className="gov-header">
        <div className="header-container">
          {/* Logo & Institute Title */}
          <div className="brand-section" onClick={() => handleNavClick('home')}>
            <div className="gov-seal-icon">
              <Landmark size={22} />
            </div>
            <div className="brand-titles">
              <h1>STATE ACADEMY OF CIVIL SERVICES</h1>
              <p>Physical Central Digital Library & Competitive Examination Center</p>
            </div>
          </div>

          {/* Mobile Hamburger Button */}
          <button
            className="mobile-toggle-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {/* Desktop Navigation Links */}
          <nav className="desktop-nav">
            <ul className="nav-links">
              <li>
                <button
                  className={`nav-item-btn ${activeTab === 'home' ? 'active' : ''}`}
                  onClick={() => handleNavClick('home')}
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  className={`nav-item-btn ${activeTab === 'library' ? 'active' : ''}`}
                  onClick={() => handleNavClick('library')}
                >
                  <Library size={16} />
                  Library Access
                </button>
              </li>
              <li>
                <button
                  className={`nav-item-btn ${activeTab === 'courses' ? 'active' : ''}`}
                  onClick={() => handleNavClick('courses')}
                >
                  <BookOpen size={16} />
                  Courses
                </button>
              </li>
              <li>
                <button
                  className={`nav-item-btn ${activeTab === 'pdfs' ? 'active' : ''}`}
                  onClick={() => handleNavClick('pdfs')}
                >
                  <FileText size={16} />
                  Study Notes
                </button>
              </li>
              <li>
                <button
                  className={`nav-item-btn ${activeTab === 'tests' ? 'active' : ''}`}
                  onClick={() => handleNavClick('tests')}
                >
                  <Clock size={16} />
                  Mock Tests
                </button>
              </li>
              <li>
                <button
                  className={`nav-item-btn ${activeTab === 'gallery' ? 'active' : ''}`}
                  onClick={() => handleNavClick('gallery')}
                >
                  <ImageIcon size={16} />
                  Campus Gallery
                </button>
              </li>
              <li>
                <button
                  className={`nav-item-btn ${activeTab === 'inquiry' ? 'active' : ''}`}
                  onClick={() => handleNavClick('inquiry')}
                >
                  <Send size={16} />
                  Inquiry Desk
                </button>
              </li>

              {/* Dynamic User Role Button / Login Modal Trigger */}
              <li style={{ marginLeft: '10px' }}>
                {user ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <button
                      className="btn-primary"
                      style={{ padding: '8px 14px', fontSize: '0.85rem' }}
                      onClick={() =>
                        handleNavClick(user.role === 'STUDENT' ? 'student_dashboard' : 'admin_dashboard')
                      }
                    >
                      <UserCheck size={16} color="#34d399" />
                      {user.role === 'STUDENT' ? 'Student Portal' : 'Official Console'}
                    </button>
                    <button
                      onClick={logoutUser}
                      title="Log Out"
                      style={{
                        background: '#fee2e2',
                        border: '1px solid #fca5a5',
                        color: '#b91c1c',
                        padding: '8px',
                        borderRadius: '6px',
                        cursor: 'pointer',
                      }}
                    >
                      <LogOut size={16} />
                    </button>
                  </div>
                ) : (
                  <button
                    className="btn-primary"
                    style={{ padding: '8px 18px', fontSize: '0.85rem' }}
                    onClick={onOpenAuth}
                  >
                    <User size={16} />
                    Portal Sign In
                  </button>
                )}
              </li>
            </ul>
          </nav>
        </div>

        {/* Mobile Dropdown Navigation */}
        {mobileMenuOpen && (
          <div className="mobile-nav-drawer">
            <button className={`mobile-nav-item ${activeTab === 'home' ? 'active' : ''}`} onClick={() => handleNavClick('home')}>
              Home
            </button>
            <button className={`mobile-nav-item ${activeTab === 'library' ? 'active' : ''}`} onClick={() => handleNavClick('library')}>
              <Library size={16} /> Library Access
            </button>
            <button className={`mobile-nav-item ${activeTab === 'courses' ? 'active' : ''}`} onClick={() => handleNavClick('courses')}>
              <BookOpen size={16} /> Courses
            </button>
            <button className={`mobile-nav-item ${activeTab === 'pdfs' ? 'active' : ''}`} onClick={() => handleNavClick('pdfs')}>
              <FileText size={16} /> Study Notes
            </button>
            <button className={`mobile-nav-item ${activeTab === 'tests' ? 'active' : ''}`} onClick={() => handleNavClick('tests')}>
              <Clock size={16} /> Mock Tests
            </button>
            <button className={`mobile-nav-item ${activeTab === 'gallery' ? 'active' : ''}`} onClick={() => handleNavClick('gallery')}>
              <ImageIcon size={16} /> Campus Gallery
            </button>
            <button className={`mobile-nav-item ${activeTab === 'inquiry' ? 'active' : ''}`} onClick={() => handleNavClick('inquiry')}>
              <Send size={16} /> Inquiry Desk
            </button>

            <div style={{ padding: '12px 16px', borderTop: '1px solid #e2e8f0', marginTop: '8px' }}>
              {user ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <button
                    className="btn-primary"
                    style={{ width: '100%', justifyContent: 'center' }}
                    onClick={() =>
                      handleNavClick(user.role === 'STUDENT' ? 'student_dashboard' : 'admin_dashboard')
                    }
                  >
                    <UserCheck size={16} color="#34d399" />
                    {user.role === 'STUDENT' ? 'My Student Portal' : 'Official Admin Console'}
                  </button>
                  <button
                    onClick={() => { logoutUser(); setMobileMenuOpen(false); }}
                    style={{
                      background: '#fee2e2',
                      border: '1px solid #fca5a5',
                      color: '#b91c1c',
                      padding: '10px',
                      borderRadius: '6px',
                      fontWeight: 'bold',
                      fontSize: '0.85rem',
                      cursor: 'pointer',
                    }}
                  >
                    Sign Out ({user.name})
                  </button>
                </div>
              ) : (
                <button
                  className="btn-primary"
                  style={{ width: '100%', justifyContent: 'center' }}
                  onClick={() => { onOpenAuth(); setMobileMenuOpen(false); }}
                >
                  <User size={16} />
                  Portal Sign In / Register
                </button>
              )}
            </div>
          </div>
        )}

        {/* Live Announcements Ticker */}
        <div className="ticker-bar">
          <div className="ticker-badge">
            <Sparkles size={12} /> NOTICE
          </div>
          <div className="ticker-content">
            ✦ OPSC OAS 2026 Comprehensive Batch admissions are open • Central Physical Library Morning & Evening slots open for new membership • Official GS Prelims Mock Test series live now • Helpline: 1800-345-0199
          </div>
        </div>
      </header>
    </>
  );
};
