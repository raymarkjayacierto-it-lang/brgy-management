import { Resident } from '../types/resident';
import { Household } from '../types/household';
import { DocumentRequest, DocumentTypeConfig } from '../types/document';
import { BlotterRecord } from '../types/blotter';
import { Complaint } from '../types/complaint';
import { Payment } from '../types/payment';
import { Official } from '../types/official';
import { AuditLog, NotificationItem, BarangaySettings } from '../types/system';

export const INITIAL_SETTINGS: BarangaySettings = {
  barangayName: 'Barangay San Isidro',
  municipality: 'Municipality of Cainta',
  province: 'Province of Rizal',
  region: 'Region IV-A (CALABARZON)',
  contactNumber: '(02) 8655-1234 / 0917-555-0199',
  email: 'sanisidro.cainta@rizal.gov.ph',
  officeHours: 'Monday – Friday, 8:00 AM – 5:00 PM',
  address: 'Barangay Hall Complex, A. Bonifacio Avenue, San Isidro, Cainta, Rizal 1900',
  captainName: 'Hon. Roberto M. Dela Rosa',
  secretaryName: 'Ms. Elena V. Bautista',
  treasurerName: 'Mr. Ricardo P. Santos',
  logoUrl: '/logo.png'
};

export const DOCUMENT_CONFIGS: DocumentTypeConfig[] = [
  {
    type: 'Barangay Clearance',
    fee: 50,
    processingTime: '15 - 30 minutes',
    requirements: ['Valid Government ID', 'Cedula / Community Tax Certificate', 'Proof of Residency (minimum 6 months)'],
    description: 'General clearance certifying good community standing, used for employment, postal ID, bank requirements, and general legal purposes.'
  },
  {
    type: 'Certificate of Indigency',
    fee: 0,
    processingTime: '10 - 20 minutes',
    requirements: ['Valid Government ID or School ID', 'Interview / Case Assessment by Barangay Social Worker'],
    description: 'Issued free of charge to indigent or low-income residents for medical assistance, financial subsidy, scholarship, or legal aid.'
  },
  {
    type: 'Certificate of Residency',
    fee: 50,
    processingTime: '15 - 20 minutes',
    requirements: ['Valid Government ID', 'Utility Bill or Lease Contract showing local address'],
    description: 'Official proof certifying that the applicant is a bonafide resident of Barangay San Isidro.'
  },
  {
    type: 'Certificate of Good Moral Character',
    fee: 50,
    processingTime: '20 - 30 minutes',
    requirements: ['Valid ID', 'No derogatory record in Barangay Blotter for the past 12 months'],
    description: 'Attests that the individual has no pending complaint or blotter record and observes good conduct.'
  },
  {
    type: 'Barangay Business Clearance',
    fee: 250,
    processingTime: '1 - 2 working days',
    requirements: ['DTI / SEC Registration', 'Barangay Inspection Clearance', 'Contract of Lease / Land Title'],
    description: 'Mandatory clearance for operating commercial or micro-business establishments located within the barangay jurisdiction.'
  },
  {
    type: 'Certificate of No Pending Case',
    fee: 50,
    processingTime: '15 - 30 minutes',
    requirements: ['Valid ID', 'Barangay Lupon Tagapamayapa Clearance check'],
    description: 'Certifies that the resident has no active or unresolved cases filed before the Lupong Tagapamayapa.'
  },
  {
    type: 'Certificate of Solo Parent',
    fee: 0,
    processingTime: '1 - 2 working days',
    requirements: ['Birth Certificate of Dependent Children', 'Affidavit of Solo Parent', 'Barangay Indigency / Assessment'],
    description: 'Endorsement certificate supporting application for Solo Parent ID pursuant to RA 8972.'
  }
];

