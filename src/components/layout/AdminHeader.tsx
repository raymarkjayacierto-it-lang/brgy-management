import React, { useState, useRef, useEffect } from 'react';
import { 
  Bell, 
  Search, 
  Menu, 
  User as UserIcon, 
  LogOut, 
  Check, 
  Shield, 
  ExternalLink,
  ChevronDown,
  ChevronRight,
  Home,
  FileCheck2,
  AlertCircle
} from 'lucide-react';
import { useAuth, DEMO_ACCOUNTS } from '../../context/AuthContext';
import { notificationService } from '../../services/systemService';
import { NotificationItem } from '../../types/system';
import { useToast } from '../../context/ToastContext';

export interface AdminHeaderProps {
  onToggleSidebar: () => void;
  onNavigate: (route: string) => void;
  currentRoute?: string;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({
  onToggleSidebar,
  onNavigate,
  currentRoute = '/admin/dashboard'
}) => {
  const { currentUser, logout, switchRole } = useAuth();
  const { showToast } = useToast();
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const notifRef = useRef<HTMLDivElement>(null);
  const userRef = useRef<HTMLDivElement>(null);

  const getBreadcrumbs = (route: string): { label: string; path?: string }[] => {
    const cleanRoute = route ? route.split('?')[0] : '/admin/dashboard';

    switch (cleanRoute) {
      case '/admin/dashboard':
        return [{ label: 'Dashboard' }];
      case '/admin/residents':
        return [{ label: 'Registry' }, { label: 'Residents', path: '/admin/residents' }];
      case '/admin/households':
        return [{ label: 'Registry' }, { label: 'Households', path: '/admin/households' }];
      case '/admin/documents':
      case '/admin/documents/requests':
        return [{ label: 'Documents', path: '/admin/documents' }, { label: 'Requests Pipeline' }];
      case '/admin/documents/issued':
        return [{ label: 'Documents', path: '/admin/documents' }, { label: 'Issued Registry' }];
      case '/admin/blotter':
        return [{ label: 'Peace & Order' }, { label: 'Blotter Records', path: '/admin/blotter' }];
      case '/admin/complaints':
        return [{ label: 'Peace & Order' }, { label: 'Citizen Complaints', path: '/admin/complaints' }];
      case '/admin/payments':
        return [{ label: 'Finance' }, { label: 'Collections & OR', path: '/admin/payments' }];
      case '/admin/officials':
        return [{ label: 'Governance' }, { label: 'Barangay Officials', path: '/admin/officials' }];
      case '/admin/reports':
        return [{ label: 'Analytics' }, { label: 'Reports & Demographics', path: '/admin/reports' }];
      case '/admin/notifications':
        return [{ label: 'System' }, { label: 'Notifications', path: '/admin/notifications' }];
      case '/admin/audit-logs':
        return [{ label: 'System' }, { label: 'Audit Trail', path: '/admin/audit-logs' }];
      case '/admin/settings':
        return [{ label: 'System' }, { label: 'Settings & Config', path: '/admin/settings' }];
      default: {
        if (cleanRoute.startsWith('/verify/')) {
          return [{ label: 'Verification', path: cleanRoute }, { label: cleanRoute.replace('/verify/', '') }];
        }
        const segments = cleanRoute.replace('/admin/', '').split('/').filter(Boolean);
        return segments.map(s => ({
          label: s.charAt(0).toUpperCase() + s.slice(1).replace(/-/g, ' ')
        }));
      }
    }
  };

  const breadcrumbs = getBreadcrumbs(currentRoute);

  useEffect(() => {
    notificationService.getNotifications().then(setNotifications);
  }, []);

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifMenu(false);
      }
      if (userRef.current && !userRef.current.contains(e.target as Node)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const handleMarkAllRead = async () => {
    await notificationService.markAllAsRead();
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    showToast('All notifications marked as read', 'info');
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    // Default search jumps to residents page with query
    onNavigate(`/admin/residents?q=${encodeURIComponent(searchQuery.trim())}`);
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-gov-border bg-white px-4 sm:px-6 shadow-xs no-print">
      {/* Left side: Hamburger + Dynamic Breadcrumbs */}
      <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 mr-2">
        <button
          type="button"
          onClick={onToggleSidebar}
          className="p-2 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 lg:hidden cursor-pointer shrink-0"
          aria-label="Toggle Navigation Sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Dynamic Breadcrumbs Navigation */}
        <nav className="flex items-center gap-1.5 text-xs text-gov-text-secondary overflow-hidden py-1" aria-label="Breadcrumb">
          <button
            type="button"
            onClick={() => onNavigate('/admin/dashboard')}
            className="inline-flex items-center gap-1.5 text-slate-500 hover:text-gov-primary transition-colors cursor-pointer font-medium shrink-0"
            title="Go to Dashboard"
          >
            <Home className="w-3.5 h-3.5 text-slate-400" />
            <span className="hidden md:inline font-semibold">Admin</span>
          </button>

          {breadcrumbs.map((item, index) => {
            const isLast = index === breadcrumbs.length - 1;
            return (
              <React.Fragment key={index}>
                <ChevronRight className="w-3.5 h-3.5 text-slate-300 shrink-0" />
                {item.path && !isLast ? (
                  <button
                    type="button"
                    onClick={() => onNavigate(item.path!)}
                    className="hover:text-gov-primary transition-colors cursor-pointer font-medium truncate max-w-28 sm:max-w-none text-slate-600"
                  >
                    {item.label}
                  </button>
                ) : (
                  <span
                    className={`truncate max-w-40 sm:max-w-none ${
                      isLast
                        ? 'font-bold text-gov-text-primary text-xs sm:text-sm'
                        : 'font-medium text-slate-600'
                    }`}
                  >
                    {item.label}
                  </span>
                )}
              </React.Fragment>
            );
          })}
        </nav>
      </div>

      {/* Center: Global Search */}
      <div className="flex-1 max-w-md mx-4 hidden md:block">
        <form onSubmit={handleSearchSubmit} className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search residents, requests (e.g. REQ-2026-000101)..."
            className="w-full h-9 pl-9 pr-4 text-xs rounded-lg border border-[#CBD5E1] bg-slate-50/70 focus:bg-white focus:outline-none focus:ring-2 focus:ring-gov-primary focus:border-gov-primary transition-all"
          />
        </form>
      </div>

      {/* Right side: Verification shortcut, Notifications, User Profile */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Quick QR Verify button */}
        <button
          type="button"
          onClick={() => onNavigate('/verify/DOC-2026-000145')}
          className="hidden xl:inline-flex items-center gap-1.5 text-xs font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer"
          title="Open Public QR Document Verification Page"
        >
          <FileCheck2 className="w-3.5 h-3.5" />
          <span>Verify QR</span>
        </button>

        {/* Notification Bell Dropdown */}
        <div className="relative" ref={notifRef}>
          <button
            type="button"
            onClick={() => setShowNotifMenu(!showNotifMenu)}
            className="relative p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
            aria-label="View notifications"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-600 px-1 text-[10px] font-bold text-white ring-2 ring-white">
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifMenu && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-xl border border-slate-200 bg-white shadow-xl py-2 z-50 animate-in fade-in zoom-in-95 duration-100">
              <div className="flex items-center justify-between px-4 py-2 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-800">
                    Notifications
                  </span>
                  {unreadCount > 0 && (
                    <span className="bg-blue-100 text-blue-800 text-[11px] font-semibold px-2 py-0.5 rounded-full">
                      {unreadCount} new
                    </span>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button
                    type="button"
                    onClick={handleMarkAllRead}
                    className="text-xs text-blue-600 hover:text-blue-800 font-medium cursor-pointer"
                  >
                    Mark all read
                  </button>
                )}
              </div>

              <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                {notifications.length === 0 ? (
                  <div className="p-6 text-center text-xs text-slate-500">
                    No new notifications
                  </div>
                ) : (
                  notifications.map(notif => (
                    <div
                      key={notif.id}
                      onClick={() => {
                        setShowNotifMenu(false);
                        if (notif.link) onNavigate(notif.link);
                      }}
                      className={`p-3 hover:bg-slate-50 transition-colors cursor-pointer flex items-start gap-3 ${
                        !notif.isRead ? 'bg-blue-50/50' : ''
                      }`}
                    >
                      <div className="mt-0.5 shrink-0">
                        {notif.type === 'error' ? (
                          <AlertCircle className="w-4 h-4 text-red-500" />
                        ) : notif.type === 'success' ? (
                          <Check className="w-4 h-4 text-emerald-500" />
                        ) : (
                          <Bell className="w-4 h-4 text-blue-500" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-slate-900 leading-snug">
                          {notif.title}
                        </p>
                        <p className="text-xs text-slate-600 line-clamp-2 mt-0.5">
                          {notif.message}
                        </p>
                        <span className="text-[10px] text-slate-400 mt-1 block">
                          {notif.timestamp}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="px-4 py-2 border-t border-slate-100 text-center bg-slate-50/70">
                <button
                  type="button"
                  onClick={() => {
                    setShowNotifMenu(false);
                    onNavigate('/admin/notifications');
                  }}
                  className="text-xs text-blue-700 hover:text-blue-900 font-semibold cursor-pointer inline-flex items-center gap-1"
                >
                  <span>View all notifications</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* User Profile Menu */}
        <div className="relative" ref={userRef}>
          <button
            type="button"
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-slate-100 transition-colors text-left cursor-pointer border border-transparent hover:border-slate-200"
          >
            <div className="w-8 h-8 rounded-full bg-gov-primary text-white flex items-center justify-center font-bold text-xs uppercase shrink-0">
              {currentUser?.name?.charAt(0) || 'A'}
            </div>
            <div className="hidden lg:block text-left pr-1">
              <p className="text-xs font-semibold text-slate-900 leading-tight truncate max-w-30">
                {currentUser?.name}
              </p>
              <p className="text-[10px] font-medium text-blue-700">
                {currentUser?.role}
              </p>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden lg:block" />
          </button>

          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-72 rounded-xl border border-slate-200 bg-white shadow-xl py-2 z-50 animate-in fade-in zoom-in-95 duration-100">
              <div className="px-4 py-2.5 border-b border-slate-100 bg-slate-50/60">
                <p className="text-xs font-semibold text-slate-900">{currentUser?.name}</p>
                <p className="text-[11px] text-slate-500 truncate">{currentUser?.email}</p>
                <div className="mt-1.5 flex items-center gap-1.5">
                  <Shield className="w-3 h-3 text-blue-600" />
                  <span className="text-[11px] font-bold text-blue-700 uppercase">
                    {currentUser?.role}
                  </span>
                </div>
              </div>

              {/* Demo Role Switcher */}
              <div className="px-3 py-2 border-b border-slate-100">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block px-1 mb-1">
                  Switch Demo Account
                </span>
                <div className="space-y-1">
                  {DEMO_ACCOUNTS.map(demo => {
                    const isSelected = currentUser?.role === demo.user.role;
                    return (
                      <button
                        key={demo.user.role}
                        type="button"
                        onClick={() => {
                          switchRole(demo.user.role);
                          setShowUserMenu(false);
                          showToast(`Switched account to ${demo.label}`, 'info');
                          if (demo.user.role === 'Resident') {
                            onNavigate('/resident/dashboard');
                          }
                        }}
                        className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs flex items-center justify-between transition-colors cursor-pointer ${
                          isSelected
                            ? 'bg-blue-50 text-blue-900 font-semibold'
                            : 'text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        <span className="truncate">{demo.label}</span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-blue-700 shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Links & Sign out */}
              <div className="py-1">
                <button
                  type="button"
                  onClick={() => {
                    setShowUserMenu(false);
                    onNavigate('/admin/settings');
                  }}
                  className="w-full px-4 py-2 text-xs text-slate-700 hover:bg-slate-100 flex items-center gap-2 cursor-pointer"
                >
                  <UserIcon className="w-4 h-4 text-slate-400" />
                  <span>Account & Barangay Settings</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowUserMenu(false);
                    logout();
                    onNavigate('/login');
                  }}
                  className="w-full px-4 py-2 text-xs text-red-600 hover:bg-red-50 flex items-center gap-2 cursor-pointer font-medium"
                >
                  <LogOut className="w-4 h-4 text-red-500" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
