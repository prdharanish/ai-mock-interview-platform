import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import api from '../../utils/api';
import ChangePassword from '../../components/ChangePassword';

export default function AdminDashboard() {
  const { user } = useSelector((s) => s.auth);
  const [activeTab, setActiveTab] = useState('analytics');
  
  const [analytics, setAnalytics] = useState(null);
  const [users, setUsers] = useState([]);
  const [questions, setQuestions] = useState([]);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // New question form state
  const [newQuestion, setNewQuestion] = useState({ title: '', content: '', category: 'DSA', role: 'Software Engineer', difficulty: 'Medium' });

  useEffect(() => {
    if (user?.role === 'admin') {
      fetchData(activeTab);
    }
  }, [activeTab, user]);

  const fetchData = async (tab) => {
    setLoading(true);
    setError(null);
    try {
      if (tab === 'analytics' && !analytics) {
        const res = await api.get('/admin/analytics');
        setAnalytics(res.data);
      } else if (tab === 'users' && users.length === 0) {
        const res = await api.get('/admin/users');
        setUsers(res.data);
      } else if (tab === 'questions' && questions.length === 0) {
        const res = await api.get('/admin/questions');
        setQuestions(res.data);
      }
    } catch (err) {
      if (err.response?.status === 403) {
        setError('Access Denied: You do not have admin privileges.');
      } else {
        setError('Failed to fetch data.');
      }
    }
    setLoading(false);
  };

  const handleAddQuestion = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/admin/questions', newQuestion);
      setQuestions([res.data, ...questions]);
      setNewQuestion({ title: '', content: '', category: 'DSA', role: 'Software Engineer', difficulty: 'Medium' });
    } catch (err) {
      setError('Failed to add question');
    }
  };

  const handleDeleteQuestion = async (id) => {
    try {
      await api.delete(`/admin/questions/${id}`);
      setQuestions(questions.filter(q => q._id !== id));
    } catch (err) {
      setError('Failed to delete question');
    }
  };

  if (user?.role !== 'admin') {
    return (
      <div className="p-8 text-center">
        <h2 className="text-2xl font-bold text-red-500 mb-4">Access Denied</h2>
        <p>You must be an administrator to view this page.</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-4 sm:space-y-6 animate-fadeInUp">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold gradient-text">Admin Dashboard</h1>
          <p className="text-sm" style={{ color: 'var(--color-muted)' }}>Manage platform data and users</p>
        </div>
      </div>

      {error && (
        <div className="p-4 mb-4 rounded-lg bg-red-900/20 border border-red-500/30 text-red-400">
          {error}
        </div>
      )}

      {/* Tabs */}
      <div className="flex rounded-lg overflow-x-auto mb-4 sm:mb-6" style={{ background: 'var(--color-surface2)', width: 'fit-content', maxWidth: '100%' }}>
        {['analytics', 'users', 'questions', 'settings'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className="px-4 sm:px-6 py-2.5 text-sm font-medium transition-all capitalize whitespace-nowrap"
            style={{
              background: activeTab === tab ? 'linear-gradient(135deg,#58a6ff,#7c3aed)' : 'transparent',
              color: activeTab === tab ? 'white' : 'var(--color-muted)',
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {loading && <p className="text-center py-8" style={{ color: 'var(--color-muted)' }}>Loading...</p>}

      {/* Analytics Tab */}
      {!loading && activeTab === 'analytics' && analytics && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <div className="card text-center p-6">
              <h3 className="text-lg mb-2" style={{ color: 'var(--color-muted)' }}>Total Users</h3>
              <p className="text-4xl font-bold text-white">{analytics.totalUsers}</p>
            </div>
            <div className="card text-center p-6">
              <h3 className="text-lg mb-2" style={{ color: 'var(--color-muted)' }}>Total Questions</h3>
              <p className="text-4xl font-bold text-white">{analytics.totalQuestions}</p>
            </div>
            <div className="card text-center p-6">
              <h3 className="text-lg mb-2" style={{ color: 'var(--color-muted)' }}>Total Sessions</h3>
              <p className="text-4xl font-bold text-white">{analytics.totalSessions}</p>
            </div>
            <div className="card text-center p-6">
              <h3 className="text-lg mb-2" style={{ color: 'var(--color-muted)' }}>Average Score</h3>
              <p className="text-4xl font-bold text-green-400">{analytics.averageScore}</p>
            </div>
          </div>

          <div className="card">
            <h3 className="text-xl font-bold mb-4">Breakdown by Target Role</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {analytics.roleBreakdown && Object.keys(analytics.roleBreakdown).length > 0 ? (
                Object.entries(analytics.roleBreakdown).map(([roleName, count]) => (
                  <div key={roleName} className="p-4 rounded-lg flex items-center justify-between" style={{ background: 'var(--color-surface2)', border: '1px solid var(--color-border)' }}>
                    <span className="font-medium">{roleName}</span>
                    <span className="badge badge-blue">{count} {count === 1 ? 'user' : 'users'}</span>
                  </div>
                ))
              ) : (
                <p className="text-sm col-span-3 text-center" style={{ color: 'var(--color-muted)' }}>No role data available</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Users Tab */}
      {!loading && activeTab === 'users' && (
        <div className="card overflow-x-auto">
          {/* Desktop table — hidden on small screens */}
          <table className="w-full text-left border-collapse hidden md:table">
            <thead>
              <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
                <th className="p-3 text-sm" style={{ color: 'var(--color-muted)' }}>Name</th>
                <th className="p-3 text-sm" style={{ color: 'var(--color-muted)' }}>Email</th>
                <th className="p-3 text-sm" style={{ color: 'var(--color-muted)' }}>Role</th>
                <th className="p-3 text-sm" style={{ color: 'var(--color-muted)' }}>Target Role</th>
                <th className="p-3 text-sm" style={{ color: 'var(--color-muted)' }}>Last Login</th>
                <th className="p-3 text-sm" style={{ color: 'var(--color-muted)' }}>Joined</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u._id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                  <td className="p-3">{u.name}</td>
                  <td className="p-3">{u.email}</td>
                  <td className="p-3">
                    <span className="badge" style={u.role === 'admin' ? { background: 'rgba(88,166,255,0.2)', color: '#58a6ff' } : {}}>
                      {u.role}
                    </span>
                  </td>
                  <td className="p-3">{u.targetRole}</td>
                  <td className="p-3">{u.lastLogin ? new Date(u.lastLogin).toLocaleString() : 'Never'}</td>
                  <td className="p-3">{new Date(u.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {/* Mobile stacked cards — visible on small screens */}
          <div className="md:hidden space-y-3">
            {users.map(u => (
              <div key={u._id} className="p-3 rounded-lg space-y-1" style={{ background: 'var(--color-surface2)', border: '1px solid var(--color-border)' }}>
                <div className="flex items-center justify-between">
                  <p className="font-medium">{u.name}</p>
                  <span className="badge text-xs" style={u.role === 'admin' ? { background: 'rgba(88,166,255,0.2)', color: '#58a6ff' } : {}}>{u.role}</span>
                </div>
                <p className="text-xs" style={{ color: 'var(--color-muted)' }}>{u.email}</p>
                <div className="text-xs" style={{ color: 'var(--color-muted)' }}>
                  <span className="block">Target: {u.targetRole}</span>
                  <span className="block">Last Login: {u.lastLogin ? new Date(u.lastLogin).toLocaleString() : 'Never'}</span>
                </div>
                <div className="flex items-center justify-between text-xs pt-1 border-t border-[rgba(255,255,255,0.05)]" style={{ color: 'var(--color-muted)' }}>
                  <span>Joined</span>
                  <span>{new Date(u.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Questions Tab */}
      {!loading && activeTab === 'questions' && (
        <div className="space-y-6">
          <div className="card">
            <h3 className="text-xl font-bold mb-4">Add New Question</h3>
            <form onSubmit={handleAddQuestion} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--color-muted)' }}>Title</label>
                  <input className="input" value={newQuestion.title} onChange={e => setNewQuestion({...newQuestion, title: e.target.value})} required />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--color-muted)' }}>Category</label>
                  <select className="input" value={newQuestion.category} onChange={e => setNewQuestion({...newQuestion, category: e.target.value})}>
                    <option value="DSA">DSA</option>
                    <option value="System Design">System Design</option>
                    <option value="HR">HR</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--color-muted)' }}>Target Role</label>
                  <input className="input" value={newQuestion.role} onChange={e => setNewQuestion({...newQuestion, role: e.target.value})} />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--color-muted)' }}>Difficulty</label>
                  <select className="input" value={newQuestion.difficulty} onChange={e => setNewQuestion({...newQuestion, difficulty: e.target.value})}>
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--color-muted)' }}>Content</label>
                <textarea className="input min-h-[100px]" value={newQuestion.content} onChange={e => setNewQuestion({...newQuestion, content: e.target.value})} required />
              </div>
              <button type="submit" className="btn-primary">Add Question</button>
            </form>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-bold">Question Bank</h3>
            {questions.map(q => (
              <div key={q._id} className="card flex flex-col sm:flex-row justify-between items-start gap-3">
                <div className="min-w-0">
                  <h4 className="font-bold text-base sm:text-lg">{q.title}</h4>
                  <div className="flex gap-2 mt-2">
                    <span className="badge">{q.category}</span>
                    <span className="badge">{q.difficulty}</span>
                  </div>
                  <p className="mt-2 text-sm whitespace-pre-wrap break-words" style={{ color: 'var(--color-muted)' }}>{q.content}</p>
                </div>
                <button onClick={() => handleDeleteQuestion(q._id)} className="badge badge-red cursor-pointer flex-shrink-0">Delete</button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Settings Tab */}
      {!loading && activeTab === 'settings' && (
        <div className="flex justify-start">
          <ChangePassword />
        </div>
      )}
    </div>
  );
}