export const INITIAL_RESIDENTS: Resident[] = [
  {
    id: 'res-1',
    residentNumber: 'RES-2026-000101',
    firstName: 'Juan',
    middleName: 'Mercado',
    lastName: 'Dela Cruz',
    birthDate: '1985-06-12',
    birthPlace: 'Cainta, Rizal',
    sex: 'Male',
    civilStatus: 'Married',
    nationality: 'Filipino',
    contactNumber: '0917-123-4567',
    email: 'juan.delacruz@gmail.com',
    address: {
      houseNumber: '124',
      street: 'Mabini Street',
      purok: 'Purok 1 - Pag-asa',
      barangay: 'San Isidro',
      municipality: 'Cainta',
      province: 'Rizal'
    },
    occupation: 'Civil Engineer',
    educationalAttainment: 'College Graduate',
    voterStatus: 'Registered',
    pwdStatus: false,
    seniorCitizenStatus: false,
    fourPsStatus: false,
    status: 'Active',
    householdId: 'hh-1',
    isHouseholdHead: true,
    createdAt: '2024-01-15T08:30:00Z',
    updatedAt: '2026-02-10T10:00:00Z'
  },
  {
    id: 'res-2',
    residentNumber: 'RES-2026-000102',
    firstName: 'Maria Clara',
    middleName: 'Santos',
    lastName: 'Dela Cruz',
    birthDate: '1988-09-24',
    birthPlace: 'Pasig City',
    sex: 'Female',
    civilStatus: 'Married',
    nationality: 'Filipino',
    contactNumber: '0918-234-5678',
    email: 'maria.santos@gmail.com',
    address: {
      houseNumber: '124',
      street: 'Mabini Street',
      purok: 'Purok 1 - Pag-asa',
      barangay: 'San Isidro',
      municipality: 'Cainta',
      province: 'Rizal'
    },
    occupation: 'Public School Teacher',
    educationalAttainment: 'College Graduate',
    voterStatus: 'Registered',
    pwdStatus: false,
    seniorCitizenStatus: false,
    fourPsStatus: false,
    status: 'Active',
    householdId: 'hh-1',
    isHouseholdHead: false,
    createdAt: '2024-01-15T08:30:00Z',
    updatedAt: '2026-02-10T10:00:00Z'
  },
  {
    id: 'res-3',
    residentNumber: 'RES-2026-000103',
    firstName: 'Antonio',
    middleName: 'Luna',
    lastName: 'Ramos',
    suffix: 'Jr.',
    birthDate: '1960-03-15',
    birthPlace: 'Cainta, Rizal',
    sex: 'Male',
    civilStatus: 'Widowed',
    nationality: 'Filipino',
    contactNumber: '0920-345-6789',
    email: 'antonio.ramos@yahoo.com',
    address: {
      houseNumber: '45-B',
      street: 'Rizal Avenue',
      purok: 'Purok 3 - Mabuhay',
      barangay: 'San Isidro',
      municipality: 'Cainta',
      province: 'Rizal'
    },
    occupation: 'Retired Government Employee',
    educationalAttainment: 'College Graduate',
    voterStatus: 'Registered',
    pwdStatus: false,
    seniorCitizenStatus: true,
    fourPsStatus: false,
    status: 'Active',
    householdId: 'hh-2',
    isHouseholdHead: true,
    createdAt: '2024-02-01T09:15:00Z',
    updatedAt: '2026-01-12T14:20:00Z'
  },
  {
    id: 'res-4',
    residentNumber: 'RES-2026-000104',
    firstName: 'Gabriela',
    middleName: 'Silang',
    lastName: 'Bautista',
    birthDate: '1992-11-04',
    birthPlace: 'Antipolo, Rizal',
    sex: 'Female',
    civilStatus: 'Single',
    nationality: 'Filipino',
    contactNumber: '0922-456-7890',
    email: 'gabriela.bautista@outlook.com',
    address: {
      houseNumber: '78',
      street: 'Bonifacio St.',
      purok: 'Purok 2 - Maligaya',
      barangay: 'San Isidro',
      municipality: 'Cainta',
      province: 'Rizal'
    },
    occupation: 'Call Center Specialist',
    educationalAttainment: 'College Undergraduate',
    voterStatus: 'Registered',
    pwdStatus: false,
    seniorCitizenStatus: false,
    fourPsStatus: false,
    status: 'Active',
    householdId: 'hh-3',
    isHouseholdHead: true,
    createdAt: '2024-03-10T11:00:00Z',
    updatedAt: '2026-02-28T09:40:00Z'
  },
  {
    id: 'res-5',
    residentNumber: 'RES-2026-000105',
    firstName: 'Eduardo',
    middleName: 'Gomez',
    lastName: 'Villanueva',
    birthDate: '1975-08-20',
    birthPlace: 'Caloocan City',
    sex: 'Male',
    civilStatus: 'Married',
    nationality: 'Filipino',
    contactNumber: '0919-567-8901',
    address: {
      houseNumber: '12',
      street: 'San Pedro Subd.',
      purok: 'Purok 4 - Masagana',
      barangay: 'San Isidro',
      municipality: 'Cainta',
      province: 'Rizal'
    },
    occupation: 'Tricycle Driver',
    educationalAttainment: 'High School Graduate',
    voterStatus: 'Registered',
    pwdStatus: false,
    seniorCitizenStatus: false,
    fourPsStatus: true,
    status: 'Active',
    householdId: 'hh-4',
    isHouseholdHead: true,
    createdAt: '2024-04-05T13:30:00Z',
    updatedAt: '2026-03-01T16:15:00Z'
  },
  {
    id: 'res-6',
    residentNumber: 'RES-2026-000106',
    firstName: 'Teresa',
    middleName: 'Magbanua',
    lastName: 'Villanueva',
    birthDate: '1978-05-14',
    birthPlace: 'Taytay, Rizal',
    sex: 'Female',
    civilStatus: 'Married',
    nationality: 'Filipino',
    contactNumber: '0927-678-9012',
    address: {
      houseNumber: '12',
      street: 'San Pedro Subd.',
      purok: 'Purok 4 - Masagana',
      barangay: 'San Isidro',
      municipality: 'Cainta',
      province: 'Rizal'
    },
    occupation: 'Sari-Sari Store Owner',
    educationalAttainment: 'High School Graduate',
    voterStatus: 'Registered',
    pwdStatus: false,
    seniorCitizenStatus: false,
    fourPsStatus: true,
    status: 'Active',
    householdId: 'hh-4',
    isHouseholdHead: false,
    createdAt: '2024-04-05T13:30:00Z',
    updatedAt: '2026-03-01T16:15:00Z'
  },
  {
    id: 'res-7',
    residentNumber: 'RES-2026-000107',
    firstName: 'Danilo',
    middleName: 'Aquino',
    lastName: 'Morales',
    birthDate: '1998-02-18',
    birthPlace: 'Cainta, Rizal',
    sex: 'Male',
    civilStatus: 'Single',
    nationality: 'Filipino',
    contactNumber: '0935-789-0123',
    email: 'danilo.morales@gmail.com',
    address: {
      houseNumber: '201',
      street: 'Sampaguita St.',
      purok: 'Purok 5 - Kaunlaran',
      barangay: 'San Isidro',
      municipality: 'Cainta',
      province: 'Rizal'
    },
    occupation: 'Graphic Designer',
    educationalAttainment: 'College Graduate',
    voterStatus: 'Registered',
    pwdStatus: true,
    seniorCitizenStatus: false,
    fourPsStatus: false,
    status: 'Active',
    createdAt: '2024-05-12T10:20:00Z',
    updatedAt: '2026-01-20T11:00:00Z'
  },
  {
    id: 'res-8',
    residentNumber: 'RES-2026-000108',
    firstName: 'Corazon',
    middleName: 'Cojuangco',
    lastName: 'Mendoza',
    birthDate: '1955-01-25',
    birthPlace: 'Tarlac City',
    sex: 'Female',
    civilStatus: 'Widowed',
    nationality: 'Filipino',
    contactNumber: '0915-890-1234',
    address: {
      houseNumber: '88',
      street: 'Ilang-Ilang Alley',
      purok: 'Purok 6 - Kalinisan',
      barangay: 'San Isidro',
      municipality: 'Cainta',
      province: 'Rizal'
    },
    occupation: 'Homemaker / Pensioner',
    educationalAttainment: 'Vocational',
    voterStatus: 'Registered',
    pwdStatus: false,
    seniorCitizenStatus: true,
    fourPsStatus: false,
    status: 'Active',
    createdAt: '2024-06-18T14:45:00Z',
    updatedAt: '2026-02-15T08:50:00Z'
  },
  {
    id: 'res-9',
    residentNumber: 'RES-2026-000109',
    firstName: 'Felipe',
    middleName: 'Castillo',
    lastName: 'Agoncillo',
    birthDate: '2005-10-10',
    birthPlace: 'Cainta, Rizal',
    sex: 'Male',
    civilStatus: 'Single',
    nationality: 'Filipino',
    contactNumber: '0998-901-2345',
    email: 'felipe.agoncillo@student.edu.ph',
    address: {
      houseNumber: '15',
      street: 'Camia Lane',
      purok: 'Purok 7 - Mapayapa',
      barangay: 'San Isidro',
      municipality: 'Cainta',
      province: 'Rizal'
    },
    occupation: 'College Student',
    educationalAttainment: 'College Undergraduate',
    voterStatus: 'Registered',
    pwdStatus: false,
    seniorCitizenStatus: false,
    fourPsStatus: false,
    status: 'Active',
    createdAt: '2024-07-22T09:00:00Z',
    updatedAt: '2026-03-02T13:20:00Z'
  },
  {
    id: 'res-10',
    residentNumber: 'RES-2026-000110',
    firstName: 'Rodrigo',
    middleName: 'Roa',
    lastName: 'Navarro',
    birthDate: '1970-04-12',
    birthPlace: 'Davao City',
    sex: 'Male',
    civilStatus: 'Married',
    nationality: 'Filipino',
    contactNumber: '0921-012-3456',
    address: {
      houseNumber: '64',
      street: 'Mabini Street',
      purok: 'Purok 1 - Pag-asa',
      barangay: 'San Isidro',
      municipality: 'Cainta',
      province: 'Rizal'
    },
    occupation: 'Security Officer',
    educationalAttainment: 'High School Graduate',
    voterStatus: 'Registered',
    pwdStatus: false,
    seniorCitizenStatus: false,
    fourPsStatus: false,
    status: 'Active',
    createdAt: '2024-08-01T15:10:00Z',
    updatedAt: '2026-02-18T17:00:00Z'
  },
  {
    id: 'res-11',
    residentNumber: 'RES-2026-000111',
    firstName: 'Liza',
    middleName: 'Araneta',
    lastName: 'Navarro',
    birthDate: '1973-07-19',
    birthPlace: 'Iloilo City',
    sex: 'Female',
    civilStatus: 'Married',
    nationality: 'Filipino',
    contactNumber: '0929-123-7890',
    address: {
      houseNumber: '64',
      street: 'Mabini Street',
      purok: 'Purok 1 - Pag-asa',
      barangay: 'San Isidro',
      municipality: 'Cainta',
      province: 'Rizal'
    },
    occupation: 'Dressmaker',
    educationalAttainment: 'High School Graduate',
    voterStatus: 'Registered',
    pwdStatus: false,
    seniorCitizenStatus: false,
    fourPsStatus: false,
    status: 'Active',
    createdAt: '2024-08-01T15:10:00Z',
    updatedAt: '2026-02-18T17:00:00Z'
  },
  {
    id: 'res-12',
    residentNumber: 'RES-2026-000112',
    firstName: 'Benigno',
    middleName: 'Cojuangco',
    lastName: 'Mendoza',
    birthDate: '1982-02-08',
    birthPlace: 'Manila',
    sex: 'Male',
    civilStatus: 'Separated',
    nationality: 'Filipino',
    contactNumber: '0947-234-8901',
    address: {
      houseNumber: '88',
      street: 'Ilang-Ilang Alley',
      purok: 'Purok 6 - Kalinisan',
      barangay: 'San Isidro',
      municipality: 'Cainta',
      province: 'Rizal'
    },
    occupation: 'Auto Mechanic',
    educationalAttainment: 'Vocational',
    voterStatus: 'Unregistered',
    pwdStatus: false,
    seniorCitizenStatus: false,
    fourPsStatus: false,
    status: 'Archived',
    createdAt: '2024-09-10T11:40:00Z',
    updatedAt: '2026-01-05T09:00:00Z'
  }
];

