import React, { useState, useEffect } from 'react';
import { paymentService } from '../../services/paymentService';
import { settingsService, auditService } from '../../services/systemService';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Payment } from '../../types/payment';
import { BarangaySettings } from '../../types/system';
import { PageHeader } from '../../components/ui/PageHeader';
import { SearchInput } from '../../components/ui/SearchInput';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../components/ui/Table';
import { Pagination } from '../../components/ui/Pagination';
import { Button } from '../../components/ui/Button';
import { Select } from '../../components/ui/Select';
import { Badge, getStatusBadge } from '../../components/ui/Badge';
import { EmptyState, LoadingState } from '../../components/ui/Feedback';
import { formatCurrency, formatDateTime } from '../../utils/formatters';
import { OfficialReceiptModal } from '../../components/documents/OfficialReceiptModal';
import { CreditCard, Printer, Receipt, DollarSign, Download } from 'lucide-react';

export const PaymentsPage: React.FC = () => {
  const { currentUser } = useAuth();
  const { showToast } = useToast();

  const [loading, setLoading] = useState(true);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [settings, setSettings] = useState<BarangaySettings | null>(null);
  const [search, setSearch] = useState('');
  const [methodFilter, setMethodFilter] = useState('');

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;

  const [selectedPaymentForReceipt, setSelectedPaymentForReceipt] = useState<Payment | null>(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const [list, stg] = await Promise.all([
        paymentService.getPayments({
          search: search.trim() || undefined,
          method: methodFilter || undefined
        }),
        settingsService.getSettings()
      ]);
      setPayments(list);
      setSettings(stg);
      setCurrentPage(1);
    } catch {
      showToast('Error loading payment collection records.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [search, methodFilter]);

  const totalPages = Math.ceil(payments.length / pageSize) || 1;
  const paginated = payments.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const totalRevenue = payments.reduce((acc, p) => acc + p.amount, 0);

  const handleExportCSV = () => {
    if (payments.length === 0) return;
    const headers = ['Payment ID', 'OR Number', 'Reference Request', 'Resident', 'Document', 'Amount', 'Method', 'Date', 'Processed By'];
    const rows = payments.map(p => [
      p.paymentNumber,
      p.officialReceiptNumber,
      p.referenceNumber,
      `"${p.residentName}"`,
      `"${p.documentType}"`,
      p.amount,
      p.paymentMethod,
      p.date,
      `"${p.processedBy}"`
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const link = document.createElement('a');
    link.setAttribute('href', encodeURI(csvContent));
    link.setAttribute('download', `Barangay_Treasury_Payments_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Payment ledger exported to CSV', 'success');
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Payment & Treasury Management"
        subtitle="Barangay fee collections, official receipts (OR), and financial logs."
        actions={
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportCSV}
            leftIcon={<Download className="w-4 h-4" />}
          >
            Export Ledger
          </Button>
        }
      />

      {/* Summary KPI Banner */}
      <div className="bg-gradient-to-r from-blue-900 to-[#1D4ED8] rounded-xl p-5 text-white shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-blue-200">
            Total Barangay Revenue Collected
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold mt-1">
            {formatCurrency(totalRevenue)}
          </h2>
          <p className="text-xs text-blue-100 mt-1">
            {payments.length} successful transactions recorded under the Barangay Treasury
          </p>
        </div>
        <div className="bg-white/10 backdrop-blur-xs border border-white/20 px-4 py-2.5 rounded-lg text-xs space-y-1">
          <div className="flex justify-between gap-4 text-blue-100">
            <span>Cash Collections:</span>
            <span className="font-bold text-white">
              {formatCurrency(payments.filter(p => p.paymentMethod === 'Cash').reduce((a, p) => a + p.amount, 0))}
            </span>
          </div>
          <div className="flex justify-between gap-4 text-blue-100">
            <span>Digital (GCash/Maya):</span>
            <span className="font-bold text-white">
              {formatCurrency(payments.filter(p => p.paymentMethod !== 'Cash').reduce((a, p) => a + p.amount, 0))}
            </span>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-[#E2E8F0] p-4 shadow-xs grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="sm:col-span-2">
          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder="Search by OR number (e.g. OR-2026-00912), resident, reference request..."
          />
        </div>
        <Select
          value={methodFilter}
          onChange={e => setMethodFilter(e.target.value)}
        >
          <option value="">All Payment Methods</option>
          <option value="Cash">Cash</option>
          <option value="GCash">GCash</option>
          <option value="Maya">Maya</option>
          <option value="Bank Transfer">Bank Transfer</option>
        </Select>
      </div>

      {/* Payments Table */}
      {loading ? (
        <LoadingState message="Loading financial records..." />
      ) : payments.length === 0 ? (
        <EmptyState
          title="No payments recorded"
          description="Payments recorded upon clearance approvals or over-the-counter transactions will appear here."
        />
      ) : (
        <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-xs overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>OR Number</TableHead>
                <TableHead>Payment ID</TableHead>
                <TableHead>Resident Payor</TableHead>
                <TableHead>Document Item</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Payment Method</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Processed By</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginated.map(payment => (
                <TableRow key={payment.id}>
                  <TableCell className="font-mono font-bold text-blue-900">
                    {payment.officialReceiptNumber}
                  </TableCell>
                  <TableCell className="font-mono text-xs text-slate-500">
                    {payment.paymentNumber}
                  </TableCell>
                  <TableCell className="font-bold text-slate-900">
                    {payment.residentName}
                  </TableCell>
                  <TableCell className="font-medium text-slate-700">
                    {payment.documentType}
                  </TableCell>
                  <TableCell className="font-extrabold text-emerald-800">
                    {formatCurrency(payment.amount)}
                  </TableCell>
                  <TableCell>
                    <span className="font-semibold px-2 py-0.5 rounded text-xs bg-slate-100 text-slate-800">
                      {payment.paymentMethod}
                    </span>
                  </TableCell>
                  <TableCell className="text-slate-500 text-xs">
                    {formatDateTime(payment.date)}
                  </TableCell>
                  <TableCell className="text-slate-600 text-xs truncate max-w-[130px]">
                    {payment.processedBy}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedPaymentForReceipt(payment)}
                      leftIcon={<Printer className="w-3.5 h-3.5" />}
                      className="h-8 px-2.5 text-xs"
                    >
                      OR
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={payments.length}
            pageSize={pageSize}
            onPageChange={setCurrentPage}
          />
        </div>
      )}

      {/* Official Receipt Modal */}
      {settings && (
        <OfficialReceiptModal
          isOpen={!!selectedPaymentForReceipt}
          onClose={() => setSelectedPaymentForReceipt(null)}
          payment={selectedPaymentForReceipt}
          settings={settings}
        />
      )}
    </div>
  );
};
