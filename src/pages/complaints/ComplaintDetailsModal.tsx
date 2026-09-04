import React, { useState } from 'react';
import { Complaint, ComplaintStatus } from '../../types/complaint';
import { Modal } from '../../components/ui/Modal';
import { getStatusBadge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Select } from '../../components/ui/Select';
import { Textarea } from '../../components/ui/Textarea';
import { formatDate } from '../../utils/formatters';
import { MessageSquareWarning, CheckCircle2, User, Clock, AlertTriangle } from 'lucide-react';

export interface ComplaintDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  complaint: Complaint | null;
  onUpdateStatus: (id: string, status: ComplaintStatus, resolution?: string) => Promise<void>;
}

export const ComplaintDetailsModal: React.FC<ComplaintDetailsModalProps> = ({
  isOpen,
  onClose,
  complaint,
  onUpdateStatus
}) => {
  const [newStatus, setNewStatus] = useState<ComplaintStatus>('RESOLVED');
  const [resolution, setResolution] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  if (!complaint) return null;

  const handleSubmit = async () => {
    setIsUpdating(true);
    try {
      await onUpdateStatus(complaint.id, newStatus, resolution.trim());
      onClose();
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Complaint Record Details"
      subtitle={`Complaint Ref: ${complaint.complaintNumber}`}
      size="lg"
      hideFooter
    >
      <div className="space-y-6">
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-base text-slate-900">{complaint.category}</span>
              {getStatusBadge(complaint.status)}
              <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-800">
                Priority: {complaint.priority}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Filed on {formatDate(complaint.dateFiled)} • Handled by: {complaint.assignedStaff}
            </p>
          </div>
        </div>

        {/* Parties */}
        <div className="grid grid-cols-2 gap-4 text-xs">
          <div className="p-3 bg-white border border-slate-200 rounded-lg">
            <span className="text-slate-400 block mb-0.5">Complainant:</span>
            <span className="font-bold text-slate-900">{complaint.complainantName}</span>
            <p className="text-slate-500 mt-0.5">{complaint.complainantContact}</p>
          </div>
          <div className="p-3 bg-white border border-slate-200 rounded-lg">
            <span className="text-slate-400 block mb-0.5">Respondent / Subject:</span>
            <span className="font-bold text-slate-900">{complaint.respondentName || 'N/A'}</span>
          </div>
        </div>

        {/* Description */}
        <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Grievance Description
          </h4>
          <p className="text-xs sm:text-sm text-slate-800 leading-relaxed">
            {complaint.description}
          </p>
        </div>

        {/* Resolution */}
        {complaint.resolution ? (
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 space-y-1">
            <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-900 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Resolved Action / Notes</span>
            </h4>
            <p className="text-xs text-emerald-950 leading-relaxed">{complaint.resolution}</p>
          </div>
        ) : (
          <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-blue-900">
              Update Investigation & Resolution
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Select
                label="Update Status"
                value={newStatus}
                onChange={e => setNewStatus(e.target.value as ComplaintStatus)}
                options={[
                  { value: 'UNDER_REVIEW', label: 'UNDER REVIEW' },
                  { value: 'IN_PROGRESS', label: 'IN PROGRESS' },
                  { value: 'RESOLVED', label: 'RESOLVED' },
                  { value: 'REJECTED', label: 'REJECTED' },
                  { value: 'CLOSED', label: 'CLOSED' }
                ]}
              />
              <div className="sm:col-span-2">
                <Textarea
                  label="Official Action Taken / Remedy"
                  value={resolution}
                  onChange={e => setResolution(e.target.value)}
                  placeholder="Record what was done by the barangay to resolve this complaint..."
                  rows={2}
                />
              </div>
            </div>
            <div className="flex justify-end">
              <Button
                variant="primary"
                size="sm"
                onClick={handleSubmit}
                isLoading={isUpdating}
              >
                Update Record
              </Button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};