export const INITIAL_HOUSEHOLDS: Household[] = [
  {
    id: 'hh-1',
    householdNumber: 'HH-2026-0001',
    headResidentId: 'res-1',
    headName: 'Juan M. Dela Cruz',
    address: '124 Mabini Street, Purok 1 - Pag-asa',
    purok: 'Purok 1 - Pag-asa',
    memberResidentIds: ['res-1', 'res-2'],
    membersCount: 2,
    incomeBracket: 'Middle (₱25,000 - ₱50,000)',
    housingType: 'Owned',
    status: 'Active',
    createdAt: '2024-01-15T08:30:00Z',
    updatedAt: '2026-02-10T10:00:00Z'
  },
  {
    id: 'hh-2',
    householdNumber: 'HH-2026-0002',
    headResidentId: 'res-3',
    headName: 'Antonio L. Ramos Jr.',
    address: '45-B Rizal Avenue, Purok 3 - Mabuhay',
    purok: 'Purok 3 - Mabuhay',
    memberResidentIds: ['res-3'],
    membersCount: 1,
    incomeBracket: 'Lower Middle (₱10,000 - ₱25,000)',
    housingType: 'Owned',
    status: 'Active',
    createdAt: '2024-02-01T09:15:00Z',
    updatedAt: '2026-01-12T14:20:00Z'
  },
  {
    id: 'hh-3',
    householdNumber: 'HH-2026-0003',
    headResidentId: 'res-4',
    headName: 'Gabriela S. Bautista',
    address: '78 Bonifacio St., Purok 2 - Maligaya',
    purok: 'Purok 2 - Maligaya',
    memberResidentIds: ['res-4'],
    membersCount: 1,
    incomeBracket: 'Middle (₱25,000 - ₱50,000)',
    housingType: 'Rented',
    status: 'Active',
    createdAt: '2024-03-10T11:00:00Z',
    updatedAt: '2026-02-28T09:40:00Z'
  },
  {
    id: 'hh-4',
    householdNumber: 'HH-2026-0004',
    headResidentId: 'res-5',
    headName: 'Eduardo G. Villanueva',
    address: '12 San Pedro Subd., Purok 4 - Masagana',
    purok: 'Purok 4 - Masagana',
    memberResidentIds: ['res-5', 'res-6'],
    membersCount: 2,
    incomeBracket: 'Low Income (Below ₱10,000)',
    housingType: 'Living with Relatives',
    status: 'Active',
    createdAt: '2024-04-05T13:30:00Z',
    updatedAt: '2026-03-01T16:15:00Z'
  }
];

