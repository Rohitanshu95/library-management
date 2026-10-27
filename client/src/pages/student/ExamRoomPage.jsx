import React, { useState, useEffect } from 'react';
import { Clock, CheckCircle, AlertCircle, ChevronLeft, ChevronRight, Flag, Award, Sparkles } from 'lucide-react';
import { api } from '../../services/api';

export const ExamRoomPage = ({ onExit }) => {
  const [testData, setTestData] = useState(null);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [timeLeft, setTimeLeft] = useState(45 * 60); // 45 minutes in seconds
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [resultData, setResultData] = useState(null);

  useEffect(() => {
    const initTest = async () => {
      try {
        const testsRes = await api.getMockTests();
        if (testsRes.success && testsRes.tests.length > 0) {
          const test = testsRes.tests[0];
          const startRes = await api.startTestAttempt(test._id);
          if (startRes.success) {
            setTestData(startRes);
            setAnswers(startRes.answers || []);
            setTimeLeft(startRes.test.durationMinutes * 60);
          }
        }
      } catch (err) {
        console.error('Error starting test:', err);
      } finally {
        setLoading(false);
      }
    };
    initTest();
  }, []);

  // Timer countdown
  useEffect(() => {
    if (resultData || timeLeft <= 0) return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          handleSubmitTest();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [timeLeft, resultData]);

  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const handleSelectOption = (optionIndex) => {
    const updated = [...answers];
    const curr = updated.find((a) => a.questionIndex === currentIdx);
    if (curr) {
      curr.selectedOption = optionIndex;
    } else {
      updated.push({ questionIndex: currentIdx, selectedOption: optionIndex, isMarkedForReview: false });
    }
    setAnswers(updated);
  };

  const handleToggleReview = () => {
    const updated = [...answers];
    const curr = updated.find((a) => a.questionIndex === currentIdx);
    if (curr) {
      curr.isMarkedForReview = !curr.isMarkedForReview;
    } else {
      updated.push({ questionIndex: currentIdx, selectedOption: -1, isMarkedForReview: true });
    }
    setAnswers(updated);
  };

  const handleSubmitTest = async () => {
    if (!testData?.attemptId) return;
    setSubmitting(true);
    try {
      const res = await api.submitTestAttempt(testData.attemptId, answers);
      if (res.success) {
        setResultData(res.results);
      }
    } catch (err) {
      console.error('Submit error:', err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '100px', color: '#64748b' }}>Initializing secure examination environment...</div>;
  }

  // Result Analysis Screen
  if (resultData) {
    return (
      <div style={{ maxWidth: '900px', margin: '40px auto 80px', padding: '0 24px' }}>
        <div className="gov-card" style={{ padding: '36px', textAlign: 'center', borderTop: '6px solid #d97706' }}>
          <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: '#dcfce7', color: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
            <Award size={36} />
          </div>

          <div style={{ color: '#d97706', fontWeight: 'bold', fontSize: '0.82rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
            OFFICIAL CBT SCORECARD & ANALYSIS
          </div>
          <h2 style={{ fontFamily: 'Cinzel, Georgia, serif', color: '#0a2540', fontSize: '1.8rem', marginTop: '4px' }}>
            {testData?.test?.title}
          </h2>

          {/* Big Score Counter */}
          <div style={{ margin: '24px 0', background: '#f8fafc', padding: '24px', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'inline-block', minWidth: '300px' }}>
            <div style={{ fontSize: '3rem', fontWeight: '800', color: resultData.isPassed ? '#059669' : '#dc2626', fontFamily: 'Cinzel, serif' }}>
              {resultData.score}
            </div>
            <div style={{ fontSize: '0.9rem', color: '#64748b' }}>Out of {resultData.totalMarks} Marks ({resultData.percentage}%)</div>
            <div style={{ marginTop: '8px', fontSize: '0.8rem', fontWeight: 'bold', color: resultData.isPassed ? '#166534' : '#991b1b' }}>
              {resultData.isPassed ? '✓ QUALIFIED PRELIMS CUTOFF' : '✗ BELOW PASSING BENCHMARK'}
            </div>
          </div>

          {/* Breakdown Badges */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', maxWidth: '600px', margin: '0 auto 30px' }}>
            <div style={{ background: '#ecfdf5', padding: '12px', borderRadius: '8px', color: '#065f46' }}>
              <strong style={{ fontSize: '1.3rem', display: 'block' }}>{resultData.totalCorrect}</strong>
              <span style={{ fontSize: '0.78rem' }}>Correct (+{resultData.totalCorrect * 2} Marks)</span>
            </div>
            <div style={{ background: '#fef2f2', padding: '12px', borderRadius: '8px', color: '#991b1b' }}>
              <strong style={{ fontSize: '1.3rem', display: 'block' }}>{resultData.totalIncorrect}</strong>
              <span style={{ fontSize: '0.78rem' }}>Wrong (-{(resultData.totalIncorrect * 0.66).toFixed(2)} Marks)</span>
            </div>
            <div style={{ background: '#f1f5f9', padding: '12px', borderRadius: '8px', color: '#475569' }}>
              <strong style={{ fontSize: '1.3rem', display: 'block' }}>{resultData.totalUnattempted}</strong>
              <span style={{ fontSize: '0.78rem' }}>Unattempted (0 Marks)</span>
            </div>
          </div>

          {/* Topic Performance */}
          <div style={{ textAlign: 'left', background: '#f8fafc', padding: '20px', borderRadius: '8px', marginBottom: '30px' }}>
            <h4 style={{ color: '#0a2540', marginBottom: '12px' }}>Topic-Wise Proficiency:</h4>
            {resultData.topicBreakdown?.map((top, idx) => (
              <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid #e2e8f0', fontSize: '0.85rem' }}>
                <span style={{ fontWeight: '600', color: '#334155' }}>{top.topic}</span>
                <span style={{ color: top.correct === top.total ? '#059669' : '#d97706' }}>
                  {top.correct} / {top.total} Correct
                </span>
              </div>
            ))}
          </div>

          <button className="btn-primary" onClick={onExit} style={{ padding: '12px 30px' }}>
            Return to Student Dashboard
          </button>
        </div>
      </div>
    );
  }

  const currentQ = testData?.questions?.[currentIdx];
  const userAns = answers.find((a) => a.questionIndex === currentIdx);

  return (
    <div style={{ maxWidth: '1200px', margin: '20px auto 60px', padding: '0 24px' }}>
      {/* Top CBT Examination Control Bar */}
      <div
        style={{
          background: '#0a2540',
          color: '#ffffff',
          borderRadius: '8px',
          padding: '16px 24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px',
        }}
      >
        <div>
          <div style={{ fontSize: '0.75rem', color: '#f59e0b', fontWeight: 'bold' }}>STATE PUBLIC ACADEMY CBT ENGINE</div>
          <h3 style={{ margin: '2px 0 0', fontSize: '1.1rem', fontFamily: 'Cinzel, Georgia, serif' }}>
            {testData?.test?.title}
          </h3>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{ background: timeLeft < 300 ? '#7f1d1d' : 'rgba(255, 255, 255, 0.1)', padding: '8px 16px', borderRadius: '6px', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 'bold', fontSize: '1.1rem' }}>
            <Clock size={18} color="#f59e0b" />
            <span>{formatTimer(timeLeft)}</span>
          </div>

          <button
            className="btn-accent"
            onClick={handleSubmitTest}
            disabled={submitting}
            style={{ padding: '8px 18px', fontSize: '0.88rem' }}
          >
            {submitting ? 'Submitting...' : 'Final Submit Exam'}
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '24px' }}>
        {/* Question Container */}
        <div className="gov-card" style={{ padding: '30px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid #f1f5f9', paddingBottom: '12px' }}>
            <span style={{ fontSize: '0.9rem', fontWeight: 'bold', color: '#0a2540' }}>
              Question {currentIdx + 1} of {testData?.questions?.length}
            </span>
            <span style={{ fontSize: '0.75rem', background: '#eff6ff', color: '#1e40af', padding: '3px 8px', borderRadius: '4px', fontWeight: 'bold' }}>
              {currentQ?.subjectTopic} • +{testData?.test?.positiveMarks} / -{testData?.test?.negativeMarks} Marks
            </span>
          </div>

          <p style={{ fontSize: '1.1rem', fontWeight: '600', color: '#0f172a', lineHeight: '1.6', marginBottom: '24px' }}>
            {currentQ?.questionText}
          </p>

          {/* Options */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '32px' }}>
            {currentQ?.options?.map((opt, oIdx) => {
              const isSelected = userAns?.selectedOption === oIdx;
              return (
                <div
                  key={oIdx}
                  onClick={() => handleSelectOption(oIdx)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '14px 18px',
                    borderRadius: '8px',
                    border: isSelected ? '2px solid #0a2540' : '1px solid #cbd5e1',
                    background: isSelected ? '#f1f5f9' : '#ffffff',
                    cursor: 'pointer',
                    transition: 'all 0.15s',
                  }}
                >
                  <div
                    style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      border: isSelected ? '6px solid #0a2540' : '2px solid #94a3b8',
                      background: '#ffffff',
                      flexShrink: 0,
                    }}
                  />
                  <span style={{ fontSize: '0.95rem', color: '#334155' }}>{opt}</span>
                </div>
              );
            })}
          </div>

          {/* Navigation Controls */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #f1f5f9', paddingTop: '20px' }}>
            <button
              onClick={handleToggleReview}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                background: userAns?.isMarkedForReview ? '#fef3c7' : '#f8fafc',
                border: '1px solid #cbd5e1',
                padding: '8px 16px',
                borderRadius: '6px',
                fontSize: '0.85rem',
                fontWeight: '600',
                color: userAns?.isMarkedForReview ? '#b45309' : '#475569',
                cursor: 'pointer',
              }}
            >
              <Flag size={14} color="#d97706" />
              {userAns?.isMarkedForReview ? 'Marked for Review' : 'Mark for Review'}
            </button>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                className="btn-outline"
                disabled={currentIdx === 0}
                onClick={() => setCurrentIdx(currentIdx - 1)}
                style={{ padding: '8px 16px', fontSize: '0.85rem' }}
              >
                <ChevronLeft size={16} /> Previous
              </button>
              <button
                className="btn-primary"
                disabled={currentIdx === testData?.questions?.length - 1}
                onClick={() => setCurrentIdx(currentIdx + 1)}
                style={{ padding: '8px 18px', fontSize: '0.85rem' }}
              >
                Next <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Question Palette Sidebar */}
        <div className="gov-card" style={{ padding: '20px', alignSelf: 'start' }}>
          <h4 style={{ color: '#0a2540', fontSize: '0.95rem', marginBottom: '14px' }}>Question Palette</h4>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px', marginBottom: '20px' }}>
            {testData?.questions?.map((q, idx) => {
              const ans = answers.find((a) => a.questionIndex === idx);
              let bg = '#e2e8f0';
              let color = '#475569';

              if (ans?.isMarkedForReview) {
                bg = '#f59e0b';
                color = '#ffffff';
              } else if (ans?.selectedOption !== undefined && ans.selectedOption !== -1) {
                bg = '#10b981';
                color = '#ffffff';
              }

              const isCurrent = currentIdx === idx;

              return (
                <button
                  key={idx}
                  onClick={() => setCurrentIdx(idx)}
                  style={{
                    height: '38px',
                    border: isCurrent ? '2px solid #0a2540' : 'none',
                    background: bg,
                    color: color,
                    fontWeight: 'bold',
                    borderRadius: '4px',
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                  }}
                >
                  {idx + 1}
                </button>
              );
            })}
          </div>

          {/* Legend */}
          <div style={{ fontSize: '0.75rem', color: '#64748b', display: 'flex', flexDirection: 'column', gap: '6px', borderTop: '1px solid #f1f5f9', paddingTop: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '12px', height: '12px', background: '#10b981', borderRadius: '2px' }} />
              <span>Answered</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '12px', height: '12px', background: '#f59e0b', borderRadius: '2px' }} />
              <span>Marked for Review</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '12px', height: '12px', background: '#e2e8f0', borderRadius: '2px' }} />
              <span>Unattempted</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
