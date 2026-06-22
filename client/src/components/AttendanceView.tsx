import React from 'react';
import { Download, Search } from 'lucide-react';
import type { EventItem, UserProfile, AttendanceRecord } from '../types';

interface AttendanceViewProps {
  events: EventItem[];
  selectedEventId: string;
  setSelectedEventId: (val: string) => void;
  handleExportCSV: () => void;
  userSearchQuery: string;
  setUserSearchQuery: (val: string) => void;
  filteredUsers: UserProfile[];
  currentEventAttendance: AttendanceRecord;
  markAttendance: (userId: string, status: 'Present' | 'Absent') => void;
}

export const AttendanceView: React.FC<AttendanceViewProps> = ({
  events,
  selectedEventId,
  setSelectedEventId,
  handleExportCSV,
  userSearchQuery,
  setUserSearchQuery,
  filteredUsers,
  currentEventAttendance,
  markAttendance,
}) => {
  return (
    <>
      <div className="page-header">
        <div className="page-title-area">
          <h1>Record Event Attendance</h1>
          <p className="page-subtitle">Select an event and mark user presence</p>
        </div>
        {selectedEventId && (
          <button className="btn btn-secondary" onClick={handleExportCSV}>
            <Download size={18} /> Export Attendance Report
          </button>
        )}
      </div>

      {/* Event Picker Selector */}
      <div className="card">
        <div className="form-group" style={{ marginBottom: 0 }}>
          <label className="form-label" style={{ marginBottom: '8px' }}>Active Event</label>
          {events.length > 0 ? (
            <select 
              className="form-control" 
              value={selectedEventId} 
              onChange={(e) => setSelectedEventId(e.target.value)}
              style={{ maxWidth: '450px' }}
            >
              {events.map(ev => (
                <option key={ev.id} value={ev.id}>{ev.name} ({ev.date})</option>
              ))}
            </select>
          ) : (
            <div style={{ color: 'var(--danger)', fontWeight: '600' }}>
              No events exist. Please create an event first.
            </div>
          )}
        </div>
      </div>

      {selectedEventId && (
        <>
          {/* Search in Attendance */}
          <div className="card" style={{ padding: '16px' }}>
            <div style={{ position: 'relative' }}>
              <Search size={18} style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--text-muted)' }} />
              <input 
                type="text" 
                className="form-control" 
                style={{ paddingLeft: '40px' }}
                placeholder="Quick search user to mark..." 
                value={userSearchQuery}
                onChange={(e) => setUserSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Grid checklist */}
          <div className="attendance-grid">
            {filteredUsers.length > 0 ? (
              filteredUsers.map(user => {
                const userStatus = currentEventAttendance[user.id];
                return (
                  <div key={user.id} className="attendance-card">
                    <div className="user-profile-summary">
                      <span className="user-profile-name">{user.name}</span>
                      <span className="user-profile-detail">ID: {user.memberId} | Dept: {user.department}</span>
                    </div>
                    
                    <div className="attendance-actions">
                      <button 
                        className={`btn-att ${userStatus === 'Present' ? 'active-present' : ''}`}
                        onClick={() => markAttendance(user.id, 'Present')}
                      >
                        Present (حاضر)
                      </button>
                      <button 
                        className={`btn-att ${(!userStatus || userStatus === 'Absent') ? 'active-absent' : ''}`}
                        onClick={() => markAttendance(user.id, 'Absent')}
                      >
                        Absent (غائب)
                      </button>
                    </div>
                  </div>
                );
              })
            ) : (
              <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px', color: 'var(--text-secondary)', border: '1px dashed var(--border-color)', borderRadius: 'var(--radius-lg)' }}>
                No users found.
              </div>
            )}
          </div>
        </>
      )}
    </>
  );
};
