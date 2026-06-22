import React from 'react';
import { Upload, Plus, Search, Trash2 } from 'lucide-react';
import type { UserProfile } from '../types';

interface UsersViewProps {
  users: UserProfile[];
  userSearchQuery: string;
  setUserSearchQuery: (val: string) => void;
  filteredUsers: UserProfile[];
  handleFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  setShowAddUserModal: (val: boolean) => void;
  setViewingUser: (val: UserProfile) => void;
  handleDeleteUser: (id: string) => void;
  selectedCollege: string;
  setSelectedCollege: (val: string) => void;
  selectedRole: string;
  setSelectedRole: (val: string) => void;
  selectedDepartment: string;
  setSelectedDepartment: (val: string) => void;
}

export const UsersView: React.FC<UsersViewProps> = ({
  users,
  userSearchQuery,
  setUserSearchQuery,
  filteredUsers,
  handleFileUpload,
  fileInputRef,
  setShowAddUserModal,
  setViewingUser,
  handleDeleteUser,
  selectedCollege,
  setSelectedCollege,
  selectedRole,
  setSelectedRole,
  selectedDepartment,
  setSelectedDepartment,
}) => {
  const colleges = Array.from(new Set(users.map(u => u.college).filter(Boolean))) as string[];
  const departments = Array.from(new Set(users.map(u => u.department).filter(Boolean))) as string[];

  return (
    <>
      <div className="page-header">
        <div className="page-title-area">
          <h1>User Profiles</h1>
          <p className="page-subtitle">Manage users, import spreadsheet files, or add manually</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <input 
            type="file" 
            accept=".xlsx, .xls, .csv" 
            onChange={handleFileUpload} 
            ref={fileInputRef as any}
            style={{ display: 'none' }} 
          />
          <button className="btn btn-secondary" onClick={() => fileInputRef.current?.click()}>
            <Upload size={18} /> Import Excel / CSV
          </button>
          <button className="btn btn-primary" onClick={() => setShowAddUserModal(true)}>
            <Plus size={18} /> Add User
          </button>
        </div>
      </div>

      {/* Filter / Search Bar */}
      <div className="card" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div style={{ position: 'relative' }}>
          <Search size={18} style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--text-muted)' }} />
          <input 
            type="text" 
            className="form-control" 
            style={{ paddingLeft: '40px' }}
            placeholder="Search users by name, email, department or ID..." 
            value={userSearchQuery}
            onChange={(e) => setUserSearchQuery(e.target.value)}
          />
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '12px' }}>
          <div>
            <label className="form-label" style={{ fontSize: '0.8rem', marginBottom: '4px' }}>College / Faculty (الكلية)</label>
            <select 
              className="form-control" 
              value={selectedCollege} 
              onChange={(e) => setSelectedCollege(e.target.value)}
            >
              <option value="">All Colleges</option>
              {colleges.map(col => (
                <option key={col} value={col}>{col}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="form-label" style={{ fontSize: '0.8rem', marginBottom: '4px' }}>Department / Group (القسم)</label>
            <select 
              className="form-control" 
              value={selectedDepartment} 
              onChange={(e) => setSelectedDepartment(e.target.value)}
            >
              <option value="">All Departments</option>
              {departments.map(dep => (
                <option key={dep} value={dep}>{dep}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="form-label" style={{ fontSize: '0.8rem', marginBottom: '4px' }}>Role (الدور)</label>
            <select 
              className="form-control" 
              value={selectedRole} 
              onChange={(e) => setSelectedRole(e.target.value)}
            >
              <option value="">All Roles</option>
              <option value="مخدوم">مخدوم (Served)</option>
              <option value="خادم">خادم (Servant)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="table-wrapper">
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Faculty</th>
              <th>Phone</th>
              <th>Department/Role</th>
              <th>Role (الدور)</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length > 0 ? (
              filteredUsers.map(user => (
                <tr key={user.id}>
                  <td style={{ fontSize: '0.8rem', fontWeight: 600, whiteSpace: 'nowrap' }}>{user.name}</td>
                  <td>{user.college || 'N/A'}</td>
                  <td>{user.phone}</td>
                  <td>
                    <span className="badge badge-success" style={{ backgroundColor: 'rgba(99,102,241,0.08)', color: 'var(--primary)' }}>
                      {user.department}
                    </span>
                  </td>
                  <td>
                    <span className={`badge ${user.role === 'خادم' ? 'badge-success' : 'badge-warning'}`} style={{ textTransform: 'none' }}>
                      {user.role || 'مخدوم'}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <button 
                      className="btn btn-secondary" 
                      style={{ padding: '6px 10px', fontSize: '0.8rem', marginRight: '8px' }}
                      onClick={() => setViewingUser(user)}
                    >
                      Details
                    </button>
                    <button 
                      className="btn btn-danger" 
                      style={{ padding: '6px 10px', fontSize: '0.8rem' }}
                      onClick={() => handleDeleteUser(user.id)}
                    >
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>
                  No profiles matched your search or database is empty.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
};
