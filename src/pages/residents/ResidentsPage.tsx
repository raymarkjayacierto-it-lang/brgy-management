import React, { useState, useEffect, useMemo } from 'react';
import { residentService } from '../../services/residentService';
import { auditService } from '../../services/systemService';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Resident, ResidentFilterOptions } from '../../types/resident';
import { PageHeader } from '../../components/ui/PageHeader';
import { SearchInput } from '../../components/ui/SearchInput';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../components/ui/Table';
import { Pagination } from '../../components/ui/Pagination';
import { Button } from '../../components/ui/Button';
import { Select } from '../../components/ui/Select';
import { Badge, getStatusBadge } from '../../components/ui/Badge';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { EmptyState, LoadingState } from '../../components/ui/Feedback';
import { calculateAge, formatDate } from '../../utils/formatters';
import { ResidentFormModal } from './ResidentFormModal';
import { ResidentDetailsModal } from './ResidentDetailsModal';
import {
  Users,
  UserPlus,
  Filter,
  Eye,
  Edit2,
  Archive,
  Download,
  RotateCcw,
  CheckCircle,
  FileText
} from 'lucide-react';

export interface ResidentsPageProps {
  onNavigateClearance?: (resident: Resident) => void;
  initialSearch?: string;
}

export const ResidentsPage: React.FC<ResidentsPageProps> = ({
  onNavigateClearance,
  initialSearch = ''
}) => {
  const { currentUser } = useAuth();
  const { showToast } = useToast();

  const [loading, setLoading] = useState(true);
  const [residents, setResidents] = useState<Resident[]>([]);
  const [search, setSearch] = useState(initialSearch);
  const [purokFilter, setPurokFilter] = useState('');
  const [civilStatusFilter, setCivilStatusFilter] = useState('');
  const [sexFilter, setSexFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('Active');
  const [seniorOnly, setSeniorOnly] = useState(false);
  const [pwdOnly, setPwdOnly] = useState(false);
  const [fourPsOnly, setFourPsOnly] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;

  // Modals state
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedResident, setSelectedResident] = useState<Resident | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Archive Confirm Dialog
  const [archiveTarget, setArchiveTarget] = useState<Resident | null>(null);
  const [isArchiving, setIsArchiving] = useState(false);

  // Load residents
  const loadResidents = async () => {
    setLoading(true);
    try {
      const filters: ResidentFilterOptions = {
        search: search.trim() || undefined,
        purok: purokFilter || undefined,
        civilStatus: civilStatusFilter || undefined,
        sex: sexFilter || undefined,
        status: statusFilter || undefined,
        seniorOnly,
        pwdOnly,
        fourPsOnly
      };
      const list = await residentService.getResidents(filters);
      setResidents(list);
      setCurrentPage(1);
    } catch {
      showToast('Unable to load residents. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadResidents();
  }, [search, purokFilter, civilStatusFilter, sexFilter, statusFilter, seniorOnly, pwdOnly, fourPsOnly]);

  // Paginated records
  const paginatedResidents = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return residents.slice(start, start + pageSize);
  }, [residents, currentPage, pageSize]);

  const totalPages = Math.ceil(residents.length / pageSize) || 1;

  // Save Resident
  const handleSaveResident = async (data: any) => {
    setIsSaving(true);
    try {
      if (selectedResident) {
        // Edit
        const updated = await residentService.updateResident(selectedResident.id, data);
        await auditService.logAction(
          currentUser?.name || 'Admin',
          currentUser?.role || 'Staff',
          'Updated Resident Record',
          'Residents',
          updated.residentNumber,
          `Updated details for ${updated.firstName} ${updated.lastName}`
        );
        showToast(`Resident ${updated.firstName} ${updated.lastName} updated successfully.`, 'success');
      } else {
        // Create
        const created = await residentService.createResident(data);
        await auditService.logAction(
          currentUser?.name || 'Admin',
          currentUser?.role || 'Staff',
          'Registered New Resident',
          'Residents',
          created.residentNumber,
          `Registered resident ${created.firstName} ${created.lastName} in ${created.address.purok}`
        );
        showToast(`New resident ${created.firstName} ${created.lastName} registered successfully.`, 'success');
      }
      setIsFormModalOpen(false);
      setSelectedResident(null);
      await loadResidents();
    } catch {
      showToast('Unable to save resident. Please check input and try again.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  // Archive Resident
  const handleConfirmArchive = async () => {
    if (!archiveTarget) return;
    setIsArchiving(true);
    try {
      await residentService.archiveResident(archiveTarget.id);
      await auditService.logAction(
        currentUser?.name || 'Admin',
        currentUser?.role || 'Staff',
        'Archived Resident Record',
        'Residents',
        archiveTarget.residentNumber,
        `Moved ${archiveTarget.firstName} ${archiveTarget.lastName} to archived records`
      );
      showToast(`Resident ${archiveTarget.firstName} ${archiveTarget.lastName} has been archived.`, 'info');
      setArchiveTarget(null);
      await loadResidents();
    } catch {
      showToast('Failed to archive resident record.', 'error');
    } finally {
      setIsArchiving(false);
    }
  };

  // Export CSV
  const handleExportCSV = () => {
    if (residents.length === 0) return;
    const headers = ['Resident Number', 'First Name', 'Last Name', 'Age', 'Sex', 'Purok', 'Contact', 'Voter Status', 'Status'];
    const rows = residents.map(r => [
      r.residentNumber,
      r.firstName,
      r.lastName,
      calculateAge(r.birthDate),
      r.sex,
      `"${r.address.purok}"`,
      r.contactNumber,
      r.voterStatus,
      r.status
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Barangay_Residents_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Residents list exported to CSV', 'success');
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title="Resident Management"
        subtitle="Manage official records of registered barangay inhabitants and voters."
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleExportCSV}
              leftIcon={<Download className="w-4 h-4" />}
            >
              Export CSV
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => {
                setSelectedResident(null);
                setIsFormModalOpen(true);
              }}
              leftIcon={<UserPlus className="w-4 h-4" />}
            >
              Add Resident
            </Button>
          </div>
        }
      />

      {/* Filter & Search Bar */}
      <div className="bg-white rounded-xl border border-gov-border p-4 shadow-xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          <div className="lg:col-span-2">
            <SearchInput
              value={search}
              onChange={setSearch}
              placeholder="Search by name, ID (e.g. RES-2026-000101), phone..."
            />
          </div>
          <Select
            value={purokFilter}
            onChange={e => setPurokFilter(e.target.value)}
          >
            <option value="">All Puroks</option>
            <option value="Purok 1 - Pag-asa">Purok 1 - Pag-asa</option>
            <option value="Purok 2 - Maligaya">Purok 2 - Maligaya</option>
            <option value="Purok 3 - Mabuhay">Purok 3 - Mabuhay</option>
            <option value="Purok 4 - Masagana">Purok 4 - Masagana</option>
            <option value="Purok 5 - Kaunlaran">Purok 5 - Kaunlaran</option>
            <option value="Purok 6 - Kalinisan">Purok 6 - Kalinisan</option>
            <option value="Purok 7 - Mapayapa">Purok 7 - Mapayapa</option>
          </Select>
          <Select
            value={sexFilter}
            onChange={e => setSexFilter(e.target.value)}
          >
            <option value="">All Sexes</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </Select>
          <Select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
          >
            <option value="Active">Active Records</option>
            <option value="Inactive">Inactive</option>
            <option value="Archived">Archived Records</option>
            <option value="">All Records</option>
          </Select>
        </div>

        {/* Special Filter Badges */}
        <div className="flex items-center gap-2 flex-wrap pt-2 border-t border-slate-100 text-xs">
          <span className="text-slate-400 font-medium">Quick Filters:</span>
          <button
            type="button"
            onClick={() => setSeniorOnly(!seniorOnly)}
            className={`px-2.5 py-1 rounded-full border transition-colors cursor-pointer ${
              seniorOnly ? 'bg-amber-100 border-amber-300 text-amber-900 font-semibold' : 'border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            Senior Citizens (60+)
          </button>
          <button
            type="button"
            onClick={() => setPwdOnly(!pwdOnly)}
            className={`px-2.5 py-1 rounded-full border transition-colors cursor-pointer ${
              pwdOnly ? 'bg-indigo-100 border-indigo-300 text-indigo-900 font-semibold' : 'border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            PWD
          </button>
          <button
            type="button"
            onClick={() => setFourPsOnly(!fourPsOnly)}
            className={`px-2.5 py-1 rounded-full border transition-colors cursor-pointer ${
              fourPsOnly ? 'bg-emerald-100 border-emerald-300 text-emerald-900 font-semibold' : 'border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            4Ps Beneficiaries
          </button>
          {(purokFilter || sexFilter || search || seniorOnly || pwdOnly || fourPsOnly) && (
            <button
              type="button"
              onClick={() => {
                setSearch('');
                setPurokFilter('');
                setSexFilter('');
                setSeniorOnly(false);
                setPwdOnly(false);
                setFourPsOnly(false);
              }}
              className="text-blue-600 hover:text-blue-800 ml-auto font-medium cursor-pointer inline-flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset Filters</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Residents Table */}
      {loading ? (
        <LoadingState message="Searching barangay resident registry..." />
      ) : residents.length === 0 ? (
        <EmptyState
          title="No residents found"
          description="No residents matched your filter parameters. Try adjusting your search query or add a new resident."
          actionLabel="Add Resident"
          onAction={() => {
            setSelectedResident(null);
            setIsFormModalOpen(true);
          }}
        />
      ) : (
        <div className="bg-white rounded-xl border border-gov-border shadow-xs overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Resident ID</TableHead>
                <TableHead>Full Name</TableHead>
                <TableHead>Age / Sex</TableHead>
                <TableHead>Civil Status</TableHead>
                <TableHead>Purok</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedResidents.map(resident => {
                const fullName = `${resident.lastName}, ${resident.firstName} ${resident.middleName ? resident.middleName.charAt(0) + '.' : ''}${resident.suffix ? ' ' + resident.suffix : ''}`;
                const age = calculateAge(resident.birthDate);

                return (
                  <TableRow key={resident.id}>
                    <TableCell className="font-mono font-semibold text-blue-900">
                      {resident.residentNumber}
                    </TableCell>
                    <TableCell>
                      <div className="font-bold text-slate-900">{fullName}</div>
                      <div className="text-[11px] text-slate-500 flex items-center gap-1.5 mt-0.5">
                        {resident.voterStatus === 'Registered' && (
                          <span className="text-blue-600 font-medium">Voter</span>
                        )}
                        {resident.seniorCitizenStatus && (
                          <span className="text-amber-700 font-medium">• Senior</span>
                        )}
                        {resident.pwdStatus && (
                          <span className="text-indigo-700 font-medium">• PWD</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {age} yrs • {resident.sex}
                    </TableCell>
                    <TableCell>{resident.civilStatus}</TableCell>
                    <TableCell>
                      <span className="font-medium text-slate-800">{resident.address.purok}</span>
                    </TableCell>
                    <TableCell className="text-slate-600">{resident.contactNumber}</TableCell>
                    <TableCell>{getStatusBadge(resident.status)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedResident(resident);
                            setIsDetailsModalOpen(true);
                          }}
                          className="p-1.5 text-slate-500 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                          title="View Full Profile"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedResident(resident);
                            setIsFormModalOpen(true);
                          }}
                          className="p-1.5 text-slate-500 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer"
                          title="Edit Resident"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        {resident.status !== 'Archived' && (
                          <button
                            type="button"
                            onClick={() => setArchiveTarget(resident)}
                            className="p-1.5 text-slate-400 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                            title="Archive Record"
                          >
                            <Archive className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>

          {/* Pagination */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={residents.length}
            pageSize={pageSize}
            onPageChange={setCurrentPage}
          />
        </div>
      )}

      {/* Form Modal (Add / Edit) */}
      <ResidentFormModal
        isOpen={isFormModalOpen}
        onClose={() => {
          setIsFormModalOpen(false);
          setSelectedResident(null);
        }}
        onSave={handleSaveResident}
        initialResident={selectedResident}
        isSaving={isSaving}
      />

      {/* Details Profile Modal */}
      <ResidentDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => {
          setIsDetailsModalOpen(false);
          setSelectedResident(null);
        }}
        resident={selectedResident}
        onEdit={res => {
          setIsDetailsModalOpen(false);
          setSelectedResident(res);
          setIsFormModalOpen(true);
        }}
        onRequestClearance={res => {
          setIsDetailsModalOpen(false);
          if (onNavigateClearance) onNavigateClearance(res);
        }}
      />

      {/* Confirm Archive Dialog */}
      <ConfirmDialog
        isOpen={!!archiveTarget}
        onClose={() => setArchiveTarget(null)}
        onConfirm={handleConfirmArchive}
        title="Archive Resident Record?"
        message={`This resident record (${archiveTarget?.firstName} ${archiveTarget?.lastName}) will be removed from active lists and moved to the Barangay archive.`}
        confirmLabel="Archive Resident"
        variant="danger"
        isLoading={isArchiving}
      />
    </div>
  );
};
