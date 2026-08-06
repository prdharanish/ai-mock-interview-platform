import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/authSlice';

export default function Navbar({ activePage, setActivePage }) {
  const { user } = useSelector((s) => s.auth);
  const dispatch = useDispatch();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'interview', label: 'Interview', icon: '🎯' },
    { id: 'questions', label: 'Question Bank', icon: '📚' },
    { id: 'coding', label: 'Coding Lab', icon: '💻' },
    { id: 'profile', label: 'Profile', icon: '👤' },
  ];
  if (user?.role === 'admin') {
    navItems.push({ id: 'admin', label: 'Admin Dashboard', icon: '⚙️' });
  }

  const handleNav = (id) => {
    setActivePage(id);
    setMobileOpen(false);
  };

  return (
    <nav className="glass sticky top-0 z-50" style={{ borderBottom: '1px solid var(--color-border)', borderLeft: 'none', borderRight: 'none', borderTop: 'none', borderRadius: 0 }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-14">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2">
            <span className="text-xl">⚡</span>
            <span className="font-bold gradient-text text-lg">InterviewPro</span>
          </div>
          {/* Desktop nav items */}
          <div className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNav(item.id)}
                className="px-3 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5"
                style={{
                  background: activePage === item.id ? 'rgba(88,166,255,0.15)' : 'transparent',
                  color: activePage === item.id ? 'var(--color-accent)' : 'var(--color-muted)',
                  border: activePage === item.id ? '1px solid rgba(88,166,255,0.3)' : '1px solid transparent',
                  cursor: 'pointer',
                }}
              >
                <span>{item.icon}</span>
                {item.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium">{user?.name}</p>
            <p className="text-xs" style={{ color: 'var(--color-muted)' }}>{user?.targetRole}</p>
          </div>
          <button
            onClick={() => dispatch(logout())}
            className="badge badge-red text-xs cursor-pointer hidden sm:inline-flex"
            style={{ cursor: 'pointer' }}
          >Sign Out</button>

          {/* Hamburger button — visible below lg */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden flex flex-col justify-center items-center w-9 h-9 rounded-lg transition-colors"
            style={{ background: mobileOpen ? 'var(--color-surface2)' : 'transparent', border: '1px solid var(--color-border)', cursor: 'pointer' }}
            aria-label="Toggle navigation menu"
          >
            <span className="block w-4 h-0.5 rounded-full transition-all" style={{ background: 'var(--color-muted)', transform: mobileOpen ? 'rotate(45deg) translateY(3px)' : 'none' }} />
            <span className="block w-4 h-0.5 rounded-full my-0.5 transition-all" style={{ background: 'var(--color-muted)', opacity: mobileOpen ? 0 : 1 }} />
            <span className="block w-4 h-0.5 rounded-full transition-all" style={{ background: 'var(--color-muted)', transform: mobileOpen ? 'rotate(-45deg) translateY(-3px)' : 'none' }} />
          </button>
        </div>
      </div>

      {/* Mobile dropdown menu */}
      {mobileOpen && (
        <div className="lg:hidden border-t animate-fadeInUp" style={{ borderColor: 'var(--color-border)', background: 'var(--color-surface)' }}>
          <div className="max-w-7xl mx-auto px-4 py-3 space-y-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNav(item.id)}
                className="w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium transition-all flex items-center gap-2"
                style={{
                  background: activePage === item.id ? 'rgba(88,166,255,0.15)' : 'transparent',
                  color: activePage === item.id ? 'var(--color-accent)' : 'var(--color-muted)',
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                <span>{item.icon}</span>
                {item.label}
              </button>
            ))}
            {/* Mobile user info + sign out */}
            <div className="pt-2 mt-2 flex items-center justify-between" style={{ borderTop: '1px solid var(--color-border)' }}>
              <div>
                <p className="text-sm font-medium">{user?.name}</p>
                <p className="text-xs" style={{ color: 'var(--color-muted)' }}>{user?.targetRole}</p>
              </div>
              <button
                onClick={() => { dispatch(logout()); setMobileOpen(false); }}
                className="badge badge-red text-xs cursor-pointer"
                style={{ cursor: 'pointer' }}
              >Sign Out</button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
