import React, { useState, useEffect } from 'react';
import { CheckCircle } from 'lucide-react';
import type { UserProfile } from '../types';

// ==========================================
// 1. Add User Modal
// ==========================================
interface AddUserModalProps {
  userForm: {
    name: string;
    phone: string;
    department: string;
    memberId: string;
    role: string;
    classYear: string;
    college: string;
    section: string;
    servant1: string;
    servant2: string;
    originalChurch: string;
    serviceType: string;
    address: string;
    hobbies: string;
    deptYear: string;
  };
  setUserForm: (val: any) => void;
  handleAddUser: (e: React.FormEvent) => void;
  setShowAddUserModal: (val: boolean) => void;
}

export const AddUserModal: React.FC<AddUserModalProps> = ({
  userForm,
  setUserForm,
  handleAddUser,
  setShowAddUserModal,
}) => {
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h3 className="card-title">Add User Profile</h3>
          <button className="btn btn-secondary" style={{ padding: '4px 8px' }} onClick={() => setShowAddUserModal(false)}>✕</button>
        </div>
        <form onSubmit={handleAddUser}>
          <div className="modal-body">
            <div className="form-group">
              <label className="form-label" htmlFor="userName">Full Name *</label>
              <input 
                id="userName"
                type="text" 
                className="form-control" 
                value={userForm.name} 
                onChange={(e) => setUserForm({ ...userForm, name: e.target.value })} 
                placeholder="John Doe"
                required 
              />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="userPhone">Phone Number</label>
              <input 
                id="userPhone"
                type="tel" 
                className="form-control" 
                value={userForm.phone} 
                onChange={(e) => setUserForm({ ...userForm, phone: e.target.value })} 
                placeholder="555-0100" 
              />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="userDept">Department / Group</label>
              <input 
                id="userDept"
                type="text" 
                className="form-control" 
                value={userForm.department} 
                onChange={(e) => setUserForm({ ...userForm, department: e.target.value })} 
                placeholder="Engineering" 
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div className="form-group">
                <label className="form-label" htmlFor="userClassYear">الفرقة (Class Year)</label>
                <input 
                  id="userClassYear"
                  type="text" 
                  className="form-control" 
                  value={userForm.classYear} 
                  onChange={(e) => setUserForm({ ...userForm, classYear: e.target.value })} 
                  placeholder="اعدادي" 
                />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="userCollege">الكلية (College)</label>
                <input 
                  id="userCollege"
                  type="text" 
                  className="form-control" 
                  value={userForm.college} 
                  onChange={(e) => setUserForm({ ...userForm, college: e.target.value })} 
                  placeholder="هندسة" 
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div className="form-group">
                <label className="form-label" htmlFor="userSection">السكشن (Section)</label>
                <input 
                  id="userSection"
                  type="text" 
                  className="form-control" 
                  value={userForm.section} 
                  onChange={(e) => setUserForm({ ...userForm, section: e.target.value })} 
                  placeholder="10" 
                />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="userDeptYear">قسم - السنة (Dept - Year)</label>
                <input 
                  id="userDeptYear"
                  type="text" 
                  className="form-control" 
                  value={userForm.deptYear} 
                  onChange={(e) => setUserForm({ ...userForm, deptYear: e.target.value })} 
                  placeholder="حاسبات" 
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div className="form-group">
                <label className="form-label" htmlFor="userServant1">الخادم المسئول (Servant 1)</label>
                <input 
                  id="userServant1"
                  type="text" 
                  className="form-control" 
                  value={userForm.servant1} 
                  onChange={(e) => setUserForm({ ...userForm, servant1: e.target.value })} 
                />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="userServant2">الخادم المسئول 2 (Servant 2)</label>
                <input 
                  id="userServant2"
                  type="text" 
                  className="form-control" 
                  value={userForm.servant2} 
                  onChange={(e) => setUserForm({ ...userForm, servant2: e.target.value })} 
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div className="form-group">
                <label className="form-label" htmlFor="userChurch">الكنيسة الاصلية (Church)</label>
                <input 
                  id="userChurch"
                  type="text" 
                  className="form-control" 
                  value={userForm.originalChurch} 
                  onChange={(e) => setUserForm({ ...userForm, originalChurch: e.target.value })} 
                />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="userService">بيخدم في ايه (Service Type)</label>
                <input 
                  id="userService"
                  type="text" 
                  className="form-control" 
                  value={userForm.serviceType} 
                  onChange={(e) => setUserForm({ ...userForm, serviceType: e.target.value })} 
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="userAddress">العنوان (Address)</label>
              <input 
                id="userAddress"
                type="text" 
                className="form-control" 
                value={userForm.address} 
                onChange={(e) => setUserForm({ ...userForm, address: e.target.value })} 
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="userHobbies">المواهب و الهوايات (Hobbies)</label>
              <input 
                id="userHobbies"
                type="text" 
                className="form-control" 
                value={userForm.hobbies} 
                onChange={(e) => setUserForm({ ...userForm, hobbies: e.target.value })} 
              />
            </div>

            <div className="form-group">
              <label className="form-label">Role (الدور) *</label>
              <div style={{ display: 'flex', gap: '20px', marginTop: '4px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <input 
                    type="radio" 
                    name="userRole" 
                    value="مخدوم" 
                    checked={userForm.role === 'مخدوم'}
                    onChange={(e) => setUserForm({ ...userForm, role: e.target.value })} 
                  />
                  مخدوم (Served)
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <input 
                    type="radio" 
                    name="userRole" 
                    value="خادم" 
                    checked={userForm.role === 'خادم'}
                    onChange={(e) => setUserForm({ ...userForm, role: e.target.value })} 
                  />
                  خادم (Servant)
                </label>
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={() => setShowAddUserModal(false)}>Cancel</button>
            <button type="submit" className="btn btn-primary">Save Profile</button>
          </div>
        </form>
      </div>
    </div>
  );
};


// ==========================================
// 2. Add Event Modal
// ==========================================
interface AddEventModalProps {
  eventForm: {
    name: string;
    date: string;
    description: string;
  };
  setEventForm: (val: any) => void;
  handleAddEvent: (e: React.FormEvent) => void;
  setShowAddEventModal: (val: boolean) => void;
}

export const AddEventModal: React.FC<AddEventModalProps> = ({
  eventForm,
  setEventForm,
  handleAddEvent,
  setShowAddEventModal,
}) => {
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h3 className="card-title">Create New Event</h3>
          <button className="btn btn-secondary" style={{ padding: '4px 8px' }} onClick={() => setShowAddEventModal(false)}>✕</button>
        </div>
        <form onSubmit={handleAddEvent}>
          <div className="modal-body">
            <div className="form-group">
              <label className="form-label" htmlFor="eventName">Event Name *</label>
              <input 
                id="eventName"
                type="text" 
                className="form-control" 
                value={eventForm.name} 
                onChange={(e) => setEventForm({ ...eventForm, name: e.target.value })} 
                placeholder="Weekly Synch"
                required 
              />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="eventDate">Event Date *</label>
              <input 
                id="eventDate"
                type="date" 
                className="form-control" 
                value={eventForm.date} 
                onChange={(e) => setEventForm({ ...eventForm, date: e.target.value })} 
                required 
              />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="eventDesc">Description</label>
              <textarea 
                id="eventDesc"
                className="form-control" 
                rows={3}
                value={eventForm.description} 
                onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })} 
                placeholder="Outline agenda items here..." 
              />
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={() => setShowAddEventModal(false)}>Cancel</button>
            <button type="submit" className="btn btn-primary">Create Event</button>
          </div>
        </form>
      </div>
    </div>
  );
};


