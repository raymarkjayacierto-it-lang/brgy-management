export type UserRole = 'Admin' | 'Captain' | 'Secretary' | 'Treasurer' | 'Staff' | 'Resident';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
  residentId?: string; // If role is Resident
}

export interface AuditLog {
  id: string;
  user: string;
  userRole: string;
  action: string;
  module: 'Residents' | 'Households' | 'Documents' | 'Blotter' | 'Complaints' | 'Payments' | 'Officials' | 'Settings';
  recordId: string;
  details?: string;
  timestamp: string;
  ipAddress: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: string;
  isRead: boolean;
  link?: string;
}

export interface BarangaySettings {
  barangayName: string;
  municipality: string;
  province: string;
  region: string;
  contactNumber: string;
  email: string;
  officeHours: string;
  address: string;
  captainName: string;
  secretaryName: string;
  treasurerName: string;
  logoUrl?: string;
  sealUrl?: string;
}
