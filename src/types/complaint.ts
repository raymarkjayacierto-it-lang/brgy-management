export type ComplaintStatus = 
  | 'SUBMITTED'
  | 'UNDER_REVIEW'
  | 'IN_PROGRESS'
  | 'RESOLVED'
  | 'REJECTED'
  | 'CLOSED';

export type ComplaintPriority = 'Low' | 'Medium' | 'High' | 'Urgent';

export interface Complaint {
  id: string;
  complaintNumber: string; // e.g. CMP-2026-0032
  complainantName: string;
  complainantContact: string;
  complainantAddress?: string;
  respondentName?: string;
  respondentAddress?: string;
  category: 'Public Disturbance' | 'Sanitation & Garbage' | 'Barangay Services' | 'Street Lighting / Road Issue' | 'Illegal Parking' | 'Other';
  description: string;
  dateFiled: string;
  priority: ComplaintPriority;
  assignedStaff: string;
  status: ComplaintStatus;
  resolution?: string;
  actionDate?: string;
  createdAt: string;
  updatedAt: string;
}
