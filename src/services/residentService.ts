import { Resident, ResidentFilterOptions } from '../types/resident';
import { INITIAL_RESIDENTS } from '../data/mockData';

const STORAGE_KEY = 'bms_residents';

function getStoredResidents(): Resident[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_RESIDENTS));
      return INITIAL_RESIDENTS;
    }
    return JSON.parse(data);
  } catch {
    return INITIAL_RESIDENTS;
  }
}

function saveStoredResidents(residents: Resident[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(residents));
}

// Simulated network delay
const delay = (ms: number = 150) => new Promise(resolve => setTimeout(resolve, ms));

export const residentService = {
  async getResidents(filters?: ResidentFilterOptions): Promise<Resident[]> {
    await delay();
    let list = getStoredResidents();

    if (!filters) return list;

    if (filters.search) {
      const q = filters.search.toLowerCase().trim();
      list = list.filter(r => 
        r.firstName.toLowerCase().includes(q) ||
        r.lastName.toLowerCase().includes(q) ||
        r.residentNumber.toLowerCase().includes(q) ||
        r.contactNumber.includes(q) ||
        (r.email && r.email.toLowerCase().includes(q))
      );
    }

    if (filters.purok) {
      list = list.filter(r => r.address.purok === filters.purok);
    }

    if (filters.sex) {
      list = list.filter(r => r.sex === filters.sex);
    }

    if (filters.civilStatus) {
      list = list.filter(r => r.civilStatus === filters.civilStatus);
    }

    if (filters.status) {
      list = list.filter(r => r.status === filters.status);
    } else {
      // Default: exclude archived unless specified
      list = list.filter(r => r.status !== 'Archived');
    }

    if (filters.voterStatus) {
      list = list.filter(r => r.voterStatus === filters.voterStatus);
    }

    if (filters.seniorOnly) {
      list = list.filter(r => r.seniorCitizenStatus);
    }

    if (filters.pwdOnly) {
      list = list.filter(r => r.pwdStatus);
    }

    if (filters.fourPsOnly) {
      list = list.filter(r => r.fourPsStatus);
    }

    return list;
  },

  async getResidentById(id: string): Promise<Resident | null> {
    await delay();
    const list = getStoredResidents();
    return list.find(r => r.id === id) || null;
  },

  async createResident(data: Omit<Resident, 'id' | 'residentNumber' | 'createdAt' | 'updatedAt'>): Promise<Resident> {
    await delay();
    const list = getStoredResidents();
    const count = list.length + 1;
    const year = new Date().getFullYear();
    const padded = String(count).padStart(6, '0');
    const residentNumber = `RES-${year}-${padded}`;

    const newResident: Resident = {
      ...data,
      id: 'res-' + Date.now(),
      residentNumber,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    list.unshift(newResident);
    saveStoredResidents(list);
    return newResident;
  },

  async updateResident(id: string, data: Partial<Resident>): Promise<Resident> {
    await delay();
    const list = getStoredResidents();
    const index = list.findIndex(r => r.id === id);
    if (index === -1) {
      throw new Error('Resident not found');
    }

    const updated = {
      ...list[index],
      ...data,
      updatedAt: new Date().toISOString()
    };

    list[index] = updated;
    saveStoredResidents(list);
    return updated;
  },

  async archiveResident(id: string): Promise<Resident> {
    return this.updateResident(id, { status: 'Archived' });
  },

  async restoreResident(id: string): Promise<Resident> {
    return this.updateResident(id, { status: 'Active' });
  }
};
