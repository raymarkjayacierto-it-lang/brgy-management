export type Sex = 'Male' | 'Female' | 'Other';
export type CivilStatus = 'Single' | 'Married' | 'Widowed' | 'Separated' | 'Divorced';
export type ResidentStatus = 'Active' | 'Inactive' | 'Archived';
export type VoterStatus = 'Registered' | 'Unregistered';

export interface ResidentAddress {
  houseNumber: string;
  street: string;
  purok: string;
  barangay: string;
  municipality: string;
  province: string;
}

export interface Resident {
  id: string;
  residentNumber: string; // e.g. RES-2026-000145
  firstName: string;
  middleName?: string;
  lastName: string;
  suffix?: string;
  birthDate: string; // YYYY-MM-DD
  birthPlace: string;
  sex: Sex;
  civilStatus: CivilStatus;
  nationality: string;
  
  // Contact
  contactNumber: string;
  email?: string;
  
  // Address
  address: ResidentAddress;
  
  // Additional
  occupation: string;
  educationalAttainment: string;
  voterStatus: VoterStatus;
  pwdStatus: boolean;
  seniorCitizenStatus: boolean;
  fourPsStatus: boolean;
  status: ResidentStatus;
  householdId?: string;
  isHouseholdHead?: boolean;
  avatarUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ResidentFilterOptions {
  search?: string;
  purok?: string;
  sex?: string;
  civilStatus?: string;
  status?: string;
  voterStatus?: string;
  seniorOnly?: boolean;
  pwdOnly?: boolean;
  fourPsOnly?: boolean;
}