export const INITIAL_DOCUMENT_REQUESTS: DocumentRequest[] = [
  {
    id: 'req-1',
    requestNumber: 'REQ-2026-000101',
    residentId: 'res-1',
    residentName: 'Juan M. Dela Cruz',
    residentAddress: '124 Mabini Street, Purok 1 - Pag-asa, Cainta, Rizal',
    documentType: 'Barangay Clearance',
    purpose: 'Local Employment Application at DPWH',
    fee: 50,
    status: 'RELEASED',
    dateRequested: '2026-09-01T08:30:00Z',
    dateProcessed: '2026-09-01T09:15:00Z',
    dateReleased: '2026-09-01T09:45:00Z',
    assignedStaff: 'Elena V. Bautista (Secretary)',
    documentNumber: 'DOC-2026-000145',
    verificationCode: 'VERIF-2026-89412A',
    officialReceiptNumber: 'OR-2026-00912',
    signatoryOfficial: 'Hon. Roberto M. Dela Rosa',
    signatoryPosition: 'Punong Barangay'
  },
  {
    id: 'req-2',
    requestNumber: 'REQ-2026-000102',
    residentId: 'res-4',
    residentName: 'Gabriela S. Bautista',
    residentAddress: '78 Bonifacio St., Purok 2 - Maligaya, Cainta, Rizal',
    documentType: 'Certificate of Residency',
    purpose: 'Opening Bank Account at Landbank Cainta Branch',
    fee: 50,
    status: 'GENERATED',
    dateRequested: '2026-09-03T10:15:00Z',
    dateProcessed: '2026-09-03T11:00:00Z',
    assignedStaff: 'Elena V. Bautista (Secretary)',
    documentNumber: 'DOC-2026-000148',
    verificationCode: 'VERIF-2026-77821B',
    officialReceiptNumber: 'OR-2026-00918',
    signatoryOfficial: 'Hon. Roberto M. Dela Rosa',
    signatoryPosition: 'Punong Barangay'
  },
  {
    id: 'req-3',
    requestNumber: 'REQ-2026-000103',
    residentId: 'res-5',
    residentName: 'Eduardo G. Villanueva',
    residentAddress: '12 San Pedro Subd., Purok 4 - Masagana, Cainta, Rizal',
    documentType: 'Certificate of Indigency',
    purpose: 'Medical Assistance at Cainta Municipal Hospital',
    fee: 0,
    status: 'APPROVED',
    dateRequested: '2026-09-04T09:00:00Z',
    dateProcessed: '2026-09-04T10:30:00Z',
    assignedStaff: 'Elena V. Bautista (Secretary)',
    signatoryOfficial: 'Hon. Roberto M. Dela Rosa',
    signatoryPosition: 'Punong Barangay'
  },
  {
    id: 'req-4',
    requestNumber: 'REQ-2026-000104',
    residentId: 'res-7',
    residentName: 'Danilo A. Morales',
    residentAddress: '201 Sampaguita St., Purok 5 - Kaunlaran, Cainta, Rizal',
    documentType: 'Certificate of Good Moral Character',
    purpose: 'Scholarship Application for Graduate Studies',
    fee: 50,
    status: 'FOR_VERIFICATION',
    dateRequested: '2026-09-04T13:45:00Z',
    assignedStaff: 'Elena V. Bautista (Secretary)'
  },
  {
    id: 'req-5',
    requestNumber: 'REQ-2026-000105',
    residentId: 'res-6',
    residentName: 'Teresa M. Villanueva',
    residentAddress: '12 San Pedro Subd., Purok 4 - Masagana, Cainta, Rizal',
    documentType: 'Barangay Business Clearance',
    purpose: 'Renewal of Sari-Sari Store Permit',
    fee: 250,
    status: 'REQUESTED',
    dateRequested: '2026-09-04T15:20:00Z'
  },
  {
    id: 'req-6',
    requestNumber: 'REQ-2026-000098',
    residentId: 'res-9',
    residentName: 'Felipe C. Agoncillo',
    residentAddress: '15 Camia Lane, Purok 7 - Mapayapa, Cainta, Rizal',
    documentType: 'Barangay Clearance',
    purpose: 'Passport Application at DFA',
    fee: 50,
    status: 'REJECTED',
    dateRequested: '2026-08-28T14:10:00Z',
    dateProcessed: '2026-08-29T09:00:00Z',
    assignedStaff: 'Elena V. Bautista (Secretary)',
    rejectionReason: 'Invalid identification submitted. Please present a primary Philippine government ID.'
  }
];

