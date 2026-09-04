import React, { useState, useEffect } from 'react';
import { notificationService } from '../../services/systemService';
import { NotificationItem } from '../../types/system';
import { PageHeader } from '../../components/ui/PageHeader';
import { Button } from '../../components/ui/Button';
import { EmptyState, LoadingState } from '../../components/ui/Feedback';
import { useToast } from '../../context/ToastContext';
import { Bell, Check, CheckCircle2, AlertCircle, AlertTriangle, ExternalLink } from 'lucide-react';

export const NotificationsPage: React.FC<{
  onNavigate: (route: string) => void;
}> = ({ onNavigate }) => {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  const loadData = async () => {
    setLoading(true);
    try {
      const list = await notificationService.getNotifications();
      setNotifications(list);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleMarkAllRead = async () => {
    await notificationService.markAllAsRead();
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    showToast('All notifications marked as read', 'info');
  };

  const handleMarkSingleRead = async (id: string) => {
    await notificationService.markAsRead(id);
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  const getIcon = (type: NotificationItem['type']) => {
    switch (type) {
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />;
      case 'success':
        return <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />;
      default:
        return <Bell className="w-5 h-5 text-blue-500 shrink-0" />;
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="space-y-6">
      <PageHeader
        title="System Notifications"
        subtitle="Real-time alerts, document status updates, and emergency blotter alerts."
        actions={
          unreadCount > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleMarkAllRead}
              leftIcon={<Check className="w-4 h-4" />}
            >
              Mark all as read
            </Button>
          )
        }
      />

      {loading ? (
        <LoadingState message="Loading notification feed..." />
      ) : notifications.length === 0 ? (
        <EmptyState
          title="No notifications"
          description="You are completely caught up! No active alerts."
        />
      ) : (
        <div className="bg-white rounded-xl border border-[#E2E8F0] divide-y divide-slate-100 shadow-xs overflow-hidden">
          {notifications.map(notif => (
            <div
              key={notif.id}
              className={`p-4 sm:p-5 flex items-start gap-4 transition-colors ${
                !notif.isRead ? 'bg-blue-50/40' : 'hover:bg-slate-50'
              }`}
            >
              <div className="mt-0.5">{getIcon(notif.type)}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-sm font-bold text-slate-900 leading-tight">
                    {notif.title}
                  </h3>
                  {!notif.isRead && (
                    <span className="w-2 h-2 rounded-full bg-blue-600" />
                  )}
                  <span className="text-xs text-slate-400 ml-auto">
                    {notif.timestamp}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
                  {notif.message}
                </p>
                <div className="mt-3 flex items-center gap-3">
                  {notif.link && (
                    <button
                      type="button"
                      onClick={() => {
                        handleMarkSingleRead(notif.id);
                        onNavigate(notif.link!);
                      }}
                      className="text-xs font-semibold text-blue-700 hover:text-blue-900 inline-flex items-center gap-1 cursor-pointer"
                    >
                      <span>Go to Record</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  )}
                  {!notif.isRead && (
                    <button
                      type="button"
                      onClick={() => handleMarkSingleRead(notif.id)}
                      className="text-xs text-slate-500 hover:text-slate-800 cursor-pointer"
                    >
                      Mark as read
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
