export type BlotterStatus = 
  | 'OPEN'
  | 'UNDER_INVESTIGATION'
  | 'FOR_MEDIATION'
  | 'RESOLVED'
  | 'REFERRED'
  | 'CLOSED';

export interface BlotterParty {
  name: string;
  contact?: string;
  address?: string;
  statement?: string;
}

export interface BlotterRecord {
  id: string;
  blotterNumber: string; // e.g. BLT-2026-0045
  dateReported: string; // YYYY-MM-DD
  incidentDate: string;
  incidentTime: string;
  location: string;
  incidentType: 'Physical Altercation' | 'Property Dispute' | 'Noise Disturbance' | 'Theft / Loss' | 'Defamation / Slander' | 'Neighborhood Conflict' | 'Other';
  narrative: string;
  status: BlotterStatus;
  
  complainants: BlotterParty[];
  respondents: BlotterParty[];
  witnesses?: BlotterParty[];
  
  recordedBy: string;
  assignedOfficer: string;
  mediationDate?: string;
  actionsTaken?: string;
  resolution?: string;
  settlementTerms?: string;
  closedDate?: string;
  createdAt: string;
  updatedAt: string;
}