export const INITIAL_BLOTTER_RECORDS: BlotterRecord[] = [
  {
    id: 'blt-1',
    blotterNumber: 'BLT-2026-000012',
    dateReported: '2026-08-25',
    incidentDate: '2026-08-24',
    incidentTime: '21:30',
    location: 'Corner Mabini St. & Rizal Ave, Purok 1',
    incidentType: 'Noise Disturbance',
    narrative: 'Complainant reported excessive loud videoke music and rowdy singing past 10:00 PM causing public disturbance to neighboring households on a Sunday night.',
    status: 'RESOLVED',
    complainants: [
      { name: 'Juan M. Dela Cruz', contact: '0917-123-4567', address: '124 Mabini St.' }
    ],
    respondents: [
      { name: 'Rodrigo R. Navarro', contact: '0921-012-3456', address: '64 Mabini St.' }
    ],
    witnesses: [
      { name: 'Antonio L. Ramos Jr.', address: '45-B Rizal Ave' }
    ],
    recordedBy: 'Desk Officer Tanod Crisanto Ramos',
    assignedOfficer: 'Chief Tanod Mario V. Cruz',
    mediationDate: '2026-08-26',
    actionsTaken: 'Both parties invited to the Barangay Hall for Lupon Tagapamayapa dialogue.',
    resolution: 'Amicable settlement signed (Kasunduan). Respondent agreed to respect the barangay curfew on loud audio devices strictly at 10:00 PM.',
    closedDate: '2026-08-26T15:00:00Z',
    createdAt: '2026-08-25T08:00:00Z',
    updatedAt: '2026-08-26T15:00:00Z'
  },
  {
    id: 'blt-2',
    blotterNumber: 'BLT-2026-000015',
    dateReported: '2026-09-02',
    incidentDate: '2026-09-01',
    incidentTime: '17:45',
    location: 'Boundary Fence, Bonifacio St., Purok 2',
    incidentType: 'Property Dispute',
    narrative: 'Dispute regarding alleged encroachment of concrete perimeter fence along the boundary line of two adjacent lots.',
    status: 'FOR_MEDIATION',
    complainants: [
      { name: 'Gabriela S. Bautista', contact: '0922-456-7890', address: '78 Bonifacio St.' }
    ],
    respondents: [
      { name: 'Manuel P. Roxas', contact: '0919-888-2211', address: '80 Bonifacio St.' }
    ],
    recordedBy: 'Elena V. Bautista (Secretary)',
    assignedOfficer: 'Hon. Roberto M. Dela Rosa (Punong Barangay)',
    mediationDate: '2026-09-10',
    actionsTaken: 'Issued First Notice of Barangay Mediation Hearing to respondent.',
    createdAt: '2026-09-02T10:30:00Z',
    updatedAt: '2026-09-03T11:00:00Z'
  },
  {
    id: 'blt-3',
    blotterNumber: 'BLT-2026-000018',
    dateReported: '2026-09-04',
    incidentDate: '2026-09-04',
    incidentTime: '07:15',
    location: 'Public Market Access Road, Purok 4',
    incidentType: 'Physical Altercation',
    narrative: 'Heated verbal argument that escalated into pushing between two vendor assistants over stall space.',
    status: 'OPEN',
    complainants: [
      { name: 'Eduardo G. Villanueva', contact: '0919-567-8901', address: '12 San Pedro Subd.' }
    ],
    respondents: [
      { name: 'Ramon S. Magtanggol', address: 'Purok 4 Public Market' }
    ],
    recordedBy: 'Desk Officer Tanod Crisanto Ramos',
    assignedOfficer: 'Chief Tanod Mario V. Cruz',
    actionsTaken: 'Incident logged. Assigned for preliminary inquiry and Lupon notice issuance.',
    createdAt: '2026-09-04T08:30:00Z',
    updatedAt: '2026-09-04T08:30:00Z'
  }
];

