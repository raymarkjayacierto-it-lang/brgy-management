import React from 'react';
import {
  LayoutDashboard,
  Users,
  Home,
  FileText,
  FileCheck,
  ShieldAlert,
  MessageSquareWarning,
  CreditCard,
  Award,
  BarChart3,
  Bell,
  History,
  Settings,
  LogOut,
  X,
  ExternalLink
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export interface AdminSidebarProps {
  currentRoute: string;
  onNavigate: (route: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

interface NavItem {
  label: string;
  path: string;
  icon: React.ReactNode;
  badge?: string | number;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  currentRoute,
  onNavigate,
  isOpen,
  onClose
}) => {
  const { currentUser, logout } = useAuth();

  const mainNavItems: NavItem[] = [
    { label: 'Dashboard', path: '/admin/dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { label: 'Residents', path: '/admin/residents', icon: <Users className="w-4 h-4" /> },
    { label: 'Households', path: '/admin/households', icon: <Home className="w-4 h-4" /> },
    { label: 'Document Requests', path: '/admin/documents', icon: <FileText className="w-4 h-4" /> },
    { label: 'Issued Documents', path: '/admin/documents/issued', icon: <FileCheck className="w-4 h-4" /> },
    { label: 'Blotter & Incidents', path: '/admin/blotter', icon: <ShieldAlert className="w-4 h-4" /> },
    { label: 'Complaints', path: '/admin/complaints', icon: <MessageSquareWarning className="w-4 h-4" /> },
    { label: 'Payments', path: '/admin/payments', icon: <CreditCard className="w-4 h-4" /> },
    { label: 'Officials & Staff', path: '/admin/officials', icon: <Award className="w-4 h-4" /> },
    { label: 'Reports', path: '/admin/reports', icon: <BarChart3 className="w-4 h-4" /> }
  ];

  const systemNavItems: NavItem[] = [
    { label: 'Notifications', path: '/admin/notifications', icon: <Bell className="w-4 h-4" /> },
    { label: 'Audit Logs', path: '/admin/audit-logs', icon: <History className="w-4 h-4" /> },
    { label: 'Settings', path: '/admin/settings', icon: <Settings className="w-4 h-4" /> }
  ];

  const renderNavGroup = (items: NavItem[], title?: string) => (
    <div className="mb-4">
      {title && (
        <h3 className="px-3 mb-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
          {title}
        </h3>
      )}
      <ul className="space-y-0.5">
        {items.map(item => {
          const isActive = currentRoute === item.path || 
            (item.path !== '/admin/dashboard' && currentRoute.startsWith(item.path) && item.path !== '/admin/documents' && item.path !== '/admin/documents/issued') ||
            (item.path === '/admin/documents' && currentRoute === '/admin/documents') ||
            (item.path === '/admin/documents/issued' && currentRoute === '/admin/documents/issued');

          return (
            <li key={item.path}>
              <button
                type="button"
                onClick={() => {
                  onNavigate(item.path);
                  if (window.innerWidth < 1024) onClose();
                }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all duration-150 cursor-pointer ${
                  isActive
                    ? 'bg-gov-pale text-gov-primary font-semibold shadow-xs border-l-3 border-gov-primary'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className={`${isActive ? 'text-gov-primary' : 'text-slate-400'}`}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="text-[10px] font-bold px-1.5 py-0.2 bg-blue-100 text-blue-800 rounded-full">
                    {item.badge}
                  </span>
                )}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-xs lg:hidden no-print"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 bg-white border-r border-gov-border flex flex-col transition-transform duration-200 ease-in-out lg:static lg:translate-x-0 no-print ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand header */}
        <div className="h-16 px-4 border-b border-gov-border flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2.5">
            <img
              src="/logo.png"
              alt="Barangay San Isidro Logo"
              className="w-9 h-9 rounded-full object-cover shadow-xs shrink-0 border border-blue-200"
            />
            <div>
              <p className="text-xs font-bold text-gov-text-primary leading-none">BMS SAN ISIDRO</p>
              <p className="text-[10px] text-gov-text-secondary mt-0.5 font-medium">Administrative Console</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 lg:hidden cursor-pointer"
            aria-label="Close Sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Navigation */}
        <div className="flex-1 overflow-y-auto px-3 py-4">
          {renderNavGroup(mainNavItems, 'MAIN')}
          {renderNavGroup(systemNavItems, 'SYSTEM')}

          {/* Quick link to Resident Portal */}
          <div className="mt-4 pt-3 border-t border-slate-100 px-1">
            <button
              type="button"
              onClick={() => {
                onNavigate('/resident/dashboard');
                if (window.innerWidth < 1024) onClose();
              }}
              className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold text-blue-700 bg-blue-50/80 hover:bg-blue-100 transition-colors cursor-pointer border border-blue-200"
            >
              <span>Citizen Portal View</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Bottom User Profile Card */}
        <div className="p-3 border-t border-gov-border bg-slate-50/70">
          <div className="flex items-center gap-2.5 mb-2">
            <div className="w-9 h-9 rounded-full bg-gov-primary text-white flex items-center justify-center font-bold text-xs uppercase shrink-0">
              {currentUser?.name?.charAt(0) || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-gov-text-primary truncate">
                {currentUser?.name}
              </p>
              <span className="inline-block text-[10px] font-medium text-gov-primary bg-blue-100/70 px-1.5 py-0.2 rounded-full">
                {currentUser?.role}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1 text-xs">
            <button
              type="button"
              onClick={() => {
                onNavigate('/admin/settings');
                if (window.innerWidth < 1024) onClose();
              }}
              className="flex-1 py-1.5 px-2 text-center rounded text-slate-600 hover:text-slate-900 hover:bg-slate-200/60 font-medium transition-colors cursor-pointer"
            >
              Profile
            </button>
            <button
              type="button"
              onClick={() => {
                logout();
                onNavigate('/login');
              }}
              className="flex items-center justify-center gap-1 py-1.5 px-2 rounded text-red-600 hover:bg-red-100/60 font-medium transition-colors cursor-pointer"
              title="Sign Out"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
