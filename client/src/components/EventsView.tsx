import React from 'react';
import { Plus, Calendar, ChevronRight } from 'lucide-react';
import type { EventItem } from '../types';

interface EventsViewProps {
  events: EventItem[];
  setSelectedEventId: (val: string) => void;
  setActiveTab: (tab: 'dashboard' | 'users' | 'events' | 'attendance') => void;
  setShowAddEventModal: (val: boolean) => void;
}

export const EventsView: React.FC<EventsViewProps> = ({
  events,
  setSelectedEventId,
  setActiveTab,
  setShowAddEventModal,
}) => {
  return (
    <>
      <div className="page-header">
        <div className="page-title-area">
          <h1>Events Management</h1>
          <p className="page-subtitle">Create and organize events list</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowAddEventModal(true)}>
          <Plus size={18} /> Create Event
        </button>
      </div>

      <div className="card">
        <div className="table-wrapper">
          <table className="table">
            <thead>
              <tr>
                <th>Event Name</th>
                <th>Date</th>
                <th>Description</th>
                <th style={{ textAlign: 'right' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {events.length > 0 ? (
                events.map(ev => (
                  <tr key={ev.id}>
                    <td><strong>{ev.name}</strong></td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Calendar size={14} />
                        {ev.date}
                      </div>
                    </td>
                    <td style={{ color: 'var(--text-secondary)', maxWidth: '400px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {ev.description}
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <button 
                        className="btn btn-secondary" 
                        style={{ padding: '6px 12px', fontSize: '0.85rem' }}
                        onClick={() => {
                          setSelectedEventId(ev.id);
                          setActiveTab('attendance');
                        }}
                      >
                        Take Attendance <ChevronRight size={14} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>
                    No events registered yet. Click "Create Event" to get started.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};
