import React from 'react';
import { useSelector } from 'react-redux';
import ChangePassword from '../../components/ChangePassword';

export default function ProfilePage() {
  const { user } = useSelector((s) => s.auth);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-4 sm:space-y-6 animate-fadeInUp">
      <div className="mb-4 sm:mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold gradient-text">My Profile</h1>
        <p className="text-sm" style={{ color: 'var(--color-muted)' }}>Manage your account settings</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-xl font-bold mb-4">Account Information</h3>
          <div className="space-y-4">
            <div>
              <p className="text-xs font-medium" style={{ color: 'var(--color-muted)' }}>Name</p>
              <p className="font-medium text-lg">{user?.name}</p>
            </div>
            <div>
              <p className="text-xs font-medium" style={{ color: 'var(--color-muted)' }}>Email</p>
              <p className="font-medium text-lg">{user?.email}</p>
            </div>
            <div>
              <p className="text-xs font-medium" style={{ color: 'var(--color-muted)' }}>Role</p>
              <span className="badge mt-1" style={user?.role === 'admin' ? { background: 'rgba(88,166,255,0.2)', color: '#58a6ff' } : {}}>
                {user?.role || 'user'}
              </span>
            </div>
            <div>
              <p className="text-xs font-medium" style={{ color: 'var(--color-muted)' }}>Target Role</p>
              <p className="font-medium text-lg">{user?.targetRole}</p>
            </div>
          </div>
        </div>

        <div>
          <ChangePassword />
        </div>
      </div>
    </div>
  );
}
