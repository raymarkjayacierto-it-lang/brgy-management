import React, { useState, useEffect } from 'react';
import { Payment, PaymentMethod } from '../../types/payment';
import { DocumentRequest } from '../../types/document';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { formatCurrency } from '../../utils/formatters';
import { CreditCard, DollarSign } from 'lucide-react';

export interface PaymentFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRecordPayment: (paymentData: any) => Promise<void>;
  request?: DocumentRequest | null;
  isSaving?: boolean;
}

export const PaymentFormModal: React.FC<PaymentFormModalProps> = ({
  isOpen,
  onClose,
  onRecordPayment,
  request,
  isSaving = false
}) => {
  const [amount, setAmount] = useState(50);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('Cash');
  const [referenceNotes, setReferenceNotes] = useState('');

  useEffect(() => {
    if (request) {
      setAmount(request.fee);
      setReferenceNotes('');
    }
  }, [request, isOpen]);

  const handleSubmit = async () => {
    if (!request) return;

    const payload = {
      referenceNumber: request.requestNumber,
      residentId: request.residentId,
      residentName: request.residentName,
      documentType: request.documentType,
      amount: Number(amount),
      paymentMethod,
      date: new Date().toISOString(),
      processedBy: 'Ricardo P. Santos (Treasurer)',
      status: 'Completed' as const,
      notes: referenceNotes.trim() || undefined
    };

    await onRecordPayment(payload);
  };

  if (!request) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Record Fee Collection / Payment"
      subtitle={`For Request: ${request.requestNumber} (${request.documentType})`}
      size="md"
      onSave={handleSubmit}
      saveLabel="Issue Receipt & Complete Payment"
      isSaving={isSaving}
    >
      <div className="space-y-4">
        <div className="p-3 bg-blue-50/70 rounded-lg border border-blue-100 text-xs">
          <div className="flex justify-between py-1">
            <span className="text-slate-500">Resident:</span>
            <span className="font-bold text-slate-900">{request.residentName}</span>
          </div>
          <div className="flex justify-between py-1">
            <span className="text-slate-500">Document Type:</span>
            <span className="font-semibold text-blue-950">{request.documentType}</span>
          </div>
          <div className="flex justify-between py-1 border-t border-blue-200/60 mt-1 pt-1 font-bold text-sm">
            <span>Assessment Fee:</span>
            <span className="text-blue-900">{formatCurrency(request.fee)}</span>
          </div>
        </div>

        <Input
          label="Amount Received (₱)"
          type="number"
          value={amount}
          onChange={e => setAmount(Number(e.target.value))}
          required
        />

        <Select
          label="Payment Method"
          value={paymentMethod}
          onChange={e => setPaymentMethod(e.target.value as PaymentMethod)}
          options={[
            { value: 'Cash', label: 'Cash (Over-the-Counter)' },
            { value: 'GCash', label: 'GCash' },
            { value: 'Maya', label: 'Maya (PayMaya)' },
            { value: 'Bank Transfer', label: 'Landbank / Bank Transfer' }
          ]}
        />

        {paymentMethod !== 'Cash' && (
          <Input
            label="Transaction / Reference Number"
            value={referenceNotes}
            onChange={e => setReferenceNotes(e.target.value)}
            placeholder="e.g. GCash Ref # 192849120"
            required
          />
        )}
      </div>
    </Modal>
  );
};
