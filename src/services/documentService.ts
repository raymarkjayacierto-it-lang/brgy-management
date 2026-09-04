import { DocumentRequest, DocumentRequestStatus, DocumentTypeConfig } from '../types/document';
import { INITIAL_DOCUMENT_REQUESTS, DOCUMENT_CONFIGS } from '../data/mockData';

const STORAGE_KEY = 'bms_document_requests';

function getStoredRequests(): DocumentRequest[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_DOCUMENT_REQUESTS));
      return INITIAL_DOCUMENT_REQUESTS;
    }
    return JSON.parse(data);
  } catch {
    return INITIAL_DOCUMENT_REQUESTS;
  }
}

function saveStoredRequests(requests: DocumentRequest[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(requests));
}

const delay = (ms: number = 150) => new Promise(resolve => setTimeout(resolve, ms));

export const documentService = {
  getDocumentConfigs(): DocumentTypeConfig[] {
    return DOCUMENT_CONFIGS;
  },

  async getDocumentRequests(filter?: { status?: string; search?: string; type?: string }): Promise<DocumentRequest[]> {
    await delay();
    let list = getStoredRequests();

    if (!filter) return list;

    if (filter.status) {
      list = list.filter(r => r.status === filter.status);
    }

    if (filter.type) {
      list = list.filter(r => r.documentType === filter.type);
    }

    if (filter.search) {
      const q = filter.search.toLowerCase().trim();
      list = list.filter(r =>
        r.requestNumber.toLowerCase().includes(q) ||
        r.residentName.toLowerCase().includes(q) ||
        r.documentType.toLowerCase().includes(q) ||
        (r.documentNumber && r.documentNumber.toLowerCase().includes(q)) ||
        (r.verificationCode && r.verificationCode.toLowerCase().includes(q))
      );
    }

    return list;
  },

  async getDocumentRequestById(id: string): Promise<DocumentRequest | null> {
    await delay();
    const list = getStoredRequests();
    return list.find(r => r.id === id) || null;
  },

  async createDocumentRequest(data: Omit<DocumentRequest, 'id' | 'requestNumber' | 'status' | 'dateRequested'>): Promise<DocumentRequest> {
    await delay();
    const list = getStoredRequests();
    const year = new Date().getFullYear();
    const count = list.length + 1;
    const requestNumber = `REQ-${year}-${String(count).padStart(6, '0')}`;

    const newRequest: DocumentRequest = {
      ...data,
      id: 'req-' + Date.now(),
      requestNumber,
      status: 'REQUESTED',
      dateRequested: new Date().toISOString()
    };

    list.unshift(newRequest);
    saveStoredRequests(list);
    return newRequest;
  },

  async updateDocumentRequestStatus(
    id: string,
    status: DocumentRequestStatus,
    metadata?: Partial<DocumentRequest>
  ): Promise<DocumentRequest> {
    await delay();
    const list = getStoredRequests();
    const index = list.findIndex(r => r.id === id);
    if (index === -1) throw new Error('Document request not found');

    const current = list[index];
    const updated: DocumentRequest = {
      ...current,
      ...metadata,
      status
    };

    // If changing to GENERATED, ensure documentNumber and verificationCode exist
    if (status === 'GENERATED' && !updated.documentNumber) {
      const year = new Date().getFullYear();
      const count = list.filter(r => r.documentNumber).length + 1;
      updated.documentNumber = `DOC-${year}-${String(count).padStart(6, '0')}`;
      const randomCode = Math.random().toString(36).substring(2, 7).toUpperCase();
      updated.verificationCode = `VERIF-${year}-${randomCode}`;
      updated.dateProcessed = new Date().toISOString();
      updated.signatoryOfficial = updated.signatoryOfficial || 'Hon. Roberto M. Dela Rosa';
      updated.signatoryPosition = updated.signatoryPosition || 'Punong Barangay';
    }

    if (status === 'RELEASED') {
      updated.dateReleased = new Date().toISOString();
    }

    list[index] = updated;
    saveStoredRequests(list);
    return updated;
  },

  async verifyDocument(codeOrNumber: string): Promise<DocumentRequest | null> {
    await delay();
    const list = getStoredRequests();
    const clean = codeOrNumber.trim().toUpperCase();
    const found = list.find(r => 
      (r.documentNumber && r.documentNumber.toUpperCase() === clean) ||
      (r.verificationCode && r.verificationCode.toUpperCase() === clean) ||
      (r.requestNumber && r.requestNumber.toUpperCase() === clean)
    );
    return found || null;
  }
};
