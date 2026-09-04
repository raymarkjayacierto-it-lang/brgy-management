import React, { useState, useEffect } from 'react';
import { documentService } from '../../services/documentService';
import { settingsService } from '../../services/systemService';
import { DocumentRequest } from '../../types/document';
import { BarangaySettings } from '../../types/system';
import { PageHeader } from '../../components/ui/PageHeader';
import { SearchInput } from '../../components/ui/SearchInput';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../components/ui/Table';
import { Pagination } from '../../components/ui/Pagination';
import { Button } from '../../components/ui/Button';
import { Badge, getStatusBadge } from '../../components/ui/Badge';
import { EmptyState, LoadingState } from '../../components/ui/Feedback';
import { formatDate } from '../../utils/formatters';
import { PrintableDocument } from '../../components/documents/PrintableDocument';
import { Printer, ShieldCheck, Eye, ExternalLink } from 'lucide-react';

export const IssuedDocumentsPage: React.FC<{
  onVerifyCode?: (code: string) => void;
}> = ({ onVerifyCode }) => {
  const [loading, setLoading] = useState(true);
  const [issuedDocs, setIssuedDocs] = useState<DocumentRequest[]>([]);
  const [settings, setSettings] = useState<BarangaySettings | null>(null);
  const [search, setSearch] = useState('');
  const [previewDoc, setPreviewDoc] = useState<DocumentRequest | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const [allDocs, stg] = await Promise.all([
          documentService.getDocumentRequests(),
          settingsService.getSettings()
        ]);
        // Filter only officially generated or released documents
        const filtered = allDocs.filter(d => 
          (d.status === 'GENERATED' || d.status === 'RELEASED') &&
          (!search || 
            (d.documentNumber && d.documentNumber.toLowerCase().includes(search.toLowerCase())) ||
            d.residentName.toLowerCase().includes(search.toLowerCase()) ||
            d.documentType.toLowerCase().includes(search.toLowerCase()) ||
            (d.verificationCode && d.verificationCode.toLowerCase().includes(search.toLowerCase()))
          )
        );
        setIssuedDocs(filtered);
        setSettings(stg);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [search]);

  const totalPages = Math.ceil(issuedDocs.length / pageSize) || 1;
  const paginated = issuedDocs.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  if (previewDoc && settings) {
    return (
      <div className="py-6">
        <PrintableDocument
          request={previewDoc}
          settings={settings}
          onClose={() => setPreviewDoc(null)}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Issued Documents & Clearances Registry"
        subtitle="Permanent repository of validated, generated, and released barangay certifications."
      />

      <div className="bg-white rounded-xl border border-gov-border p-4 shadow-xs">
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Search by Document Number (e.g. DOC-2026-000145), resident name, or verification code..."
        />
      </div>

      {loading ? (
        <LoadingState message="Loading issued certificates..." />
      ) : issuedDocs.length === 0 ? (
        <EmptyState
          title="No issued documents found"
          description="Documents that have been approved, generated, and given official document numbers will appear here."
        />
      ) : (
        <div className="bg-white rounded-xl border border-gov-border shadow-xs overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Document No.</TableHead>
                <TableHead>Certificate Type</TableHead>
                <TableHead>Resident Bearer</TableHead>
                <TableHead>Purpose</TableHead>
                <TableHead>Date Issued</TableHead>
                <TableHead>Security Code</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginated.map(doc => (
                <TableRow key={doc.id}>
                  <TableCell className="font-mono font-bold text-blue-950">
                    {doc.documentNumber || 'DOC-PENDING'}
                  </TableCell>
                  <TableCell className="font-semibold text-slate-800">
                    {doc.documentType}
                  </TableCell>
                  <TableCell>
                    <div className="font-bold text-slate-900">{doc.residentName}</div>
                    <div className="text-[11px] text-slate-500 truncate max-w-xs">{doc.residentAddress}</div>
                  </TableCell>
                  <TableCell className="text-slate-600 truncate max-w-40">
                    {doc.purpose}
                  </TableCell>
                  <TableCell className="text-slate-600 text-xs">
                    {formatDate(doc.dateProcessed || doc.dateRequested)}
                  </TableCell>
                  <TableCell className="font-mono text-xs text-slate-500">
                    {doc.verificationCode}
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(doc.status)}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => setPreviewDoc(doc)}
                        leftIcon={<Printer className="w-3.5 h-3.5" />}
                      >
                        Print
                      </Button>
                      {onVerifyCode && (
                        <button
                          type="button"
                          onClick={() => onVerifyCode(doc.documentNumber || doc.verificationCode || '')}
                          className="p-1.5 text-slate-400 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                          title="Verify QR Authenticity"
                        >
                          <ShieldCheck className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={issuedDocs.length}
            pageSize={pageSize}
            onPageChange={setCurrentPage}
          />
        </div>
      )}
    </div>
  );
};
