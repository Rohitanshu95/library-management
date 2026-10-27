import React, { useState } from 'react';
import {
  Image,
  Eye,
  X,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Building,
  Award,
  Sparkles,
  MapPin,
  CheckCircle2,
  Calendar,
} from 'lucide-react';

const GALLERY_ITEMS = [
  {
    id: 1,
    title: 'Central Air-Conditioned Reading Hall',
    category: 'READING_HALLS',
    categoryLabel: 'Reading Halls',
    imageUrl: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&q=80&w=1000',
    description: 'Sound-dampened reading hall with 200 ergonomic individual study cubicles, dedicated power outlets, and LED reading lights.',
    features: ['Sound-proofed acoustic ceiling', 'Godrej ergonomic chairs', '230V individual socket', '06:00 AM - 11:30 PM Access'],
    date: 'Academic Year 2026',
    location: 'First Floor, Block A',
  },
  {
    id: 2,
    title: 'High-Speed Cyber Digital Resource Center',
    category: 'DIGITAL_LIBRARY',
    categoryLabel: 'Digital Library',
    imageUrl: 'https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?auto=format&fit=crop&q=80&w=1000',
    description: 'Dual-display desktop workstations loaded with online legal databases, international journals, digital state archives, and e-newspapers.',
    features: ['1 Gbps Dedicated Gov-Leased Fiber', 'Access to Manupatra & JSTOR', 'Pre-configured CBT Exam terminals', 'Licensed antivirus & firewall'],
    date: 'Updated Oct 2026',
    location: 'Second Floor, Digital Wing',
  },
  {
    id: 3,
    title: 'Smart Interactive Audio-Visual Lecture Hall',
    category: 'CLASSROOMS',
    categoryLabel: 'Classrooms',
    imageUrl: 'https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&q=80&w=1000',
    description: 'Tiered amphitheater classroom equipped with 4K interactive digital touch panels and live streaming setup for hybrid civil service batches.',
    features: ['4K Interactive ViewSonic displays', 'Dual-mic surround audio', 'Hybrid online-offline broadcast', 'Capacity: 120 Aspirants'],
    date: 'Batch 2026-27',
    location: 'Ground Floor, Auditorium Block',
  },
  {
    id: 4,
    title: 'Officer Aspirants Group Discussion Chamber',
    category: 'DISCUSSION',
    categoryLabel: 'Discussion Rooms',
    imageUrl: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=1000',
    description: 'Collaborative discussion pods where candidates prepare for personality tests, group debates, and peer answer writing evaluations.',
    features: ['Magnetic whiteboards', 'Round-table collaborative layout', 'Reserved for Mains & Interview qualifiers', 'Air conditioned'],
    date: 'Year-Round Facility',
    location: 'Third Floor, Annex Block',
  },
  {
    id: 5,
    title: 'Civil Services Toppers & Hall of Fame Felicitations',
    category: 'TOPPERS',
    categoryLabel: 'Toppers & Felicitations',
    imageUrl: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=1000',
    description: 'Annual felicitation ceremony honoring Academy scholars who cracked OPSC OAS and UPSC CSE with top All-India ranks.',
    features: ['Rank 1 & Top 10 Rankers 2024-25', 'State Hon’ble Chief Guest Address', 'Cash Scholarships & Trophies', 'Alumni Mentorship Registry'],
    date: 'Annual State Conclave 2025',
    location: 'Main Institutional Convention Center',
  },
  {
    id: 6,
    title: 'Individual Premium Quiet Study Cubicles',
    category: 'READING_HALLS',
    categoryLabel: 'Reading Halls',
    imageUrl: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&q=80&w=1000',
    description: 'Private high-partition cubicles designed for focused, distraction-free 12-hour preparation for civil services prelims & mains.',
    features: ['High wooden partitions', 'Locker unit attached', 'Direct overhead glare-free lighting', 'Silent Zone enforcement'],
    date: 'Academic Year 2026',
    location: 'First Floor, Silent Wing',
  },
  {
    id: 7,
    title: 'Biometric Turnstiles & Reception Security Desk',
    category: 'READING_HALLS',
    categoryLabel: 'Reading Halls',
    imageUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=1000',
    description: 'Automated QR code & RFID gate turnstiles linked to the cloud attendance system for real-time seat tracking.',
    features: ['Instant QR verification under 0.5s', 'Automated SMS/Email entry log', '24x7 Security & CCTV surveillance', 'Visitor bag scanner'],
    date: 'Installed 2026',
    location: 'Main Academy Entrance Lobby',
  },
  {
    id: 8,
    title: 'State Archives & Reference Books Vault',
    category: 'DIGITAL_LIBRARY',
    categoryLabel: 'Digital Library',
    imageUrl: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&q=80&w=1000',
    description: 'Curated repository containing rare Odisha gazettes, British colonial records, Sanskrit manuscripts, and UPSC standard reference books.',
    features: ['Over 35,000 reference titles', 'Bilingual Odia & English collection', 'Government report archives', 'Dewey Decimal Cataloguing'],
    date: 'Permanent Collection',
    location: 'Ground Floor, Archives Wing',
  },
  {
    id: 9,
    title: 'Mock Interview Board Chamber',
    category: 'DISCUSSION',
    categoryLabel: 'Discussion Rooms',
    imageUrl: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&q=80&w=1000',
    description: 'Realistic interview simulation chamber with multi-angle video recording for candidate body language & posture analysis.',
    features: ['Chaired by retired IAS/IPS officers', 'HD multi-cam recording & review', 'Detailed psychological feedback', 'Dress code mandatory'],
    date: 'Interview Season 2026',
    location: 'Executive Boardroom, Block B',
  },
];

