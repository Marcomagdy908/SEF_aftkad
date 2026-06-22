import { useState, useEffect, useRef } from 'react';
import type { ChangeEvent } from 'react';
import { AlertTriangle, Menu } from 'lucide-react';
import * as XLSX from 'xlsx';
import { auth, rtdb, isMockMode } from './firebase';
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  createUserWithEmailAndPassword
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
import type { UserProfile, EventItem, AttendanceRecord, DBState } from './types';

// Components
import { LoginView } from './components/LoginView';
import { Sidebar } from './components/Sidebar';
import { DashboardView } from './components/DashboardView';
import { UsersView } from './components/UsersView';
import { EventsView } from './components/EventsView';
import { AttendanceView } from './components/AttendanceView';
import { AddUserModal, AddEventModal, ImportPreviewModal, UserDetailsModal } from './components/Modals';

// Initial mock data if firebase is not configured
const initialMockData: DBState = {
  users: [
    {
      id: 'u1',
      name: 'يوسف كرم',
      phone: '01229683182',
      department: 'General',
      memberId: 'MEM-1007',
      role: 'مخدوم',
      classYear: 'ثانية',
      college: 'هندسة',
      section: '',
      servant1: 'ماركو مجدي',
      servant2: '',
      originalChurch: 'ابو سيفين و الانبا رويس',
      serviceType: 'مدرسة الالحان و بيروح اعداد خدام',
      address: 'حدائق المعادي',
      hobbies: 'الالحان',
      deptYear: 'اتصالات '
    }

  ],
  events: [
    { id: 'e1', name: 'الاجتماع العام للخدمة', date: '2026-06-25', description: 'اجتماع خدمة الافتقاد الأسبوعي للوقوف على أحوال المخدومين.' }
  ],
  attendance: {
    'e1': { 'u1': 'Present' }
  }
};

