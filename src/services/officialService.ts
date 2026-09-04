import { Official } from '../types/official';
import { INITIAL_OFFICIALS } from '../data/mockData';

const STORAGE_KEY = 'bms_officials';

function getStoredOfficials(): Official[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_OFFICIALS));
      return INITIAL_OFFICIALS;
    }
    return JSON.parse(data);
  } catch {
    return INITIAL_OFFICIALS;
  }
}

function saveStoredOfficials(officials: Official[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(officials));
}

const delay = (ms: number = 150) => new Promise(resolve => setTimeout(resolve, ms));

export const officialService = {
  async getOfficials(): Promise<Official[]> {
    await delay();
    return getStoredOfficials().sort((a, b) => a.order - b.order);
  },

  async createOfficial(data: Omit<Official, 'id'>): Promise<Official> {
    await delay();
    const list = getStoredOfficials();
    const newOfficial: Official = {
      ...data,
      id: 'off-' + Date.now()
    };
    list.push(newOfficial);
    saveStoredOfficials(list);
    return newOfficial;
  },

  async updateOfficial(id: string, data: Partial<Official>): Promise<Official> {
    await delay();
    const list = getStoredOfficials();
    const index = list.findIndex(o => o.id === id);
    if (index === -1) throw new Error('Official not found');

    const updated = {
      ...list[index],
      ...data
    };
    list[index] = updated;
    saveStoredOfficials(list);
    return updated;
  }
};
