import React, { useState, useEffect } from 'react';
import { Complaint, ComplaintPriority, ComplaintStatus } from '../../types/complaint';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Textarea } from '../../components/ui/Textarea';

export interface ComplaintFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => Promise<void>;
  initialComplaint?: Complaint | null;
  isSaving?: boolean;
}

export const ComplaintFormModal: React.FC<ComplaintFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialComplaint,
  isSaving = false
}) => {
  const [complainantName, setComplainantName] = useState('');
  const [complainantContact, setComplainantContact] = useState('');
  const [complainantAddress, setComplainantAddress] = useState('');
  const [respondentName, setRespondentName] = useState('');
  const [category, setCategory] = useState<Complaint['category']>('Public Disturbance');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<ComplaintPriority>('Medium');
  const [assignedStaff, setAssignedStaff] = useState('Chief Tanod Mario V. Cruz');
  const [status, setStatus] = useState<ComplaintStatus>('SUBMITTED');

  useEffect(() => {
    if (initialComplaint) {
      setComplainantName(initialComplaint.complainantName);
      setComplainantContact(initialComplaint.complainantContact);
      setComplainantAddress(initialComplaint.complainantAddress || '');
      setRespondentName(initialComplaint.respondentName || '');
      setCategory(initialComplaint.category);
      setDescription(initialComplaint.description);
      setPriority(initialComplaint.priority);
      setAssignedStaff(initialComplaint.assignedStaff);
      setStatus(initialComplaint.status);
    } else {
      setComplainantName('');
      setComplainantContact('09');
      setComplainantAddress('');
      setRespondentName('');
      setCategory('Public Disturbance');
      setDescription('');
      setPriority('Medium');
      setAssignedStaff('Chief Tanod Mario V. Cruz');
      setStatus('SUBMITTED');
    }
  }, [initialComplaint, isOpen]);

  const handleSubmit = async () => {
    if (!complainantName.trim() || !description.trim()) {
      alert('Please provide complainant name and complaint description.');
      return;
    }

    const payload = {
      complainantName: complainantName.trim(),
      complainantContact: complainantContact.trim(),
      complainantAddress: complainantAddress.trim() || undefined,
      respondentName: respondentName.trim() || undefined,
      category,
      description: description.trim(),
      dateFiled: new Date().toISOString().split('T')[0],
      priority,
      assignedStaff,
      status
    };

    await onSave(payload);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialComplaint ? 'Edit Resident Complaint' : 'File New Resident Complaint / Grievance'}
      subtitle="Barangay Public Assistance & Complaints Desk"
      size="lg"
      onSave={handleSubmit}
      saveLabel={initialComplaint ? 'Update Complaint' : 'File Complaint'}
      isSaving={isSaving}
    >
      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input
            label="Complainant Full Name"
            value={complainantName}
            onChange={e => setComplainantName(e.target.value)}
            placeholder="e.g. Maria Clara Santos"
            required
          />
          <Input
            label="Contact Mobile #"
            value={complainantContact}
            onChange={e => setComplainantContact(e.target.value)}
            placeholder="0918-000-0000"
            required
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input
            label="Complainant Address"
            value={complainantAddress}
            onChange={e => setComplainantAddress(e.target.value)}
            placeholder="e.g. 124 Mabini St., Purok 1"
          />
          <Input
            label="Respondent / Subject of Complaint"
            value={respondentName}
            onChange={e => setRespondentName(e.target.value)}
            placeholder="e.g. Neighbor or Commercial Store"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Select
            label="Category"
            value={category}
            onChange={e => setCategory(e.target.value as any)}
            options={[
              { value: 'Public Disturbance', label: 'Public Disturbance' },
              { value: 'Sanitation & Garbage', label: 'Sanitation & Garbage' },
              { value: 'Barangay Services', label: 'Barangay Services' },
              { value: 'Street Lighting / Road Issue', label: 'Street Lighting / Road Issue' },
              { value: 'Illegal Parking', label: 'Illegal Parking' },
              { value: 'Other', label: 'Other' }
            ]}
          />
          <Select
            label="Urgency / Priority"
            value={priority}
            onChange={e => setPriority(e.target.value as ComplaintPriority)}
            options={[
              { value: 'Low', label: 'Low' },
              { value: 'Medium', label: 'Medium' },
              { value: 'High', label: 'High' },
              { value: 'Urgent', label: 'Urgent' }
            ]}
          />
          <Select
            label="Assigned Staff / Kagawad"
            value={assignedStaff}
            onChange={e => setAssignedStaff(e.target.value)}
            options={[
              { value: 'Chief Tanod Mario V. Cruz', label: 'Chief Tanod Mario V. Cruz' },
              { value: 'Kag. Fernando Poe (Health & Sanitation)', label: 'Kag. Fernando Poe' },
              { value: 'Kag. Ramon Mitra (Infrastructure)', label: 'Kag. Ramon Mitra' },
              { value: 'Kag. Miriam Santiago (Rules & Ordinances)', label: 'Kag. Miriam Santiago' }
            ]}
          />
        </div>

        <Textarea
          label="Detailed Description of Grievance"
          value={description}
          onChange={e => setDescription(e.target.value)}
          placeholder="Describe what occurred, exact location, and remedies sought..."
          rows={3}
          required
        />
      </div>
    </Modal>
  );
};
