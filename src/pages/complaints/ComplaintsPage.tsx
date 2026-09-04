import React, { useState, useEffect } from 'react';
import { complaintService } from '../../services/complaintService';
import { auditService } from '../../services/systemService';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Complaint, ComplaintStatus } from '../../types/complaint';
import { PageHeader } from '../../components/ui/PageHeader';
import { SearchInput } from '../../components/ui/SearchInput';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../components/ui/Table';
import { Pagination } from '../../components/ui/Pagination';
import { Button } from '../../components/ui/Button';
import { Select } from '../../components/ui/Select';
import { getStatusBadge } from '../../components/ui/Badge';
import { EmptyState, LoadingState } from '../../components/ui/Feedback';
import { formatDate } from '../../utils/formatters';
import { ComplaintFormModal } from './ComplaintFormModal';
import { ComplaintDetailsModal } from './ComplaintDetailsModal';
import { MessageSquareWarning, PlusCircle, Eye, Edit2 } from 'lucide-react';

export const ComplaintsPage: React.FC = () => {
  const { currentUser } = useAuth();
  const { showToast } = useToast();

  const [loading, setLoading] = useState(true);
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const list = await complaintService.getComplaints({
        search: search.trim() || undefined,
        status: statusFilter || undefined,
        category: categoryFilter || undefined
      });
      setComplaints(list);
      setCurrentPage(1);
    } catch {
      showToast('Error loading complaints.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [search, statusFilter, categoryFilter]);

  const totalPages = Math.ceil(complaints.length / pageSize) || 1;
  const paginated = complaints.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleSave = async (data: any) => {
    setIsSaving(true);
    try {
      if (selectedComplaint) {
        const updated = await complaintService.updateComplaint(selectedComplaint.id, data);
        await auditService.logAction(
          currentUser?.name || 'Staff',
          currentUser?.role || 'Staff',
          'Updated Complaint',
          'Complaints',
          updated.complaintNumber,
          `Updated grievance ${updated.complaintNumber}`
        );
        showToast(`Complaint ${updated.complaintNumber} updated.`, 'success');
      } else {
        const created = await complaintService.createComplaint(data);
        await auditService.logAction(
          currentUser?.name || 'Staff',
          currentUser?.role || 'Staff',
          'Logged Resident Complaint',
          'Complaints',
          created.complaintNumber,
          `Category: ${created.category} filed by ${created.complainantName}`
        );
        showToast(`Complaint logged as ${created.complaintNumber}.`, 'success');
      }
      setIsFormOpen(false);
      setSelectedComplaint(null);
      await loadData();
    } catch {
      showToast('Failed to save complaint.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpdateStatus = async (id: string, status: ComplaintStatus, resolution?: string) => {
    try {
      await complaintService.updateStatus(id, status, resolution);
      showToast('Complaint status updated.', 'success');
      await loadData();
    } catch {
      showToast('Failed to update status.', 'error');
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Complaints & Grievance Desk"
        subtitle="Manage resident grievances, community sanitation reports, and neighborhood issues."
        actions={
          <Button
            variant="primary"
            size="sm"
            onClick={() => {
              setSelectedComplaint(null);
              setIsFormOpen(true);
            }}
            leftIcon={<PlusCircle className="w-4 h-4" />}
          >
            File New Complaint
          </Button>
        }
      />

      {/* Filters */}
      <div className="bg-white rounded-xl border border-[#E2E8F0] p-4 shadow-xs grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="sm:col-span-1">
          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder="Search by complaint #, complainant, respondent..."
          />
        </div>
        <Select
          value={categoryFilter}
          onChange={e => setCategoryFilter(e.target.value)}
        >
          <option value="">All Categories</option>
          <option value="Public Disturbance">Public Disturbance</option>
          <option value="Sanitation & Garbage">Sanitation & Garbage</option>
          <option value="Barangay Services">Barangay Services</option>
          <option value="Street Lighting / Road Issue">Street Lighting / Road Issue</option>
          <option value="Illegal Parking">Illegal Parking</option>
        </Select>
        <Select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
        >
          <option value="">All Statuses</option>
          <option value="SUBMITTED">SUBMITTED</option>
          <option value="UNDER_REVIEW">UNDER REVIEW</option>
          <option value="IN_PROGRESS">IN PROGRESS</option>
          <option value="RESOLVED">RESOLVED</option>
          <option value="REJECTED">REJECTED</option>
          <option value="CLOSED">CLOSED</option>
        </Select>
      </div>

      {/* Table */}
      {loading ? (
        <LoadingState message="Fetching complaints..." />
      ) : complaints.length === 0 ? (
        <EmptyState
          title="No complaints found"
          description="There are no complaint records matching your filter parameters."
          actionLabel="File Complaint"
          onAction={() => {
            setSelectedComplaint(null);
            setIsFormOpen(true);
          }}
        />
      ) : (
        <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-xs overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Complaint #</TableHead>
                <TableHead>Complainant</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Subject / Respondent</TableHead>
                <TableHead>Date Filed</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginated.map(cmp => (
                <TableRow key={cmp.id}>
                  <TableCell className="font-mono font-semibold text-blue-900">
                    {cmp.complaintNumber}
                  </TableCell>
                  <TableCell className="font-bold text-slate-900">
                    {cmp.complainantName}
                  </TableCell>
                  <TableCell className="font-medium text-slate-800">
                    {cmp.category}
                  </TableCell>
                  <TableCell className="text-slate-600 truncate max-w-[140px]">
                    {cmp.respondentName || 'N/A'}
                  </TableCell>
                  <TableCell className="text-slate-500 text-xs">
                    {formatDate(cmp.dateFiled)}
                  </TableCell>
                  <TableCell>
                    <span className={`text-[11px] font-bold px-2 py-0.5 rounded ${
                      cmp.priority === 'High' || cmp.priority === 'Urgent'
                        ? 'bg-red-100 text-red-800'
                        : cmp.priority === 'Medium'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-slate-100 text-slate-700'
                    }`}>
                      {cmp.priority}
                    </span>
                  </TableCell>
                  <TableCell>{getStatusBadge(cmp.status)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedComplaint(cmp);
                          setIsDetailsOpen(true);
                        }}
                        className="p-1.5 text-slate-500 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                        title="View Complaint"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedComplaint(cmp);
                          setIsFormOpen(true);
                        }}
                        className="p-1.5 text-slate-500 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer"
                        title="Edit Complaint"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={complaints.length}
            pageSize={pageSize}
            onPageChange={setCurrentPage}
          />
        </div>
      )}

      {/* Form Modal */}
      <ComplaintFormModal
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setSelectedComplaint(null);
        }}
        onSave={handleSave}
        initialComplaint={selectedComplaint}
        isSaving={isSaving}
      />

      {/* Details Modal */}
      <ComplaintDetailsModal
        isOpen={isDetailsOpen}
        onClose={() => {
          setIsDetailsOpen(false);
          setSelectedComplaint(null);
        }}
        complaint={selectedComplaint}
        onUpdateStatus={handleUpdateStatus}
      />
    </div>
  );
};
