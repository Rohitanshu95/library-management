import React from 'react';
import {
  Landmark,
  Library,
  BookOpen,
  Award,
  Users,
  CheckCircle,
  ArrowRight,
  ShieldCheck,
  Clock,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../../state/AuthContext';

export const HomePage = ({ onOpenAuth, onSelectPlan }) => {
  const { setActiveTab } = useAuth();

  return (
    <div>
      {/* Hero Section */}
      <section
        style={{
          background: 'linear-gradient(135deg, #051329 0%, #0a2540 60%, #0f3460 100%)',
          color: '#ffffff',
          padding: '48px 16px 72px',
          position: 'relative',
          overflow: 'hidden',
          borderBottom: '4px solid #d97706',
        }}
      >
        <div className="hero-grid-container">
          <div>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                background: 'rgba(217, 119, 6, 0.2)',
                border: '1px solid #d97706',
                color: '#fef3c7',
                padding: '4px 12px',
                borderRadius: '20px',
                fontSize: '0.75rem',
                fontWeight: '600',
                marginBottom: '16px',
              }}
            >
              <Sparkles size={14} color="#f59e0b" />
              STATE APEX CIVIL SERVICES TRAINING & DIGITAL LEARNING CENTER
            </div>

            <h1
              className="hero-heading"
              style={{
                fontFamily: 'Cinzel, Georgia, serif',
                lineHeight: '1.25',
                marginBottom: '16px',
                color: '#ffffff',
              }}
            >
              Empowering Aspirants for Civil Services & State Examinations
            </h1>

            <p style={{ fontSize: '0.98rem', color: '#cbd5e1', lineHeight: '1.65', marginBottom: '24px' }}>
              A world-class government learning center equipped with a 500-seat silent physical reference library, state officer-mentored course modules, and authenticated computer-based mock examinations.
            </p>

            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <button
                className="btn-accent"
                onClick={() => setActiveTab('library')}
                style={{ padding: '12px 20px', fontSize: '0.9rem' }}
              >
                <Library size={18} />
                Reserve Library Seat Pass
              </button>
              <button
                className="btn-outline"
                onClick={() => setActiveTab('courses')}
                style={{
                  background: 'rgba(255, 255, 255, 0.08)',
                  color: '#ffffff',
                  borderColor: 'rgba(255, 255, 255, 0.4)',
                  padding: '12px 20px',
                  fontSize: '0.9rem',
                }}
              >
                <BookOpen size={18} />
                Explore Courses & Syllabi
              </button>
            </div>
          </div>

          {/* Quick Stats Grid */}
          <div
            className="stats-grid-container"
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              borderRadius: '12px',
              padding: '20px',
            }}
          >
            <div style={{ background: 'rgba(10, 37, 64, 0.6)', padding: '16px', borderRadius: '8px', borderLeft: '4px solid #f59e0b' }}>
              <Users size={24} color="#f59e0b" style={{ marginBottom: '6px' }} />
              <div style={{ fontSize: '1.6rem', fontWeight: '800', fontFamily: 'Cinzel, serif' }}>12,500+</div>
              <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>Enrolled Aspirants</div>
            </div>

            <div style={{ background: 'rgba(10, 37, 64, 0.6)', padding: '16px', borderRadius: '8px', borderLeft: '4px solid #10b981' }}>
              <Library size={24} color="#10b981" style={{ marginBottom: '6px' }} />
              <div style={{ fontSize: '1.6rem', fontWeight: '800', fontFamily: 'Cinzel, serif' }}>500+</div>
              <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>Physical AC Reading Desks</div>
            </div>

            <div style={{ background: 'rgba(10, 37, 64, 0.6)', padding: '16px', borderRadius: '8px', borderLeft: '4px solid #3b82f6' }}>
              <Award size={24} color="#3b82f6" style={{ marginBottom: '6px' }} />
              <div style={{ fontSize: '1.6rem', fontWeight: '800', fontFamily: 'Cinzel, serif' }}>450+</div>
              <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>Selections in OAS & UPSC</div>
            </div>

            <div style={{ background: 'rgba(10, 37, 64, 0.6)', padding: '16px', borderRadius: '8px', borderLeft: '4px solid #ec4899' }}>
              <Clock size={24} color="#ec4899" style={{ marginBottom: '6px' }} />
              <div style={{ fontSize: '1.6rem', fontWeight: '800', fontFamily: 'Cinzel, serif' }}>18 Hrs</div>
              <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>Daily Supervised Facility</div>
            </div>
          </div>
        </div>
      </section>

      {/* Six Core Modules Feature Grid */}
      <section style={{ maxWidth: '1200px', margin: '-30px auto 60px', padding: '0 16px', position: 'relative', zIndex: 10 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
          {/* Card 1: Library */}
          <div className="gov-card" style={{ padding: '24px' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '8px', background: '#ecfdf5', color: '#047857', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '14px' }}>
              <Library size={24} />
            </div>
            <h3 style={{ fontSize: '1.1rem', color: '#0a2540', marginBottom: '8px' }}>
              Physical Library & Study Cubicles
            </h3>
            <p style={{ fontSize: '0.85rem', color: '#64748b', lineHeight: '1.6', marginBottom: '16px' }}>
              Secure desk allocation with digital QR ticket passes, power sockets for laptops, high-speed WiFi, and 4 shift choices.
            </p>
            <button
              onClick={() => setActiveTab('library')}
              style={{ background: 'none', border: 'none', color: '#047857', fontWeight: '700', fontSize: '0.85rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              View Available Slots & Plans <ArrowRight size={16} />
            </button>
          </div>

          {/* Card 2: Exam Courses */}
          <div className="gov-card" style={{ padding: '24px' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '8px', background: '#eff6ff', color: '#1d4ed8', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '14px' }}>
              <BookOpen size={24} />
            </div>
            <h3 style={{ fontSize: '1.1rem', color: '#0a2540', marginBottom: '8px' }}>
              Exam Preparation Courses
            </h3>
            <p style={{ fontSize: '0.85rem', color: '#64748b', lineHeight: '1.6', marginBottom: '16px' }}>
              Structured video lecture series taught by ex-civil servants. Dedicated syllabus mapping for OPSC, OAS, and UPSC exams.
            </p>
            <button
              onClick={() => setActiveTab('courses')}
              style={{ background: 'none', border: 'none', color: '#1d4ed8', fontWeight: '700', fontSize: '0.85rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              Browse Course Syllabi <ArrowRight size={16} />
            </button>
          </div>

          {/* Card 3: Computer-Based Mock Tests */}
          <div className="gov-card" style={{ padding: '24px' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '8px', background: '#fffbeb', color: '#b45309', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '14px' }}>
              <Clock size={24} />
            </div>
            <h3 style={{ fontSize: '1.1rem', color: '#0a2540', marginBottom: '8px' }}>
              Timed CBT Mock Test Engine
            </h3>
            <p style={{ fontSize: '0.85rem', color: '#64748b', lineHeight: '1.6', marginBottom: '16px' }}>
              Simulates actual exam conditions with countdown timers, question palettes, negative marking, and instant result scorecards.
            </p>
            <button
              onClick={() => setActiveTab('tests')}
              style={{ background: 'none', border: 'none', color: '#b45309', fontWeight: '700', fontSize: '0.85rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              Take Practice Exam <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </section>

      {/* Facilities & Verified Photo Gallery Showcase */}
      <section style={{ maxWidth: '1200px', margin: '30px auto 60px', padding: '0 16px' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ color: '#d97706', fontWeight: '700', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
            INFRASTRUCTURE & ACADEMIC FACILITIES
          </div>
          <h2 style={{ fontFamily: 'Cinzel, serif', fontSize: '1.6rem', color: '#0a2540', marginTop: '6px' }}>
            Verified Academy Campus & Digital Reading Halls
          </h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px' }}>
          <div className="gov-card" style={{ overflow: 'hidden' }}>
            <img
              src="https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&q=80&w=600"
              alt="Central Library"
              style={{ width: '100%', height: '180px', objectFit: 'cover' }}
            />
            <div style={{ padding: '16px' }}>
              <div style={{ fontSize: '0.72rem', color: '#059669', fontWeight: '700' }}>CENTRAL LIBRARY</div>
              <h4 style={{ color: '#0a2540', fontSize: '0.95rem', marginTop: '4px' }}>Silent Reading Chamber</h4>
              <p style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '6px' }}>
                Equipped with noise insulation, personal charging ports, and ergonomic chairs for long study hours.
              </p>
            </div>
          </div>

          <div className="gov-card" style={{ overflow: 'hidden' }}>
            <img
              src="https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&q=80&w=600"
              alt="Smart Classroom"
              style={{ width: '100%', height: '180px', objectFit: 'cover' }}
            />
            <div style={{ padding: '16px' }}>
              <div style={{ fontSize: '0.72rem', color: '#2563eb', fontWeight: '700' }}>ACADEMIC BLOCK</div>
              <h4 style={{ color: '#0a2540', fontSize: '0.95rem', marginTop: '4px' }}>Interactive Smart Classrooms</h4>
              <p style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '6px' }}>
                High-definition digital boards for daily analysis of current affairs and Indian Constitution case studies.
              </p>
            </div>
          </div>

          <div className="gov-card" style={{ overflow: 'hidden' }}>
            <img
              src="https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?auto=format&fit=crop&q=80&w=600"
              alt="Reference Section"
              style={{ width: '100%', height: '180px', objectFit: 'cover' }}
            />
            <div style={{ padding: '16px' }}>
              <div style={{ fontSize: '0.72rem', color: '#d97706', fontWeight: '700' }}>REFERENCE REPOSITORY</div>
              <h4 style={{ color: '#0a2540', fontSize: '0.95rem', marginTop: '4px' }}>State Gazette & Research Vault</h4>
              <p style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '6px' }}>
                Over 18,000 standard volumes including Odisha legislative records, economic surveys, and history archives.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
