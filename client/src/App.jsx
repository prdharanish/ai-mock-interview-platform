import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import AuthPage from './pages/Auth/AuthPage';
import AdminLogin from './pages/Auth/AdminLogin';
import Dashboard from './pages/Dashboard/Dashboard';
import InterviewSession from './pages/Interview/InterviewSession';
import QuestionBank from './pages/QuestionBank/QuestionBank';
import CodingSimulator from './pages/CodingSimulator/CodingSimulator';
import AdminDashboard from './pages/Admin/AdminDashboard';
import ProfilePage from './pages/Profile/ProfilePage';
import Navbar from './components/Navbar';

export default function App() {
  const dispatch = useDispatch();
  const { token, user } = useSelector((s) => s.auth);
  const [activePage, setActivePage] = useState('dashboard');
  const [showAdminLogin, setShowAdminLogin] = useState(false);

  // Handle admin login success — update Redux store directly
  const handleAdminLoggedIn = ({ token: newToken, user: adminUser }) => {
    // Dispatch a synthetic login success to update Redux state
    dispatch({ type: 'auth/login/fulfilled', payload: { token: newToken, user: adminUser } });
    setShowAdminLogin(false);
    setActivePage('admin');
  };

  if (!token) {
    if (showAdminLogin) {
      return (
        <AdminLogin
          onSwitchToUser={() => setShowAdminLogin(false)}
          onAdminLoggedIn={handleAdminLoggedIn}
        />
      );
    }
    return <AuthPage onSwitchToAdmin={() => setShowAdminLogin(true)} />;
  }

  const pages = {
    dashboard: <Dashboard />,
    interview: <InterviewSession />,
    questions: <QuestionBank />,
    coding: <CodingSimulator />,
    profile: <ProfilePage />,
    admin: user?.role === 'admin' ? <AdminDashboard /> : <Dashboard />,
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-bg)' }}>
      <Navbar activePage={activePage} setActivePage={setActivePage} />
      <main>{pages[activePage] || <Dashboard />}</main>
    </div>
  );
}
