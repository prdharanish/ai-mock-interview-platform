import React, { useState, useEffect } from 'react';
import api from '../../utils/api';

const CATEGORIES = ['All', 'DSA', 'System Design', 'HR'];
const DIFFICULTIES = ['All', 'Easy', 'Medium', 'Hard'];

export default function QuestionBank() {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({ category: '', difficulty: '', search: '' });
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', content: '', category: 'DSA', difficulty: 'Medium', role: '', company: '' });
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filter.category) params.category = filter.category;
      if (filter.difficulty) params.difficulty = filter.difficulty;
      if (filter.search) params.search = filter.search;
      const res = await api.get('/questions', { params });
      setQuestions(res.data);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, [filter]);

  const handleCreate = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = { ...form, company: form.company ? form.company.split(',').map((c) => c.trim()) : [] };
      await api.post('/questions', payload);
      setShowForm(false);
      setForm({ title: '', content: '', category: 'DSA', difficulty: 'Medium', role: '', company: '' });
      load();
    } catch (e) { console.error(e); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this question?')) return;
    try {
      await api.delete(`/questions/${id}`);
      setQuestions((q) => q.filter((x) => x._id !== id));
    } catch (e) { console.error(e); }
  };

  const diffColor = { Easy: 'badge-green', Medium: 'badge-yellow', Hard: 'badge-red' };
  const catColor = { DSA: 'badge-blue', 'System Design': 'badge-purple', HR: 'badge-yellow' };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-4 sm:space-y-6 animate-fadeInUp">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Question Bank</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--color-muted)' }}>{questions.length} questions available</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary">+ Add Question</button>
      </div>

      {/* Add Question Form */}
      {showForm && (
        <div className="card animate-fadeInUp">
          <h2 className="font-semibold mb-4">New Question</h2>
          <form onSubmit={handleCreate} className="space-y-3">
            <input className="input" placeholder="Question title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
            <textarea className="input" rows={4} placeholder="Question content / description" value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} required />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <select className="input" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                {['DSA', 'System Design', 'HR'].map((c) => <option key={c}>{c}</option>)}
              </select>
              <select className="input" value={form.difficulty} onChange={(e) => setForm({ ...form, difficulty: e.target.value })}>
                {['Easy', 'Medium', 'Hard'].map((d) => <option key={d}>{d}</option>)}
              </select>
            </div>
            <input className="input" placeholder="Role (e.g. Frontend Developer)" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} />
            <input className="input" placeholder="Companies (comma separated: Google, Amazon)" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} />
            <div className="flex gap-3">
              <button type="submit" className="btn-primary" disabled={saving}>{saving ? 'Saving…' : 'Save Question'}</button>
              <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 rounded-lg text-sm" style={{ background: 'var(--color-surface2)', color: 'var(--color-muted)', border: '1px solid var(--color-border)', cursor: 'pointer' }}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-center">
        <input
          className="input"
          style={{ maxWidth: '100%' }}
          placeholder="🔍  Search questions…"
          value={filter.search}
          onChange={(e) => setFilter({ ...filter, search: e.target.value })}
        />
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((c) => (
            <button key={c} onClick={() => setFilter({ ...filter, category: c === 'All' ? '' : c })}
              className="badge transition-all"
              style={{
                cursor: 'pointer',
                background: (filter.category === c || (c === 'All' && !filter.category)) ? 'rgba(88,166,255,0.2)' : 'var(--color-surface2)',
                color: (filter.category === c || (c === 'All' && !filter.category)) ? 'var(--color-accent)' : 'var(--color-muted)',
                border: `1px solid ${(filter.category === c || (c === 'All' && !filter.category)) ? '#58a6ff' : 'var(--color-border)'}`,
              }}
            >{c}</button>
          ))}
        </div>
        <div className="flex gap-2">
          {DIFFICULTIES.map((d) => (
            <button key={d} onClick={() => setFilter({ ...filter, difficulty: d === 'All' ? '' : d })}
              className="badge transition-all"
              style={{
                cursor: 'pointer',
                background: (filter.difficulty === d || (d === 'All' && !filter.difficulty)) ? 'rgba(124,58,237,0.2)' : 'var(--color-surface2)',
                color: (filter.difficulty === d || (d === 'All' && !filter.difficulty)) ? '#a78bfa' : 'var(--color-muted)',
                border: `1px solid ${(filter.difficulty === d || (d === 'All' && !filter.difficulty)) ? '#7c3aed' : 'var(--color-border)'}`,
              }}
            >{d}</button>
          ))}
        </div>
      </div>

      {/* Question List */}
      {loading ? (
        <div className="flex items-center justify-center h-32" style={{ color: 'var(--color-muted)' }}>Loading questions…</div>
      ) : questions.length === 0 ? (
        <div className="card text-center py-12" style={{ color: 'var(--color-muted)' }}>
          <p className="text-4xl mb-3">📭</p>
          <p>No questions found. Add one or adjust filters.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {questions.map((q) => (
            <div key={q._id} className="card flex items-start justify-between gap-4 hover:border-opacity-60 transition-all" style={{ borderColor: 'var(--color-border)' }}>
              <div className="flex-1 space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-medium">{q.title}</h3>
                  <span className={`badge ${catColor[q.category] || 'badge-blue'}`}>{q.category}</span>
                  <span className={`badge ${diffColor[q.difficulty] || 'badge-yellow'}`}>{q.difficulty}</span>
                </div>
                <p className="text-sm line-clamp-2" style={{ color: 'var(--color-muted)' }}>{q.content}</p>
                {(q.company?.length > 0 || q.role) && (
                  <div className="flex flex-wrap gap-1.5">
                    {q.role && <span className="text-xs px-2 py-0.5 rounded" style={{ background: 'var(--color-surface2)', color: 'var(--color-muted)' }}>🎯 {q.role}</span>}
                    {q.company?.map((c) => <span key={c} className="text-xs px-2 py-0.5 rounded" style={{ background: 'var(--color-surface2)', color: 'var(--color-muted)' }}>🏢 {c}</span>)}
                  </div>
                )}
              </div>
              <button onClick={() => handleDelete(q._id)} className="badge badge-red flex-shrink-0 text-xs" style={{ cursor: 'pointer' }}>Delete</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
