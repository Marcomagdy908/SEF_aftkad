import { useState, useEffect, useRef } from 'react';
import type { ChangeEvent } from 'react';
import { Menu } from 'lucide-react';
import * as XLSX from 'xlsx';
import { auth, rtdb } from './firebase';
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth';
import type { User as FirebaseUser } from 'firebase/auth';
import {
  ref,
  push,
  set,
  onValue,
  remove
} from 'firebase/database';

// Types
import type { UserProfile, EventItem, AttendanceRecord } from './types';

// Components
import { LoginView } from './components/LoginView';
import { Sidebar } from './components/Sidebar';
import { DashboardView } from './components/DashboardView';
import { UsersView } from './components/UsersView';
import { EventsView } from './components/EventsView';
import { AttendanceView } from './components/AttendanceView';
import { AddUserModal, AddEventModal, ImportPreviewModal, UserDetailsModal } from './components/Modals';

function App() {
  // Navigation & Auth
  const [activeTab, setActiveTab] = useState<'dashboard' | 'users' | 'events' | 'attendance'>('dashboard');
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);

  // App Data State
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [events, setEvents] = useState<EventItem[]>([]);
  const [attendance, setAttendance] = useState<{ [eventId: string]: AttendanceRecord }>({});
  const [selectedEventId, setSelectedEventId] = useState<string>('');

  // Modals / Forms
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [showAddEventModal, setShowAddEventModal] = useState(false);
  const [showImportPreviewModal, setShowImportPreviewModal] = useState(false);

  // User Form State
  const [userForm, setUserForm] = useState({
    name: '',
    phone: '',
    department: '',
    memberId: '',
    role: 'مخدوم',
    classYear: '',
    college: '',
    section: '',
    servant1: '',
    servant2: '',
    originalChurch: '',
    serviceType: '',
    address: '',
    hobbies: '',
    deptYear: ''
  });
  const [viewingUser, setViewingUser] = useState<UserProfile | null>(null);

  // Event Form State
  const [eventForm, setEventForm] = useState({ name: '', date: '', description: '' });

  // Search / Filter State
  const [userSearchQuery, setUserSearchQuery] = useState('');
  const [selectedCollege, setSelectedCollege] = useState('');
  const [selectedRole, setSelectedRole] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Excel Import State
  const [importedUsersPreview, setImportedUsersPreview] = useState<UserProfile[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auth State Listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
    return unsubscribe;
  }, []);

  // Realtime Database Listeners
  useEffect(() => {
    if (!currentUser) return;

    const unsubscribeUsers = onValue(ref(rtdb, 'users'), (snapshot) => {
      const val = snapshot.val();
      const uList: UserProfile[] = val
        ? Object.keys(val).map((key) => ({ id: key, ...val[key] } as UserProfile))
        : [];
      setUsers(uList);
    }, (error) => {
      console.error('RTDB users sync error:', error);
    });

    const unsubscribeEvents = onValue(ref(rtdb, 'events'), (snapshot) => {
      const val = snapshot.val();
      const eList: EventItem[] = val
        ? Object.keys(val).map((key) => ({ id: key, ...val[key] } as EventItem))
        : [];
      setEvents(eList);
      if (eList.length > 0 && !selectedEventId) {
        setSelectedEventId(eList[0].id);
      }
    }, (error) => {
      console.error('RTDB events sync error:', error);
    });

    const unsubscribeAttendance = onValue(ref(rtdb, 'attendance'), (snapshot) => {
      setAttendance(snapshot.val() || {});
    }, (error) => {
      console.error('RTDB attendance sync error:', error);
    });

    return () => {
      unsubscribeUsers();
      unsubscribeEvents();
      unsubscribeAttendance();
    };
  }, [currentUser]);

  // Auth Functions
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setAuthLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err: any) {
      setAuthError(err.message || 'Failed to sign in. Please check your credentials.');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    setCurrentUser(null);
  };

  // User Actions
  const resetUserForm = () => setUserForm({
    name: '', phone: '', department: '', memberId: '', role: 'مخدوم',
    classYear: '', college: '', section: '', servant1: '', servant2: '',
    originalChurch: '', serviceType: '', address: '', hobbies: '', deptYear: ''
  });

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userForm.name) return;

    const newProfile: Omit<UserProfile, 'id'> = {
      name: userForm.name,
      phone: userForm.phone || 'N/A',
      department: userForm.department || 'General',
      memberId: userForm.memberId || `MEM-${Math.floor(1000 + Math.random() * 9000)}`,
      role: userForm.role as 'خادم' | 'مخدوم',
      classYear: userForm.classYear || '',
      college: userForm.college || '',
      section: userForm.section || '',
      servant1: userForm.servant1 || '',
      servant2: userForm.servant2 || '',
      originalChurch: userForm.originalChurch || '',
      serviceType: userForm.serviceType || '',
      address: userForm.address || '',
      hobbies: userForm.hobbies || '',
      deptYear: userForm.deptYear || ''
    };

    try {
      await push(ref(rtdb, 'users'), newProfile);
      resetUserForm();
      setShowAddUserModal(false);
    } catch (err) {
      console.error('Failed to add user:', err);
      alert('Failed to save user. Please try again.');
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!window.confirm('Are you sure you want to delete this user profile?')) return;
    try {
      await remove(ref(rtdb, `users/${userId}`));
    } catch (err) {
      console.error('Failed to delete user:', err);
      alert('Failed to delete user. Please try again.');
    }
  };

  const handleUpdateUser = async (updatedUser: UserProfile) => {
    try {
      const { id, ...profileData } = updatedUser;
      await set(ref(rtdb, `users/${id}`), profileData);
      setViewingUser(updatedUser);
    } catch (err) {
      console.error('Failed to update user:', err);
      alert('Failed to save changes. Please try again.');
    }
  };

  // Excel / CSV Import
  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const bstr = evt.target?.result;
        const workbook = XLSX.read(bstr, { type: 'binary' });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as any[][];

        if (data.length <= 1) {
          alert('Excel file seems to be empty or lacks headers.');
          return;
        }

        const headers = data[0].map((h: any) => String(h).toLowerCase().trim());
        const nameIdx = headers.findIndex((h: string) => h.includes('name') || h.includes('اسم') || h.includes('الإسم'));
        const phoneIdx = headers.findIndex((h: string) => h.includes('phone') || h.includes('tel') || h.includes('تليفون') || h.includes('هاتف') || h.includes('التليفون') || h.includes('رقم'));
        const deptIdx = headers.findIndex((h: string) => h.includes('dept') || h.includes('division') || h.includes('قسم') || h.includes('سنة'));
        const idIdx = headers.findIndex((h: string) => h.includes('id') || h.includes('code') || h.includes('member') || h.includes('كود') || h.includes('مسلسل'));
        const roleIdx = headers.findIndex((h: string) => h.includes('دور') || h.includes('نوع') || h.includes('خادم/مخدوم'));
        const classYearIdx = headers.findIndex((h: string) => h.includes('الفرقة') || h.includes('class') || h.includes('grade'));
        const collegeIdx = headers.findIndex((h: string) => h.includes('الكلية') || h.includes('college') || h.includes('faculty'));
        const sectionIdx = headers.findIndex((h: string) => h.includes('السكشن') || h.includes('section'));
        const servant1Idx = headers.findIndex((h: string) => h.includes('الخادم المسئول') || h.includes('الخادم المسؤول') || h.includes('الخادم 1'));
        const servant2Idx = headers.findIndex((h: string) => h.includes('الخادم المسئول2') || h.includes('الخادم المسؤول2') || h.includes('الخادم 2'));
        const originalChurchIdx = headers.findIndex((h: string) => h.includes('الكنيسة الاصلية') || h.includes('الكنيسة'));
        const serviceTypeIdx = headers.findIndex((h: string) => h.includes('بيحدم') || h.includes('بيخدم') || h.includes('الخدمة'));
        const addressIdx = headers.findIndex((h: string) => h.includes('عنوان') || h.includes('العنوان') || h.includes('address') || h.includes('منطقة'));
        const hobbiesIdx = headers.findIndex((h: string) => h.includes('مواهب') || h.includes('المواهب') || h.includes('هوايات') || h.includes('hobbies'));
        const deptYearIdx = headers.findIndex((h: string) => h.includes('قسم - السنة') || h.includes('قسم-السنة') || h.includes('قسم/السنة'));

        if (nameIdx === -1) {
          alert('Excel must contain a column for Name (الإسم).');
          return;
        }

        const parsedProfiles: UserProfile[] = [];
        for (let i = 1; i < data.length; i++) {
          const row = data[i];
          if (!row || row.length === 0 || !row[nameIdx]) continue;

          let detectedRole: 'خادم' | 'مخدوم' = 'مخدوم';
          if (roleIdx !== -1 && row[roleIdx]) {
            const val = String(row[roleIdx]).trim();
            if (val.includes('خادم') || val.toLowerCase() === 'servant') detectedRole = 'خادم';
          }

          parsedProfiles.push({
            id: `temp_${i}_${Date.now()}`,
            name: String(row[nameIdx]).trim(),
            phone: phoneIdx !== -1 && row[phoneIdx] ? String(row[phoneIdx]).trim() : 'N/A',
            department: deptIdx !== -1 && row[deptIdx] ? String(row[deptIdx]).trim() : 'General',
            memberId: idIdx !== -1 && row[idIdx] ? String(row[idIdx]).trim() : `MEM-${Math.floor(1000 + Math.random() * 9000)}`,
            role: detectedRole,
            classYear: classYearIdx !== -1 && row[classYearIdx] ? String(row[classYearIdx]).trim() : '',
            college: collegeIdx !== -1 && row[collegeIdx] ? String(row[collegeIdx]).trim() : '',
            section: sectionIdx !== -1 && row[sectionIdx] ? String(row[sectionIdx]).trim() : '',
            servant1: servant1Idx !== -1 && row[servant1Idx] ? String(row[servant1Idx]).trim() : '',
            servant2: servant2Idx !== -1 && row[servant2Idx] ? String(row[servant2Idx]).trim() : '',
            originalChurch: originalChurchIdx !== -1 && row[originalChurchIdx] ? String(row[originalChurchIdx]).trim() : '',
            serviceType: serviceTypeIdx !== -1 && row[serviceTypeIdx] ? String(row[serviceTypeIdx]).trim() : '',
            address: addressIdx !== -1 && row[addressIdx] ? String(row[addressIdx]).trim() : '',
            hobbies: hobbiesIdx !== -1 && row[hobbiesIdx] ? String(row[hobbiesIdx]).trim() : '',
            deptYear: deptYearIdx !== -1 && row[deptYearIdx] ? String(row[deptYearIdx]).trim() : ''
          });
        }

        setImportedUsersPreview(parsedProfiles);
        setShowImportPreviewModal(true);
      } catch (err) {
        console.error(err);
        alert('Failed to parse Excel file. Ensure it is a valid format.');
      }
    };
    reader.readAsBinaryString(file);
  };

  const handleConfirmImport = async () => {
    try {
      for (const user of importedUsersPreview) {
        const { id: _id, ...newProfile } = user;
        await push(ref(rtdb, 'users'), newProfile);
      }
    } catch (err) {
      console.error('Batch import failed:', err);
      alert('Import failed. Please try again.');
      return;
    }
    setImportedUsersPreview([]);
    setShowImportPreviewModal(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Event Actions
  const handleAddEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventForm.name || !eventForm.date) return;

    try {
      const newRef = await push(ref(rtdb, 'events'), {
        name: eventForm.name,
        date: eventForm.date,
        description: eventForm.description || 'No description provided.'
      });
      if (newRef.key) setSelectedEventId(newRef.key);
    } catch (err) {
      console.error('Failed to add event:', err);
      alert('Failed to create event. Please try again.');
      return;
    }

    setEventForm({ name: '', date: '', description: '' });
    setShowAddEventModal(false);
    setActiveTab('attendance');
  };

  // Attendance Actions
  const markAttendance = async (userId: string, status: 'Present' | 'Absent') => {
    if (!selectedEventId) {
      alert('Please select or create an event first.');
      return;
    }

    const currentEventRecord = attendance[selectedEventId] || {};
    const updatedRecord = { ...currentEventRecord, [userId]: status };

    try {
      await set(ref(rtdb, `attendance/${selectedEventId}`), updatedRecord);
    } catch (err) {
      console.error('Failed to mark attendance:', err);
      alert('Failed to save attendance. Please try again.');
    }
  };

  // Export to Excel
  const handleExportCSV = () => {
    const currentEvent = events.find(e => e.id === selectedEventId);
    if (!currentEvent) {
      alert('Select an event to export.');
      return;
    }

    const currentRecord = attendance[selectedEventId] || {};
    const exportData = users.map(user => ({
      'Name': user.name,
      'Phone': user.phone,
      'الفرقة': user.classYear || '',
      'الكلية': user.college || '',
      'الخادم المسئول': user.servant1 || '',
      'الخادم المسئول2': user.servant2 || '',
      'Attendance Status': currentRecord[user.id] || 'Absent'
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Attendance');
    XLSX.writeFile(workbook, `${currentEvent.name.replace(/\s+/g, '_')}_Attendance_${currentEvent.date}.xlsx`);
  };

  // Stats
  const totalUsersCount = users.length;
  const totalEventsCount = events.length;
  const currentEventAttendance = selectedEventId ? attendance[selectedEventId] || {} : {};
  const currentEventPresent = Object.values(currentEventAttendance).filter(v => v === 'Present').length;
  const currentEventAbsent = totalUsersCount - currentEventPresent;
  const presentServants = users.filter(u => u.role === 'خادم' && currentEventAttendance[u.id] === 'Present').length;
  const totalServants = users.filter(u => u.role === 'خادم').length;
  const absentServants = totalServants - presentServants;
  const presentServed = users.filter(u => u.role !== 'خادم' && currentEventAttendance[u.id] === 'Present').length;
  const totalServed = users.filter(u => u.role !== 'خادم').length;
  const absentServed = totalServed - presentServed;

  // Filtered Users
  const filteredUsers = users.filter(u => {
    const matchesSearch =
      u.name.toLowerCase().includes(userSearchQuery.toLowerCase()) ||
      u.department.toLowerCase().includes(userSearchQuery.toLowerCase()) ||
      u.memberId.toLowerCase().includes(userSearchQuery.toLowerCase()) ||
      (u.role && u.role.toLowerCase().includes(userSearchQuery.toLowerCase()));
    const matchesCollege = !selectedCollege || u.college === selectedCollege;
    const matchesRole = !selectedRole || u.role === selectedRole;
    const matchesDepartment = !selectedDepartment || u.department === selectedDepartment;
    return matchesSearch && matchesCollege && matchesRole && matchesDepartment;
  });

  // Login Screen
  if (!currentUser) {
    return (
      <LoginView
        email={email}
        setEmail={setEmail}
        password={password}
        setPassword={setPassword}
        authError={authError}
        authLoading={authLoading}
        handleLogin={handleLogin}
      />
    );
  }

  // Dashboard Layout
  return (
    <div className="app-container">
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentUser={currentUser}
        handleLogout={handleLogout}
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
      />

      <main className="main-content">
        <div className="mobile-header">
          <button className="burger-btn" onClick={() => setIsSidebarOpen(true)} aria-label="Open menu">
            <Menu size={24} />
          </button>
          <span className="mobile-logo-text">SEF_Aftkad</span>
        </div>

        {activeTab === 'dashboard' && (
          <DashboardView
            totalUsersCount={totalUsersCount}
            totalEventsCount={totalEventsCount}
            currentEventPresent={currentEventPresent}
            users={users}
            events={events}
            selectedEventId={selectedEventId}
            setSelectedEventId={setSelectedEventId}
            currentEventAbsent={currentEventAbsent}
            presentServants={presentServants}
            absentServants={absentServants}
            presentServed={presentServed}
            absentServed={absentServed}
            setActiveTab={setActiveTab}
            setShowAddUserModal={setShowAddUserModal}
            setShowAddEventModal={setShowAddEventModal}
          />
        )}

        {activeTab === 'users' && (
          <UsersView
            users={users}
            userSearchQuery={userSearchQuery}
            setUserSearchQuery={setUserSearchQuery}
            filteredUsers={filteredUsers}
            handleFileUpload={handleFileUpload}
            fileInputRef={fileInputRef}
            setShowAddUserModal={setShowAddUserModal}
            setViewingUser={setViewingUser}
            handleDeleteUser={handleDeleteUser}
            selectedCollege={selectedCollege}
            setSelectedCollege={setSelectedCollege}
            selectedRole={selectedRole}
            setSelectedRole={setSelectedRole}
            selectedDepartment={selectedDepartment}
            setSelectedDepartment={setSelectedDepartment}
          />
        )}

        {activeTab === 'events' && (
          <EventsView
            events={events}
            setSelectedEventId={setSelectedEventId}
            setActiveTab={setActiveTab}
            setShowAddEventModal={setShowAddEventModal}
          />
        )}

        {activeTab === 'attendance' && (
          <AttendanceView
            events={events}
            selectedEventId={selectedEventId}
            setSelectedEventId={setSelectedEventId}
            handleExportCSV={handleExportCSV}
            userSearchQuery={userSearchQuery}
            setUserSearchQuery={setUserSearchQuery}
            filteredUsers={filteredUsers}
            currentEventAttendance={currentEventAttendance}
            markAttendance={markAttendance}
          />
        )}
      </main>

      {showAddUserModal && (
        <AddUserModal
          userForm={userForm}
          setUserForm={setUserForm}
          handleAddUser={handleAddUser}
          setShowAddUserModal={setShowAddUserModal}
        />
      )}

      {showAddEventModal && (
        <AddEventModal
          eventForm={eventForm}
          setEventForm={setEventForm}
          handleAddEvent={handleAddEvent}
          setShowAddEventModal={setShowAddEventModal}
        />
      )}

      {showImportPreviewModal && (
        <ImportPreviewModal
          importedUsersPreview={importedUsersPreview}
          setImportedUsersPreview={setImportedUsersPreview}
          handleConfirmImport={handleConfirmImport}
          setShowImportPreviewModal={setShowImportPreviewModal}
        />
      )}

      {viewingUser && (
        <UserDetailsModal
          viewingUser={viewingUser}
          setViewingUser={setViewingUser}
          handleUpdateUser={handleUpdateUser}
        />
      )}
    </div>
  );
}

export default App;
