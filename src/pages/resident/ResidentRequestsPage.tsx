import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { documentService } from '../../services/documentService';
import { residentService } from '../../services/residentService';
import { settingsService } from '../../services/systemService';
import { DocumentRequest } from '../../types/document';
import { BarangaySettings } from '../../types/system';
import { PageHeader } from '../../components/ui/PageHeader';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../components/ui/Table';
import { Button } from '../../components/ui/Button';
import { getStatusBadge } from '../../components/ui/Badge';
import { LoadingState, EmptyState } from '../../components/ui/Feedback';
import { formatDate, formatCurrency } from '../../utils/formatters';
import { PrintableDocument } from '../../components/documents/PrintableDocument';
import { FileText, Printer, PlusCircle } from 'lucide-react';

export const ResidentRequestsPage: React.FC<{
  onOpenRequestModal: () => void;
}> = ({ onOpenRequestModal }) => {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [requests, setRequests] = useState<DocumentRequest[]>([]);
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
        const targetResident = resList.find(r => r.id === currentUser?.residentId) || resList[0];
        setSettings(stg);
        if (targetResident) {
          const mine = allReqs.filter(r => r.residentId === targetResident.id || r.residentName.includes(targetResident.lastName));
          setRequests(mine);
        }
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [currentUser]);

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

  return (
    <div className="space-y-6">
      <PageHeader
        title="My Clearance Applications & Documents"
        subtitle="Tracking history and status of all certifications submitted to Barangay San Isidro."
        actions={
          <Button
            variant="primary"
            size="sm"
            onClick={onOpenRequestModal}
            leftIcon={<PlusCircle className="w-4 h-4" />}
          >
            New Request
          </Button>
        }
      />

      {loading ? (
        <LoadingState message="Loading your clearance records..." />
      ) : requests.length === 0 ? (
        <EmptyState
          title="No requests filed"
          description="You have not submitted any certificate requests yet."
          actionLabel="File Certificate Request"
          onAction={onOpenRequestModal}
        />
      ) : (
        <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-xs overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tracking #</TableHead>
                <TableHead>Document Type</TableHead>
                <TableHead>Purpose</TableHead>
                <TableHead>Date Filed</TableHead>
                <TableHead>Assessment Fee</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {requests.map(req => (
                <TableRow key={req.id}>
                  <TableCell className="font-mono font-bold text-blue-900">
                    {req.requestNumber}
                  </TableCell>
                  <TableCell className="font-semibold text-slate-900">
                    {req.documentType}
                  </TableCell>
                  <TableCell className="text-slate-600 truncate max-w-xs">
                    {req.purpose}
                  </TableCell>
                  <TableCell className="text-slate-500 text-xs">
                    {formatDate(req.dateRequested)}
                  </TableCell>
                  <TableCell className="font-semibold">
                    {req.fee > 0 ? formatCurrency(req.fee) : 'FREE'}
                  </TableCell>
                  <TableCell>{getStatusBadge(req.status)}</TableCell>
                  <TableCell className="text-right">
                    {(req.status === 'RELEASED' || req.status === 'GENERATED') && (
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => setPreviewDoc(req)}
                        leftIcon={<Printer className="w-3.5 h-3.5" />}
                        className="h-8 px-2.5 text-xs"
                      >
                        Print
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};
