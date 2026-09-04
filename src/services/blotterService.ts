import { BlotterRecord, BlotterStatus } from '../types/blotter';
import { INITIAL_BLOTTER_RECORDS } from '../data/mockData';

const STORAGE_KEY = 'bms_blotter_records';

function getStoredBlotter(): BlotterRecord[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_BLOTTER_RECORDS));
      return INITIAL_BLOTTER_RECORDS;
    }
    return JSON.parse(data);
  } catch {
    return INITIAL_BLOTTER_RECORDS;
  }
}

function saveStoredBlotter(records: BlotterRecord[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
}

const delay = (ms: number = 150) => new Promise(resolve => setTimeout(resolve, ms));

export const blotterService = {
  async getBlotterRecords(filter?: { status?: string; search?: string; type?: string }): Promise<BlotterRecord[]> {
    await delay();
    let list = getStoredBlotter();

    if (!filter) return list;

    if (filter.status) {
      list = list.filter(b => b.status === filter.status);
    }

    if (filter.type) {
      list = list.filter(b => b.incidentType === filter.type);
    }

    if (filter.search) {
      const q = filter.search.toLowerCase().trim();
      list = list.filter(b =>
        b.blotterNumber.toLowerCase().includes(q) ||
        b.incidentType.toLowerCase().includes(q) ||
        b.location.toLowerCase().includes(q) ||
        b.narrative.toLowerCase().includes(q) ||
        b.complainants.some(c => c.name.toLowerCase().includes(q)) ||
        b.respondents.some(r => r.name.toLowerCase().includes(q))
      );
    }

    return list;
  },

  async getBlotterById(id: string): Promise<BlotterRecord | null> {
    await delay();
    const list = getStoredBlotter();
    return list.find(b => b.id === id) || null;
  },

  async createBlotterRecord(data: Omit<BlotterRecord, 'id' | 'blotterNumber' | 'createdAt' | 'updatedAt'>): Promise<BlotterRecord> {
    await delay();
    const list = getStoredBlotter();
    const year = new Date().getFullYear();
    const count = list.length + 1;
    const blotterNumber = `BLT-${year}-${String(count).padStart(6, '0')}`;

    const newRecord: BlotterRecord = {
      ...data,
      id: 'blt-' + Date.now(),
      blotterNumber,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    list.unshift(newRecord);
    saveStoredBlotter(list);
    return newRecord;
  },

  async updateBlotterRecord(id: string, data: Partial<BlotterRecord>): Promise<BlotterRecord> {
    await delay();
    const list = getStoredBlotter();
    const index = list.findIndex(b => b.id === id);
    if (index === -1) throw new Error('Blotter record not found');

    const updated: BlotterRecord = {
      ...list[index],
      ...data,
      updatedAt: new Date().toISOString()
    };

    if (data.status === 'RESOLVED' || data.status === 'CLOSED') {
      updated.closedDate = updated.closedDate || new Date().toISOString();
    }

    list[index] = updated;
    saveStoredBlotter(list);
    return updated;
  },

  async updateStatus(id: string, status: BlotterStatus, resolution?: string): Promise<BlotterRecord> {
    return this.updateBlotterRecord(id, {
      status,
      resolution: resolution || undefined
    });
  }
};
