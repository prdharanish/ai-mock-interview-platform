import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, BarChart, Bar } from 'recharts';
import api from '../../utils/api';

const StatCard = ({ label, value, icon, color }) => (
  <div className="card flex items-center gap-4">
    <div className="text-3xl w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${color}20`, border: `1px solid ${color}40` }}>{icon}</div>
    <div>
      <p className="text-2xl font-bold">{value}</p>
      <p className="text-xs mt-0.5" style={{ color: 'var(--color-muted)' }}>{label}</p>
    </div>
  </div>
);

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) {
    return (
      <div className="card p-3 text-sm">
        <p style={{ color: 'var(--color-muted)' }}>{label}</p>
        <p className="font-bold" style={{ color: 'var(--color-accent)' }}>Score: {payload[0].value}/10</p>
      </div>
    );
  }
  return null;
};

export default function Dashboard() {
  const { user } = useSelector((s) => s.auth);
  const [trends, setTrends] = useState([]);
  const [weakAreas, setWeakAreas] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [t, w, s] = await Promise.all([
          api.get('/analytics/trends'),
          api.get('/analytics/weak-areas'),
          api.get('/analytics/sessions'),
        ]);
        setTrends(t.data);
        setWeakAreas(w.data);
        setSessions(s.data);
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    };
    load();
  }, []);

  const completed = sessions.filter((s) => s.status === 'Completed').length;
  const avgScore = trends.length ? (trends.reduce((a, t) => a + t.score, 0) / trends.length).toFixed(1) : '—';
  const weakest = weakAreas[0]?.category || '—';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6 sm:space-y-8 animate-fadeInUp">
      {/* Welcome */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold">Welcome back, <span className="gradient-text">{user?.name?.split(' ')[0]}</span> 👋</h1>
        <p className="mt-1 text-xs sm:text-sm" style={{ color: 'var(--color-muted)' }}>Targeting <span style={{ color: 'var(--color-accent)' }}>{user?.targetRole}</span> · {user?.techStack?.join(', ') || 'No stack set'}</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <StatCard label="Sessions Completed" value={completed} icon="🎯" color="#58a6ff" />
        <StatCard label="Avg Score" value={avgScore} icon="⭐" color="#7c3aed" />
        <StatCard label="Total Answers" value={sessions.length} icon="📝" color="#3fb950" />
        <StatCard label="Weakest Area" value={weakest} icon="⚠️" color="#d29922" />
      </div>

      {/* Charts */}
      {loading ? (
        <div className="flex items-center justify-center h-48" style={{ color: 'var(--color-muted)' }}>Loading analytics…</div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Score Trend */}
          <div className="card space-y-4">
            <h2 className="font-semibold text-lg">Score Trend</h2>
            {trends.length === 0 ? (
              <div className="h-48 flex items-center justify-center text-sm" style={{ color: 'var(--color-muted)' }}>Complete sessions to see trend data</div>
            ) : (
              <ResponsiveContainer width="100%" height={240}>
                <LineChart data={trends}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                  <XAxis dataKey="date" tick={{ fill: 'var(--color-muted)', fontSize: 11 }} />
                  <YAxis domain={[0, 10]} tick={{ fill: 'var(--color-muted)', fontSize: 11 }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Line type="monotone" dataKey="score" stroke="#58a6ff" strokeWidth={2} dot={{ fill: '#58a6ff', r: 4 }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* Weak Areas Bar */}
          <div className="card space-y-4">
            <h2 className="font-semibold text-lg">Performance by Category</h2>
            {weakAreas.length === 0 ? (
              <div className="h-48 flex items-center justify-center text-sm" style={{ color: 'var(--color-muted)' }}>Submit answers to see category breakdown</div>
            ) : (
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={weakAreas} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                  <XAxis type="number" domain={[0, 10]} tick={{ fill: 'var(--color-muted)', fontSize: 11 }} />
                  <YAxis dataKey="category" type="category" tick={{ fill: 'var(--color-muted)', fontSize: 11 }} width={100} />
                  <Tooltip formatter={(v) => [`${v}/10`, 'Avg Score']} contentStyle={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)' }} />
                  <Bar dataKey="avgScore" fill="#7c3aed" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      )}

      {/* Recent Sessions */}
      <div className="card space-y-4">
        <h2 className="font-semibold text-lg">Recent Sessions</h2>
        {sessions.length === 0 ? (
          <p className="text-sm" style={{ color: 'var(--color-muted)' }}>No sessions yet. Start your first mock interview!</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
                  {['Role', 'Status', 'Score', 'Date'].map((h) => (
                    <th key={h} className="text-left pb-2 pr-4 font-medium text-xs" style={{ color: 'var(--color-muted)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sessions.slice(0, 8).map((s) => (
                  <tr key={s._id} style={{ borderBottom: '1px solid rgba(48,54,61,0.5)' }}>
                    <td className="py-2.5 pr-4">{s.role}</td>
                    <td className="py-2.5 pr-4">
                      <span className={`badge ${s.status === 'Completed' ? 'badge-green' : 'badge-yellow'}`}>{s.status}</span>
                    </td>
                    <td className="py-2.5 pr-4">{s.overallScore != null ? `${s.overallScore}/10` : '—'}</td>
                    <td className="py-2.5" style={{ color: 'var(--color-muted)' }}>{new Date(s.startedAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