export const INITIAL_COMPLAINTS: Complaint[] = [
  {
    id: 'cmp-1',
    complaintNumber: 'CMP-2026-000031',
    complainantName: 'Antonio L. Ramos Jr.',
    complainantContact: '0920-345-6789',
    complainantAddress: '45-B Rizal Avenue, Purok 3',
    respondentName: 'Nearby Commercial Carwash',
    category: 'Sanitation & Garbage',
    description: 'Improper drainage of soapy water runoff flowing into residential sidewalk, creating slippery hazard for elderly pedestrians.',
    dateFiled: '2026-08-30',
    priority: 'High',
    assignedStaff: 'Kag. Fernando Poe (Committee on Health & Sanitation)',
    status: 'IN_PROGRESS',
    resolution: 'Barangay Health Inspector issued corrective inspection order with 5-day grace period.',
    createdAt: '2026-08-30T09:00:00Z',
    updatedAt: '2026-09-02T14:30:00Z'
  },
  {
    id: 'cmp-2',
    complaintNumber: 'CMP-2026-000034',
    complainantName: 'Maria Clara S. Dela Cruz',
    complainantContact: '0918-234-5678',
    category: 'Street Lighting / Road Issue',
    description: 'Two busted streetlight bulbs along Mabini St. near corner Rizal Ave, making the area pitch black at night and prone to safety concerns.',
    dateFiled: '2026-09-02',
    priority: 'Medium',
    assignedStaff: 'Kag. Ramon Mitra (Committee on Infrastructure)',
    status: 'RESOLVED',
    resolution: 'Barangay maintenance electrician replaced two 50W LED solar lamps on Sept 3, 2026.',
    actionDate: '2026-09-03',
    createdAt: '2026-09-02T11:20:00Z',
    updatedAt: '2026-09-03T16:00:00Z'
  },
  {
    id: 'cmp-3',
    complaintNumber: 'CMP-2026-000036',
    complainantName: 'Corazon C. Mendoza',
    complainantContact: '0915-890-1234',
    complainantAddress: '88 Ilang-Ilang Alley, Purok 6',
    category: 'Illegal Parking',
    description: 'Delivery truck continuously parked obstructing the narrow residential alleyway entrance, blocking ambulance and emergency egress.',
    dateFiled: '2026-09-04',
    priority: 'High',
    assignedStaff: 'Chief Tanod Mario V. Cruz',
    status: 'UNDER_REVIEW',
    createdAt: '2026-09-04T10:00:00Z',
    updatedAt: '2026-09-04T10:00:00Z'
  }
];

