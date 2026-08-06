import React, { useState } from 'react';
import api from '../../utils/api';

export default function AdminLogin({ onSwitchToUser, onAdminLoggedIn }) {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await api.post('/auth/login', { email: form.email, password: form.password });
      const { token, user } = res.data;

      if (user.role !== 'admin') {
        setError('This account does not have admin access.');
        setLoading(false);
        return;
      }

      // Admin confirmed — store credentials and notify parent
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      onAdminLoggedIn({ token, user });
    } catch (err) {
      setError(err.response?.data?.msg || 'Login failed. Please check your credentials.');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: 'radial-gradient(ellipse at 40% 30%, rgba(248,81,73,0.1) 0%, transparent 50%), radial-gradient(ellipse at 60% 20%, rgba(124,58,237,0.15) 0%, transparent 60%), var(--color-bg)' }}>
      <div className="w-full max-w-md animate-fadeInUp">
        {/* Logo / Title */}
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">🛡️</div>
          <h1 className="text-2xl sm:text-3xl font-bold mb-2" style={{ background: 'linear-gradient(135deg, #f85149, #7c3aed)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
            Admin Access
          </h1>
          <p style={{ color: 'var(--color-muted)' }} className="text-sm">InterviewPro platform administration</p>
        </div>

        <div className="card">
          {/* Header badge */}
          <div className="flex justify-center mb-6">
            <span className="badge badge-red text-xs px-4 py-1">Restricted Access</span>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-lg text-sm" style={{ background: 'rgba(248,81,73,0.1)', border: '1px solid rgba(248,81,73,0.3)', color: 'var(--color-danger)' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--color-muted)' }}>Admin Email</label>
              <input
                className="input"
                type="email"
                placeholder="admin@interviewpro.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--color-muted)' }}>Password</label>
              <input
                className="input"
                type="password"
                placeholder="••••••••"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
              />
            </div>

            <button
              type="submit"
              className="w-full mt-2 font-semibold py-2.5 rounded-lg transition-all"
              disabled={loading}
              style={{
                background: loading ? 'var(--color-surface2)' : 'linear-gradient(135deg, #f85149, #7c3aed)',
                color: 'white',
                border: 'none',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.5 : 1,
              }}
            >
              {loading ? 'Verifying…' : 'Sign In as Admin'}
            </button>
          </form>

          {/* Link back to regular login */}
          <div className="text-center mt-6 pt-4" style={{ borderTop: '1px solid var(--color-border)' }}>
            <button
              onClick={onSwitchToUser}
              className="text-xs transition-colors"
              style={{ color: 'var(--color-muted)', cursor: 'pointer', background: 'none', border: 'none' }}
              onMouseEnter={(e) => e.target.style.color = 'var(--color-accent)'}
              onMouseLeave={(e) => e.target.style.color = 'var(--color-muted)'}
            >
              ← Back to regular login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
