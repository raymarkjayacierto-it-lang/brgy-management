import React, { useState, useEffect } from 'react';
import { officialService } from '../../services/officialService';
import { auditService } from '../../services/systemService';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Official } from '../../types/official';
import { PageHeader } from '../../components/ui/PageHeader';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../components/ui/Table';
import { Button } from '../../components/ui/Button';
import { Badge, getStatusBadge } from '../../components/ui/Badge';
import { EmptyState, LoadingState } from '../../components/ui/Feedback';
import { formatDate } from '../../utils/formatters';
import { OfficialFormModal } from './OfficialFormModal';
import { Award, PlusCircle, Edit2, Phone, Mail } from 'lucide-react';

export const OfficialsPage: React.FC = () => {
  const { currentUser } = useAuth();
  const { showToast } = useToast();

  const [loading, setLoading] = useState(true);
  const [officials, setOfficials] = useState<Official[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedOfficial, setSelectedOfficial] = useState<Official | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const list = await officialService.getOfficials();
      setOfficials(list);
    } catch {
      showToast('Error loading officials.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSave = async (data: any) => {
    setIsSaving(true);
    try {
      if (selectedOfficial) {
        const updated = await officialService.updateOfficial(selectedOfficial.id, data);
        await auditService.logAction(
          currentUser?.name || 'Admin',
          currentUser?.role || 'Staff',
          'Updated Official Record',
          'Officials',
          updated.id,
          `Updated roster entry for ${updated.name}`
        );
        showToast(`Official ${updated.name} updated.`, 'success');
      } else {
        const created = await officialService.createOfficial(data);
        await auditService.logAction(
          currentUser?.name || 'Admin',
          currentUser?.role || 'Staff',
          'Added Official Record',
          'Officials',
          created.id,
          `Added ${created.name} (${created.position})`
        );
        showToast(`Official ${created.name} added.`, 'success');
      }
      setIsFormOpen(false);
      setSelectedOfficial(null);
      await loadData();
    } catch {
      showToast('Failed to save official.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Barangay Officials & Staff Directory"
        subtitle="Elected Sangguniang Barangay members, Lupon Tagapamayapa, and appointed personnel."
        actions={
          <Button
            variant="primary"
            size="sm"
            onClick={() => {
              setSelectedOfficial(null);
              setIsFormOpen(true);
            }}
            leftIcon={<PlusCircle className="w-4 h-4" />}
          >
            Add Official
          </Button>
        }
      />

      {loading ? (
        <LoadingState message="Loading officials roster..." />
      ) : officials.length === 0 ? (
        <EmptyState
          title="No officials listed"
          description="There are currently no officials recorded."
          actionLabel="Add Official"
          onAction={() => {
            setSelectedOfficial(null);
            setIsFormOpen(true);
          }}
        />
      ) : (
        <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-xs overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Official</TableHead>
                <TableHead>Position / Role</TableHead>
                <TableHead>Committee Chairmanship</TableHead>
                <TableHead>Contact Details</TableHead>
                <TableHead>Term of Office</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {officials.map(official => (
                <TableRow key={official.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-blue-900 text-white flex items-center justify-center font-bold text-xs">
                        {official.name.replace('Hon. ', '').replace('Mr. ', '').replace('Ms. ', '').charAt(0)}
                      </div>
                      <div>
                        <span className="font-bold text-slate-900">{official.name}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="font-semibold text-blue-950">
                    {official.position}
                  </TableCell>
                  <TableCell className="text-slate-600 text-xs">
                    {official.committee || 'General Council'}
                  </TableCell>
                  <TableCell className="text-xs">
                    <div className="flex items-center gap-1 text-slate-700">
                      <Phone className="w-3 h-3 text-blue-600" />
                      <span>{official.contactNumber}</span>
                    </div>
                    <div className="flex items-center gap-1 text-slate-500 mt-0.5">
                      <Mail className="w-3 h-3 text-slate-400" />
                      <span>{official.email}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-xs text-slate-500">
                    {formatDate(official.termStart)} – {formatDate(official.termEnd)}
                  </TableCell>
                  <TableCell>{getStatusBadge(official.status)}</TableCell>
                  <TableCell className="text-right">
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedOfficial(official);
                        setIsFormOpen(true);
                      }}
                      className="p-1.5 text-slate-500 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer"
                      title="Edit Official"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Form Modal */}
      <OfficialFormModal
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setSelectedOfficial(null);
        }}
        onSave={handleSave}
        initialOfficial={selectedOfficial}
        isSaving={isSaving}
      />
    </div>
  );
};
