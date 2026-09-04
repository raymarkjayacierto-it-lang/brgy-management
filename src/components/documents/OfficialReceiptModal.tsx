import React from 'react';
import { Payment } from '../../types/payment';
import { BarangaySettings } from '../../types/system';
import { formatCurrency, formatDateTime } from '../../utils/formatters';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Printer } from 'lucide-react';

export interface OfficialReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  payment: Payment | null;
  settings: BarangaySettings;
}

export const OfficialReceiptModal: React.FC<OfficialReceiptModalProps> = ({
  isOpen,
  onClose,
  payment,
  settings
}) => {
  if (!payment) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Official Receipt (OR)"
      subtitle={`OR Number: ${payment.officialReceiptNumber}`}
      size="md"
      hideFooter
    >
      <div className="flex flex-col items-center">
        {/* Print button */}
        <div className="w-full flex justify-end mb-4 no-print">
          <Button
            variant="primary"
            size="sm"
            onClick={handlePrint}
            leftIcon={<Printer className="w-4 h-4" />}
          >
            Print Receipt
          </Button>
        </div>

        {/* Official Receipt Paper */}
        <div className="print-page w-full bg-amber-50/40 border border-amber-200 rounded-xl p-6 text-slate-800 font-mono text-xs shadow-xs">
          <div className="text-center border-b border-dashed border-amber-300 pb-4 mb-4">
            <img
              src="/logo.png"
              alt="Barangay San Isidro Official Seal"
              className="w-14 h-14 rounded-full mx-auto mb-2 object-cover border border-amber-300 shadow-xs"
            />
            <p className="font-bold text-sm tracking-wider uppercase text-blue-950 font-sans">
              REPUBLIC OF THE PHILIPPINES
            </p>
            <p className="font-semibold text-xs text-slate-700 font-sans">
              {settings.barangayName}, {settings.municipality}
            </p>
            <p className="text-[11px] text-slate-500 font-sans">{settings.province}</p>
            <h3 className="font-bold text-base mt-2 text-slate-900 uppercase underline">
              OFFICIAL RECEIPT
            </h3>
            <p className="text-xs text-amber-900 font-bold mt-0.5">
              No. {payment.officialReceiptNumber}
            </p>
          </div>

          <div className="space-y-2 mb-4">
            <div className="flex justify-between">
              <span className="text-slate-500">Date & Time:</span>
              <span className="font-semibold">{formatDateTime(payment.date)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Payor / Resident:</span>
              <span className="font-semibold text-slate-950 uppercase">{payment.residentName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Reference Request:</span>
              <span>{payment.referenceNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Nature of Collection:</span>
              <span className="font-semibold">{payment.documentType} Fee</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Payment Mode:</span>
              <span className="font-bold text-blue-800">{payment.paymentMethod}</span>
            </div>
          </div>

          <div className="border-t border-b border-dashed border-amber-300 py-3 my-4">
            <div className="flex justify-between text-sm font-bold text-slate-950">
              <span>TOTAL AMOUNT PAID:</span>
              <span className="text-base text-emerald-800">{formatCurrency(payment.amount)}</span>
            </div>
          </div>

          <div className="pt-4 text-center">
            <p className="text-slate-500 text-[11px]">Collecting Officer / Treasurer:</p>
            <p className="font-bold text-xs uppercase text-slate-900 mt-3 underline">
              {payment.processedBy || settings.treasurerName}
            </p>
            <p className="text-[10px] text-slate-500">Office of the Barangay Treasurer</p>
          </div>
        </div>
      </div>
    </Modal>
  );
};
