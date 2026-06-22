import React from 'react';
import { Users as UsersIcon, Calendar as CalendarIcon, CheckSquare as CheckSquareIcon, Plus } from 'lucide-react';
import type { UserProfile, EventItem } from '../types';

interface DashboardViewProps {
  totalUsersCount: number;
  totalEventsCount: number;
  currentEventPresent: number;
  users: UserProfile[];
  events: EventItem[];
  selectedEventId: string;
  setSelectedEventId: (val: string) => void;
  currentEventAbsent: number;
  presentServants: number;
  absentServants: number;
  presentServed: number;
  absentServed: number;
  setActiveTab: (tab: 'dashboard' | 'users' | 'events' | 'attendance') => void;
  setShowAddUserModal: (val: boolean) => void;
  setShowAddEventModal: (val: boolean) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  totalUsersCount,
  totalEventsCount,
  currentEventPresent,
  users,
  events,
  selectedEventId,
  setSelectedEventId,
  currentEventAbsent,
  presentServants,
  absentServants,
  presentServed,
  absentServed,
  setActiveTab,
  setShowAddUserModal,
  setShowAddEventModal,
}) => {
  return (
    <>
      <div className="page-header">
        <div className="page-title-area">
          <h1>Overview Dashboard</h1>
          <p className="page-subtitle">Track your general metrics and stats</p>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">
            <UsersIcon size={28} />
          </div>
          <div>
            <div className="stat-value">{totalUsersCount}</div>
            <div className="stat-label">Total Users</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <CalendarIcon size={28} />
          </div>
          <div>
            <div className="stat-value">{totalEventsCount}</div>
            <div className="stat-label">Events Managed</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <CheckSquareIcon size={28} />
          </div>
          <div>
            <div className="stat-value">
              {events.length > 0 ? (users.length > 0 ? `${Math.round((currentEventPresent / users.length) * 100)}%` : '0%') : 'N/A'}
            </div>
            <div className="stat-label">Latest Event Attendance</div>
          </div>
        </div>
      </div>

      {/* Quick Actions Panel */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Quick Actions</h3>
        </div>
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
          <button className="btn btn-primary" onClick={() => { setActiveTab('users'); setShowAddUserModal(true); }}>
            <Plus size={18} /> Add User Profile
          </button>
          <button className="btn btn-primary" onClick={() => { setActiveTab('events'); setShowAddEventModal(true); }}>
            <Plus size={18} /> Create New Event
          </button>
          <button className="btn btn-secondary" onClick={() => setActiveTab('attendance')}>
            <CheckSquareIcon size={18} /> Mark Attendance
          </button>
        </div>
      </div>

      {/* Latest Event Card */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Latest Attendance Statistics</h3>
        </div>
        {events.length > 0 ? (
          <div>
            <div style={{ marginBottom: '20px' }}>
              <label className="form-label" style={{ marginBottom: '8px' }}>Select Event to View Stats</label>
              <select 
                className="form-control" 
                value={selectedEventId} 
                onChange={(e) => setSelectedEventId(e.target.value)}
                style={{ maxWidth: '350px' }}
              >
                {events.map(ev => (
                  <option key={ev.id} value={ev.id}>{ev.name} ({ev.date})</option>
                ))}
              </select>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', textAlign: 'center' }}>
              <div style={{ padding: '16px', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)' }}>
                <div style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--success)', marginBottom: '8px' }}>{currentEventPresent}</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: '600', marginBottom: '12px' }}>Present (حاضر)</div>
                <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '8px', display: 'flex', justifyContent: 'space-around', fontSize: '0.8rem' }}>
                  <div><strong>{presentServants}</strong> خادم</div>
                  <div><strong>{presentServed}</strong> مخدوم</div>
                </div>
              </div>
              <div style={{ padding: '16px', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)' }}>
                <div style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--danger)', marginBottom: '8px' }}>{currentEventAbsent}</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: '600', marginBottom: '12px' }}>Absent (غائب)</div>
                <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '8px', display: 'flex', justifyContent: 'space-around', fontSize: '0.8rem' }}>
                  <div><strong>{absentServants}</strong> خادم</div>
                  <div><strong>{absentServed}</strong> مخدوم</div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>
            No events found. Go to the Events tab to create your first event!
          </div>
        )}
      </div>
    </>
  );
};
