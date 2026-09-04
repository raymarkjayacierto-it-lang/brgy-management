import React, { useState, useEffect } from 'react';
import { Official, OfficialPosition } from '../../types/official';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';

export interface OfficialFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => Promise<void>;
  initialOfficial?: Official | null;
  isSaving?: boolean;
}

export const OfficialFormModal: React.FC<OfficialFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialOfficial,
  isSaving = false
}) => {
  const [name, setName] = useState('');
  const [position, setPosition] = useState<OfficialPosition>('Barangay Kagawad');
  const [committee, setCommittee] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [email, setEmail] = useState('');
  const [termStart, setTermStart] = useState('2023-11-01');
  const [termEnd, setTermEnd] = useState('2026-11-01');
  const [status, setStatus] = useState<'Active' | 'Inactive'>('Active');

  useEffect(() => {
    if (initialOfficial) {
      setName(initialOfficial.name);
      setPosition(initialOfficial.position);
      setCommittee(initialOfficial.committee || '');
      setContactNumber(initialOfficial.contactNumber);
      setEmail(initialOfficial.email);
      setTermStart(initialOfficial.termStart);
      setTermEnd(initialOfficial.termEnd);
      setStatus(initialOfficial.status);
    } else {
      setName('');
      setPosition('Barangay Kagawad');
      setCommittee('');
      setContactNumber('09');
      setEmail('');
      setTermStart('2023-11-01');
      setTermEnd('2026-11-01');
      setStatus('Active');
    }
  }, [initialOfficial, isOpen]);

  const handleSubmit = async () => {
    if (!name.trim() || !contactNumber.trim()) {
      alert('Please fill out official name and contact number.');
      return;
    }

    const payload = {
      name: name.trim(),
      position,
      committee: committee.trim() || undefined,
      contactNumber: contactNumber.trim(),
      email: email.trim() || `${name.toLowerCase().replace(/\s+/g, '.')}@cainta.gov.ph`,
      termStart,
      termEnd,
      status,
      order: position === 'Punong Barangay' ? 1 : 5
    };

    await onSave(payload);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialOfficial ? 'Edit Barangay Official' : 'Add Barangay Official / Staff'}
      subtitle="Elected Councilors, Appointed Officers & Administration"
      size="md"
      onSave={handleSubmit}
      saveLabel={initialOfficial ? 'Update Official' : 'Save Official'}
      isSaving={isSaving}
    >
      <div className="space-y-4">
        <Input
          label="Full Name (with Honorific)"
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="e.g. Hon. Juan Dela Cruz"
          required
        />

        <Select
          label="Barangay Position"
          value={position}
          onChange={e => setPosition(e.target.value as OfficialPosition)}
          options={[
            { value: 'Punong Barangay', label: 'Punong Barangay (Barangay Captain)' },
            { value: 'Barangay Kagawad', label: 'Barangay Kagawad (Councilor)' },
            { value: 'SK Chairperson', label: 'SK Chairperson' },
            { value: 'Barangay Secretary', label: 'Barangay Secretary' },
            { value: 'Barangay Treasurer', label: 'Barangay Treasurer' },
            { value: 'Chief Tanod', label: 'Chief Tanod' },
            { value: 'Barangay Administrator', label: 'Barangay Administrator' },
            { value: 'Barangay Health Worker', label: 'Barangay Health Worker' }
          ]}
          required
        />

        <Input
          label="Committee Chairmanship / Assignment"
          value={committee}
          onChange={e => setCommittee(e.target.value)}
          placeholder="e.g. Health, Sanitation & Environment"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input
            label="Contact Mobile #"
            value={contactNumber}
            onChange={e => setContactNumber(e.target.value)}
            placeholder="0917-000-0000"
            required
          />
          <Input
            label="Official Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="official@cainta.gov.ph"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input
            label="Term Start Date"
            type="date"
            value={termStart}
            onChange={e => setTermStart(e.target.value)}
          />
          <Input
            label="Term End Date"
            type="date"
            value={termEnd}
            onChange={e => setTermEnd(e.target.value)}
          />
        </div>

        <Select
          label="Tenure Status"
          value={status}
          onChange={e => setStatus(e.target.value as 'Active' | 'Inactive')}
          options={[
            { value: 'Active', label: 'Active in Office' },
            { value: 'Inactive', label: 'Inactive / End of Term' }
          ]}
        />
      </div>
    </Modal>
  );
};
