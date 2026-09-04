import React, { useState, useEffect } from 'react';
import { auditService } from '../../services/systemService';
import { AuditLog } from '../../types/system';
import { PageHeader } from '../../components/ui/PageHeader';
import { SearchInput } from '../../components/ui/SearchInput';
import { Select } from '../../components/ui/Select';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../components/ui/Table';
import { Pagination } from '../../components/ui/Pagination';
import { EmptyState, LoadingState } from '../../components/ui/Feedback';
import { formatDateTime } from '../../utils/formatters';
import { History, Shield, User } from 'lucide-react';

export const AuditLogsPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [search, setSearch] = useState('');
  const [moduleFilter, setModuleFilter] = useState('');

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const list = await auditService.getAuditLogs();
        setLogs(list);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const filteredLogs = logs.filter(log => {
    const matchesSearch = !search ||
      log.user.toLowerCase().includes(search.toLowerCase()) ||
      log.action.toLowerCase().includes(search.toLowerCase()) ||
      log.recordId.toLowerCase().includes(search.toLowerCase()) ||
      (log.details && log.details.toLowerCase().includes(search.toLowerCase()));

    const matchesModule = !moduleFilter || log.module === moduleFilter;

    return matchesSearch && matchesModule;
  });

  const totalPages = Math.ceil(filteredLogs.length / pageSize) || 1;
  const paginated = filteredLogs.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Audit Trail & System Logs"
        subtitle="Immutable security logs tracking all administrative actions, record alterations, and user activities."
      />

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gov-border p-4 shadow-xs grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="sm:col-span-2">
          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder="Search by user, action performed, or record ID (e.g. RES-2026-000101)..."
          />
        </div>
        <Select
          value={moduleFilter}
          onChange={e => setModuleFilter(e.target.value)}
        >
          <option value="">All System Modules</option>
          <option value="Residents">Residents</option>
          <option value="Households">Households</option>
          <option value="Documents">Documents</option>
          <option value="Blotter">Blotter</option>
          <option value="Complaints">Complaints</option>
          <option value="Payments">Payments</option>
          <option value="Officials">Officials</option>
          <option value="Settings">Settings</option>
        </Select>
      </div>

      {loading ? (
        <LoadingState message="Loading security audit log..." />
      ) : filteredLogs.length === 0 ? (
        <EmptyState
          title="No audit logs found"
          description="No activity logs matching your filter query."
        />
      ) : (
        <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-xs overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User / Authority</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Module</TableHead>
                <TableHead>Record Reference</TableHead>
                <TableHead>Activity Details</TableHead>
                <TableHead>Timestamp</TableHead>
                <TableHead>IP Address</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginated.map(log => (
                <TableRow key={log.id}>
                  <TableCell>
                    <div className="font-bold text-slate-900">{log.user}</div>
                    <span className="text-[10px] font-medium text-blue-700 bg-blue-50 px-1.5 py-0.2 rounded border border-blue-200 inline-block mt-0.5">
                      {log.userRole}
                    </span>
                  </TableCell>
                  <TableCell className="font-semibold text-slate-800">
                    {log.action}
                  </TableCell>
                  <TableCell>
                    <span className="font-medium text-xs text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                      {log.module}
                    </span>
                  </TableCell>
                  <TableCell className="font-mono text-xs font-bold text-blue-900">
                    {log.recordId}
                  </TableCell>
                  <TableCell className="text-xs text-slate-600 truncate max-w-xs">
                    {log.details || '—'}
                  </TableCell>
                  <TableCell className="text-xs text-slate-500 whitespace-nowrap">
                    {formatDateTime(log.timestamp)}
                  </TableCell>
                  <TableCell className="font-mono text-[11px] text-slate-400">
                    {log.ipAddress}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={filteredLogs.length}
            pageSize={pageSize}
            onPageChange={setCurrentPage}
          />
        </div>
      )}
    </div>
  );
};
