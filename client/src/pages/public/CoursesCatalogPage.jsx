import React, { useState, useEffect } from 'react';
import { BookOpen, Video, Award, Clock, CheckCircle } from 'lucide-react';
import { api } from '../../services/api';

export const CoursesCatalogPage = ({ onEnrollCourse }) => {
  const [courses, setCourses] = useState([]);
  const [category, setCategory] = useState('ALL');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await api.getCourses(category);
        if (res.success) {
          setCourses(res.courses);
        }
      } catch (err) {
        console.error('Error fetching courses:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, [category]);

  return (
    <div style={{ maxWidth: '1200px', margin: '40px auto 80px', padding: '0 24px' }}>
      <div style={{ textAlign: 'center', marginBottom: '36px' }}>
        <div style={{ color: '#2563eb', fontWeight: '700', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
          OFFICIAL EXAMINATION TRAINING MODULES
        </div>
        <h1 style={{ fontFamily: 'Cinzel, Georgia, serif', fontSize: '2.2rem', color: '#0a2540', marginTop: '6px' }}>
          Competitive Civil Services Course Catalogue
        </h1>
        <p style={{ color: '#64748b', fontSize: '0.95rem', maxWidth: '600px', margin: '8px auto 0' }}>
          Structured lecture batches prepared and mentored by retired civil servants and senior subject faculties.
        </p>

        {/* Filter Pills */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '24px', flexWrap: 'wrap' }}>
          {['ALL', 'OPSC / OAS', 'UPSC / IAS', 'Banking / RBI'].map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              style={{
                padding: '8px 18px',
                borderRadius: '20px',
                border: '1px solid #cbd5e1',
                background: category === cat ? '#0a2540' : '#ffffff',
                color: category === cat ? '#ffffff' : '#475569',
                fontWeight: '600',
                fontSize: '0.82rem',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              {cat === 'ALL' ? 'All Modules' : cat}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px', color: '#64748b' }}>
          Loading course programs...
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '28px' }}>
          {courses.map((course) => (
            <div key={course._id} className="gov-card" style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ position: 'relative' }}>
                <img
                  src={course.thumbnail}
                  alt={course.title}
                  style={{ width: '100%', height: '200px', objectFit: 'cover' }}
                />
                <span
                  style={{
                    position: 'absolute',
                    top: '12px',
                    left: '12px',
                    background: '#0a2540',
                    color: '#f59e0b',
                    fontSize: '0.72rem',
                    fontWeight: '800',
                    padding: '4px 10px',
                    borderRadius: '4px',
                    letterSpacing: '0.5px',
                  }}
                >
                  {course.examCategory}
                </span>
              </div>

              <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                <div style={{ fontSize: '0.8rem', color: '#2563eb', fontWeight: '700', marginBottom: '4px' }}>
                  {course.instructor?.name} • {course.instructor?.designation}
                </div>
                <h3 style={{ color: '#0a2540', fontSize: '1.15rem', lineHeight: '1.4', marginBottom: '10px' }}>
                  {course.title}
                </h3>
                <p style={{ fontSize: '0.85rem', color: '#64748b', lineHeight: '1.6', marginBottom: '16px', flex: 1 }}>
                  {course.description}
                </p>

                {/* Syllabus Highlights */}
                <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '6px', marginBottom: '20px' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: '700', color: '#334155', marginBottom: '6px', textTransform: 'uppercase' }}>
                    Syllabus Coverage:
                  </div>
                  {course.syllabus?.slice(0, 3).map((item, idx) => (
                    <div key={idx} style={{ fontSize: '0.78rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <CheckCircle size={12} color="#059669" /> {item}
                    </div>
                  ))}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto', borderTop: '1px solid #f1f5f9', paddingTop: '16px' }}>
                  <div>
                    <div style={{ fontSize: '1.4rem', fontWeight: '800', color: '#0a2540', fontFamily: 'Cinzel, serif' }}>
                      ₹{course.price}
                    </div>
                    {course.originalPrice > 0 && (
                      <div style={{ fontSize: '0.75rem', color: '#94a3b8', textDecoration: 'line-through' }}>
                        ₹{course.originalPrice}
                      </div>
                    )}
                  </div>

                  <button
                    className="btn-accent"
                    onClick={() => onEnrollCourse(course)}
                    style={{ padding: '8px 18px', fontSize: '0.88rem' }}
                  >
                    Enroll Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
