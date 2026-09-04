import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider, useToast } from './context/ToastContext';
import { AdminLayout } from './layouts/AdminLayout';
import { ResidentLayout } from './layouts/ResidentLayout';

// Admin Pages
import { LoginPage } from './pages/auth/LoginPage';
import { DashboardPage } from './pages/dashboard/DashboardPage';
import { ResidentsPage } from './pages/residents/ResidentsPage';
import { HouseholdsPage } from './pages/households/HouseholdsPage';
import { DocumentRequestsPage } from './pages/documents/DocumentRequestsPage';
import { IssuedDocumentsPage } from './pages/documents/IssuedDocumentsPage';
import { BlotterPage } from './pages/blotter/BlotterPage';
import { ComplaintsPage } from './pages/complaints/ComplaintsPage';
import { PaymentsPage } from './pages/payments/PaymentsPage';
import { OfficialsPage } from './pages/officials/OfficialsPage';
import { ReportsPage } from './pages/reports/ReportsPage';
import { NotificationsPage } from './pages/notifications/NotificationsPage';
import { AuditLogsPage } from './pages/audit/AuditLogsPage';
import { SettingsPage } from './pages/settings/SettingsPage';

// Public Verification Page
import { DocumentVerificationPage } from './pages/verify/DocumentVerificationPage';

// Resident Portal Pages
import { ResidentDashboardPage } from './pages/resident/ResidentDashboardPage';
import { ResidentRequestsPage } from './pages/resident/ResidentRequestsPage';
import { ResidentOfficialsPage } from './pages/resident/ResidentOfficialsPage';

// Global Modals
import { DocumentRequestModal } from './pages/documents/DocumentRequestModal';
import { ResidentFormModal } from './pages/residents/ResidentFormModal';
import { residentService } from './services/residentService';
import { documentService } from './services/documentService';
import { auditService } from './services/systemService';
import { Resident } from './types/resident';

