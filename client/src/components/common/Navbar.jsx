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
  Sparkles,
  Menu,
  X,
  Image as ImageIcon,
  Users,
  QrCode,
  DollarSign,
  LayoutDashboard,
  Globe,
} from 'lucide-react';
import { useAuth } from '../../state/AuthContext';

export const Navbar = ({ onOpenAuth }) => {
  const {
    user,
    activeTab,
    setActiveTab,
    logoutUser,
    isAdmin,
    isStudent,
    adminSubTab,
    setAdminSubTab,
  } = useAuth();

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

  const handleAdminModuleClick = (subTabKey) => {
    setActiveTab('admin_dashboard');
    if (setAdminSubTab) {
      setAdminSubTab(subTabKey);
    }
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
          <span className="hide-mobile" style={{ fontSize: '0.74rem' }}>
            {isAdmin
              ? 'Secretariat Administrative Command Center • Restricted Official Access'
              : 'National Civil Services & Public Library Portal • Official Digital Initiative'}
          </span>
        </div>
        <div className="gov-top-bar-right">
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Font:</span>
            <button className="accessibility-btn" onClick={() => handleFontSize(-1)}>A-</button>
            <button className="accessibility-btn" onClick={() => handleFontSize(0)}>A</button>
            <button className="accessibility-btn" onClick={() => handleFontSize(1)}>A+</button>
          </div>
          <span className="hide-mobile" style={{ color: '#475569' }}>|</span>
          <span className="hide-mobile" style={{ fontSize: '0.74rem', color: '#94a3b8' }}>
            {isAdmin ? 'System Uptime: 99.98%' : 'Helpline: 1800-345-0199'}
          </span>
        </div>
      </div>

      {/* National Tricolor Stripe */}
      <div className="tiranga-stripe" />

      {/* Main Government Portal Header */}
      <header className="gov-header">
        <div className="header-container">
          {/* Logo & Institute Title */}
          <div
            className="brand-section"
            onClick={() => handleNavClick(isAdmin ? 'admin_dashboard' : 'home')}
            style={{ cursor: 'pointer' }}
          >
            <div className="gov-seal-icon">
              <Landmark size={22} />
            </div>
            <div className="brand-titles">
              <h1>STATE ACADEMY OF CIVIL SERVICES</h1>
              <p>
                {isAdmin
                  ? 'Secretariat Administrative Command Console & Library Operations'
                  : 'Physical Central Digital Library & Competitive Examination Center'}
              </p>
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

          {/* Desktop Navigation Links - Role-Tailored */}
          <nav className="desktop-nav">
            <ul className="nav-links">
              {isAdmin ? (
                /* ADMIN / OFFICIAL STAFF NAVIGATION */
                <>
                  <li>
                    <button
                      className={`nav-item-btn ${
                        activeTab === 'admin_dashboard' && adminSubTab === 'overview' ? 'active' : ''
                      }`}
                      onClick={() => handleAdminModuleClick('overview')}
                    >
                      <LayoutDashboard size={15} />
                      Console
                    </button>
                  </li>
                  <li>
                    <button
                      className={`nav-item-btn ${
                        activeTab === 'admin_dashboard' && adminSubTab === 'users' ? 'active' : ''
                      }`}
                      onClick={() => handleAdminModuleClick('users')}
                    >
                      <Users size={15} />
                      Aspirants
                    </button>
                  </li>
                  <li>
                    <button
                      className={`nav-item-btn ${
                        activeTab === 'admin_dashboard' && adminSubTab === 'gate_desk' ? 'active' : ''
                      }`}
                      onClick={() => handleAdminModuleClick('gate_desk')}
                    >
                      <QrCode size={15} />
                      Gate Scanner
                    </button>
                  </li>
                  <li>
                    <button
                      className={`nav-item-btn ${
                        activeTab === 'admin_dashboard' && adminSubTab === 'inquiries' ? 'active' : ''
                      }`}
                      onClick={() => handleAdminModuleClick('inquiries')}
                    >
                      <Send size={15} />
                      Inquiries
                    </button>
                  </li>
                  <li>
                    <button
                      className={`nav-item-btn ${
                        activeTab === 'admin_dashboard' && adminSubTab === 'finance' ? 'active' : ''
                      }`}
                      onClick={() => handleAdminModuleClick('finance')}
                    >
                      <DollarSign size={15} />
                      Finance Ledger
                    </button>
                  </li>
                  <li>
                    <button
                      className={`nav-item-btn ${activeTab === 'home' ? 'active' : ''}`}
                      onClick={() => handleNavClick('home')}
                      title="Preview public academy website"
                    >
                      <Globe size={15} />
                      Public View
                    </button>
                  </li>

                  {/* Admin User Profile & Sign Out */}
                  <li style={{ marginLeft: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          background: 'rgba(239, 68, 68, 0.1)',
                          border: '1px solid #f87171',
                          padding: '6px 12px',
                          borderRadius: '6px',
                          fontSize: '0.8rem',
                          fontWeight: '600',
                          color: '#991b1b',
                        }}
                      >
                        <ShieldAlert size={14} color="#dc2626" />
                        <span>Admin ({user.name})</span>
                      </div>
                      <button
                        onClick={logoutUser}
                        title="Sign Out of Admin Console"
                        style={{
                          background: '#fee2e2',
                          border: '1px solid #fca5a5',
                          color: '#b91c1c',
                          padding: '7px 10px',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          fontSize: '0.8rem',
                          fontWeight: '600',
                        }}
                      >
                        <LogOut size={15} />
                        Logout
                      </button>
                    </div>
                  </li>
                </>
              ) : (
                /* STUDENT & VISITOR NAVIGATION */
                <>
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
                      <Library size={15} />
                      Library Access
                    </button>
                  </li>
                  <li>
                    <button
                      className={`nav-item-btn ${activeTab === 'courses' ? 'active' : ''}`}
                      onClick={() => handleNavClick('courses')}
                    >
                      <BookOpen size={15} />
                      Courses
                    </button>
                  </li>
                  <li>
                    <button
                      className={`nav-item-btn ${activeTab === 'pdfs' ? 'active' : ''}`}
                      onClick={() => handleNavClick('pdfs')}
                    >
                      <FileText size={15} />
                      Study Notes
                    </button>
                  </li>
                  <li>
                    <button
                      className={`nav-item-btn ${activeTab === 'tests' ? 'active' : ''}`}
                      onClick={() => handleNavClick('tests')}
                    >
                      <Clock size={15} />
                      Mock Tests
                    </button>
                  </li>
                  <li>
                    <button
                      className={`nav-item-btn ${activeTab === 'gallery' ? 'active' : ''}`}
                      onClick={() => handleNavClick('gallery')}
                    >
                      <ImageIcon size={15} />
                      Campus Gallery
                    </button>
                  </li>
                  <li>
                    <button
                      className={`nav-item-btn ${activeTab === 'inquiry' ? 'active' : ''}`}
                      onClick={() => handleNavClick('inquiry')}
                    >
                      <Send size={15} />
                      Inquiry Desk
                    </button>
                  </li>

                  {/* Student Logged In vs Visitor */}
                  <li style={{ marginLeft: '10px' }}>
                    {isStudent ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <button
                          className={`btn-primary ${activeTab === 'student_dashboard' ? 'active-gold' : ''}`}
                          style={{
                            padding: '8px 14px',
                            fontSize: '0.85rem',
                            border: activeTab === 'student_dashboard' ? '2px solid #f59e0b' : undefined,
                          }}
                          onClick={() => handleNavClick('student_dashboard')}
                        >
                          <UserCheck size={16} color="#34d399" />
                          Student Portal
                        </button>
                        <button
                          onClick={logoutUser}
                          title="Candidate Sign Out"
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
                </>
              )}
            </ul>
          </nav>
        </div>

        {/* Mobile Dropdown Navigation */}
        {mobileMenuOpen && (
          <div className="mobile-nav-drawer">
            {isAdmin ? (
              /* Mobile Admin Links */
              <>
                <div style={{ padding: '8px 16px', background: '#fef2f2', borderBottom: '1px solid #fecaca', fontSize: '0.8rem', color: '#991b1b', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <ShieldAlert size={14} /> SECRETARIAT COMMAND MODULES
                </div>
                <button
                  className={`mobile-nav-item ${activeTab === 'admin_dashboard' && adminSubTab === 'overview' ? 'active' : ''}`}
                  onClick={() => handleAdminModuleClick('overview')}
                >
                  <LayoutDashboard size={16} /> Console Overview
                </button>
                <button
                  className={`mobile-nav-item ${activeTab === 'admin_dashboard' && adminSubTab === 'users' ? 'active' : ''}`}
                  onClick={() => handleAdminModuleClick('users')}
                >
                  <Users size={16} /> Aspirants Directory
                </button>
                <button
                  className={`mobile-nav-item ${activeTab === 'admin_dashboard' && adminSubTab === 'gate_desk' ? 'active' : ''}`}
                  onClick={() => handleAdminModuleClick('gate_desk')}
                >
                  <QrCode size={16} /> Gate Scanner
                </button>
                <button
                  className={`mobile-nav-item ${activeTab === 'admin_dashboard' && adminSubTab === 'inquiries' ? 'active' : ''}`}
                  onClick={() => handleAdminModuleClick('inquiries')}
                >
                  <Send size={16} /> Inquiries CRM
                </button>
                <button
                  className={`mobile-nav-item ${activeTab === 'admin_dashboard' && adminSubTab === 'finance' ? 'active' : ''}`}
                  onClick={() => handleAdminModuleClick('finance')}
                >
                  <DollarSign size={16} /> Finance Ledger
                </button>
                <button
                  className={`mobile-nav-item ${activeTab === 'home' ? 'active' : ''}`}
                  onClick={() => handleNavClick('home')}
                >
                  <Globe size={16} /> View Public Portal
                </button>

                <div style={{ padding: '12px 16px', borderTop: '1px solid #e2e8f0', marginTop: '8px' }}>
                  <button
                    onClick={() => {
                      logoutUser();
                      setMobileMenuOpen(false);
                    }}
                    style={{
                      width: '100%',
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
              </>
            ) : (
              /* Mobile Student / Visitor Links */
              <>
                <button
                  className={`mobile-nav-item ${activeTab === 'home' ? 'active' : ''}`}
                  onClick={() => handleNavClick('home')}
                >
                  Home
                </button>
                <button
                  className={`mobile-nav-item ${activeTab === 'library' ? 'active' : ''}`}
                  onClick={() => handleNavClick('library')}
                >
                  <Library size={16} /> Library Access
                </button>
                <button
                  className={`mobile-nav-item ${activeTab === 'courses' ? 'active' : ''}`}
                  onClick={() => handleNavClick('courses')}
                >
                  <BookOpen size={16} /> Courses
                </button>
                <button
                  className={`mobile-nav-item ${activeTab === 'pdfs' ? 'active' : ''}`}
                  onClick={() => handleNavClick('pdfs')}
                >
                  <FileText size={16} /> Study Notes
                </button>
                <button
                  className={`mobile-nav-item ${activeTab === 'tests' ? 'active' : ''}`}
                  onClick={() => handleNavClick('tests')}
                >
                  <Clock size={16} /> Mock Tests
                </button>
                <button
                  className={`mobile-nav-item ${activeTab === 'gallery' ? 'active' : ''}`}
                  onClick={() => handleNavClick('gallery')}
                >
                  <ImageIcon size={16} /> Campus Gallery
                </button>
                <button
                  className={`mobile-nav-item ${activeTab === 'inquiry' ? 'active' : ''}`}
                  onClick={() => handleNavClick('inquiry')}
                >
                  <Send size={16} /> Inquiry Desk
                </button>

                <div style={{ padding: '12px 16px', borderTop: '1px solid #e2e8f0', marginTop: '8px' }}>
                  {isStudent ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <button
                        className="btn-primary"
                        style={{ width: '100%', justifyContent: 'center' }}
                        onClick={() => handleNavClick('student_dashboard')}
                      >
                        <UserCheck size={16} color="#34d399" />
                        My Student Portal
                      </button>
                      <button
                        onClick={() => {
                          logoutUser();
                          setMobileMenuOpen(false);
                        }}
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
                      onClick={() => {
                        onOpenAuth();
                        setMobileMenuOpen(false);
                      }}
                    >
                      <User size={16} />
                      Portal Sign In / Register
                    </button>
                  )}
                </div>
              </>
            )}
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