const CATEGORIES = [
  { key: 'ALL', label: 'All Campus Facilities' },
  { key: 'READING_HALLS', label: 'Reading Halls & Desks' },
  { key: 'DIGITAL_LIBRARY', label: 'Digital e-Library' },
  { key: 'CLASSROOMS', label: 'Smart Classrooms' },
  { key: 'DISCUSSION', label: 'Discussion & Interview' },
  { key: 'TOPPERS', label: 'Toppers & Felicitations' },
];

export const GalleryPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [lightboxItem, setLightboxItem] = useState(null);

  const filteredItems =
    selectedCategory === 'ALL'
      ? GALLERY_ITEMS
      : GALLERY_ITEMS.filter((item) => item.category === selectedCategory);

  const handleNextLightbox = () => {
    if (!lightboxItem) return;
    const currentIndex = filteredItems.findIndex((i) => i.id === lightboxItem.id);
    const nextIndex = (currentIndex + 1) % filteredItems.length;
    setLightboxItem(filteredItems[nextIndex]);
  };

  const handlePrevLightbox = () => {
    if (!lightboxItem) return;
    const currentIndex = filteredItems.findIndex((i) => i.id === lightboxItem.id);
    const prevIndex = (currentIndex - 1 + filteredItems.length) % filteredItems.length;
    setLightboxItem(filteredItems[prevIndex]);
  };

  return (
    <div style={{ maxWidth: '1240px', margin: '30px auto 80px', padding: '0 24px' }}>
      {/* Official Government Header Banner */}
      <div
        style={{
          background: 'linear-gradient(135deg, #051329 0%, #0a2540 100%)',
          color: '#ffffff',
          borderRadius: '12px',
          padding: '36px 32px',
          marginBottom: '32px',
          borderBottom: '4px solid #d97706',
          boxShadow: 'var(--shadow-md)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div style={{ position: 'relative', zIndex: 2, maxWidth: '820px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(217, 119, 6, 0.25)', border: '1px solid #f59e0b', color: '#fbbf24', padding: '4px 12px', borderRadius: '16px', fontSize: '0.78rem', fontWeight: 'bold', marginBottom: '14px' }}>
            <Building size={14} /> STATE PUBLIC SERVICE ACADEMY • CAMPUS INFRASTRUCTURE
          </div>
          <h1 style={{ fontSize: '2.1rem', fontFamily: 'Cinzel, Georgia, serif', margin: '0 0 10px', color: '#ffffff', letterSpacing: '0.5px' }}>
            Campus & Study Infrastructure Gallery
          </h1>
          <p style={{ margin: 0, fontSize: '0.95rem', color: '#cbd5e1', lineHeight: '1.6' }}>
            Explore our state-of-the-art physical reading halls, high-speed cyber library, smart interactive classrooms, and inspirational alumni hall designed to nurture future administrative leaders of the state.
          </p>
        </div>

        {/* Decorative Watermark */}
        <div style={{ position: 'absolute', right: '-20px', top: '-10px', opacity: 0.08, pointerEvents: 'none' }}>
          <Image size={240} />
        </div>
      </div>

      {/* Category Filter Tabs */}
      <div
        style={{
          display: 'flex',
          gap: '10px',
          flexWrap: 'wrap',
          marginBottom: '30px',
          borderBottom: '2px solid #e2e8f0',
          paddingBottom: '16px',
        }}
      >
        {CATEGORIES.map((cat) => (
          <button
            key={cat.key}
            onClick={() => setSelectedCategory(cat.key)}
            style={{
              padding: '9px 18px',
              borderRadius: '20px',
              border: selectedCategory === cat.key ? '2px solid #0a2540' : '1px solid #cbd5e1',
              background: selectedCategory === cat.key ? '#0a2540' : '#ffffff',
              color: selectedCategory === cat.key ? '#ffffff' : '#475569',
              fontWeight: selectedCategory === cat.key ? '700' : '500',
              fontSize: '0.85rem',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Photo Gallery Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
          gap: '24px',
          marginBottom: '50px',
        }}
      >
        {filteredItems.map((item) => (
          <div
            key={item.id}
            onClick={() => setLightboxItem(item)}
            className="gov-card"
            style={{
              overflow: 'hidden',
              cursor: 'pointer',
              transition: 'transform 0.25s ease, box-shadow 0.25s ease',
              display: 'flex',
              flexDirection: 'column',
              padding: 0,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = '0 16px 30px -10px rgba(0,0,0,0.15)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
            }}
          >
            {/* Image Container with Hover Overlay */}
            <div style={{ position: 'relative', width: '100%', height: '230px', overflow: 'hidden', background: '#0a2540' }}>
              <img
                src={item.imageUrl}
                alt={item.title}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  transition: 'transform 0.4s ease',
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  top: '12px',
                  left: '12px',
                  background: 'rgba(10, 37, 64, 0.85)',
                  backdropFilter: 'blur(4px)',
                  color: '#fbbf24',
                  fontSize: '0.72rem',
                  fontWeight: '700',
                  padding: '4px 10px',
                  borderRadius: '12px',
                  border: '1px solid rgba(251, 191, 36, 0.4)',
                }}
              >
                {item.categoryLabel}
              </div>

              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'rgba(5, 19, 41, 0.4)',
                  opacity: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'opacity 0.2s ease',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = '0')}
              >
                <span
                  style={{
                    background: '#ffffff',
                    color: '#0a2540',
                    padding: '8px 16px',
                    borderRadius: '20px',
                    fontSize: '0.82rem',
                    fontWeight: '700',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                  }}
                >
                  <Eye size={15} /> View Full Photo
                </span>
              </div>
            </div>

            {/* Card Body */}
            <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
              <h3 style={{ fontSize: '1.1rem', color: '#0a2540', margin: '0 0 8px', fontFamily: 'Cinzel, Georgia, serif' }}>
                {item.title}
              </h3>
              <p style={{ fontSize: '0.85rem', color: '#64748b', lineHeight: '1.5', margin: '0 0 16px', flex: 1 }}>
                {item.description}
              </p>

              <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.78rem', color: '#94a3b8' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <MapPin size={13} color="#d97706" /> {item.location}
                </span>
                <span>{item.date}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Campus Visit Callout */}
      <div
        style={{
          background: 'linear-gradient(135deg, #f8fafc 0%, #eff6ff 100%)',
          border: '1px solid #cbd5e1',
          borderRadius: '12px',
          padding: '30px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '20px',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#1d4ed8', fontSize: '0.8rem', fontWeight: 'bold', marginBottom: '6px' }}>
            <ShieldCheck size={16} /> PHYSICAL CAMPUS WALKTHROUGH AVAILABLE
          </div>
          <h3 style={{ fontSize: '1.3rem', color: '#0a2540', margin: '0 0 6px', fontFamily: 'Cinzel, serif' }}>
            Schedule an On-Campus Orientation Tour
          </h3>
          <p style={{ margin: 0, fontSize: '0.88rem', color: '#475569', maxWidth: '640px' }}>
            Prospective aspirants and parents may visit the State Academy between 09:00 AM and 05:00 PM (Monday to Saturday) to tour the facilities, inspect sample desk cubicles, and interact with academic counselors.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <div style={{ background: '#ffffff', padding: '10px 18px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem', color: '#0a2540', fontWeight: '600' }}>
            Reception Helpline: <strong>+91 (0674) 239-1002</strong>
          </div>
        </div>
      </div>

      {/* Fullscreen Lightbox Modal */}
      {lightboxItem && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(5, 19, 41, 0.94)',
            backdropFilter: 'blur(10px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1500,
            padding: '20px',
          }}
          onClick={() => setLightboxItem(null)}
        >
          <div
            style={{
              position: 'relative',
              background: '#ffffff',
              borderRadius: '14px',
              maxWidth: '920px',
              width: '100%',
              maxHeight: '94vh',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '0 30px 70px rgba(0,0,0,0.6)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setLightboxItem(null)}
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                background: 'rgba(10, 37, 64, 0.7)',
                border: 'none',
                color: '#ffffff',
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                zIndex: 20,
              }}
            >
              <X size={20} />
            </button>

            {/* Prev & Next Floating Buttons */}
            <button
              onClick={handlePrevLightbox}
              style={{
                position: 'absolute',
                top: '40%',
                left: '16px',
                background: 'rgba(255, 255, 255, 0.9)',
                border: 'none',
                color: '#0a2540',
                width: '42px',
                height: '42px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                zIndex: 20,
                boxShadow: '0 4px 14px rgba(0,0,0,0.2)',
              }}
            >
              <ChevronLeft size={24} />
            </button>

            <button
              onClick={handleNextLightbox}
              style={{
                position: 'absolute',
                top: '40%',
                right: '16px',
                background: 'rgba(255, 255, 255, 0.9)',
                border: 'none',
                color: '#0a2540',
                width: '42px',
                height: '42px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                zIndex: 20,
                boxShadow: '0 4px 14px rgba(0,0,0,0.2)',
              }}
            >
              <ChevronRight size={24} />
            </button>

            {/* Modal Image */}
            <div style={{ height: '440px', background: '#0a2540', overflow: 'hidden' }}>
              <img
                src={lightboxItem.imageUrl}
                alt={lightboxItem.title}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>

            {/* Modal Info Footer */}
            <div style={{ padding: '24px 30px', background: '#ffffff', overflowY: 'auto' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#d97706', fontSize: '0.8rem', fontWeight: 'bold', marginBottom: '6px' }}>
                <Building size={15} /> {lightboxItem.categoryLabel} • {lightboxItem.location}
              </div>
              <h2 style={{ fontSize: '1.45rem', color: '#0a2540', margin: '0 0 10px', fontFamily: 'Cinzel, Georgia, serif' }}>
                {lightboxItem.title}
              </h2>
              <p style={{ fontSize: '0.92rem', color: '#475569', lineHeight: '1.6', margin: '0 0 18px' }}>
                {lightboxItem.description}
              </p>

              {/* Specifications / Highlights */}
              <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '14px 18px' }}>
                <div style={{ fontSize: '0.78rem', fontWeight: 'bold', color: '#0a2540', textTransform: 'uppercase', marginBottom: '8px' }}>
                  Facility Infrastructure Highlights:
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px', fontSize: '0.85rem', color: '#334155' }}>
                  {lightboxItem.features.map((feat, idx) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <CheckCircle2 size={14} color="#059669" /> {feat}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