function App() {
  // Navigation & Auth
  const [activeTab, setActiveTab] = useState<'dashboard' | 'users' | 'events' | 'attendance'>('dashboard');
  const [currentUser, setCurrentUser] = useState<FirebaseUser | { email: string } | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);

  // App Data State (Synchronized either from Firestore or LocalStorage mock)
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
  // Search state
  const [userSearchQuery, setUserSearchQuery] = useState('');
  const [selectedCollege, setSelectedCollege] = useState('');
  const [selectedRole, setSelectedRole] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Imported data state
  const [importedUsersPreview, setImportedUsersPreview] = useState<UserProfile[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load Auth State
  useEffect(() => {
    const savedAdminUser = localStorage.getItem('real_admin_user');
    if (savedAdminUser) {
      setCurrentUser(JSON.parse(savedAdminUser));
    } else if (auth) {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        if (user) {
          setCurrentUser(user);
        }
      });
      return unsubscribe;
    }
  }, []);

  // Load local mock fallback data
  const loadLocalMockData = () => {
    const savedData = localStorage.getItem('attendance_tracker_mock_db');
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData) as DBState;
        setUsers(parsed.users || []);
        setEvents(parsed.events || []);
        setAttendance(parsed.attendance || {});
        if (parsed.events && parsed.events.length > 0) {
          setSelectedEventId(parsed.events[0].id);
        }
      } catch (e) {
        setUsers(initialMockData.users);
        setEvents(initialMockData.events);
        setAttendance(initialMockData.attendance);
        setSelectedEventId(initialMockData.events[0].id);
      }
    } else {
      setUsers(initialMockData.users);
      setEvents(initialMockData.events);
      setAttendance(initialMockData.attendance);
      setSelectedEventId(initialMockData.events[0].id);
    }
  };

  // Load / Sync Data State
  useEffect(() => {
    if (!currentUser) return;

    if (isMockMode) {
      loadLocalMockData();
    } else if (rtdb) {
      // Firebase Live mode using Realtime Database listeners
      const usersRef = ref(rtdb, 'users');
      const unsubscribeUsers = onValue(usersRef, (snapshot) => {
        const val = snapshot.val();
        if (!val) {
          // Seed RTDB automatically on first run
          initialMockData.users.forEach(async (user) => {
            const { id, ...profile } = user;
            try {
              await set(ref(rtdb!, `users/${id}`), profile);
            } catch (err) {
              console.warn("Failed to seed initial user to RTDB:", err);
            }
          });
        }
        const uList: UserProfile[] = [];
        if (val) {
          Object.keys(val).forEach((key) => {
            uList.push({ id: key, ...val[key] } as UserProfile);
          });
        }
        setUsers(uList);
      }, (error) => {
        console.error("RTDB user sync failed, using local fallback:", error);
        loadLocalMockData();
      });

      const eventsRef = ref(rtdb, 'events');
      const unsubscribeEvents = onValue(eventsRef, (snapshot) => {
        const val = snapshot.val();
        if (!val) {
          // Seed RTDB events automatically on first run
          initialMockData.events.forEach(async (event) => {
            const { id, ...evt } = event;
            try {
              await set(ref(rtdb!, `events/${id}`), evt);
            } catch (err) {
              console.warn("Failed to seed initial event to RTDB:", err);
            }
          });
        }
        const eList: EventItem[] = [];
        if (val) {
          Object.keys(val).forEach((key) => {
            eList.push({ id: key, ...val[key] } as EventItem);
          });
        }
        setEvents(eList);
        if (eList.length > 0 && !selectedEventId) {
          setSelectedEventId(eList[0].id);
        }
      }, (error) => {
        console.error("RTDB events sync failed:", error);
      });

      const attendanceRef = ref(rtdb, 'attendance');
      const unsubscribeAttendance = onValue(attendanceRef, (snapshot) => {
        const val = snapshot.val() || {};
        setAttendance(val);
      }, (error) => {
        console.error("RTDB attendance sync failed:", error);
      });

      return () => {
        unsubscribeUsers();
        unsubscribeEvents();
        unsubscribeAttendance();
      };
    }
  }, [currentUser]);

  // Helper to persist data updates (Mock only)
  const saveMockDB = (newUsers: UserProfile[], newEvents: EventItem[], newAttendance: { [eventId: string]: AttendanceRecord }) => {
    if (isMockMode) {
      const data: DBState = { users: newUsers, events: newEvents, attendance: newAttendance };
      localStorage.setItem('attendance_tracker_mock_db', JSON.stringify(data));
    }
  };

  // Auth Functions
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setAuthLoading(true);

    // Support admin credentials locally first
    if (email === 'admin@gmail.com' && password === 'password123') {
      const adminUser = { email: 'admin@gmail.com' };
      localStorage.setItem('real_admin_user', JSON.stringify(adminUser));
      setCurrentUser(adminUser);
      setAuthLoading(false);
      return;
    }

    if (auth) {
      try {
        await signInWithEmailAndPassword(auth, email, password);
      } catch (err: any) {
        if ((err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential') && email === 'admin@gmail.com' && password === 'password123') {
          try {
            // Auto-create admin user in Firebase Auth backend on first attempt
            await createUserWithEmailAndPassword(auth, email, password);
          } catch (createErr: any) {
            setAuthError(createErr.message || 'Failed to initialize admin credentials on Firebase.');
          }
        } else {
          setAuthError(err.message || 'Failed to sign in. Please check credentials.');
        }
      } finally {
        setAuthLoading(false);
      }
    } else {
      setAuthError('Authentication service is not available.');
      setAuthLoading(false);
    }
  };

  const handleLogout = async () => {
    localStorage.removeItem('real_admin_user');
    if (auth) {
      await signOut(auth);
    }
    setCurrentUser(null);
  };

  // User Actions
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

    if (rtdb) {
      try {
        await push(ref(rtdb, 'users'), newProfile);
        setUserForm({
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
        setShowAddUserModal(false);
        return;
      } catch (err) {
        console.warn("RTDB push user failed, using local storage fallback:", err);
      }
    }

    const newUser: UserProfile = { id: `u_${Date.now()}`, ...newProfile };
    const updatedUsers = [...users, newUser];
    setUsers(updatedUsers);
    saveMockDB(updatedUsers, events, attendance);

    setUserForm({
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
    setShowAddUserModal(false);
  };

  const handleDeleteUser = async (userId: string) => {
    if (!window.confirm("Are you sure you want to delete this user profile?")) return;

    if (rtdb) {
      try {
        await remove(ref(rtdb, `users/${userId}`));
        return;
      } catch (err) {
        console.warn("RTDB remove user failed, fallback to local storage:", err);
      }
    }

    const updatedUsers = users.filter(u => u.id !== userId);
    const updatedAttendance = { ...attendance };
    Object.keys(updatedAttendance).forEach(eId => {
      if (updatedAttendance[eId]) {
        delete updatedAttendance[eId][userId];
      }
    });
    setUsers(updatedUsers);
    setAttendance(updatedAttendance);
    saveMockDB(updatedUsers, events, updatedAttendance);
  };

  const handleUpdateUser = async (updatedUser: UserProfile) => {
    if (rtdb) {
      try {
        const { id, ...profileData } = updatedUser;
        await set(ref(rtdb, `users/${id}`), profileData);
        setViewingUser(updatedUser);
        return;
      } catch (err) {
        console.warn("RTDB set user update failed, fallback to local storage:", err);
      }
    }

    const updatedUsers = users.map(u => u.id === updatedUser.id ? updatedUser : u);
    setUsers(updatedUsers);
    saveMockDB(updatedUsers, events, attendance);
    setViewingUser(updatedUser);
  };

  // Excel / CSV File Parsing
  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const bstr = evt.target?.result;
        const workbook = XLSX.read(bstr, { type: 'binary' });
        const wsname = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[wsname];
        const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as any[][];

        // Extract headers
        if (data.length <= 1) {
          alert('Excel file seems to be empty or lacks headers.');
          return;
        }

        const headers = data[0].map(h => String(h).toLowerCase().trim());
        const nameIdx = headers.findIndex(h => h.includes('name') || h.includes('اسم') || h.includes('الإسم'));
        const phoneIdx = headers.findIndex(h => h.includes('phone') || h.includes('tel') || h.includes('تليفون') || h.includes('هاتف') || h.includes('التليفون') || h.includes('رقم'));
        const deptIdx = headers.findIndex(h => h.includes('dept') || h.includes('role') || h.includes('division') || h.includes('فرقة') || h.includes('كلية') || h.includes('قسم') || h.includes('سنة'));
        const idIdx = headers.findIndex(h => h.includes('id') || h.includes('code') || h.includes('member') || h.includes('كود') || h.includes('مسلسل'));
        const roleIdx = headers.findIndex(h => h.includes('دور') || h.includes('role') || h.includes('نوع') || h.includes('خادم/مخدوم'));

        // Additional Arabic fields
        const classYearIdx = headers.findIndex(h => h.includes('الفرقة') || h.includes('class') || h.includes('grade'));
        const collegeIdx = headers.findIndex(h => h.includes('الكلية') || h.includes('college') || h.includes('faculty'));
        const sectionIdx = headers.findIndex(h => h.includes('السكشن') || h.includes('section'));
        const servant1Idx = headers.findIndex(h => h.includes('الخادم المسئول') || h.includes('الخادم المسؤول') || h.includes('الخادم 1'));
        const servant2Idx = headers.findIndex(h => h.includes('الخادم المسئول2') || h.includes('الخادم المسؤول2') || h.includes('الخادم 2'));
        const originalChurchIdx = headers.findIndex(h => h.includes('الكنيسة الاصلية') || h.includes('الكنيسة'));
        const serviceTypeIdx = headers.findIndex(h => h.includes('بيحدم') || h.includes('بيخدم') || h.includes('الخدمة'));
        const addressIdx = headers.findIndex(h => h.includes('عنوان') || h.includes('العنوان') || h.includes('address') || h.includes('منطقة'));
        const hobbiesIdx = headers.findIndex(h => h.includes('مواهب') || h.includes('المواهب') || h.includes('هوايات') || h.includes('hobbies'));
        const deptYearIdx = headers.findIndex(h => h.includes('قسم - السنة') || h.includes('قسم-السنة') || h.includes('قسم/السنة'));

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
            if (val.includes('خادم') || val.toLowerCase() === 'servant') {
              detectedRole = 'خادم';
            }
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
    if (rtdb) {
      try {
        for (const user of importedUsersPreview) {
          const newProfile = {
            name: user.name,
            phone: user.phone || 'N/A',
            department: user.department || 'General',
            memberId: user.memberId || `MEM-${Math.floor(1000 + Math.random() * 9000)}`,
            role: user.role || 'مخدوم',
            classYear: user.classYear || '',
            college: user.college || '',
            section: user.section || '',
            servant1: user.servant1 || '',
            servant2: user.servant2 || '',
            originalChurch: user.originalChurch || '',
            serviceType: user.serviceType || '',
            address: user.address || '',
            hobbies: user.hobbies || '',
            deptYear: user.deptYear || ''
          };
          await push(ref(rtdb, 'users'), newProfile);
        }
        setImportedUsersPreview([]);
        setShowImportPreviewModal(false);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        return;
      } catch (err) {
        console.warn("RTDB batch import failed, falling back to local storage:", err);
      }
    }

    const parsedWithRealIds = importedUsersPreview.map((user, idx) => ({
      ...user,
      id: `u_excel_${Date.now()}_${idx}`
    }));
    const updatedUsers = [...users, ...parsedWithRealIds];
    setUsers(updatedUsers);
    saveMockDB(updatedUsers, events, attendance);

    setImportedUsersPreview([]);
    setShowImportPreviewModal(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Event Actions
  const handleAddEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventForm.name || !eventForm.date) return;

    const newEventDetails: Omit<EventItem, 'id'> = {
      name: eventForm.name,
      date: eventForm.date,
      description: eventForm.description || 'No description provided.'
    };

    let newEventId = '';

    if (rtdb) {
      try {
        const newRef = await push(ref(rtdb, 'events'), newEventDetails);
        newEventId = newRef.key || '';
      } catch (err) {
        console.warn("RTDB push event failed, saving to local storage fallback:", err);
      }
    }

    if (!newEventId) {
      newEventId = `e_${Date.now()}`;
      const newEvent: EventItem = { id: newEventId, ...newEventDetails };
      const updatedEvents = [...events, newEvent];
      setEvents(updatedEvents);
      saveMockDB(users, updatedEvents, attendance);
    }

    if (newEventId) {
      setSelectedEventId(newEventId);
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
    const updatedRecord = {
      ...currentEventRecord,
      [userId]: status
    };

    if (rtdb) {
      try {
        await set(ref(rtdb, `attendance/${selectedEventId}`), updatedRecord);
        return;
      } catch (err) {
        console.warn("RTDB set attendance failed, saving to local storage:", err);
      }
    }

    const updatedAttendance = {
      ...attendance,
      [selectedEventId]: updatedRecord
    };
    setAttendance(updatedAttendance);
    saveMockDB(users, events, updatedAttendance);
  };

  // Export Attendance to CSV
  const handleExportCSV = () => {
    const currentEvent = events.find(e => e.id === selectedEventId);
    if (!currentEvent) {
      alert('Select an event to export.');
      return;
    }

    const currentRecord = attendance[selectedEventId] || {};

    // Prepare data
    const exportData = users.map(user => {
      const status = currentRecord[user.id] || 'Absent';
      return {
        'Name': user.name,
        'Phone': user.phone,
        'الفرقة': user.classYear || '',
        'الكلية': user.college || '',
        'الخادم المسئول': user.servant1 || '',
        'الخادم المسئول2': user.servant2 || '',
        'Attendance Status': status
      };
    });

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    Xpath: XLSX.utils.book_append_sheet(workbook, worksheet, 'Attendance');

    // Write and trigger download
    XLSX.writeFile(workbook, `${currentEvent.name.replace(/\s+/g, '_')}_Attendance_${currentEvent.date}.xlsx`);
  };

  // Helper Stats calculations
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

  // Filtered users list based on search and selected filters
  const filteredUsers = users.filter(u => {
    const matchesSearch = u.name.toLowerCase().includes(userSearchQuery.toLowerCase()) ||
      u.department.toLowerCase().includes(userSearchQuery.toLowerCase()) ||
      u.memberId.toLowerCase().includes(userSearchQuery.toLowerCase()) ||
      (u.role && u.role.toLowerCase().includes(userSearchQuery.toLowerCase()));

    const matchesCollege = !selectedCollege || u.college === selectedCollege;
    const matchesRole = !selectedRole || u.role === selectedRole;
    const matchesDepartment = !selectedDepartment || u.department === selectedDepartment;

    return matchesSearch && matchesCollege && matchesRole && matchesDepartment;
  });

  // Non-logged-in View: Login screen
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
        isMockMode={isMockMode}
      />
    );
  }

  // Logged-in Dashboard Layout
  return (
    <div className="app-container">
      {/* Sidebar navigation */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentUser={currentUser}
        handleLogout={handleLogout}
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
      />

      {/* Main dashboard content workspace */}
      <main className="main-content">

        <div className="mobile-header">
          <button className="burger-btn" onClick={() => setIsSidebarOpen(true)} aria-label="Open menu">
            <Menu size={24} />
          </button>
          <span className="mobile-logo-text">SEF_Aftkad</span>
        </div>

        {isMockMode && (
          <div className="alert-banner alert-banner-info">
            <AlertTriangle size={20} />
            <span>Offline Mock Mode enabled. Connect real Firebase using environment variables.</span>
          </div>
        )}

        {/* Dashboard View */}
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

        {/* Users View */}
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

        {/* Events View */}
        {activeTab === 'events' && (
          <EventsView
            events={events}
            setSelectedEventId={setSelectedEventId}
            setActiveTab={setActiveTab}
            setShowAddEventModal={setShowAddEventModal}
          />
        )}

        {/* Attendance View */}
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

      {/* Add User Modal */}
      {showAddUserModal && (
        <AddUserModal
          userForm={userForm}
          setUserForm={setUserForm}
          handleAddUser={handleAddUser}
          setShowAddUserModal={setShowAddUserModal}
        />
      )}

      {/* Add Event Modal */}
      {showAddEventModal && (
        <AddEventModal
          eventForm={eventForm}
          setEventForm={setEventForm}
          handleAddEvent={handleAddEvent}
          setShowAddEventModal={setShowAddEventModal}
        />
      )}

      {/* Excel Import Preview Modal */}
      {showImportPreviewModal && (
        <ImportPreviewModal
          importedUsersPreview={importedUsersPreview}
          setImportedUsersPreview={setImportedUsersPreview}
          handleConfirmImport={handleConfirmImport}
          setShowImportPreviewModal={setShowImportPreviewModal}
        />
      )}

      {/* View User Details Modal */}
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
