export type PaymentMethod = 'Cash' | 'GCash' | 'Maya' | 'Bank Transfer';
export type PaymentStatus = 'Completed' | 'Pending' | 'Refunded';

export interface Payment {
  id: string;
  paymentNumber: string; // e.g. PAY-2026-000412
  officialReceiptNumber: string; // e.g. OR-8923412
  referenceNumber: string; // Related Document Request / Clearance ID
  residentId: string;
  residentName: string;
  documentType: string;
  amount: number;
  paymentMethod: PaymentMethod;
  date: string;
  processedBy: string;
  status: PaymentStatus;
  notes?: string;
  createdAt: string;
}
