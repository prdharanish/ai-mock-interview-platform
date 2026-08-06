import React, { useState } from 'react';
import api from '../utils/api';

export default function ChangePassword() {
  const [form, setForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [msg, setMsg] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg(null);
    setError(null);

    if (form.newPassword !== form.confirmPassword) {
      return setError('New passwords do not match');
    }
    
    if (form.newPassword.length < 8) {
      return setError('New password must be at least 8 characters long');
    }

    setLoading(true);
    try {
      const res = await api.put('/auth/change-password', {
        currentPassword: form.currentPassword,
        newPassword: form.newPassword
      });
      setMsg(res.data.msg || 'Password updated successfully');
      setForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      setError(err.response?.data?.msg || 'An error occurred while changing password');
    }
    setLoading(false);
  };

  return (
    <div className="card max-w-md w-full animate-fadeInUp">
      <h3 className="text-xl font-bold mb-4">Change Password</h3>
      
      {msg && (
        <div className="mb-4 p-3 rounded-lg text-sm bg-green-900/20 border border-green-500/30 text-green-400">
          {msg}
        </div>
      )}
      
      {error && (
        <div className="mb-4 p-3 rounded-lg text-sm bg-red-900/20 border border-red-500/30 text-red-400">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--color-muted)' }}>Current Password</label>
          <input 
            className="input" 
            type="password" 
            value={form.currentPassword} 
            onChange={(e) => setForm({ ...form, currentPassword: e.target.value })} 
            required 
          />
        </div>
        <div>
          <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--color-muted)' }}>New Password</label>
          <input 
            className="input" 
            type="password" 
            value={form.newPassword} 
            onChange={(e) => setForm({ ...form, newPassword: e.target.value })} 
            required 
          />
        </div>
        <div>
          <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--color-muted)' }}>Confirm New Password</label>
          <input 
            className="input" 
            type="password" 
            value={form.confirmPassword} 
            onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })} 
            required 
          />
        </div>
        
        <button type="submit" className="btn-primary w-full mt-2" disabled={loading}>
          {loading ? 'Updating...' : 'Update Password'}
        </button>
      </form>
    </div>
  );
}
