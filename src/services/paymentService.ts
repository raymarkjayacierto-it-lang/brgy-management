import { Payment } from '../types/payment';
import { INITIAL_PAYMENTS } from '../data/mockData';

const STORAGE_KEY = 'bms_payments';

function getStoredPayments(): Payment[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_PAYMENTS));
      return INITIAL_PAYMENTS;
    }
    return JSON.parse(data);
  } catch {
    return INITIAL_PAYMENTS;
  }
}

function saveStoredPayments(payments: Payment[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(payments));
}

const delay = (ms: number = 150) => new Promise(resolve => setTimeout(resolve, ms));

export const paymentService = {
  async getPayments(filter?: { method?: string; search?: string; startDate?: string; endDate?: string }): Promise<Payment[]> {
    await delay();
    let list = getStoredPayments();

    if (!filter) return list;

    if (filter.method) {
      list = list.filter(p => p.paymentMethod === filter.method);
    }

    if (filter.search) {
      const q = filter.search.toLowerCase().trim();
      list = list.filter(p =>
        p.officialReceiptNumber.toLowerCase().includes(q) ||
        p.referenceNumber.toLowerCase().includes(q) ||
        p.residentName.toLowerCase().includes(q) ||
        p.documentType.toLowerCase().includes(q) ||
        p.paymentNumber.toLowerCase().includes(q)
      );
    }

    return list;
  },

  async getPaymentById(id: string): Promise<Payment | null> {
    await delay();
    const list = getStoredPayments();
    return list.find(p => p.id === id) || null;
  },

  async createPayment(data: Omit<Payment, 'id' | 'paymentNumber' | 'officialReceiptNumber' | 'createdAt'>): Promise<Payment> {
    await delay();
    const list = getStoredPayments();
    const year = new Date().getFullYear();
    const count = list.length + 1;
    const paymentNumber = `PAY-${year}-${String(count).padStart(6, '0')}`;
    const officialReceiptNumber = `OR-${year}-${String(900 + count).padStart(5, '0')}`;

    const newPayment: Payment = {
      ...data,
      id: 'pay-' + Date.now(),
      paymentNumber,
      officialReceiptNumber,
      createdAt: new Date().toISOString()
    };

    list.unshift(newPayment);
    saveStoredPayments(list);
    return newPayment;
  }
};
