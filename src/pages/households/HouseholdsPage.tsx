import React, { useState, useEffect } from 'react';
import { householdService } from '../../services/householdService';
import { residentService } from '../../services/residentService';
import { auditService } from '../../services/systemService';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Household } from '../../types/household';
import { Resident } from '../../types/resident';
import { PageHeader } from '../../components/ui/PageHeader';
import { SearchInput } from '../../components/ui/SearchInput';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../components/ui/Table';
import { Pagination } from '../../components/ui/Pagination';
import { Button } from '../../components/ui/Button';
import { Select } from '../../components/ui/Select';
import { getStatusBadge } from '../../components/ui/Badge';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { EmptyState, LoadingState } from '../../components/ui/Feedback';
import { HouseholdFormModal } from './HouseholdFormModal';
import { HouseholdDetailsModal } from './HouseholdDetailsModal';
import { Home, PlusCircle, Eye, Edit2, Archive, Users } from 'lucide-react';

export const HouseholdsPage: React.FC<{
  onViewResidentProfile?: (resident: Resident) => void;
}> = ({ onViewResidentProfile }) => {
  const { currentUser } = useAuth();
  const { showToast } = useToast();

  const [loading, setLoading] = useState(true);
  const [households, setHouseholds] = useState<Household[]>([]);
  const [residents, setResidents] = useState<Resident[]>([]);
  const [search, setSearch] = useState('');
  const [purokFilter, setPurokFilter] = useState('');

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;

  // Modals
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [selectedHousehold, setSelectedHousehold] = useState<Household | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Archive
  const [archiveTarget, setArchiveTarget] = useState<Household | null>(null);
  const [isArchiving, setIsArchiving] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const [hhList, resList] = await Promise.all([
        householdService.getHouseholds(purokFilter || undefined, search || undefined),
        residentService.getResidents()
      ]);
      setHouseholds(hhList);
      setResidents(resList);
      setCurrentPage(1);
    } catch {
      showToast('Error loading households data.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [search, purokFilter]);

  const totalPages = Math.ceil(households.length / pageSize) || 1;
  const paginated = households.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleSave = async (data: any) => {
    setIsSaving(true);
    try {
      if (selectedHousehold) {
        const updated = await householdService.updateHousehold(selectedHousehold.id, data);
        await auditService.logAction(
          currentUser?.name || 'Admin',
          currentUser?.role || 'Staff',
          'Updated Household Record',
          'Households',
          updated.householdNumber,
          `Updated household head: ${updated.headName}`
        );
        showToast(`Household ${updated.householdNumber} updated successfully.`, 'success');
      } else {
        const created = await householdService.createHousehold(data);
        await auditService.logAction(
          currentUser?.name || 'Admin',
          currentUser?.role || 'Staff',
          'Registered Household Record',
          'Households',
          created.householdNumber,
          `Created household under ${created.headName}`
        );
        showToast(`Household ${created.householdNumber} registered successfully.`, 'success');
      }
      setIsFormOpen(false);
      setSelectedHousehold(null);
      await loadData();
    } catch {
      showToast('Failed to save household.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleConfirmArchive = async () => {
    if (!archiveTarget) return;
    setIsArchiving(true);
    try {
      await householdService.archiveHousehold(archiveTarget.id);
      showToast(`Household ${archiveTarget.householdNumber} archived.`, 'info');
      setArchiveTarget(null);
      await loadData();
    } catch {
      showToast('Failed to archive household.', 'error');
    } finally {
      setIsArchiving(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Household Management"
        subtitle="Catalog and oversee barangay family units and household composition."
        actions={
          <Button
            variant="primary"
            size="sm"
            onClick={() => {
              setSelectedHousehold(null);
              setIsFormOpen(true);
            }}
            leftIcon={<PlusCircle className="w-4 h-4" />}
          >
            Register Household
          </Button>
        }
      />

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gov-border p-4 shadow-xs grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="sm:col-span-2">
          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder="Search by household ID (e.g. HH-2026-0001), head of family, address..."
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
      </div>

      {loading ? (
        <LoadingState message="Loading households..." />
      ) : households.length === 0 ? (
        <EmptyState
          title="No households found"
          description="No households found matching your search. Register a new household unit to get started."
          actionLabel="Register Household"
          onAction={() => {
            setSelectedHousehold(null);
            setIsFormOpen(true);
          }}
        />
      ) : (
        <div className="bg-white rounded-xl border border-gov-border shadow-xs overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Household ID</TableHead>
                <TableHead>Household Head</TableHead>
                <TableHead>Address</TableHead>
                <TableHead>Purok</TableHead>
                <TableHead>Members</TableHead>
                <TableHead>Economic Status</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginated.map(hh => (
                <TableRow key={hh.id}>
                  <TableCell className="font-mono font-semibold text-blue-900">
                    {hh.householdNumber}
                  </TableCell>
                  <TableCell className="font-bold text-slate-900">
                    {hh.headName}
                  </TableCell>
                  <TableCell className="text-slate-600 truncate max-w-xs">
                    {hh.address}
                  </TableCell>
                  <TableCell className="font-medium text-slate-800">
                    {hh.purok}
                  </TableCell>
                  <TableCell>
                    <span className="inline-flex items-center gap-1 font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-full text-xs">
                      <Users className="w-3 h-3 text-blue-600" />
                      {hh.membersCount} member{hh.membersCount !== 1 ? 's' : ''}
                    </span>
                  </TableCell>
                  <TableCell className="text-xs text-slate-600">
                    {hh.incomeBracket.split('(')[0]}
                  </TableCell>
                  <TableCell>{getStatusBadge(hh.status)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedHousehold(hh);
                          setIsDetailsOpen(true);
                        }}
                        className="p-1.5 text-slate-500 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                        title="View Household"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedHousehold(hh);
                          setIsFormOpen(true);
                        }}
                        className="p-1.5 text-slate-500 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer"
                        title="Edit Household"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setArchiveTarget(hh)}
                        className="p-1.5 text-slate-400 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                        title="Archive Household"
                      >
                        <Archive className="w-4 h-4" />
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
            totalItems={households.length}
            pageSize={pageSize}
            onPageChange={setCurrentPage}
          />
        </div>
      )}

      {/* Form Modal */}
      <HouseholdFormModal
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setSelectedHousehold(null);
        }}
        onSave={handleSave}
        initialHousehold={selectedHousehold}
        residents={residents}
        isSaving={isSaving}
      />

      {/* Details Modal */}
      <HouseholdDetailsModal
        isOpen={isDetailsOpen}
        onClose={() => {
          setIsDetailsOpen(false);
          setSelectedHousehold(null);
        }}
        household={selectedHousehold}
        residents={residents}
        onViewResident={onViewResidentProfile}
      />

      {/* Confirm Archive */}
      <ConfirmDialog
        isOpen={!!archiveTarget}
        onClose={() => setArchiveTarget(null)}
        onConfirm={handleConfirmArchive}
        title="Archive Household Record?"
        message={`Are you sure you want to archive Household ${archiveTarget?.householdNumber}? This will remove it from active records.`}
        confirmLabel="Archive Household"
        variant="danger"
        isLoading={isArchiving}
      />
    </div>
  );
};
