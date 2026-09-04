import { Household } from '../types/household';
import { INITIAL_HOUSEHOLDS } from '../data/mockData';

const STORAGE_KEY = 'bms_households';

function getStoredHouseholds(): Household[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_HOUSEHOLDS));
      return INITIAL_HOUSEHOLDS;
    }
    return JSON.parse(data);
  } catch {
    return INITIAL_HOUSEHOLDS;
  }
}

function saveStoredHouseholds(households: Household[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(households));
}

const delay = (ms: number = 150) => new Promise(resolve => setTimeout(resolve, ms));

export const householdService = {
  async getHouseholds(purok?: string, search?: string): Promise<Household[]> {
    await delay();
    let list = getStoredHouseholds().filter(h => h.status !== 'Archived');

    if (purok) {
      list = list.filter(h => h.purok === purok);
    }

    if (search) {
      const q = search.toLowerCase().trim();
      list = list.filter(h =>
        h.householdNumber.toLowerCase().includes(q) ||
        h.headName.toLowerCase().includes(q) ||
        h.address.toLowerCase().includes(q)
      );
    }

    return list;
  },

  async getHouseholdById(id: string): Promise<Household | null> {
    await delay();
    const list = getStoredHouseholds();
    return list.find(h => h.id === id) || null;
  },

  async createHousehold(data: Omit<Household, 'id' | 'householdNumber' | 'createdAt' | 'updatedAt'>): Promise<Household> {
    await delay();
    const list = getStoredHouseholds();
    const count = list.length + 1;
    const year = new Date().getFullYear();
    const householdNumber = `HH-${year}-${String(count).padStart(4, '0')}`;

    const newHousehold: Household = {
      ...data,
      id: 'hh-' + Date.now(),
      householdNumber,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    list.unshift(newHousehold);
    saveStoredHouseholds(list);
    return newHousehold;
  },

  async updateHousehold(id: string, data: Partial<Household>): Promise<Household> {
    await delay();
    const list = getStoredHouseholds();
    const index = list.findIndex(h => h.id === id);
    if (index === -1) throw new Error('Household not found');

    const updated = {
      ...list[index],
      ...data,
      updatedAt: new Date().toISOString()
    };

    list[index] = updated;
    saveStoredHouseholds(list);
    return updated;
  },

  async archiveHousehold(id: string): Promise<Household> {
    return this.updateHousehold(id, { status: 'Archived' });
  }
};
