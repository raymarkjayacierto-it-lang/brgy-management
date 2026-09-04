export interface Household {
  id: string;
  householdNumber: string; // e.g. HH-2026-0089
  headResidentId: string;
  headName: string;
  address: string;
  purok: string;
  memberResidentIds: string[];
  membersCount: number;
  incomeBracket: 'Low Income (Below ₱10,000)' | 'Lower Middle (₱10,000 - ₱25,000)' | 'Middle (₱25,000 - ₱50,000)' | 'Upper (Above ₱50,000)';
  housingType: 'Owned' | 'Rented' | 'Informal Settler' | 'Living with Relatives';
  status: 'Active' | 'Archived';
  createdAt: string;
  updatedAt: string;
}
