export type OfficialPosition = 
  | 'Punong Barangay'
  | 'Barangay Kagawad'
  | 'SK Chairperson'
  | 'Barangay Secretary'
  | 'Barangay Treasurer'
  | 'Chief Tanod'
  | 'Barangay Administrator'
  | 'Barangay Health Worker';

export interface Official {
  id: string;
  name: string;
  position: OfficialPosition;
  committee?: string;
  contactNumber: string;
  email: string;
  termStart: string;
  termEnd: string;
  status: 'Active' | 'Inactive';
  photoUrl?: string;
  order: number;
}
