import React from 'react';
import { Database, Users, Calendar, CheckSquare, LogOut, X } from 'lucide-react';

interface SidebarProps {
  activeTab: 'dashboard' | 'users' | 'events' | 'attendance';
  setActiveTab: (tab: 'dashboard' | 'users' | 'events' | 'attendance') => void;
  currentUser: { email: string | null } | null;
  handleLogout: () => void;
  isOpen: boolean;
  setIsOpen: (val: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  currentUser,
  handleLogout,
  isOpen,
  setIsOpen,
}) => {
  return (
    <>
      {isOpen && <div className="sidebar-overlay" onClick={() => setIsOpen(false)}></div>}
      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="logo-section" style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div className="logo-icon">
              <img src="/logo.jpg" alt="SEF_Logo" style={{ width: '50px', height: '50px', borderRadius: '50%' }} />
            </div>
            <span className="logo-text">SEF_Aftkad</span>
          </div>
          <button className="close-btn" onClick={() => setIsOpen(false)} aria-label="Close menu">
            <X size={20} />
          </button>
        </div>

        <nav className="nav-links">
          <button 
            className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => { setActiveTab('dashboard'); setIsOpen(false); }}
          >
            <Database size={18} />
            <span>Dashboard</span>
          </button>

          <button 
            className={`nav-item ${activeTab === 'users' ? 'active' : ''}`}
            onClick={() => { setActiveTab('users'); setIsOpen(false); }}
          >
            <Users size={18} />
            <span>User Profiles</span>
          </button>

          <button 
            className={`nav-item ${activeTab === 'events' ? 'active' : ''}`}
            onClick={() => { setActiveTab('events'); setIsOpen(false); }}
          >
            <Calendar size={18} />
            <span>Events</span>
          </button>

          <button 
            className={`nav-item ${activeTab === 'attendance' ? 'active' : ''}`}
            onClick={() => { setActiveTab('attendance'); setIsOpen(false); }}
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
            <button className="nav-item" onClick={() => { handleLogout(); setIsOpen(false); }} style={{ color: '#f87171' }}>
              <LogOut size={18} />
              <span>Sign Out</span>
            </button>
          </div>
        )}
      </aside>
    </>
  );
};