// ==========================================
// 3. Import Preview Modal
// ==========================================
interface ImportPreviewModalProps {
  importedUsersPreview: UserProfile[];
  setImportedUsersPreview: (val: UserProfile[]) => void;
  handleConfirmImport: () => void;
  setShowImportPreviewModal: (val: boolean) => void;
}

export const ImportPreviewModal: React.FC<ImportPreviewModalProps> = ({
  importedUsersPreview,
  setImportedUsersPreview,
  handleConfirmImport,
  setShowImportPreviewModal,
}) => {
  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '750px' }}>
        <div className="modal-header">
          <h3 className="card-title">Preview Excel Imports</h3>
          <button className="btn btn-secondary" style={{ padding: '4px 8px' }} onClick={() => { setShowImportPreviewModal(false); setImportedUsersPreview([]); }}>✕</button>
        </div>
        <div className="modal-body">
          <p style={{ marginBottom: '16px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
            We found the following user profiles in your file. Review the details below before importing.
          </p>
          <div className="table-wrapper" style={{ maxHeight: '40vh', overflowY: 'auto' }}>
            <table className="table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Department</th>
                  <th>Role (الدور)</th>
                </tr>
              </thead>
              <tbody>
                {importedUsersPreview.map((user, index) => (
                  <tr key={index}>
                    <td>{user.name}</td>
                    <td>{user.department}</td>
                    <td>
                      <select 
                        className="form-control" 
                        style={{ padding: '4px 8px', width: 'auto', display: 'inline-block' }}
                        value={user.role || 'مخدوم'}
                        onChange={(e) => {
                          const updated = [...importedUsersPreview];
                          updated[index] = { ...updated[index], role: e.target.value as 'خادم' | 'مخدوم' };
                          setImportedUsersPreview(updated);
                        }}
                      >
                        <option value="مخدوم">مخدوم</option>
                        <option value="خادم">خادم</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="modal-footer">
          <button type="button" className="btn btn-secondary" onClick={() => { setShowImportPreviewModal(false); setImportedUsersPreview([]); }}>Cancel</button>
          <button type="button" className="btn btn-primary" onClick={handleConfirmImport}>
            <CheckCircle size={16} /> Import {importedUsersPreview.length} Users
          </button>
        </div>
      </div>
    </div>
  );
};


// ==========================================
// 4. User Details Modal
// ==========================================
interface UserDetailsModalProps {
  viewingUser: UserProfile;
  setViewingUser: (val: UserProfile | null) => void;
  handleUpdateUser: (updatedUser: UserProfile) => void;
}

export const UserDetailsModal: React.FC<UserDetailsModalProps> = ({
  viewingUser,
  setViewingUser,
  handleUpdateUser,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<UserProfile>(viewingUser);

  useEffect(() => {
    setEditForm(viewingUser);
    setIsEditing(false);
  }, [viewingUser]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleUpdateUser(editForm);
    setIsEditing(false);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '650px' }}>
        <div className="modal-header">
          <h3 className="card-title">
            {isEditing ? 'تعديل بيانات العضو (Edit Member)' : 'تفاصيل العضو (Member Details)'}
          </h3>
          <button className="btn btn-secondary" style={{ padding: '4px 8px' }} onClick={() => setViewingUser(null)}>✕</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body" style={{ direction: 'rtl', textAlign: 'right' }}>
            {isEditing ? (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                  <label className="form-label">الاسم (Full Name) *</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    value={editForm.name} 
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} 
                    required 
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">رقم التليفون (Phone)</label>
                  <input 
                    type="tel" 
                    className="form-control" 
                    value={editForm.phone} 
                    onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })} 
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">الفرقة (Class Year)</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    value={editForm.classYear || ''} 
                    onChange={(e) => setEditForm({ ...editForm, classYear: e.target.value })} 
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">الكلية (College)</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    value={editForm.college || ''} 
                    onChange={(e) => setEditForm({ ...editForm, college: e.target.value })} 
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">السكشن (Section)</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    value={editForm.section || ''} 
                    onChange={(e) => setEditForm({ ...editForm, section: e.target.value })} 
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">قسم - السنة (Dept - Year)</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    value={editForm.deptYear || ''} 
                    onChange={(e) => setEditForm({ ...editForm, deptYear: e.target.value })} 
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">الخادم المسئول (Servant 1)</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    value={editForm.servant1 || ''} 
                    onChange={(e) => setEditForm({ ...editForm, servant1: e.target.value })} 
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">الخادم المسئول 2 (Servant 2)</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    value={editForm.servant2 || ''} 
                    onChange={(e) => setEditForm({ ...editForm, servant2: e.target.value })} 
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">الكنيسة الأصلية (Church)</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    value={editForm.originalChurch || ''} 
                    onChange={(e) => setEditForm({ ...editForm, originalChurch: e.target.value })} 
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">بيخدم في إيه (Service Type)</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    value={editForm.serviceType || ''} 
                    onChange={(e) => setEditForm({ ...editForm, serviceType: e.target.value })} 
                  />
                </div>
                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                  <label className="form-label">العنوان (Address)</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    value={editForm.address || ''} 
                    onChange={(e) => setEditForm({ ...editForm, address: e.target.value })} 
                  />
                </div>
                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                  <label className="form-label">المواهب والهوايات (Hobbies)</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    value={editForm.hobbies || ''} 
                    onChange={(e) => setEditForm({ ...editForm, hobbies: e.target.value })} 
                  />
                </div>
                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                  <label className="form-label">الدور (Role) *</label>
                  <div style={{ display: 'flex', gap: '20px', marginTop: '4px' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                      <input 
                        type="radio" 
                        name="editUserRole" 
                        value="مخدوم" 
                        checked={editForm.role === 'مخدوم'}
                        onChange={(e) => setEditForm({ ...editForm, role: e.target.value as 'خادم' | 'مخدوم' })} 
                      />
                      مخدوم (Served)
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                      <input 
                        type="radio" 
                        name="editUserRole" 
                        value="خادم" 
                        checked={editForm.role === 'خادم'}
                        onChange={(e) => setEditForm({ ...editForm, role: e.target.value as 'خادم' | 'مخدوم' })} 
                      />
                      خادم (Servant)
                    </label>
                  </div>
                </div>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div><strong>الاسم:</strong> {viewingUser.name}</div>
                <div><strong>رقم التليفون:</strong> {viewingUser.phone}</div>
                <div><strong>الفرقة:</strong> {viewingUser.classYear || 'N/A'}</div>
                <div><strong>الكلية:</strong> {viewingUser.college || 'N/A'}</div>
                <div><strong>السكشن:</strong> {viewingUser.section || 'N/A'}</div>
                <div><strong>الخادم المسئول:</strong> {viewingUser.servant1 || 'N/A'}</div>
                <div><strong>الخادم المسئول 2:</strong> {viewingUser.servant2 || 'N/A'}</div>
                <div><strong>الكنيسة الأصلية:</strong> {viewingUser.originalChurch || 'N/A'}</div>
                <div><strong>بيخدم في إيه:</strong> {viewingUser.serviceType || 'N/A'}</div>
                <div><strong>العنوان:</strong> {viewingUser.address || 'N/A'}</div>
                <div><strong>المواهب والهوايات:</strong> {viewingUser.hobbies || 'N/A'}</div>
                <div><strong>قسم - السنة:</strong> {viewingUser.deptYear || 'N/A'}</div>
                <div><strong>الدور:</strong> {viewingUser.role || 'مخدوم'}</div>
              </div>
            )}
          </div>
          <div className="modal-footer" style={{ justifyContent: 'flex-start', gap: '8px' }}>
            {isEditing ? (
              <>
                <button type="submit" className="btn btn-primary">حفظ التعديلات (Save Changes)</button>
                <button type="button" className="btn btn-secondary" onClick={() => { setIsEditing(false); setEditForm(viewingUser); }}>إلغاء (Cancel)</button>
              </>
            ) : (
              <>
                <button type="button" className="btn btn-primary" onClick={() => setIsEditing(true)}>تعديل (Edit)</button>
                <button type="button" className="btn btn-secondary" onClick={() => setViewingUser(null)}>إغلاق (Close)</button>
              </>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};
