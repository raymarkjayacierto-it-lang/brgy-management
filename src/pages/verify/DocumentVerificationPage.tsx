import React, { useState, useEffect } from 'react';
import { documentService } from '../../services/documentService';
import { settingsService } from '../../services/systemService';
import { DocumentRequest } from '../../types/document';
import { BarangaySettings } from '../../types/system';
import { formatDate } from '../../utils/formatters';
import { CheckCircle2, XCircle, Search, ShieldCheck, ArrowLeft, Building2 } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export const DocumentVerificationPage: React.FC<{
  initialCode?: string;
  onNavigate: (route: string) => void;
}> = ({ initialCode = 'DOC-2026-000145', onNavigate }) => {
  const [queryCode, setQueryCode] = useState(initialCode);
  const [searchedRecord, setSearchedRecord] = useState<DocumentRequest | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState<BarangaySettings | null>(null);

  useEffect(() => {
    settingsService.getSettings().then(setSettings);
    if (initialCode) {
      handleVerify(initialCode);
    }
  }, [initialCode]);

  const handleVerify = async (codeToSearch: string) => {
    if (!codeToSearch.trim()) return;
    setLoading(true);
    setHasSearched(true);
    try {
      const result = await documentService.verifyDocument(codeToSearch);
      setSearchedRecord(result);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleVerify(queryCode);
  };

  const isValid = searchedRecord && (searchedRecord.status === 'RELEASED' || searchedRecord.status === 'GENERATED');

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      {/* Top Header */}
      <header className="bg-white border-b border-gov-border py-4 px-6 shadow-xs">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src="/logo.png"
              alt="Barangay San Isidro Logo"
              className="w-10 h-10 rounded-full object-cover shadow-xs shrink-0 border border-blue-200"
            />
            <div>
              <h1 className="text-sm sm:text-base font-bold text-gov-text-primary">
                Barangay Document Verification Portal
              </h1>
              <p className="text-xs text-gov-text-secondary">Republic of the Philippines</p>
            </div>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => onNavigate('/admin/dashboard')}
            leftIcon={<ArrowLeft className="w-4 h-4" />}
          >
            Go to Admin
          </Button>
        </div>
      </header>

      {/* Main Verification Card */}
      <main className="flex-1 max-w-2xl w-full mx-auto px-4 py-10">
        <div className="bg-white rounded-2xl border border-gov-border shadow-md p-6 sm:p-8">
          <div className="text-center mb-8">
            <div className="w-14 h-14 rounded-full bg-blue-50 text-gov-primary flex items-center justify-center mx-auto mb-3">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-extrabold text-gov-text-primary">
              Authenticate Barangay Document
            </h2>
            <p className="text-xs sm:text-sm text-gov-text-secondary mt-1.5 max-w-md mx-auto">
              Verify the authenticity of clearances, certifications, and permits issued by {settings?.barangayName || 'the Barangay'}.
            </p>
          </div>

          {/* Search form */}
          <form onSubmit={handleSubmit} className="mb-8">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={queryCode}
                  onChange={e => setQueryCode(e.target.value)}
                  placeholder="Enter Document No. (e.g. DOC-2026-000145) or Verif Code"
                  className="w-full h-11 px-4 text-xs sm:text-sm rounded-lg border border-[#CBD5E1] focus:ring-2 focus:ring-gov-primary focus:border-gov-primary uppercase font-mono"
                  required
                />
              </div>
              <Button
                type="submit"
                variant="primary"
                isLoading={loading}
                leftIcon={<Search className="w-4 h-4" />}
              >
                Verify
              </Button>
            </div>
            <p className="text-[11px] text-slate-400 mt-1.5">
              Quick test code: <button type="button" onClick={() => { setQueryCode('DOC-2026-000145'); handleVerify('DOC-2026-000145'); }} className="text-blue-600 underline cursor-pointer">DOC-2026-000145</button> or <button type="button" onClick={() => { setQueryCode('DOC-2026-000148'); handleVerify('DOC-2026-000148'); }} className="text-blue-600 underline cursor-pointer">DOC-2026-000148</button>
            </p>
          </form>

          {/* Verification Results */}
          {hasSearched && !loading && (
            <div className="animate-in fade-in zoom-in-95 duration-200">
              {isValid ? (
                <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <CheckCircle2 className="w-8 h-8 text-emerald-600 shrink-0" />
                    <div>
                      <h3 className="text-base font-bold text-emerald-950 uppercase tracking-wide">
                        ✓ VALID DOCUMENT
                      </h3>
                      <p className="text-xs text-emerald-800">
                        This official certification is registered and recognized in the Barangay Registry.
                      </p>
                    </div>
                  </div>

                  {/* Sanitized Public Data (Do not expose private resident data per Section 19) */}
                  <div className="bg-white rounded-lg border border-emerald-100 p-4 space-y-2.5 text-xs text-slate-700">
                    <div className="flex justify-between border-b border-slate-100 pb-2">
                      <span className="text-slate-500 font-medium">Document Number:</span>
                      <span className="font-mono font-bold text-slate-900">{searchedRecord.documentNumber}</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-100 pb-2">
                      <span className="text-slate-500 font-medium">Document Type:</span>
                      <span className="font-semibold text-blue-900">{searchedRecord.documentType}</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-100 pb-2">
                      <span className="text-slate-500 font-medium">Date Issued:</span>
                      <span className="font-semibold">{formatDate(searchedRecord.dateProcessed || searchedRecord.dateRequested)}</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-100 pb-2">
                      <span className="text-slate-500 font-medium">Status:</span>
                      <span className="font-bold text-emerald-700 uppercase">{searchedRecord.status}</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-100 pb-2">
                      <span className="text-slate-500 font-medium">Issuing Authority:</span>
                      <span className="font-medium text-slate-800">{searchedRecord.signatoryOfficial || settings?.captainName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500 font-medium">Verification Code:</span>
                      <span className="font-mono text-slate-600">{searchedRecord.verificationCode}</span>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center gap-2 text-[11px] text-emerald-800 font-medium">
                    <Building2 className="w-3.5 h-3.5" />
                    <span>Issued by {settings?.barangayName}, {settings?.municipality}, {settings?.province}</span>
                  </div>
                </div>
              ) : (
                <div className="rounded-xl border border-red-200 bg-red-50/60 p-6 text-center">
                  <XCircle className="w-10 h-10 text-red-600 mx-auto mb-2" />
                  <h3 className="text-base font-bold text-red-950 uppercase">
                    RECORD NOT VERIFIED
                  </h3>
                  <p className="text-xs text-red-800 mt-1 max-w-md mx-auto">
                    {searchedRecord
                      ? `This document request is currently in "${searchedRecord.status}" status and has not yet been officially generated or released.`
                      : 'No official barangay record was found with this document number or security code. Please check the reference code on your certificate.'}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 text-center text-xs text-slate-500 border-t border-slate-200 bg-white">
        <p>Republic of the Philippines • Official Public Verification Service</p>
      </footer>
    </div>
  );
};
