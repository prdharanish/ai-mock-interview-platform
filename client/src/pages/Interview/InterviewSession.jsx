import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { startSession, getNextQuestion, submitAnswer, clearFeedback } from '../../store/interviewSlice';

const ROLES = ['Software Engineer', 'Frontend Developer', 'Backend Developer', 'Full Stack Developer'];

function ScoreRing({ score }) {
  const color = score >= 7 ? 'var(--color-success)' : score >= 4 ? 'var(--color-warning)' : 'var(--color-danger)';
  return (
    <div className="flex flex-col items-center">
      <div className="w-20 h-20 rounded-full flex items-center justify-center text-2xl font-bold" style={{ background: `${color}20`, border: `3px solid ${color}`, color }}>
        {score}
      </div>
      <p className="text-xs mt-1.5" style={{ color: 'var(--color-muted)' }}>/ 10</p>
    </div>
  );
}

export default function InterviewSession() {
  const dispatch = useDispatch();
  const { session, currentQuestion, feedback, loading, error } = useSelector((s) => s.interview);
  const [answer, setAnswer] = useState('');
  const [role, setRole] = useState('Software Engineer');

  const handleStartSession = () => dispatch(startSession(role));

  const handleNextQuestion = () => {
    if (session) {
      dispatch(clearFeedback());
      dispatch(getNextQuestion(session._id));
      setAnswer('');
    }
  };

  const handleSubmit = () => {
    if (session && currentQuestion && answer.trim()) {
      dispatch(submitAnswer({ sessionId: session._id, questionId: currentQuestion._id, userAnswer: answer }));
    }
  };

  const catColor = { DSA: 'badge-blue', 'System Design': 'badge-purple', HR: 'badge-yellow' };
  const diffColor = { Easy: 'badge-green', Medium: 'badge-yellow', Hard: 'badge-red' };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-4 sm:space-y-6 animate-fadeInUp">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Mock Interview</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--color-muted)' }}>
            {session ? `Session active · ${session.role}` : 'Choose your role and start a new session'}
          </p>
        </div>

        {!session ? (
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <select className="input" style={{ maxWidth: '100%' }} value={role} onChange={(e) => setRole(e.target.value)}>
              {ROLES.map((r) => <option key={r}>{r}</option>)}
            </select>
            <button className="btn-primary pulse-glow whitespace-nowrap" onClick={handleStartSession} disabled={loading}>
              {loading ? 'Starting…' : '🚀 Start Session'}
            </button>
          </div>
        ) : !currentQuestion ? (
          <button className="btn-primary" onClick={handleNextQuestion} disabled={loading}>
            {loading ? 'Loading…' : 'Get First Question'}
          </button>
        ) : null}
      </div>

      {error && (
        <div className="p-4 rounded-lg text-sm" style={{ background: 'rgba(248,81,73,0.1)', border: '1px solid rgba(248,81,73,0.3)', color: 'var(--color-danger)' }}>
          {error.msg || 'An error occurred. Please try again.'}
        </div>
      )}

      {/* Question Card */}
      {currentQuestion && (
        <div className="card space-y-3">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <h2 className="text-xl font-semibold">{currentQuestion.title}</h2>
            <div className="flex gap-2 flex-shrink-0">
              <span className={`badge ${catColor[currentQuestion.category] || 'badge-blue'}`}>{currentQuestion.category}</span>
              <span className={`badge ${diffColor[currentQuestion.difficulty] || 'badge-yellow'}`}>{currentQuestion.difficulty}</span>
            </div>
          </div>
          <p className="text-sm leading-relaxed whitespace-pre-wrap" style={{ color: 'var(--color-muted)' }}>{currentQuestion.content}</p>
          {currentQuestion.company?.length > 0 && (
            <div className="flex gap-2 flex-wrap">
              {currentQuestion.company.map((c) => (
                <span key={c} className="text-xs px-2 py-0.5 rounded" style={{ background: 'var(--color-surface2)', color: 'var(--color-muted)' }}>🏢 {c}</span>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Answer Input */}
      {currentQuestion && !feedback && (
        <div className="space-y-3">
          <textarea
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Type your answer here. Be thorough — the AI evaluates clarity, correctness, and depth."
            className="input"
            rows={8}
            style={{ resize: 'vertical', lineHeight: '1.6' }}
          />
          <div className="flex justify-end">
            <button className="btn-primary" onClick={handleSubmit} disabled={loading || !answer.trim()}>
              {loading ? '🤖 Evaluating…' : 'Submit Answer'}
            </button>
          </div>
        </div>
      )}

      {/* Feedback Card */}
      {feedback && (
        <div className="card space-y-6 animate-fadeInUp">
          <div className="flex items-center justify-between flex-wrap gap-4" style={{ borderBottom: '1px solid var(--color-border)', paddingBottom: '16px' }}>
            <h3 className="text-xl font-bold">AI Feedback</h3>
            <ScoreRing score={feedback.score} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl space-y-2" style={{ background: 'rgba(63,185,80,0.08)', border: '1px solid rgba(63,185,80,0.25)' }}>
              <h4 className="text-sm font-semibold" style={{ color: 'var(--color-success)' }}>✓ Strengths</h4>
              {feedback.strengths?.length ? (
                <ul className="space-y-1.5">
                  {feedback.strengths.map((s, i) => <li key={i} className="text-sm flex gap-2"><span style={{ color: 'var(--color-success)' }}>•</span>{s}</li>)}
                </ul>
              ) : <p className="text-sm" style={{ color: 'var(--color-muted)' }}>None identified</p>}
            </div>
            <div className="p-4 rounded-xl space-y-2" style={{ background: 'rgba(248,81,73,0.08)', border: '1px solid rgba(248,81,73,0.25)' }}>
              <h4 className="text-sm font-semibold" style={{ color: 'var(--color-danger)' }}>⚠ Areas to Improve</h4>
              {feedback.weaknesses?.length ? (
                <ul className="space-y-1.5">
                  {feedback.weaknesses.map((w, i) => <li key={i} className="text-sm flex gap-2"><span style={{ color: 'var(--color-danger)' }}>•</span>{w}</li>)}
                </ul>
              ) : <p className="text-sm" style={{ color: 'var(--color-muted)' }}>None identified</p>}
            </div>
          </div>

          <div className="p-4 rounded-xl space-y-2" style={{ background: 'rgba(88,166,255,0.08)', border: '1px solid rgba(88,166,255,0.25)' }}>
            <h4 className="text-sm font-semibold" style={{ color: 'var(--color-accent)' }}>💡 Ideal Answer</h4>
            <p className="text-sm leading-relaxed whitespace-pre-wrap" style={{ color: 'var(--color-muted)' }}>{feedback.correctAnswer}</p>
          </div>

          <div className="flex justify-end">
            <button className="btn-primary" onClick={handleNextQuestion}>Next Question →</button>
          </div>
        </div>
      )}

      {/* Empty State */}
      {session && !currentQuestion && !loading && (
        <div className="card text-center py-16 space-y-3">
          <p className="text-5xl">🎯</p>
          <p className="text-lg font-semibold">Session is ready!</p>
          <p className="text-sm" style={{ color: 'var(--color-muted)' }}>Click "Get First Question" to begin your mock interview.</p>
        </div>
      )}
    </div>
  );
}
