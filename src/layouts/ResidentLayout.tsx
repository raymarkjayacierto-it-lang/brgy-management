import React from 'react';
import { 
  FileText, 
  Clock, 
  Award, 
  Home, 
  LogOut, 
  ArrowLeft,
  CheckCircle2,
  FileCheck2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/Button';

export interface ResidentLayoutProps {
  children: React.ReactNode;
  currentRoute: string;
  onNavigate: (route: string) => void;
  onRequestDocument?: () => void;
}

export const ResidentLayout: React.FC<ResidentLayoutProps> = ({
  children,
  currentRoute,
  onNavigate,
  onRequestDocument
}) => {
  const { currentUser, logout, switchRole } = useAuth();

  const navItems = [
    { label: 'Overview', path: '/resident/dashboard', icon: <Home className="w-4 h-4" /> },
    { label: 'My Requests', path: '/resident/requests', icon: <Clock className="w-4 h-4" /> },
    { label: 'Officials Directory', path: '/resident/officials', icon: <Award className="w-4 h-4" /> }
  ];

  return (
    <div className="min-h-screen bg-gov-bg flex flex-col">
      {/* Resident Portal Header */}
      <header className="sticky top-0 z-30 bg-white border-b border-gov-border shadow-xs">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src="/logo.png"
              alt="Barangay San Isidro Logo"
              className="w-10 h-10 rounded-full object-cover shadow-xs shrink-0 border border-blue-200"
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm sm:text-base font-bold text-gov-text-primary">
                  Barangay San Isidro
                </span>
                <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                  Citizen Portal
                </span>
              </div>
              <p className="text-[11px] text-gov-text-secondary">Republic of the Philippines</p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {onRequestDocument && (
              <Button
                variant="primary"
                size="sm"
                onClick={onRequestDocument}
                leftIcon={<FileText className="w-4 h-4" />}
                className="hidden sm:inline-flex"
              >
                Request Certificate
              </Button>
            )}

            <button
              type="button"
              onClick={() => {
                switchRole('Admin');
                onNavigate('/admin/dashboard');
              }}
              className="text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg border border-blue-200 transition-colors cursor-pointer inline-flex items-center gap-1.5"
              title="Return to Admin Dashboard"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Admin Mode</span>
            </button>

            <button
              type="button"
              onClick={() => {
                logout();
                onNavigate('/login');
              }}
              className="p-2 text-slate-500 hover:text-red-600 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
              aria-label="Logout"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center gap-2 border-t border-slate-100 overflow-x-auto">
          {navItems.map(item => {
            const isActive = currentRoute === item.path;
            return (
              <button
                key={item.path}
                type="button"
                onClick={() => onNavigate(item.path)}
                className={`flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-medium border-b-2 transition-colors cursor-pointer ${
                  isActive
                    ? 'border-gov-primary text-gov-primary'
                    : 'border-transparent text-slate-600 hover:text-slate-900'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gov-border py-6 text-center text-xs text-gov-text-secondary">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© 2026 Barangay San Isidro, Municipality of Cainta, Rizal. All rights reserved.</p>
          <div className="flex items-center gap-4 text-[11px] text-slate-400">
            <span>Republic Act No. 7160 (Local Government Code)</span>
            <span>•</span>
            <span>Data Privacy Act of 2012 Compliant</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
