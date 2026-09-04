import React, { useState, useEffect } from 'react';
import { BlotterRecord, BlotterStatus } from '../../types/blotter';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Textarea } from '../../components/ui/Textarea';

export interface BlotterFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => Promise<void>;
  initialRecord?: BlotterRecord | null;
  isSaving?: boolean;
}

export const BlotterFormModal: React.FC<BlotterFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialRecord,
  isSaving = false
}) => {
  const [incidentType, setIncidentType] = useState<BlotterRecord['incidentType']>('Noise Disturbance');
  const [incidentDate, setIncidentDate] = useState('2026-09-04');
  const [incidentTime, setIncidentTime] = useState('14:00');
  const [location, setLocation] = useState('');
  const [narrative, setNarrative] = useState('');
  const [status, setStatus] = useState<BlotterStatus>('OPEN');

  // Parties
  const [complainantName, setComplainantName] = useState('');
  const [complainantContact, setComplainantContact] = useState('');
  const [respondentName, setRespondentName] = useState('');
  const [respondentAddress, setRespondentAddress] = useState('');
  const [witnessName, setWitnessName] = useState('');

  // Officer
  const [assignedOfficer, setAssignedOfficer] = useState('Chief Tanod Mario V. Cruz');
  const [mediationDate, setMediationDate] = useState('');
  const [actionsTaken, setActionsTaken] = useState('');

  useEffect(() => {
    if (initialRecord) {
      setIncidentType(initialRecord.incidentType);
      setIncidentDate(initialRecord.incidentDate);
      setIncidentTime(initialRecord.incidentTime);
      setLocation(initialRecord.location);
      setNarrative(initialRecord.narrative);
      setStatus(initialRecord.status);
      setComplainantName(initialRecord.complainants[0]?.name || '');
      setComplainantContact(initialRecord.complainants[0]?.contact || '');
      setRespondentName(initialRecord.respondents[0]?.name || '');
      setRespondentAddress(initialRecord.respondents[0]?.address || '');
      setWitnessName(initialRecord.witnesses?.[0]?.name || '');
      setAssignedOfficer(initialRecord.assignedOfficer || 'Chief Tanod Mario V. Cruz');
      setMediationDate(initialRecord.mediationDate || '');
      setActionsTaken(initialRecord.actionsTaken || '');
    } else {
      setIncidentType('Noise Disturbance');
      setIncidentDate(new Date().toISOString().split('T')[0]);
      setIncidentTime('12:00');
      setLocation('Purok 1 - Pag-asa');
      setNarrative('');
      setStatus('OPEN');
      setComplainantName('');
      setComplainantContact('09');
      setRespondentName('');
      setRespondentAddress('');
      setWitnessName('');
      setAssignedOfficer('Chief Tanod Mario V. Cruz');
      setMediationDate('');
      setActionsTaken('');
    }
  }, [initialRecord, isOpen]);

  const handleSubmit = async () => {
    if (!complainantName.trim() || !respondentName.trim() || !location.trim() || !narrative.trim()) {
      alert('Please fill out complainant, respondent, location, and incident narrative.');
      return;
    }

    const payload = {
      dateReported: new Date().toISOString().split('T')[0],
      incidentDate,
      incidentTime,
      location: location.trim(),
      incidentType,
      narrative: narrative.trim(),
      status,
      complainants: [{ name: complainantName.trim(), contact: complainantContact.trim() }],
      respondents: [{ name: respondentName.trim(), address: respondentAddress.trim() }],
      witnesses: witnessName.trim() ? [{ name: witnessName.trim() }] : [],
      recordedBy: 'Barangay Desk Officer',
      assignedOfficer,
      mediationDate: mediationDate || undefined,
      actionsTaken: actionsTaken.trim() || undefined
    };

    await onSave(payload);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialRecord ? 'Edit Blotter Incident Entry' : 'Record Official Blotter Incident'}
      subtitle="Barangay Peace & Order / Lupong Tagapamayapa Log"
      size="xl"
      onSave={handleSubmit}
      saveLabel={initialRecord ? 'Update Entry' : 'Log Incident'}
      isSaving={isSaving}
    >
      <div className="space-y-4">
        {/* Incident classification & timing */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Select
            label="Incident Classification"
            value={incidentType}
            onChange={e => setIncidentType(e.target.value as any)}
            options={[
              { value: 'Physical Altercation', label: 'Physical Altercation' },
              { value: 'Property Dispute', label: 'Property Dispute / Boundary' },
              { value: 'Noise Disturbance', label: 'Noise Disturbance' },
              { value: 'Theft / Loss', label: 'Theft / Loss of Property' },
              { value: 'Defamation / Slander', label: 'Defamation / Slander' },
              { value: 'Neighborhood Conflict', label: 'Neighborhood Conflict' },
              { value: 'Other', label: 'Other' }
            ]}
          />
          <Input
            label="Incident Date"
            type="date"
            value={incidentDate}
            onChange={e => setIncidentDate(e.target.value)}
            required
          />
          <Input
            label="Incident Time"
            type="time"
            value={incidentTime}
            onChange={e => setIncidentTime(e.target.value)}
            required
          />
        </div>

        <Input
          label="Location of Incident"
          value={location}
          onChange={e => setLocation(e.target.value)}
          placeholder="e.g. Corner Mabini St. and Rizal Ave., Purok 1"
          required
        />

        {/* Parties Involved */}
        <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-600 block">
            Parties Involved
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="Complainant Name"
              value={complainantName}
              onChange={e => setComplainantName(e.target.value)}
              placeholder="e.g. Juan M. Dela Cruz"
              required
            />
            <Input
              label="Complainant Contact #"
              value={complainantContact}
              onChange={e => setComplainantContact(e.target.value)}
              placeholder="0917-000-0000"
            />
            <Input
              label="Respondent / Counterparty Name"
              value={respondentName}
              onChange={e => setRespondentName(e.target.value)}
              placeholder="e.g. Rodrigo R. Navarro"
              required
            />
            <Input
              label="Respondent Address / Dwelling"
              value={respondentAddress}
              onChange={e => setRespondentAddress(e.target.value)}
              placeholder="e.g. 64 Mabini Street"
            />
          </div>
          <Input
            label="Witness(es) (Optional)"
            value={witnessName}
            onChange={e => setWitnessName(e.target.value)}
            placeholder="e.g. Antonio L. Ramos Jr."
          />
        </div>

        <Textarea
          label="Detailed Incident Narrative"
          value={narrative}
          onChange={e => setNarrative(e.target.value)}
          placeholder="State the facts chronologically as reported by the complainant and responding officers..."
          rows={3}
          required
        />

        {/* Assignment & Lupon */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Select
            label="Assigned Officer / Conciliator"
            value={assignedOfficer}
            onChange={e => setAssignedOfficer(e.target.value)}
            options={[
              { value: 'Hon. Roberto M. Dela Rosa (Punong Barangay)', label: 'Hon. Roberto M. Dela Rosa (Punong Barangay)' },
              { value: 'Chief Tanod Mario V. Cruz', label: 'Chief Tanod Mario V. Cruz' },
              { value: 'Elena V. Bautista (Secretary)', label: 'Elena V. Bautista (Secretary)' },
              { value: 'Desk Officer Tanod Crisanto Ramos', label: 'Desk Officer Tanod Crisanto Ramos' }
            ]}
          />
          <Select
            label="Case Status"
            value={status}
            onChange={e => setStatus(e.target.value as BlotterStatus)}
            options={[
              { value: 'OPEN', label: 'OPEN' },
              { value: 'UNDER_INVESTIGATION', label: 'UNDER INVESTIGATION' },
              { value: 'FOR_MEDIATION', label: 'FOR MEDIATION (Lupon)' },
              { value: 'RESOLVED', label: 'RESOLVED (Amicable Settlement)' },
              { value: 'REFERRED', label: 'REFERRED (PNP / Court)' },
              { value: 'CLOSED', label: 'CLOSED' }
            ]}
          />
          <Input
            label="Mediation Hearing Date (If any)"
            type="date"
            value={mediationDate}
            onChange={e => setMediationDate(e.target.value)}
          />
        </div>
      </div>
    </Modal>
  );
};
