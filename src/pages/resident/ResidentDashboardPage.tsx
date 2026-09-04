import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { documentService } from '../../services/documentService';
import { residentService } from '../../services/residentService';
import { DocumentRequest } from '../../types/document';
import { Resident } from '../../types/resident';
import { Card, CardHeader, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { getStatusBadge } from '../../components/ui/Badge';
import { LoadingState } from '../../components/ui/Feedback';
import { formatDate, formatCurrency } from '../../utils/formatters';
import { PrintableDocument } from '../../components/documents/PrintableDocument';
import { settingsService } from '../../services/systemService';
import { BarangaySettings } from '../../types/system';
import {
  FileText,
  Clock,
  CheckCircle2,
  Printer,
  ShieldCheck,
  PlusCircle,
  HelpCircle,
  MapPin,
  Phone
} from 'lucide-react';

export interface ResidentDashboardPageProps {
  onOpenRequestModal: () => void;
  onNavigate: (route: string) => void;
}

export const ResidentDashboardPage: React.FC<ResidentDashboardPageProps> = ({
  onOpenRequestModal,
  onNavigate
}) => {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [resident, setResident] = useState<Resident | null>(null);
  const [myRequests, setMyRequests] = useState<DocumentRequest[]>([]);
  const [settings, setSettings] = useState<BarangaySettings | null>(null);
  const [previewDoc, setPreviewDoc] = useState<DocumentRequest | null>(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const [allReqs, resList, stg] = await Promise.all([
          documentService.getDocumentRequests(),
          residentService.getResidents(),
          settingsService.getSettings()
        ]);
        // Use resident from auth context or fall back to first resident (Juan dela Cruz)
        const targetResident = resList.find(r => r.id === currentUser?.residentId) || resList[0];
        setResident(targetResident);
        setSettings(stg);

        if (targetResident) {
          const mine = allReqs.filter(r => r.residentId === targetResident.id || r.residentName.includes(targetResident.lastName));
          setMyRequests(mine);
        }
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [currentUser]);

  if (loading) {
    return <LoadingState message="Connecting to citizen services portal..." />;
  }

  if (previewDoc && settings) {
    return (
      <div className="py-6">
        <PrintableDocument
          request={previewDoc}
          settings={settings}
          onClose={() => setPreviewDoc(null)}
        />
      </div>
    );
  }

  const activeClearances = myRequests.filter(r => r.status === 'RELEASED' || r.status === 'GENERATED');

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-blue-900 to-[#1D4ED8] p-6 sm:p-8 text-white shadow-md relative overflow-hidden">
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-blue-200">
              Citizen e-Services Portal
            </span>
            <h1 className="text-2xl sm:text-3xl font-black mt-1">
              Welcome, {resident?.firstName || 'Citizen'}!
            </h1>
            <p className="text-xs sm:text-sm text-blue-100 mt-1 max-w-lg">
              Official online portal of Barangay San Isidro. Request clearances, track processing progress, and download certified certificates.
            </p>
            <div className="mt-3 flex items-center gap-3 text-xs text-blue-200">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" />
                <span>{resident?.address.purok}</span>
              </span>
              <span>•</span>
              <span>Resident ID: {resident?.residentNumber}</span>
            </div>
          </div>

          <Button
            variant="secondary"
            size="lg"
            onClick={onOpenRequestModal}
            leftIcon={<PlusCircle className="w-5 h-5" />}
            className="shrink-0 font-bold shadow-lg"
          >
            Request Clearance
          </Button>
        </div>
      </div>

      {/* 3 Quick Status Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
          <span className="text-xs text-slate-500 font-semibold uppercase">Total Requests Filed</span>
          <p className="text-2xl font-black text-slate-900 mt-1">{myRequests.length}</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
          <span className="text-xs text-slate-500 font-semibold uppercase">In Progress / Processing</span>
          <p className="text-2xl font-black text-amber-600 mt-1">
            {myRequests.filter(r => !['RELEASED', 'REJECTED'].includes(r.status)).length}
          </p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
          <span className="text-xs text-slate-500 font-semibold uppercase">Active Clearances</span>
          <p className="text-2xl font-black text-emerald-600 mt-1">
            {activeClearances.length}
          </p>
        </div>
      </div>

      {/* My Clearances & Requests */}
      <Card>
        <CardHeader
          title="My Document Requests & Clearances"
          subtitle="Real-time status of your applications at the Barangay Hall"
          action={
            <Button
              variant="outline"
              size="sm"
              onClick={() => onNavigate('/resident/requests')}
            >
              View Full History
            </Button>
          }
        />
        <CardContent className="p-0">
          {myRequests.length === 0 ? (
            <div className="p-8 text-center text-slate-500 text-sm">
              You have not submitted any clearance requests yet.
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {myRequests.map(req => (
                <div key={req.id} className="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-slate-50 transition-colors">
                  <div className="flex items-start gap-3">
                    <div className="p-2.5 rounded-lg bg-blue-50 text-blue-700 mt-0.5 shrink-0">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-bold text-slate-900">{req.documentType}</span>
                        {getStatusBadge(req.status)}
                      </div>
                      <p className="text-xs text-slate-600 mt-0.5">
                        Purpose: <strong className="text-slate-800">{req.purpose}</strong>
                      </p>
                      <p className="text-[11px] text-slate-400 mt-1">
                        Tracking Ref: <span className="font-mono text-blue-900 font-semibold">{req.requestNumber}</span> • Filed {formatDate(req.dateRequested)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                    {(req.status === 'RELEASED' || req.status === 'GENERATED') && (
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => setPreviewDoc(req)}
                        leftIcon={<Printer className="w-4 h-4" />}
                      >
                        Print Certificate
                      </Button>
                    )}
                    {req.status === 'FOR_PAYMENT' && (
                      <span className="text-xs font-semibold text-amber-800 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-lg">
                        Proceed to Treasurer Window ({formatCurrency(req.fee)})
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
