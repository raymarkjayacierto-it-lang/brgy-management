import React from 'react';
import { DocumentRequest } from '../../types/document';
import { BarangaySettings } from '../../types/system';
import { formatDate, formatCurrency } from '../../utils/formatters';
import { generateQRCodeSVG } from '../../utils/qr';
import { Printer, X } from 'lucide-react';
import { Button } from '../ui/Button';

export interface PrintableDocumentProps {
  request: DocumentRequest;
  settings: BarangaySettings;
  onClose?: () => void;
}

export const PrintableDocument: React.FC<PrintableDocumentProps> = ({
  request,
  settings,
  onClose
}) => {
  const handlePrint = () => {
    window.print();
  };

  const verificationUrl = `${window.location.origin}/verify/${request.documentNumber || request.requestNumber}`;
  const qrSvg = generateQRCodeSVG(verificationUrl, 100);

  return (
    <div className="flex flex-col items-center">
      {/* Action Bar (hidden when printing) */}
      <div className="w-full max-w-3xl flex items-center justify-between gap-3 mb-4 p-3 bg-white rounded-xl border border-slate-200 shadow-xs no-print">
        <div>
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Official Document Preview</span>
          <p className="text-sm font-bold text-slate-900">{request.documentType} ({request.documentNumber || 'Draft'})</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="primary"
            size="sm"
            onClick={handlePrint}
            leftIcon={<Printer className="w-4 h-4" />}
          >
            Print Certificate
          </Button>
          {onClose && (
            <Button
              variant="outline"
              size="sm"
              onClick={onClose}
            >
              Close
            </Button>
          )}
        </div>
      </div>

      {/* Official Certificate Paper Container */}
      <div className="print-page w-full max-w-3xl bg-white border border-slate-300 shadow-xl p-8 sm:p-12 relative text-slate-900 font-serif leading-relaxed">
        {/* Subtle Watermark Seal in center */}
        <div className="absolute inset-0 flex items-center justify-center opacity-[0.07] pointer-events-none select-none z-0">
          <img
            src="/logo.png"
            alt="Barangay Seal Watermark"
            className="w-[420px] h-[420px] object-contain rounded-full"
          />
        </div>

        {/* Header Letterhead */}
        <div className="text-center border-b-2 border-slate-900 pb-5 mb-6 relative">
          {/* Top Philippines Seal Graphic */}
          <div className="flex items-center justify-between mb-3 px-2">
            <img
              src="/logo.png"
              alt="Barangay San Isidro Official Seal"
              className="w-20 h-20 rounded-full object-cover shadow-xs border-2 border-emerald-700 shrink-0"
            />
            <div className="text-center flex-1 mx-2">
              <p className="text-xs tracking-widest font-sans uppercase text-slate-600">
                Republic of the Philippines
              </p>
              <p className="text-xs font-sans uppercase font-medium text-slate-700">
                {settings.province}
              </p>
              <p className="text-xs font-sans uppercase font-semibold text-slate-800">
                {settings.municipality}
              </p>
              <h2 className="text-lg sm:text-xl font-sans font-black tracking-wide text-blue-950 mt-0.5 uppercase">
                {settings.barangayName}
              </h2>
              <p className="text-[10px] font-sans text-slate-500 italic">
                Office of the Punong Barangay & Lupong Tagapamayapa
              </p>
            </div>
            <img
              src="/logo.png"
              alt="Barangay San Isidro Seal"
              className="w-20 h-20 rounded-full object-cover shadow-xs border-2 border-emerald-700 shrink-0"
            />
          </div>
        </div>

        {/* Certificate Title */}
        <div className="text-center my-6">
          <h1 className="text-2xl sm:text-3xl font-black font-sans uppercase tracking-wider text-blue-950 underline underline-offset-8 decoration-2 decoration-blue-900">
            {request.documentType}
          </h1>
          <p className="text-xs font-sans font-semibold text-slate-500 tracking-widest mt-2 uppercase">
            Document No.: <span className="font-mono text-slate-900 font-bold">{request.documentNumber || 'DOC-2026-PENDING'}</span>
          </p>
        </div>

        {/* Salutation */}
        <div className="mt-8 mb-6">
          <p className="text-sm font-bold tracking-wider font-sans uppercase text-slate-900">
            TO WHOM IT MAY CONCERN:
          </p>
        </div>

        {/* Body Paragraph */}
        <div className="space-y-4 text-justify text-sm sm:text-base leading-relaxed text-slate-800">
          <p className="indent-8">
            This is to certify that <strong className="font-bold text-slate-950 uppercase underline">{request.residentName}</strong>, of legal age, Filipino citizen, is a bonafide resident with permanent postal address at{' '}
            <strong className="font-semibold text-slate-900">{request.residentAddress}</strong>, within the territorial jurisdiction of {settings.barangayName}, {settings.municipality}, {settings.province}.
          </p>

          {request.documentType === 'Barangay Clearance' && (
            <p className="indent-8">
              Based on the official records of this Barangay, the aforementioned individual is a person of good moral character, a law-abiding citizen with no pending derogatory criminal record, complaint, or blotter filed before the Lupong Tagapamayapa.
            </p>
          )}

          {request.documentType === 'Certificate of Indigency' && (
            <p className="indent-8">
              This further certifies that the bearer belongs to the low-income / indigent families of this barangay and is currently experiencing financial hardship. This certification is granted to avail of social services and government subsidy assistance.
            </p>
          )}

          {request.documentType === 'Certificate of Residency' && (
            <p className="indent-8">
              This certification confirms that the subject resident has continuously resided at the registered dwelling and maintains active residency records in the Barangay Registry of Inhabitants.
            </p>
          )}

          {request.documentType === 'Barangay Business Clearance' && (
            <p className="indent-8">
              This clearance is granted for the operation of commercial enterprise having complied with all initial barangay zoning, sanitation, and safety prerequisites pursuant to the Local Government Code of 1991.
            </p>
          )}

          <p className="indent-8">
            This certification is being issued upon the request of the interested party for the purpose of:{' '}
            <strong className="font-bold text-slate-950 uppercase bg-blue-50/70 px-1 py-0.5 rounded">{request.purpose}</strong> and for whatever legal intent it may serve.
          </p>

          <p className="indent-8">
            Given this{' '}
            <strong>{new Date(request.dateProcessed || request.dateRequested).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}</strong>{' '}
            at the Barangay Hall of {settings.barangayName}, {settings.municipality}, {settings.province}, Philippines.
          </p>
        </div>

        {/* Signatures & Thumbmark Section */}
        <div className="mt-12 pt-6 grid grid-cols-2 sm:grid-cols-3 gap-6 items-end">
          {/* Thumbmark box */}
          <div className="border border-slate-400 p-2 text-center rounded bg-slate-50/50 flex flex-col items-center">
            <div className="w-20 h-20 border border-dashed border-slate-400 mb-1 flex items-center justify-center text-[10px] text-slate-400 uppercase font-sans">
              Right Thumbmark
            </div>
            <span className="text-[10px] font-sans text-slate-600 font-medium">Applicant Signature</span>
          </div>

          {/* Attested by Secretary */}
          <div className="text-center font-sans">
            <p className="text-xs text-slate-500 mb-6 italic">Attested by:</p>
            <p className="text-xs sm:text-sm font-bold text-slate-900 underline uppercase">
              {settings.secretaryName}
            </p>
            <p className="text-[11px] text-slate-600">Barangay Secretary</p>
          </div>

          {/* Approved by Punong Barangay */}
          <div className="text-center font-sans">
            <p className="text-xs text-slate-500 mb-6 italic">Approved by:</p>
            <p className="text-xs sm:text-sm font-bold text-blue-950 underline uppercase">
              {request.signatoryOfficial || settings.captainName}
            </p>
            <p className="text-[11px] text-slate-700 font-semibold">
              {request.signatoryPosition || 'Punong Barangay'}
            </p>
          </div>
        </div>

        {/* Footer Meta & QR Code */}
        <div className="mt-10 pt-4 border-t-2 border-slate-900 flex items-center justify-between text-[10px] font-sans text-slate-600">
          <div>
            <p><strong>Official Receipt No:</strong> {request.officialReceiptNumber || 'N/A (Exempted)'}</p>
            <p><strong>Document Fee:</strong> {formatCurrency(request.fee)}</p>
            <p><strong>Security Verification Code:</strong> {request.verificationCode || 'VERIF-PENDING'}</p>
            <p className="italic text-slate-400 mt-1">Note: Valid for six (6) months from date of issuance. Void without dry seal.</p>
          </div>

          {/* Dynamic QR Code */}
          <div className="text-center flex flex-col items-center">
            <div 
              className="bg-white p-1 rounded border border-slate-300 shadow-xs"
              dangerouslySetInnerHTML={{ __html: qrSvg }}
            />
            <span className="text-[9px] font-mono text-slate-500 mt-0.5">Scan to Verify</span>
          </div>
        </div>
      </div>
    </div>
  );
};
