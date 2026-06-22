export interface UserProfile {
  id: string;
  name: string;
  phone: string;
  department: string;
  memberId: string;
  role: 'خادم' | 'مخدوم';
  classYear?: string;
  college?: string;
  section?: string;
  servant1?: string;
  servant2?: string;
  originalChurch?: string;
  serviceType?: string;
  address?: string;
  hobbies?: string;
  deptYear?: string;
}

export interface EventItem {
  id: string;
  name: string;
  date: string;
  description: string;
}

export interface AttendanceRecord {
  [userId: string]: 'Present' | 'Absent' | undefined;
}

export interface DBState {
  users: UserProfile[];
  events: EventItem[];
  attendance: { [eventId: string]: AttendanceRecord };
}