function AppContent() {
  const { currentUser, isAuthenticated } = useAuth();
  const { showToast } = useToast();

  // Simple, robust client route state with browser history sync
  const [currentRoute, setCurrentRoute] = useState<string>(() => {
    const path = window.location.pathname;
    if (path.startsWith('/verify/')) return path;
    if (!isAuthenticated) return '/login';
    return currentUser?.role === 'Resident' ? '/resident/dashboard' : '/admin/dashboard';
  });

  const [allResidents, setAllResidents] = useState<Resident[]>([]);
  const [globalRequestModalOpen, setGlobalRequestModalOpen] = useState(false);
  const [globalResidentModalOpen, setGlobalResidentModalOpen] = useState(false);

  // Sync route changes with browser URL
  const navigate = (path: string) => {
    setCurrentRoute(path);
    try {
      window.history.pushState({}, '', path);
    } catch {
      // Safe fallback
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    const handlePopState = () => {
      setCurrentRoute(window.location.pathname);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Preload residents for global quick action modals
  useEffect(() => {
    residentService.getResidents().then(setAllResidents);
  }, [globalRequestModalOpen, globalResidentModalOpen]);

  // Handle global document request submission
  const handleGlobalRequestSubmit = async (data: any) => {
    try {
      const created = await documentService.createDocumentRequest(data);
      await auditService.logAction(
        currentUser?.name || 'User',
        currentUser?.role || 'Resident',
        'Filed Document Request',
        'Documents',
        created.requestNumber,
        `Filed ${created.documentType} for ${created.residentName}`
      );
      showToast(`Request ${created.requestNumber} successfully filed!`, 'success');
      setGlobalRequestModalOpen(false);
      if (currentUser?.role === 'Resident') {
        navigate('/resident/requests');
      } else {
        navigate('/admin/documents');
      }
    } catch {
      showToast('Error filing document request.', 'error');
    }
  };

  // Handle global resident creation
  const handleGlobalResidentSubmit = async (data: any) => {
    try {
      const created = await residentService.createResident(data);
      await auditService.logAction(
        currentUser?.name || 'Admin',
        currentUser?.role || 'Staff',
        'Registered New Resident',
        'Residents',
        created.residentNumber,
        `Registered resident ${created.firstName} ${created.lastName}`
      );
      showToast(`Resident ${created.firstName} ${created.lastName} registered!`, 'success');
      setGlobalResidentModalOpen(false);
      navigate('/admin/residents');
    } catch {
      showToast('Error saving resident record.', 'error');
    }
  };

  // 1. PUBLIC ROUTE: Document QR Verification
  if (currentRoute.startsWith('/verify')) {
    const parts = currentRoute.split('/');
    const code = parts[2] || 'DOC-2026-000145';
    return (
      <DocumentVerificationPage
        initialCode={code}
        onNavigate={navigate}
      />
    );
  }

  // 2. AUTHENTICATION ROUTE: Login
  if (!isAuthenticated || currentRoute === '/login') {
    return (
      <LoginPage
        onLoginSuccess={(role) => {
          if (role === 'Resident') {
            navigate('/resident/dashboard');
          } else {
            navigate('/admin/dashboard');
          }
        }}
        onNavigateVerify={() => navigate('/verify/DOC-2026-000145')}
      />
    );
  }

  // 3. CITIZEN / RESIDENT PORTAL ROUTES
  if (currentUser?.role === 'Resident' || currentRoute.startsWith('/resident')) {
    return (
      <ResidentLayout
        currentRoute={currentRoute}
        onNavigate={navigate}
        onRequestDocument={() => setGlobalRequestModalOpen(true)}
      >
        {currentRoute === '/resident/requests' ? (
          <ResidentRequestsPage onOpenRequestModal={() => setGlobalRequestModalOpen(true)} />
        ) : currentRoute === '/resident/officials' ? (
          <ResidentOfficialsPage />
        ) : (
          <ResidentDashboardPage
            onOpenRequestModal={() => setGlobalRequestModalOpen(true)}
            onNavigate={navigate}
          />
        )}

        {/* Global Citizen Request Modal */}
        <DocumentRequestModal
          isOpen={globalRequestModalOpen}
          onClose={() => setGlobalRequestModalOpen(false)}
          onSubmit={handleGlobalRequestSubmit}
          residents={allResidents}
        />
      </ResidentLayout>
    );
  }

  // 4. ADMINISTRATIVE CONSOLE ROUTES
  const renderAdminContent = () => {
    if (currentRoute === '/admin/residents' || currentRoute.startsWith('/admin/residents?')) {
      return (
        <ResidentsPage
          onNavigateClearance={() => {
            navigate('/admin/documents');
            setGlobalRequestModalOpen(true);
          }}
        />
      );
    }
    if (currentRoute === '/admin/households') {
      return <HouseholdsPage />;
    }
    if (currentRoute === '/admin/documents' || currentRoute === '/admin/documents/requests') {
      return <DocumentRequestsPage />;
    }
    if (currentRoute === '/admin/documents/issued') {
      return <IssuedDocumentsPage onVerifyCode={code => navigate(`/verify/${code}`)} />;
    }
    if (currentRoute === '/admin/blotter') {
      return <BlotterPage />;
    }
    if (currentRoute === '/admin/complaints') {
      return <ComplaintsPage />;
    }
    if (currentRoute === '/admin/payments') {
      return <PaymentsPage />;
    }
    if (currentRoute === '/admin/officials') {
      return <OfficialsPage />;
    }
    if (currentRoute === '/admin/reports') {
      return <ReportsPage />;
    }
    if (currentRoute === '/admin/notifications') {
      return <NotificationsPage onNavigate={navigate} />;
    }
    if (currentRoute === '/admin/audit-logs') {
      return <AuditLogsPage />;
    }
    if (currentRoute === '/admin/settings') {
      return <SettingsPage />;
    }

    // Default: Dashboard
    return (
      <DashboardPage
        onNavigate={navigate}
        onOpenNewRequestModal={() => setGlobalRequestModalOpen(true)}
        onOpenNewResidentModal={() => setGlobalResidentModalOpen(true)}
      />
    );
  };

  return (
    <AdminLayout
      currentRoute={currentRoute}
      onNavigate={navigate}
    >
      {renderAdminContent()}

      {/* Global Modals */}
      <DocumentRequestModal
        isOpen={globalRequestModalOpen}
        onClose={() => setGlobalRequestModalOpen(false)}
        onSubmit={handleGlobalRequestSubmit}
        residents={allResidents}
      />

      <ResidentFormModal
        isOpen={globalResidentModalOpen}
        onClose={() => setGlobalResidentModalOpen(false)}
        onSave={handleGlobalResidentSubmit}
      />
    </AdminLayout>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <AppContent />
      </ToastProvider>
    </AuthProvider>
  );
}
