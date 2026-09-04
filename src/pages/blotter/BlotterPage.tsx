import React, { useState, useEffect } from 'react';
import { blotterService } from '../../services/blotterService';
import { auditService } from '../../services/systemService';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { BlotterRecord, BlotterStatus } from '../../types/blotter';
import { PageHeader } from '../../components/ui/PageHeader';
import { SearchInput } from '../../components/ui/SearchInput';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../components/ui/Table';
import { Pagination } from '../../components/ui/Pagination';
import { Button } from '../../components/ui/Button';
import { Select } from '../../components/ui/Select';
import { getStatusBadge } from '../../components/ui/Badge';
import { EmptyState, LoadingState } from '../../components/ui/Feedback';
import { formatDate } from '../../utils/formatters';
import { BlotterFormModal } from './BlotterFormModal';
import { BlotterDetailsModal } from './BlotterDetailsModal';
import { ShieldAlert, PlusCircle, Eye, Edit2, CheckCircle2 } from 'lucide-react';

export const BlotterPage: React.FC = () => {
  const { currentUser } = useAuth();
  const { showToast } = useToast();

  const [loading, setLoading] = useState(true);
  const [records, setRecords] = useState<BlotterRecord[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<BlotterRecord | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const list = await blotterService.getBlotterRecords({
        search: search.trim() || undefined,
        status: statusFilter || undefined,
        type: typeFilter || undefined
      });
      setRecords(list);
      setCurrentPage(1);
    } catch {
      showToast('Error loading blotter records.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [search, statusFilter, typeFilter]);

  const totalPages = Math.ceil(records.length / pageSize) || 1;
  const paginated = records.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleSave = async (data: any) => {
    setIsSaving(true);
    try {
      if (selectedRecord) {
        const updated = await blotterService.updateBlotterRecord(selectedRecord.id, data);
        await auditService.logAction(
          currentUser?.name || 'Officer',
          currentUser?.role || 'Staff',
          'Updated Blotter Entry',
          'Blotter',
          updated.blotterNumber,
          `Updated incident report ${updated.blotterNumber}`
        );
        showToast(`Blotter record ${updated.blotterNumber} updated.`, 'success');
      } else {
        const created = await blotterService.createBlotterRecord(data);
        await auditService.logAction(
          currentUser?.name || 'Officer',
          currentUser?.role || 'Staff',
          'Logged New Blotter Case',
          'Blotter',
          created.blotterNumber,
          `Reported: ${created.incidentType} at ${created.location}`
        );
        showToast(`New incident logged under ${created.blotterNumber}.`, 'success');
      }
      setIsFormOpen(false);
      setSelectedRecord(null);
      await loadData();
    } catch {
      showToast('Failed to save blotter record.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpdateStatus = async (id: string, status: BlotterStatus, resolution?: string) => {
    try {
      await blotterService.updateStatus(id, status, resolution);
      showToast('Case status updated successfully.', 'success');
      await loadData();
    } catch {
      showToast('Failed to update case status.', 'error');
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Blotter & Incident Management"
        subtitle="Peace & order record-keeping and Lupong Tagapamayapa case proceedings."
        actions={
          <Button
            variant="primary"
            size="sm"
            onClick={() => {
              setSelectedRecord(null);
              setIsFormOpen(true);
            }}
            leftIcon={<PlusCircle className="w-4 h-4" />}
          >
            Log New Incident
          </Button>
        }
      />

      {/* Filters */}
      <div className="bg-white rounded-xl border border-[#E2E8F0] p-4 shadow-xs grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="sm:col-span-1">
          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder="Search by blotter #, complainant, respondent..."
          />
        </div>
        <Select
          value={typeFilter}
          onChange={e => setTypeFilter(e.target.value)}
        >
          <option value="">All Incident Types</option>
          <option value="Physical Altercation">Physical Altercation</option>
          <option value="Property Dispute">Property Dispute</option>
          <option value="Noise Disturbance">Noise Disturbance</option>
          <option value="Theft / Loss">Theft / Loss</option>
          <option value="Defamation / Slander">Defamation / Slander</option>
          <option value="Neighborhood Conflict">Neighborhood Conflict</option>
        </Select>
        <Select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
        >
          <option value="">All Statuses</option>
          <option value="OPEN">OPEN</option>
          <option value="UNDER_INVESTIGATION">UNDER INVESTIGATION</option>
          <option value="FOR_MEDIATION">FOR MEDIATION</option>
          <option value="RESOLVED">RESOLVED</option>
          <option value="REFERRED">REFERRED</option>
          <option value="CLOSED">CLOSED</option>
        </Select>
      </div>

      {/* Table */}
      {loading ? (
        <LoadingState message="Fetching blotter records..." />
      ) : records.length === 0 ? (
        <EmptyState
          title="No blotter incidents found"
          description="There are no blotter incident records matching your filters."
          actionLabel="Log Incident"
          onAction={() => {
            setSelectedRecord(null);
            setIsFormOpen(true);
          }}
        />
      ) : (
        <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-xs overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Blotter #</TableHead>
                <TableHead>Incident Type</TableHead>
                <TableHead>Complainant</TableHead>
                <TableHead>Respondent</TableHead>
                <TableHead>Date & Time</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginated.map(record => (
                <TableRow key={record.id}>
                  <TableCell className="font-mono font-semibold text-blue-900">
                    {record.blotterNumber}
                  </TableCell>
                  <TableCell className="font-semibold text-slate-800">
                    {record.incidentType}
                  </TableCell>
                  <TableCell className="font-medium text-slate-900">
                    {record.complainants[0]?.name || 'Anonymous'}
                  </TableCell>
                  <TableCell className="text-slate-700">
                    {record.respondents[0]?.name || 'Unidentified'}
                  </TableCell>
                  <TableCell className="text-slate-500 text-xs">
                    {formatDate(record.incidentDate)} {record.incidentTime}
                  </TableCell>
                  <TableCell className="text-slate-600 truncate max-w-[160px]">
                    {record.location}
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(record.status)}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedRecord(record);
                          setIsDetailsOpen(true);
                        }}
                        className="p-1.5 text-slate-500 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                        title="View Full Case"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedRecord(record);
                          setIsFormOpen(true);
                        }}
                        className="p-1.5 text-slate-500 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer"
                        title="Edit Record"
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
            totalItems={records.length}
            pageSize={pageSize}
            onPageChange={setCurrentPage}
          />
        </div>
      )}

      {/* Form Modal */}
      <BlotterFormModal
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setSelectedRecord(null);
        }}
        onSave={handleSave}
        initialRecord={selectedRecord}
        isSaving={isSaving}
      />

      {/* Details Modal */}
      <BlotterDetailsModal
        isOpen={isDetailsOpen}
        onClose={() => {
          setIsDetailsOpen(false);
          setSelectedRecord(null);
        }}
        record={selectedRecord}
        onUpdateStatus={handleUpdateStatus}
      />
    </div>
  );
};
