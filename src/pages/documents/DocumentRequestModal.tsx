import React, { useState, useEffect } from 'react';
import { documentService } from '../../services/documentService';
import { DocumentType, DocumentTypeConfig } from '../../types/document';
import { Resident } from '../../types/resident';
import { Modal } from '../../components/ui/Modal';
import { Select } from '../../components/ui/Select';
import { Input } from '../../components/ui/Input';
import { Textarea } from '../../components/ui/Textarea';
import { formatCurrency } from '../../utils/formatters';
import { FileText, Clock, AlertCircle, CheckCircle2, Shield } from 'lucide-react';

export interface DocumentRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => Promise<void>;
  residents: Resident[];
  preselectedResident?: Resident | null;
  isSaving?: boolean;
}

export const DocumentRequestModal: React.FC<DocumentRequestModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  residents,
  preselectedResident,
  isSaving = false
}) => {
  const configs = documentService.getDocumentConfigs();
  const [selectedResidentId, setSelectedResidentId] = useState('');
  const [documentType, setDocumentType] = useState<DocumentType>('Barangay Clearance');
  const [purpose, setPurpose] = useState('Local Employment Application');
  const [additionalInfo, setAdditionalInfo] = useState('');

  useEffect(() => {
    if (preselectedResident) {
      setSelectedResidentId(preselectedResident.id);
    } else if (residents.length > 0 && !selectedResidentId) {
      setSelectedResidentId(residents[0].id);
    }
  }, [preselectedResident, residents, isOpen]);

  const currentConfig: DocumentTypeConfig = configs.find(c => c.type === documentType) || configs[0];

  const handleDocumentTypeChange = (type: DocumentType) => {
    setDocumentType(type);
    if (type === 'Barangay Clearance') setPurpose('Local Employment Application');
    else if (type === 'Certificate of Indigency') setPurpose('Medical Assistance / Financial Subsidy');
    else if (type === 'Certificate of Residency') setPurpose('Opening Bank Account / Government ID');
    else if (type === 'Certificate of Good Moral Character') setPurpose('Scholarship / School Requirement');
    else if (type === 'Barangay Business Clearance') setPurpose('New Business Permit Renewal');
    else if (type === 'Certificate of Solo Parent') setPurpose('Solo Parent ID Application');
    else setPurpose('');
  };

  const handleFormSubmit = async () => {
    const resident = residents.find(r => r.id === selectedResidentId);
    if (!resident) {
      alert('Please select a registered resident.');
      return;
    }
    if (!purpose.trim()) {
      alert('Please state the purpose for this document request.');
      return;
    }

    const payload = {
      residentId: resident.id,
      residentName: `${resident.firstName} ${resident.lastName}`,
      residentAddress: `${resident.address.houseNumber} ${resident.address.street}, ${resident.address.purok}, Cainta, Rizal`,
      documentType,
      purpose: purpose.trim(),
      additionalInfo: additionalInfo.trim() || undefined,
      fee: currentConfig.fee
    };

    await onSubmit(payload);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="File Official Document Request"
      subtitle="Request barangay clearance, certification, or business endorsement"
      size="lg"
      onSave={handleFormSubmit}
      saveLabel="Submit Request"
      isSaving={isSaving}
    >
      <div className="space-y-4">
        {/* Resident selector */}
        <Select
          label="Requesting Resident"
          value={selectedResidentId}
          onChange={e => setSelectedResidentId(e.target.value)}
          required
        >
          <option value="" disabled>Select resident</option>
          {residents.map(r => (
            <option key={r.id} value={r.id}>
              {r.lastName}, {r.firstName} ({r.residentNumber}) - {r.address.purok}
            </option>
          ))}
        </Select>

        {/* Document type selector */}
        <Select
          label="Document Type"
          value={documentType}
          onChange={e => handleDocumentTypeChange(e.target.value as DocumentType)}
          required
        >
          {configs.map(cfg => (
            <option key={cfg.type} value={cfg.type}>
              {cfg.type} ({cfg.fee > 0 ? formatCurrency(cfg.fee) : 'FREE / Indigent'})
            </option>
          ))}
        </Select>

        {/* Dynamic Requirements & Fee Guide (as specified in Section 16) */}
        <div className="rounded-xl border border-blue-100 bg-blue-50/70 p-4 space-y-3">
          <div className="flex items-center justify-between text-xs pb-2 border-b border-blue-200/60">
            <div className="flex items-center gap-1.5 font-bold text-blue-950">
              <Clock className="w-4 h-4 text-blue-700" />
              <span>Processing Time: {currentConfig.processingTime}</span>
            </div>
            <div className="text-right">
              <span className="text-[11px] text-slate-500 mr-1">Document Fee:</span>
              <span className="font-extrabold text-sm text-blue-900">
                {currentConfig.fee > 0 ? formatCurrency(currentConfig.fee) : 'FREE (₱0.00)'}
              </span>
            </div>
          </div>

          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-blue-900 mb-1.5">
              Required Supporting Documents:
            </p>
            <ul className="space-y-1">
              {currentConfig.requirements.map((req, idx) => (
                <li key={idx} className="text-xs text-slate-700 flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                  <span>{req}</span>
                </li>
              ))}
            </ul>
          </div>
          <p className="text-[11px] text-slate-500 italic mt-1">{currentConfig.description}</p>
        </div>

        {/* Purpose */}
        <Input
          label="Purpose of Request"
          value={purpose}
          onChange={e => setPurpose(e.target.value)}
          placeholder="e.g. Local Employment, Bank Loan, Scholarship, Indigency Assistance"
          required
        />

        {/* Additional information */}
        <Textarea
          label="Additional Details / Notes (Optional)"
          value={additionalInfo}
          onChange={e => setAdditionalInfo(e.target.value)}
          placeholder="Include any specific employer names, reference numbers, or requirements..."
          rows={2}
        />
      </div>
    </Modal>
  );
};
