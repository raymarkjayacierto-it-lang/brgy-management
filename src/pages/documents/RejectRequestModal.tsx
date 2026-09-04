import React, { useState } from 'react';
import { Modal } from '../../components/ui/Modal';
import { Textarea } from '../../components/ui/Textarea';
import { DocumentRequest } from '../../types/document';

export interface RejectRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onReject: (reason: string) => Promise<void>;
  request: DocumentRequest | null;
  isSaving?: boolean;
}

export const RejectRequestModal: React.FC<RejectRequestModalProps> = ({
  isOpen,
  onClose,
  onReject,
  request,
  isSaving = false
}) => {
  const [reason, setReason] = useState('Invalid or incomplete identification documents submitted.');

  if (!request) return null;

  const handleSubmit = async () => {
    if (!reason.trim()) {
      alert('Please provide a reason for rejection.');
      return;
    }
    await onReject(reason.trim());
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Reject Document Request"
      subtitle={`Rejecting ${request.requestNumber} for ${request.residentName}`}
      size="md"
      onSave={handleSubmit}
      saveLabel="Confirm Rejection"
      saveVariant="danger"
      isSaving={isSaving}
    >
      <div className="space-y-3">
        <p className="text-xs text-slate-600">
          State the specific deficiency or legal reason for rejection. This notice will be visible to the applicant.
        </p>
        <Textarea
          label="Rejection Reason / Findings"
          value={reason}
          onChange={e => setReason(e.target.value)}
          placeholder="Explain what requirements were missing or why the clearance cannot be granted..."
          rows={3}
          required
        />
      </div>
    </Modal>
  );
};
