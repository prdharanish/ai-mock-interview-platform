import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { register, login, clearError } from '../../store/authSlice';

const ROLE_OPTIONS = ['Software Engineer', 'Frontend Developer', 'Backend Developer', 'Full Stack Developer', 'DevOps Engineer', 'Data Scientist'];

export default function AuthPage({ onSwitchToAdmin }) {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((s) => s.auth);
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ name: '', email: '', password: '', targetRole: 'Software Engineer', techStack: [] });

  const [techInput, setTechInput] = useState('');

  const handleAddTech = (e) => {
    if (e.key === 'Enter' && techInput.trim()) {
      e.preventDefault();
      if (!form.techStack.includes(techInput.trim())) {
        setForm((f) => ({ ...f, techStack: [...f.techStack, techInput.trim()] }));
      }
      setTechInput('');
    }
  };

  const removeTech = (tech) => {
    setForm((f) => ({ ...f, techStack: f.techStack.filter(t => t !== tech) }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(clearError());
    if (isLogin) dispatch(login({ email: form.email, password: form.password }));
    else dispatch(register(form));
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: 'radial-gradient(ellipse at 60% 20%, rgba(124,58,237,0.15) 0%, transparent 60%), var(--color-bg)' }}>
      <div className="w-full max-w-md animate-fadeInUp">
        {/* Logo / Title */}
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">⚡</div>
          <h1 className="text-3xl font-bold gradient-text mb-2">InterviewPro</h1>
          <p style={{ color: 'var(--color-muted)' }} className="text-sm">AI-powered mock interview platform</p>
        </div>

        <div className="card">
          {/* Tab toggle */}
          <div className="flex rounded-lg overflow-hidden mb-6" style={{ background: 'var(--color-surface2)' }}>
            {['Login', 'Sign Up'].map((label, i) => (
              <button
                key={label}
                onClick={() => { setIsLogin(i === 0); dispatch(clearError()); }}
                className="flex-1 py-2.5 text-sm font-medium transition-all"
                style={{
                  background: isLogin === (i === 0) ? 'linear-gradient(135deg,#58a6ff,#7c3aed)' : 'transparent',
                  color: isLogin === (i === 0) ? 'white' : 'var(--color-muted)',
                  borderRadius: '6px',
                  border: 'none',
                  cursor: 'pointer',
                }}
              >{label}</button>
            ))}
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-lg text-sm" style={{ background: 'rgba(248,81,73,0.1)', border: '1px solid rgba(248,81,73,0.3)', color: 'var(--color-danger)' }}>
              {error.msg || 'An error occurred'}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--color-muted)' }}>Full Name</label>
                <input className="input" placeholder="John Doe" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
              </div>
            )}
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--color-muted)' }}>Email</label>
              <input className="input" type="email" placeholder="you@company.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--color-muted)' }}>Password</label>
              <input className="input" type="password" placeholder="••••••••" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
            </div>

            {!isLogin && (
              <>
                <div>
                  <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--color-muted)' }}>Target Role</label>
                  <select className="input" value={form.targetRole} onChange={(e) => setForm({ ...form, targetRole: e.target.value })}>
                    {ROLE_OPTIONS.map((r) => <option key={r}>{r}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium mb-2" style={{ color: 'var(--color-muted)' }}>Tech Stack (Press Enter to add)</label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {form.techStack.map((tech) => (
                      <span
                        key={tech}
                        className="badge flex items-center gap-1 transition-all"
                        style={{ background: 'rgba(88,166,255,0.2)', color: '#58a6ff', border: '1px solid #58a6ff' }}
                      >
                        {tech}
                        <button type="button" onClick={() => removeTech(tech)} className="text-[#58a6ff] hover:text-white font-bold ml-1 cursor-pointer">
                          &times;
                        </button>
                      </span>
                    ))}
                  </div>
                  <input
                    type="text"
                    className="input w-full"
                    placeholder="e.g. React, Node.js"
                    value={techInput}
                    onChange={(e) => setTechInput(e.target.value)}
                    onKeyDown={handleAddTech}
                  />
                </div>
              </>
            )}

            <button type="submit" className="btn-primary w-full mt-2" disabled={loading}>
              {loading ? 'Please wait…' : isLogin ? 'Sign In' : 'Create Account'}
            </button>
          </form>
        </div>

        {/* Subtle admin link */}
        <div className="text-center mt-6">
          <button
            onClick={onSwitchToAdmin}
            className="text-xs transition-colors"
            style={{ color: 'var(--color-muted)', cursor: 'pointer', background: 'none', border: 'none', opacity: 0.6 }}
            onMouseEnter={(e) => { e.target.style.color = 'var(--color-accent)'; e.target.style.opacity = 1; }}
            onMouseLeave={(e) => { e.target.style.color = 'var(--color-muted)'; e.target.style.opacity = 0.6; }}
          >
            Admin?
          </button>
        </div>
      </div>
    </div>
  );
}
