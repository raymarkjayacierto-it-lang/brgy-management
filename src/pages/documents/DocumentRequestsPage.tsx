import React, { useState, useEffect } from 'react';
import { documentService } from '../../services/documentService';
import { residentService } from '../../services/residentService';
import { paymentService } from '../../services/paymentService';
import { settingsService, auditService } from '../../services/systemService';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { DocumentRequest, DocumentRequestStatus, DocumentType } from '../../types/document';
import { Resident } from '../../types/resident';
import { BarangaySettings } from '../../types/system';
import { PageHeader } from '../../components/ui/PageHeader';
import { SearchInput } from '../../components/ui/SearchInput';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../components/ui/Table';
import { Pagination } from '../../components/ui/Pagination';
import { Button } from '../../components/ui/Button';
import { Select } from '../../components/ui/Select';
import { getStatusBadge } from '../../components/ui/Badge';
import { EmptyState, LoadingState } from '../../components/ui/Feedback';
import { formatDate, formatCurrency } from '../../utils/formatters';
import { DocumentRequestModal } from './DocumentRequestModal';
import { PaymentFormModal } from '../payments/PaymentFormModal';
import { RejectRequestModal } from './RejectRequestModal';
import { PrintableDocument } from '../../components/documents/PrintableDocument';
import {
  FileText,
  PlusCircle,
  Eye,
  CheckCircle,
  XCircle,
  Printer,
  DollarSign,
  Send,
  MoreVertical,
  CheckCheck,
  Building
} from 'lucide-react';