export const INITIAL_PAYMENTS: Payment[] = [
  {
    id: 'pay-1',
    paymentNumber: 'PAY-2026-000411',
    officialReceiptNumber: 'OR-2026-00912',
    referenceNumber: 'REQ-2026-000101',
    residentId: 'res-1',
    residentName: 'Juan M. Dela Cruz',
    documentType: 'Barangay Clearance',
    amount: 50,
    paymentMethod: 'Cash',
    date: '2026-09-01T09:15:00Z',
    processedBy: 'Ricardo P. Santos (Treasurer)',
    status: 'Completed',
    notes: 'Exact payment received.',
    createdAt: '2026-09-01T09:15:00Z'
  },
  {
    id: 'pay-2',
    paymentNumber: 'PAY-2026-000412',
    officialReceiptNumber: 'OR-2026-00918',
    referenceNumber: 'REQ-2026-000102',
    residentId: 'res-4',
    residentName: 'Gabriela S. Bautista',
    documentType: 'Certificate of Residency',
    amount: 50,
    paymentMethod: 'GCash',
    date: '2026-09-03T11:00:00Z',
    processedBy: 'Ricardo P. Santos (Treasurer)',
    status: 'Completed',
    notes: 'GCash Ref # 902148912',
    createdAt: '2026-09-03T11:00:00Z'
  },
  {
    id: 'pay-3',
    paymentNumber: 'PAY-2026-000413',
    officialReceiptNumber: 'OR-2026-00920',
    referenceNumber: 'REQ-2026-000085',
    residentId: 'res-10',
    residentName: 'Rodrigo R. Navarro',
    documentType: 'Barangay Clearance',
    amount: 50,
    paymentMethod: 'Cash',
    date: '2026-09-04T09:30:00Z',
    processedBy: 'Ricardo P. Santos (Treasurer)',
    status: 'Completed',
    createdAt: '2026-09-04T09:30:00Z'
  }
];

