import React, { useState } from 'react';
import { AdminHeader } from '../components/layout/AdminHeader';
import { AdminSidebar } from '../components/layout/AdminSidebar';

export interface AdminLayoutProps {
  children: React.ReactNode;
  currentRoute: string;
  onNavigate: (route: string) => void;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  children,
  currentRoute,
  onNavigate
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-gov-bg">
      {/* Sidebar */}
      <AdminSidebar
        currentRoute={currentRoute}
        onNavigate={onNavigate}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <AdminHeader
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          onNavigate={onNavigate}
          currentRoute={currentRoute}
        />

        <main className="flex-1 overflow-y-auto px-4 py-6 sm:px-6 lg:px-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
};
