import React, { useState } from 'react';
import { X, Play, CheckCircle, FileText } from 'lucide-react';
import { api } from '../../services/api';

export const CourseVideoModal = ({ isOpen, onClose, course }) => {
  if (!isOpen || !course) return null;

  const [activeLesson, setActiveLesson] = useState(course.lessons?.[0] || null);

  const handleLessonWatched = async (lessonId) => {
    try {
      await api.updateCourseProgress(course._id, lessonId);
    } catch (err) {
      console.error('Progress sync error:', err);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(5, 19, 41, 0.9)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1300,
        padding: '20px',
      }}
    >
      <div
        style={{
          background: '#ffffff',
          borderRadius: '12px',
          width: '100%',
          maxWidth: '1000px',
          height: '85vh',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
        }}
      >
        {/* Header */}
        <div style={{ background: '#0a2540', color: 'white', padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <span style={{ fontSize: '0.72rem', color: '#f59e0b', fontWeight: 'bold' }}>{course.examCategory}</span>
            <h3 style={{ margin: '2px 0 0', fontSize: '1.1rem' }}>{course.title}</h3>
          </div>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        {/* Video Player + Lesson Syllabus Split */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', flex: 1, overflow: 'hidden' }}>
          {/* Main Video Screen */}
          <div style={{ background: '#000000', display: 'flex', flexDirection: 'column' }}>
            <div style={{ flex: 1, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {activeLesson?.videoUrl ? (
                <video
                  key={activeLesson._id}
                  controls
                  autoPlay
                  onEnded={() => handleLessonWatched(activeLesson._id)}
                  style={{ width: '100%', height: '100%', maxHeight: '520px', objectFit: 'contain' }}
                >
                  <source src={activeLesson.videoUrl} type="video/mp4" />
                  Your browser does not support video playback.
                </video>
              ) : (
                <div style={{ color: '#94a3b8' }}>Select a lesson to begin playback</div>
              )}
            </div>

            <div style={{ background: '#0a2540', padding: '14px 20px', color: '#ffffff' }}>
              <h4 style={{ margin: 0, fontSize: '1rem' }}>{activeLesson?.title}</h4>
              <p style={{ margin: '4px 0 0', fontSize: '0.8rem', color: '#94a3b8' }}>
                Chapter: {activeLesson?.chapter} • Duration: {activeLesson?.durationMinutes} Mins
              </p>
            </div>
          </div>

          {/* Lessons Syllabus Sidebar */}
          <div style={{ background: '#f8fafc', borderLeft: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
            <div style={{ padding: '16px', background: '#f1f5f9', borderBottom: '1px solid #e2e8f0', fontWeight: 'bold', fontSize: '0.85rem', color: '#0a2540' }}>
              Course Syllabus & Lectures ({course.lessons?.length || 0})
            </div>

            <div style={{ padding: '8px' }}>
              {course.lessons?.map((les, idx) => {
                const isSelected = activeLesson?._id === les._id;
                return (
                  <div
                    key={idx}
                    onClick={() => {
                      setActiveLesson(les);
                      handleLessonWatched(les._id);
                    }}
                    style={{
                      padding: '12px',
                      borderRadius: '6px',
                      background: isSelected ? '#ffffff' : 'transparent',
                      border: isSelected ? '1px solid #0a2540' : '1px solid transparent',
                      boxShadow: isSelected ? 'var(--shadow-sm)' : 'none',
                      marginBottom: '6px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '10px',
                    }}
                  >
                    <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: isSelected ? '#0a2540' : '#e2e8f0', color: isSelected ? '#ffffff' : '#475569', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 'bold', flexShrink: 0 }}>
                      {idx + 1}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '0.82rem', fontWeight: '600', color: '#0a2540', lineHeight: '1.4' }}>
                        {les.title}
                      </div>
                      <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '2px' }}>
                        {les.durationMinutes} mins • {les.chapter}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