export const INITIAL_OFFICIALS: Official[] = [
  {
    id: 'off-1',
    name: 'Hon. Roberto M. Dela Rosa',
    position: 'Punong Barangay',
    committee: 'Executive & Peace and Order',
    contactNumber: '0917-500-1101',
    email: 'captain.delarosa@cainta.gov.ph',
    termStart: '2023-11-01',
    termEnd: '2026-11-01',
    status: 'Active',
    order: 1
  },
  {
    id: 'off-2',
    name: 'Hon. Fernando P. Poe Jr.',
    position: 'Barangay Kagawad',
    committee: 'Health, Sanitation & Environment',
    contactNumber: '0918-500-1102',
    email: 'kag.poe@cainta.gov.ph',
    termStart: '2023-11-01',
    termEnd: '2026-11-01',
    status: 'Active',
    order: 2
  },
  {
    id: 'off-3',
    name: 'Hon. Ramon B. Mitra',
    position: 'Barangay Kagawad',
    committee: 'Public Works & Infrastructure',
    contactNumber: '0919-500-1103',
    email: 'kag.mitra@cainta.gov.ph',
    termStart: '2023-11-01',
    termEnd: '2026-11-01',
    status: 'Active',
    order: 3
  },
  {
    id: 'off-4',
    name: 'Hon. Miriam D. Santiago',
    position: 'Barangay Kagawad',
    committee: 'Rules, Ethics, Ordinances & Human Rights',
    contactNumber: '0920-500-1104',
    email: 'kag.santiago@cainta.gov.ph',
    termStart: '2023-11-01',
    termEnd: '2026-11-01',
    status: 'Active',
    order: 4
  },
  {
    id: 'off-5',
    name: 'Hon. Claro M. Recto',
    position: 'Barangay Kagawad',
    committee: 'Budget, Finance & Appropriations',
    contactNumber: '0921-500-1105',
    email: 'kag.recto@cainta.gov.ph',
    termStart: '2023-11-01',
    termEnd: '2026-11-01',
    status: 'Active',
    order: 5
  },
  {
    id: 'off-6',
    name: 'Hon. Maria Teresa L. Aquino',
    position: 'Barangay Kagawad',
    committee: 'Women, Family & Senior Citizens Welfare',
    contactNumber: '0922-500-1106',
    email: 'kag.aquino@cainta.gov.ph',
    termStart: '2023-11-01',
    termEnd: '2026-11-01',
    status: 'Active',
    order: 6
  },
  {
    id: 'off-7',
    name: 'Hon. Joshua R. Alcantara',
    position: 'SK Chairperson',
    committee: 'Youth & Sports Development',
    contactNumber: '0923-500-1107',
    email: 'sk.alcantara@cainta.gov.ph',
    termStart: '2023-11-01',
    termEnd: '2026-11-01',
    status: 'Active',
    order: 7
  },
  {
    id: 'off-8',
    name: 'Ms. Elena V. Bautista',
    position: 'Barangay Secretary',
    committee: 'Administrative & Records Management',
    contactNumber: '0924-500-1108',
    email: 'sec.bautista@cainta.gov.ph',
    termStart: '2023-11-01',
    termEnd: '2026-11-01',
    status: 'Active',
    order: 8
  },
  {
    id: 'off-9',
    name: 'Mr. Ricardo P. Santos',
    position: 'Barangay Treasurer',
    committee: 'Treasury & Revenue Collection',
    contactNumber: '0925-500-1109',
    email: 'treasurer.santos@cainta.gov.ph',
    termStart: '2023-11-01',
    termEnd: '2026-11-01',
    status: 'Active',
    order: 9
  },
  {
    id: 'off-10',
    name: 'Mr. Mario V. Cruz',
    position: 'Chief Tanod',
    committee: 'Peace & Order / Barangay Tanod Brigade',
    contactNumber: '0926-500-1110',
    email: 'chieftanod.cruz@cainta.gov.ph',
    termStart: '2023-11-01',
    termEnd: '2026-11-01',
    status: 'Active',
    order: 10
  }
];

export const INITIAL_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'aud-1',
    user: 'Hon. Roberto M. Dela Rosa',
    userRole: 'Punong Barangay',
    action: 'Approved Document Request',
    module: 'Documents',
    recordId: 'REQ-2026-000101',
    details: 'Barangay Clearance for Juan M. Dela Cruz approved for issuance',
    timestamp: '2026-09-01T09:15:00Z',
    ipAddress: '192.168.1.10'
  },
  {
    id: 'aud-2',
    user: 'Ricardo P. Santos',
    userRole: 'Barangay Treasurer',
    action: 'Recorded Payment',
    module: 'Payments',
    recordId: 'OR-2026-00912',
    details: 'Collected ₱50.00 cash fee for REQ-2026-000101',
    timestamp: '2026-09-01T09:16:00Z',
    ipAddress: '192.168.1.15'
  },
  {
    id: 'aud-3',
    user: 'Elena V. Bautista',
    userRole: 'Barangay Secretary',
    action: 'Updated Resident Record',
    module: 'Residents',
    recordId: 'RES-2026-000104',
    details: 'Updated contact number and address details for Gabriela S. Bautista',
    timestamp: '2026-09-02T14:30:00Z',
    ipAddress: '192.168.1.12'
  },
  {
    id: 'aud-4',
    user: 'Desk Officer Tanod Crisanto Ramos',
    userRole: 'Staff',
    action: 'Created Blotter Entry',
    module: 'Blotter',
    recordId: 'BLT-2026-000018',
    details: 'Logged physical altercation at Public Market Access Road',
    timestamp: '2026-09-04T08:30:00Z',
    ipAddress: '192.168.1.20'
  }
];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    title: 'New Document Request Filed',
    message: 'Teresa M. Villanueva submitted a request for Barangay Business Clearance.',
    type: 'info',
    timestamp: '10 minutes ago',
    isRead: false,
    link: '/admin/documents'
  },
  {
    id: 'notif-2',
    title: 'Payment Received via GCash',
    message: '₱50.00 payment received for Certificate of Residency (REQ-2026-000102).',
    type: 'success',
    timestamp: '1 hour ago',
    isRead: false,
    link: '/admin/payments'
  },
  {
    id: 'notif-3',
    title: 'Blotter Mediation Scheduled',
    message: 'Lupon Tagapamayapa hearing scheduled for BLT-2026-000015 on Sept 10.',
    type: 'warning',
    timestamp: '3 hours ago',
    isRead: true,
    link: '/admin/blotter'
  },
  {
    id: 'notif-4',
    title: 'Urgent Complaint Logged',
    message: 'Complaint filed regarding obstructed emergency lane in Purok 6.',
    type: 'error',
    timestamp: '5 hours ago',
    isRead: true,
    link: '/admin/complaints'
  }
];
