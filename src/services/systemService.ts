import { AuditLog, NotificationItem, BarangaySettings } from '../types/system';
import { INITIAL_AUDIT_LOGS, INITIAL_NOTIFICATIONS, INITIAL_SETTINGS } from '../data/mockData';

const AUDIT_KEY = 'bms_audit_logs';
const NOTIF_KEY = 'bms_notifications';
const SETTINGS_KEY = 'bms_settings';

const delay = (ms: number = 100) => new Promise(resolve => setTimeout(resolve, ms));

export const auditService = {
  async getAuditLogs(): Promise<AuditLog[]> {
    await delay();
    try {
      const data = localStorage.getItem(AUDIT_KEY);
      if (!data) {
        localStorage.setItem(AUDIT_KEY, JSON.stringify(INITIAL_AUDIT_LOGS));
        return INITIAL_AUDIT_LOGS;
      }
      return JSON.parse(data);
    } catch {
      return INITIAL_AUDIT_LOGS;
    }
  },

  async logAction(
    user: string,
    userRole: string,
    action: string,
    module: AuditLog['module'],
    recordId: string,
    details?: string
  ): Promise<void> {
    try {
      const logs = await this.getAuditLogs();
      const newLog: AuditLog = {
        id: 'aud-' + Date.now(),
        user,
        userRole,
        action,
        module,
        recordId,
        details,
        timestamp: new Date().toISOString(),
        ipAddress: '192.168.1.' + Math.floor(Math.random() * 50 + 10)
      };
      logs.unshift(newLog);
      localStorage.setItem(AUDIT_KEY, JSON.stringify(logs.slice(0, 100)));
    } catch {
      // safe fallback
    }
  }
};

export const notificationService = {
  async getNotifications(): Promise<NotificationItem[]> {
    await delay();
    try {
      const data = localStorage.getItem(NOTIF_KEY);
      if (!data) {
        localStorage.setItem(NOTIF_KEY, JSON.stringify(INITIAL_NOTIFICATIONS));
        return INITIAL_NOTIFICATIONS;
      }
      return JSON.parse(data);
    } catch {
      return INITIAL_NOTIFICATIONS;
    }
  },

  async markAsRead(id: string): Promise<void> {
    const list = await this.getNotifications();
    const item = list.find(n => n.id === id);
    if (item) {
      item.isRead = true;
      localStorage.setItem(NOTIF_KEY, JSON.stringify(list));
    }
  },

  async markAllAsRead(): Promise<void> {
    const list = await this.getNotifications();
    list.forEach(n => { n.isRead = true; });
    localStorage.setItem(NOTIF_KEY, JSON.stringify(list));
  }
};

export const settingsService = {
  async getSettings(): Promise<BarangaySettings> {
    await delay();
    try {
      const data = localStorage.getItem(SETTINGS_KEY);
      if (!data) {
        localStorage.setItem(SETTINGS_KEY, JSON.stringify(INITIAL_SETTINGS));
        return INITIAL_SETTINGS;
      }
      return JSON.parse(data);
    } catch {
      return INITIAL_SETTINGS;
    }
  },

  async updateSettings(data: Partial<BarangaySettings>): Promise<BarangaySettings> {
    await delay();
    const current = await this.getSettings();
    const updated = { ...current, ...data };
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(updated));
    return updated;
  }
};
