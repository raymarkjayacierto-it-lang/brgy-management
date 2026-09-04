export type DocumentType = 
  | 'Barangay Clearance'
  | 'Certificate of Residency'
  | 'Certificate of Indigency'
  | 'Certificate of Good Moral Character'
  | 'Barangay Business Clearance'
  | 'Certificate of No Pending Case'
  | 'Certificate of Solo Parent';

export type DocumentRequestStatus = 
  | 'REQUESTED'
  | 'FOR_VERIFICATION'
  | 'APPROVED'
  | 'FOR_PAYMENT'
  | 'PAID'
  | 'GENERATING'
  | 'GENERATED'
  | 'RELEASED'
  | 'REJECTED';

export interface DocumentTypeConfig {
  type: DocumentType;
  fee: number;
  processingTime: string;
  requirements: string[];
  description: string;
}

export interface DocumentRequest {
  id: string;
  requestNumber: string; // e.g. REQ-2026-000124
  residentId: string;
  residentName: string;
  residentAddress: string;
  documentType: DocumentType;
  purpose: string;
  additionalInfo?: string;
  fee: number;
  status: DocumentRequestStatus;
  dateRequested: string;
  dateProcessed?: string;
  dateReleased?: string;
  assignedStaff?: string;
  rejectionReason?: string;
  
  // Generated document metadata
  documentNumber?: string; // e.g. DOC-2026-000145
  verificationCode?: string; // e.g. VERIF-98234-XYZ
  officialReceiptNumber?: string;
  signatoryOfficial?: string;
  signatoryPosition?: string;
  remarks?: string;
}
