import React from 'react';
import { Database, Users, Calendar, CheckSquare, LogOut } from 'lucide-react';

interface SidebarProps {
  activeTab: 'dashboard' | 'users' | 'events' | 'attendance';
  setActiveTab: (tab: 'dashboard' | 'users' | 'events' | 'attendance') => void;
  currentUser: { email: string | null } | null;
  handleLogout: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  currentUser,
  handleLogout,
}) => {
  return (
    <aside className="sidebar">
      <div className="logo-section">
        <div className="logo-icon">
          <img src="src\assets\مارافرام.jpg" alt="SEF_Logo" style={{ width: '50px', height: '50px', borderRadius: '50%' }} />
        </div>
        <span className="logo-text">SEF_Aftkad</span>
      </div>

      <nav className="nav-links">
        <button 
          className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
          onClick={() => setActiveTab('dashboard')}
        >
          <Database size={18} />
          <span>Dashboard</span>
        </button>

        <button 
          className={`nav-item ${activeTab === 'users' ? 'active' : ''}`}
          onClick={() => setActiveTab('users')}
        >
          <Users size={18} />
          <span>User Profiles</span>
        </button>

        <button 
          className={`nav-item ${activeTab === 'events' ? 'active' : ''}`}
          onClick={() => setActiveTab('events')}
        >
          <Calendar size={18} />
          <span>Events</span>
        </button>

        <button 
          className={`nav-item ${activeTab === 'attendance' ? 'active' : ''}`}
          onClick={() => setActiveTab('attendance')}
        >
          <CheckSquare size={18} />
          <span>Take Attendance</span>
        </button>
      </nav>

      {currentUser && (
        <div className="sidebar-footer">
          <div style={{ marginBottom: '12px', fontSize: '0.8rem', opacity: 0.7 }}>
            Logged in as:<br/>
            <strong style={{ color: '#fff' }}>{currentUser.email || 'Admin'}</strong>
          </div>
          <button className="nav-item" onClick={handleLogout} style={{ color: '#f87171' }}>
            <LogOut size={18} />
            <span>Sign Out</span>
          </button>
        </div>
      )}
    </aside>
  );
};