export const DocumentRequestsPage: React.FC = () => {
  const { currentUser } = useAuth();
  const { showToast } = useToast();

  const [loading, setLoading] = useState(true);
  const [requests, setRequests] = useState<DocumentRequest[]>([]);
  const [residents, setResidents] = useState<Resident[]>([]);
  const [settings, setSettings] = useState<BarangaySettings | null>(null);

  // Filters
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;

  // Active modal controls
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<DocumentRequest | null>(null);
  const [previewPrintRequest, setPreviewPrintRequest] = useState<DocumentRequest | null>(null);
  const [actionMenuOpenId, setActionMenuOpenId] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const [reqList, resList, stg] = await Promise.all([
        documentService.getDocumentRequests({
          search: search.trim() || undefined,
          status: statusFilter || undefined,
          type: typeFilter || undefined
        }),
        residentService.getResidents(),
        settingsService.getSettings()
      ]);
      setRequests(reqList);
      setResidents(resList);
      setSettings(stg);
      setCurrentPage(1);
    } catch {
      showToast('Unable to load document requests.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [search, statusFilter, typeFilter]);

  const totalPages = Math.ceil(requests.length / pageSize) || 1;
  const paginated = requests.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  // Workflow Action Handlers
  const handleStatusTransition = async (
    req: DocumentRequest,
    nextStatus: DocumentRequestStatus,
    metadata?: Partial<DocumentRequest>
  ) => {
    setIsProcessing(true);
    setActionMenuOpenId(null);
    try {
      const updated = await documentService.updateDocumentRequestStatus(req.id, nextStatus, {
        assignedStaff: `${currentUser?.name} (${currentUser?.role})`,
        ...metadata
      });

      await auditService.logAction(
        currentUser?.name || 'Admin',
        currentUser?.role || 'Staff',
        `Changed Status to ${nextStatus}`,
        'Documents',
        req.requestNumber,
        `Document request status moved to ${nextStatus}`
      );

      showToast(`Request ${req.requestNumber} status updated to ${nextStatus.replace(/_/g, ' ')}.`, 'success');
      await loadData();
    } catch {
      showToast('Error updating document status.', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCreateRequest = async (data: any) => {
    try {
      const created = await documentService.createDocumentRequest(data);
      await auditService.logAction(
        currentUser?.name || 'Admin',
        currentUser?.role || 'Staff',
        'Created Document Request',
        'Documents',
        created.requestNumber,
        `Filed ${created.documentType} for ${created.residentName}`
      );
      showToast(`Document request ${created.requestNumber} filed successfully!`, 'success');
      setIsRequestModalOpen(false);
      await loadData();
    } catch {
      showToast('Failed to create request.', 'error');
    }
  };

  const handleRecordPayment = async (paymentData: any) => {
    try {
      const payment = await paymentService.createPayment(paymentData);
      if (selectedRequest) {
        await documentService.updateDocumentRequestStatus(selectedRequest.id, 'PAID', {
          officialReceiptNumber: payment.officialReceiptNumber
        });
        await auditService.logAction(
          currentUser?.name || 'Treasurer',
          'Treasurer',
          'Payment Recorded',
          'Payments',
          payment.officialReceiptNumber,
          `Collected fee for ${selectedRequest.requestNumber}`
        );
      }
      showToast(`Payment recorded. Official Receipt: ${payment.officialReceiptNumber}`, 'success');
      setIsPaymentModalOpen(false);
      setSelectedRequest(null);
      await loadData();
    } catch {
      showToast('Failed to record payment.', 'error');
    }
  };

  const handleReject = async (reason: string) => {
    if (!selectedRequest) return;
    try {
      await documentService.updateDocumentRequestStatus(selectedRequest.id, 'REJECTED', {
        rejectionReason: reason
      });
      await auditService.logAction(
        currentUser?.name || 'Admin',
        currentUser?.role || 'Staff',
        'Rejected Document Request',
        'Documents',
        selectedRequest.requestNumber,
        `Reason: ${reason}`
      );
      showToast(`Request ${selectedRequest.requestNumber} has been rejected.`, 'info');
      setIsRejectModalOpen(false);
      setSelectedRequest(null);
      await loadData();
    } catch {
      showToast('Failed to reject request.', 'error');
    }
  };

  if (previewPrintRequest && settings) {
    return (
      <div className="py-6">
        <PrintableDocument
          request={previewPrintRequest}
          settings={settings}
          onClose={() => setPreviewPrintRequest(null)}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Document Requests Management"
        subtitle="Review, approve, generate, and release official barangay clearances and certifications."
        actions={
          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsRequestModalOpen(true)}
            leftIcon={<PlusCircle className="w-4 h-4" />}
          >
            New Request
          </Button>
        }
      />

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gov-border p-4 shadow-xs grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="sm:col-span-1">
          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder="Search by request #, name, doc #..."
          />
        </div>
        <Select
          value={typeFilter}
          onChange={e => setTypeFilter(e.target.value)}
        >
          <option value="">All Document Types</option>
          <option value="Barangay Clearance">Barangay Clearance</option>
          <option value="Certificate of Residency">Certificate of Residency</option>
          <option value="Certificate of Indigency">Certificate of Indigency</option>
          <option value="Certificate of Good Moral Character">Certificate of Good Moral</option>
          <option value="Barangay Business Clearance">Barangay Business Clearance</option>
          <option value="Certificate of Solo Parent">Certificate of Solo Parent</option>
        </Select>
        <Select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
        >
          <option value="">All Statuses</option>
          <option value="REQUESTED">REQUESTED</option>
          <option value="FOR_VERIFICATION">FOR VERIFICATION</option>
          <option value="APPROVED">APPROVED</option>
          <option value="FOR_PAYMENT">FOR PAYMENT</option>
          <option value="PAID">PAID</option>
          <option value="GENERATING">GENERATING</option>
          <option value="GENERATED">GENERATED</option>
          <option value="RELEASED">RELEASED</option>
          <option value="REJECTED">REJECTED</option>
        </Select>
      </div>

      {/* Table */}
      {loading ? (
        <LoadingState message="Fetching document requests pipeline..." />
      ) : requests.length === 0 ? (
        <EmptyState
          title="No document requests found"
          description="There are currently no document requests matching your search or filters."
          actionLabel="File Request"
          onAction={() => setIsRequestModalOpen(true)}
        />
      ) : (
        <div className="bg-white rounded-xl border border-gov-border shadow-xs overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Request #</TableHead>
                <TableHead>Resident Name</TableHead>
                <TableHead>Document</TableHead>
                <TableHead>Purpose</TableHead>
                <TableHead>Date Filed</TableHead>
                <TableHead>Fee</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginated.map(req => (
                <TableRow key={req.id}>
                  <TableCell className="font-mono font-semibold text-blue-900">
                    <div>{req.requestNumber}</div>
                    {req.documentNumber && (
                      <span className="text-[10px] text-emerald-700 font-bold block">
                        {req.documentNumber}
                      </span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="font-bold text-slate-900">{req.residentName}</div>
                    <div className="text-[11px] text-slate-500 truncate max-w-xs">{req.residentAddress}</div>
                  </TableCell>
                  <TableCell className="font-semibold text-slate-800">
                    {req.documentType}
                  </TableCell>
                  <TableCell className="text-slate-600 truncate max-w-45">
                    {req.purpose}
                  </TableCell>
                  <TableCell className="text-slate-500 text-xs">
                    {formatDate(req.dateRequested)}
                  </TableCell>
                  <TableCell className="font-semibold">
                    {req.fee > 0 ? formatCurrency(req.fee) : <span className="text-emerald-700">FREE</span>}
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(req.status)}
                  </TableCell>
                  <TableCell className="text-right">
                    {/* Action dropdown */}
                    <div className="relative inline-block text-left">
                      <div className="flex items-center justify-end gap-1">
                        {/* If generated or released, quick print button */}
                        {(req.status === 'GENERATED' || req.status === 'RELEASED') && (
                          <button
                            type="button"
                            onClick={() => setPreviewPrintRequest(req)}
                            className="p-1.5 text-blue-700 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                            title="Preview / Print Official Document"
                          >
                            <Printer className="w-4 h-4" />
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() => setActionMenuOpenId(actionMenuOpenId === req.id ? null : req.id)}
                          className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                          aria-label="More actions"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </div>

                      {actionMenuOpenId === req.id && (
                        <div
                          className="absolute right-0 mt-1 w-48 rounded-xl border border-slate-200 bg-white shadow-xl py-1.5 z-30 text-left text-xs animate-in fade-in zoom-in-95 duration-100"
                          onMouseLeave={() => setActionMenuOpenId(null)}
                        >
                          {req.status === 'REQUESTED' && (
                            <button
                              type="button"
                              onClick={() => handleStatusTransition(req, 'FOR_VERIFICATION')}
                              className="w-full px-3 py-2 text-slate-700 hover:bg-blue-50 flex items-center gap-2 cursor-pointer"
                            >
                              <CheckCircle className="w-3.5 h-3.5 text-blue-600" />
                              <span>Verify Requirements</span>
                            </button>
                          )}

                          {req.status === 'FOR_VERIFICATION' && (
                            <button
                              type="button"
                              onClick={() => handleStatusTransition(req, 'APPROVED')}
                              className="w-full px-3 py-2 hover:bg-emerald-50 flex items-center gap-2 cursor-pointer font-semibold text-emerald-800"
                            >
                              <CheckCheck className="w-3.5 h-3.5 text-emerald-600" />
                              <span>Approve Request</span>
                            </button>
                          )}

                          {(req.status === 'APPROVED' || req.status === 'FOR_PAYMENT') && req.fee > 0 && (
                            <button
                              type="button"
                              onClick={() => {
                                setActionMenuOpenId(null);
                                setSelectedRequest(req);
                                setIsPaymentModalOpen(true);
                              }}
                              className="w-full px-3 py-2 hover:bg-amber-50 flex items-center gap-2 cursor-pointer font-semibold text-amber-900"
                            >
                              <DollarSign className="w-3.5 h-3.5 text-amber-600" />
                              <span>Record Payment</span>
                            </button>
                          )}

                          {(req.status === 'APPROVED' && req.fee === 0) || req.status === 'PAID' ? (
                            <button
                              type="button"
                              onClick={() => handleStatusTransition(req, 'GENERATED')}
                              className="w-full px-3 py-2 hover:bg-blue-50 flex items-center gap-2 cursor-pointer font-bold text-blue-900"
                            >
                              <Printer className="w-3.5 h-3.5 text-blue-600" />
                              <span>Generate Document</span>
                            </button>
                          ) : null}

                          {req.status === 'GENERATED' && (
                            <button
                              type="button"
                              onClick={() => handleStatusTransition(req, 'RELEASED')}
                              className="w-full px-3 py-2 hover:bg-emerald-50 flex items-center gap-2 cursor-pointer font-bold text-emerald-900"
                            >
                              <Send className="w-3.5 h-3.5 text-emerald-600" />
                              <span>Mark as Released</span>
                            </button>
                          )}

                          {(req.status === 'GENERATED' || req.status === 'RELEASED') && (
                            <button
                              type="button"
                              onClick={() => {
                                setActionMenuOpenId(null);
                                setPreviewPrintRequest(req);
                              }}
                              className="w-full px-3 py-2 text-slate-700 hover:bg-blue-50 flex items-center gap-2 cursor-pointer"
                            >
                              <Eye className="w-3.5 h-3.5 text-blue-600" />
                              <span>View Printable Certificate</span>
                            </button>
                          )}

                          {req.status !== 'RELEASED' && req.status !== 'REJECTED' && (
                            <button
                              type="button"
                              onClick={() => {
                                setActionMenuOpenId(null);
                                setSelectedRequest(req);
                                setIsRejectModalOpen(true);
                              }}
                              className="w-full px-3 py-2 text-red-600 hover:bg-red-50 flex items-center gap-2 cursor-pointer border-t border-slate-100"
                            >
                              <XCircle className="w-3.5 h-3.5 text-red-500" />
                              <span>Reject Request</span>
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={requests.length}
            pageSize={pageSize}
            onPageChange={setCurrentPage}
          />
        </div>
      )}

      {/* Request Modal */}
      <DocumentRequestModal
        isOpen={isRequestModalOpen}
        onClose={() => setIsRequestModalOpen(false)}
        onSubmit={handleCreateRequest}
        residents={residents}
      />

      {/* Payment Modal */}
      <PaymentFormModal
        isOpen={isPaymentModalOpen}
        onClose={() => {
          setIsPaymentModalOpen(false);
          setSelectedRequest(null);
        }}
        request={selectedRequest}
        onRecordPayment={handleRecordPayment}
      />

      {/* Reject Modal */}
      <RejectRequestModal
        isOpen={isRejectModalOpen}
        onClose={() => {
          setIsRejectModalOpen(false);
          setSelectedRequest(null);
        }}
        request={selectedRequest}
        onReject={handleReject}
      />
    </div>
  );
};
