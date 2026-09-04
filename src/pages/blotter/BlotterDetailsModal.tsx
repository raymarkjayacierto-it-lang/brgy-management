import React, { useState } from 'react';
import { BlotterRecord, BlotterStatus } from '../../types/blotter';
import { Modal } from '../../components/ui/Modal';
import { getStatusBadge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Textarea } from '../../components/ui/Textarea';
import { Select } from '../../components/ui/Select';
import { formatDate } from '../../utils/formatters';
import { ShieldAlert, Users, Calendar, MapPin, CheckCircle2, FileText, Clock } from 'lucide-react';

export interface BlotterDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  record: BlotterRecord | null;
  onUpdateStatus: (id: string, status: BlotterStatus, resolution?: string) => Promise<void>;
}

export const BlotterDetailsModal: React.FC<BlotterDetailsModalProps> = ({
  isOpen,
  onClose,
  record,
  onUpdateStatus
}) => {
  const [newStatus, setNewStatus] = useState<BlotterStatus>('RESOLVED');
  const [resolutionText, setResolutionText] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  if (!record) return null;

  const handleStatusSubmit = async () => {
    setIsUpdating(true);
    try {
      await onUpdateStatus(record.id, newStatus, resolutionText.trim());
      onClose();
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Incident Blotter Record"
      subtitle={`Blotter Entry: ${record.blotterNumber}`}
      size="xl"
      hideFooter
    >
      <div className="space-y-6">
        {/* Banner */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base font-bold text-slate-900">{record.incidentType}</span>
              {getStatusBadge(record.status)}
            </div>
            <p className="text-xs text-slate-500 mt-1 flex items-center gap-2">
              <span>Reported: {formatDate(record.dateReported)}</span>
              <span>•</span>
              <span>Incident: {formatDate(record.incidentDate)} at {record.incidentTime}</span>
            </p>
          </div>
          <div className="text-right text-xs text-slate-600">
            <span className="font-semibold text-slate-800">Officer:</span> {record.assignedOfficer}
          </div>
        </div>

        {/* Location & Parties */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-2">
            <h4 className="font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1 text-[11px]">
              <Users className="w-3.5 h-3.5 text-blue-600" />
              <span>Complainant(s)</span>
            </h4>
            {record.complainants.map((c, i) => (
              <div key={i} className="font-semibold text-slate-900">
                {c.name} {c.contact && <span className="text-slate-500 font-normal">({c.contact})</span>}
              </div>
            ))}
          </div>

          <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-2">
            <h4 className="font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1 text-[11px]">
              <Users className="w-3.5 h-3.5 text-amber-600" />
              <span>Respondent(s)</span>
            </h4>
            {record.respondents.map((r, i) => (
              <div key={i} className="font-semibold text-slate-900">
                {r.name} {r.address && <span className="text-slate-500 font-normal">({r.address})</span>}
              </div>
            ))}
          </div>
        </div>

        {/* Narrative */}
        <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Incident Narrative / Statement
          </h4>
          <p className="text-xs sm:text-sm text-slate-800 leading-relaxed whitespace-pre-wrap">
            {record.narrative}
          </p>
          <div className="text-[11px] text-slate-400 pt-2 border-t border-slate-100 flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5" />
            <span>Location: {record.location}</span>
          </div>
        </div>

        {/* Resolution / Mediation Status */}
        {record.resolution ? (
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 space-y-1">
            <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-950 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Amicable Settlement / Resolution Recorded</span>
            </h4>
            <p className="text-xs text-emerald-900 leading-relaxed">{record.resolution}</p>
          </div>
        ) : (
          <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-blue-950">
              Update Hearing or Record Resolution
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Select
                label="Update Case Status"
                value={newStatus}
                onChange={e => setNewStatus(e.target.value as BlotterStatus)}
                options={[
                  { value: 'UNDER_INVESTIGATION', label: 'UNDER INVESTIGATION' },
                  { value: 'FOR_MEDIATION', label: 'FOR MEDIATION' },
                  { value: 'RESOLVED', label: 'RESOLVED (Kasunduan)' },
                  { value: 'REFERRED', label: 'REFERRED (PNP / Court)' },
                  { value: 'CLOSED', label: 'CLOSED' }
                ]}
              />
              <div className="sm:col-span-2">
                <Textarea
                  label="Resolution Details / Settlement Terms"
                  value={resolutionText}
                  onChange={e => setResolutionText(e.target.value)}
                  placeholder="Record terms of amicable settlement or referral details..."
                  rows={2}
                />
              </div>
            </div>
            <div className="flex justify-end">
              <Button
                variant="primary"
                size="sm"
                onClick={handleStatusSubmit}
                isLoading={isUpdating}
              >
                Save Resolution
              </Button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};
