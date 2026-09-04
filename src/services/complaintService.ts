import { Complaint, ComplaintStatus } from '../types/complaint';
import { INITIAL_COMPLAINTS } from '../data/mockData';

const STORAGE_KEY = 'bms_complaints';

function getStoredComplaints(): Complaint[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_COMPLAINTS));
      return INITIAL_COMPLAINTS;
    }
    return JSON.parse(data);
  } catch {
    return INITIAL_COMPLAINTS;
  }
}

function saveStoredComplaints(complaints: Complaint[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(complaints));
}

const delay = (ms: number = 150) => new Promise(resolve => setTimeout(resolve, ms));

export const complaintService = {
  async getComplaints(filter?: { status?: string; search?: string; category?: string }): Promise<Complaint[]> {
    await delay();
    let list = getStoredComplaints();

    if (!filter) return list;

    if (filter.status) {
      list = list.filter(c => c.status === filter.status);
    }

    if (filter.category) {
      list = list.filter(c => c.category === filter.category);
    }

    if (filter.search) {
      const q = filter.search.toLowerCase().trim();
      list = list.filter(c =>
        c.complaintNumber.toLowerCase().includes(q) ||
        c.complainantName.toLowerCase().includes(q) ||
        (c.respondentName && c.respondentName.toLowerCase().includes(q)) ||
        c.description.toLowerCase().includes(q)
      );
    }

    return list;
  },

  async getComplaintById(id: string): Promise<Complaint | null> {
    await delay();
    const list = getStoredComplaints();
    return list.find(c => c.id === id) || null;
  },

  async createComplaint(data: Omit<Complaint, 'id' | 'complaintNumber' | 'createdAt' | 'updatedAt'>): Promise<Complaint> {
    await delay();
    const list = getStoredComplaints();
    const year = new Date().getFullYear();
    const count = list.length + 1;
    const complaintNumber = `CMP-${year}-${String(count).padStart(6, '0')}`;

    const newComplaint: Complaint = {
      ...data,
      id: 'cmp-' + Date.now(),
      complaintNumber,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    list.unshift(newComplaint);
    saveStoredComplaints(list);
    return newComplaint;
  },

  async updateComplaint(id: string, data: Partial<Complaint>): Promise<Complaint> {
    await delay();
    const list = getStoredComplaints();
    const index = list.findIndex(c => c.id === id);
    if (index === -1) throw new Error('Complaint not found');

    const updated: Complaint = {
      ...list[index],
      ...data,
      updatedAt: new Date().toISOString()
    };

    list[index] = updated;
    saveStoredComplaints(list);
    return updated;
  },

  async updateStatus(id: string, status: ComplaintStatus, resolution?: string): Promise<Complaint> {
    return this.updateComplaint(id, {
      status,
      resolution: resolution || undefined,
      actionDate: (status === 'RESOLVED' || status === 'CLOSED') ? new Date().toISOString().split('T')[0] : undefined
    });
  }
};
