import React, { useState, useEffect } from 'react';
import { residentService } from '../../services/residentService';
import { householdService } from '../../services/householdService';
import { documentService } from '../../services/documentService';
import { blotterService } from '../../services/blotterService';
import { complaintService } from '../../services/complaintService';
import { paymentService } from '../../services/paymentService';
import { settingsService } from '../../services/systemService';
import { Resident } from '../../types/resident';
import { DocumentRequest } from '../../types/document';
import { Payment } from '../../types/payment';
import { BarangaySettings } from '../../types/system';
import { PageHeader } from '../../components/ui/PageHeader';
import { Card, CardHeader, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Select } from '../../components/ui/Select';
import { Input } from '../../components/ui/Input';
import { LoadingState } from '../../components/ui/Feedback';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { Printer, Download, BarChart3, FileSpreadsheet, Building2 } from 'lucide-react';

export const ReportsPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [residents, setResidents] = useState<Resident[]>([]);
  const [householdsCount, setHouseholdsCount] = useState(0);
  const [requests, setRequests] = useState<DocumentRequest[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [settings, setSettings] = useState<BarangaySettings | null>(null);

  // Filter criteria
  const [reportType, setReportType] = useState('summary');
  const [purokFilter, setPurokFilter] = useState('');
  const [startDate, setStartDate] = useState('2026-08-01');
  const [endDate, setEndDate] = useState('2026-09-04');

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const [res, hh, req, pay, stg] = await Promise.all([
          residentService.getResidents(),
          householdService.getHouseholds(),
          documentService.getDocumentRequests(),
          paymentService.getPayments(),
          settingsService.getSettings()
        ]);
        setResidents(res);
        setHouseholdsCount(hh.length);
        setRequests(req);
        setPayments(pay);
        setSettings(stg);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handlePrint = () => {
    window.print();
  };

  const handleExportCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8," + 
      "Metric,Value\n" +
      `Total Registered Inhabitants,${residents.length}\n` +
      `Total Registered Households,${householdsCount}\n` +
      `Total Clearances Issued,${requests.filter(r => r.status === 'RELEASED').length}\n` +
      `Total Treasury Revenue Collected,${payments.reduce((a, p) => a + p.amount, 0)}\n`;
    
    const encoded = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encoded);
    link.setAttribute('download', `Barangay_Executive_Report_${endDate}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return <LoadingState message="Generating administrative report summary..." />;
  }

  // Purok breakdown
  const puroks = [
    'Purok 1 - Pag-asa',
    'Purok 2 - Maligaya',
    'Purok 3 - Mabuhay',
    'Purok 4 - Masagana',
    'Purok 5 - Kaunlaran',
    'Purok 6 - Kalinisan',
    'Purok 7 - Mapayapa'
  ];

  const totalRevenue = payments.reduce((acc, p) => acc + p.amount, 0);
  const totalIssued = requests.filter(r => r.status === 'RELEASED' || r.status === 'GENERATED').length;
  const seniorCount = residents.filter(r => r.seniorCitizenStatus).length;
  const pwdCount = residents.filter(r => r.pwdStatus).length;
  const fourPsCount = residents.filter(r => r.fourPsStatus).length;
  const votersCount = residents.filter(r => r.voterStatus === 'Registered').length;

  return (
    <div className="space-y-6">
      <div className="no-print">
        <PageHeader
          title="Reports & Analytics Dashboard"
          subtitle="Generate official council summaries, demographic statistics, and revenue ledgers."
          actions={
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleExportCSV}
                leftIcon={<Download className="w-4 h-4" />}
              >
                Export CSV
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={handlePrint}
                leftIcon={<Printer className="w-4 h-4" />}
              >
                Print Report
              </Button>
            </div>
          }
        />

        {/* Filters */}
        <div className="bg-white rounded-xl border border-[#E2E8F0] p-4 shadow-xs grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
          <Select
            label="Report Scope"
            value={reportType}
            onChange={e => setReportType(e.target.value)}
            options={[
              { value: 'summary', label: 'Executive Barangay Summary' },
              { value: 'demographics', label: 'Population & Demographics Report' },
              { value: 'documents', label: 'Clearance Issuance & Treasury Revenue' }
            ]}
          />
          <Input
            label="Start Date"
            type="date"
            value={startDate}
            onChange={e => setStartDate(e.target.value)}
          />
          <Input
            label="End Date"
            type="date"
            value={endDate}
            onChange={e => setEndDate(e.target.value)}
          />
        </div>
      </div>

      {/* Printable Report Document */}
      <div className="print-page bg-white rounded-xl border border-slate-300 shadow-md p-8 sm:p-10 space-y-8">
        {/* Formal Header */}
        <div className="text-center border-b-2 border-slate-900 pb-5">
          <p className="text-xs uppercase tracking-widest text-slate-500 font-serif">
            Republic of the Philippines • {settings?.province}
          </p>
          <p className="text-sm font-bold uppercase text-slate-700 font-serif">
            {settings?.municipality}
          </p>
          <h1 className="text-xl sm:text-2xl font-black uppercase text-blue-950 mt-1 font-sans">
            {settings?.barangayName}
          </h1>
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800 mt-2 bg-slate-100 inline-block px-4 py-1 rounded">
            BARANGAY ACCOMPLISHMENT & EXECUTIVE SUMMARY REPORT
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Covering Period: {formatDate(startDate)} to {formatDate(endDate)}
          </p>
        </div>

        {/* Section 1: Executive KPI Metrics */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200 pb-1 mb-4">
            1. Core Governance Indicators
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
            <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
              <span className="text-xs text-slate-500 block">Total Inhabitants</span>
              <span className="text-2xl font-extrabold text-blue-950 mt-1 block">{residents.length}</span>
            </div>
            <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
              <span className="text-xs text-slate-500 block">Households</span>
              <span className="text-2xl font-extrabold text-blue-950 mt-1 block">{householdsCount}</span>
            </div>
            <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
              <span className="text-xs text-slate-500 block">Documents Released</span>
              <span className="text-2xl font-extrabold text-emerald-800 mt-1 block">{totalIssued}</span>
            </div>
            <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
              <span className="text-xs text-slate-500 block">Revenue Collected</span>
              <span className="text-2xl font-extrabold text-emerald-800 mt-1 block">{formatCurrency(totalRevenue)}</span>
            </div>
          </div>
        </div>

        {/* Section 2: Purok Demographic Distribution */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200 pb-1 mb-3">
            2. Population Breakdown by Purok / Zone
          </h3>
          <table className="w-full text-xs text-left border border-slate-300">
            <thead className="bg-slate-100 font-bold text-slate-700">
              <tr>
                <th className="p-2.5 border border-slate-300">Purok / Zone</th>
                <th className="p-2.5 border border-slate-300 text-center">Residents</th>
                <th className="p-2.5 border border-slate-300 text-center">Voters</th>
                <th className="p-2.5 border border-slate-300 text-center">Senior Citizens</th>
                <th className="p-2.5 border border-slate-300 text-center">PWD</th>
                <th className="p-2.5 border border-slate-300 text-center">4Ps Members</th>
              </tr>
            </thead>
            <tbody>
              {puroks.map(purok => {
                const resInPurok = residents.filter(r => r.address.purok === purok);
                return (
                  <tr key={purok} className="hover:bg-slate-50">
                    <td className="p-2 border border-slate-300 font-semibold">{purok}</td>
                    <td className="p-2 border border-slate-300 text-center font-bold">{resInPurok.length}</td>
                    <td className="p-2 border border-slate-300 text-center">{resInPurok.filter(r => r.voterStatus === 'Registered').length}</td>
                    <td className="p-2 border border-slate-300 text-center">{resInPurok.filter(r => r.seniorCitizenStatus).length}</td>
                    <td className="p-2 border border-slate-300 text-center">{resInPurok.filter(r => r.pwdStatus).length}</td>
                    <td className="p-2 border border-slate-300 text-center">{resInPurok.filter(r => r.fourPsStatus).length}</td>
                  </tr>
                );
              })}
              <tr className="bg-slate-100 font-extrabold text-slate-900">
                <td className="p-2.5 border border-slate-300">TOTAL</td>
                <td className="p-2.5 border border-slate-300 text-center">{residents.length}</td>
                <td className="p-2.5 border border-slate-300 text-center">{votersCount}</td>
                <td className="p-2.5 border border-slate-300 text-center">{seniorCount}</td>
                <td className="p-2.5 border border-slate-300 text-center">{pwdCount}</td>
                <td className="p-2.5 border border-slate-300 text-center">{fourPsCount}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Section 3: Document Requests & Clearance Collections */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200 pb-1 mb-3">
            3. Document Services & Fee Collections Summary
          </h3>
          <table className="w-full text-xs text-left border border-slate-300">
            <thead className="bg-slate-100 font-bold text-slate-700">
              <tr>
                <th className="p-2.5 border border-slate-300">Document Type</th>
                <th className="p-2.5 border border-slate-300 text-center">Requests Filed</th>
                <th className="p-2.5 border border-slate-300 text-center">Issued / Released</th>
                <th className="p-2.5 border border-slate-300 text-center">Standard Fee</th>
                <th className="p-2.5 border border-slate-300 text-right">Total Revenue</th>
              </tr>
            </thead>
            <tbody>
              {[
                { type: 'Barangay Clearance', fee: 50 },
                { type: 'Certificate of Residency', fee: 50 },
                { type: 'Certificate of Indigency', fee: 0 },
                { type: 'Certificate of Good Moral Character', fee: 50 },
                { type: 'Barangay Business Clearance', fee: 250 }
              ].map(item => {
                const reqs = requests.filter(r => r.documentType === item.type);
                const issued = reqs.filter(r => r.status === 'RELEASED' || r.status === 'GENERATED').length;
                const rev = payments.filter(p => p.documentType === item.type).reduce((a, p) => a + p.amount, 0);

                return (
                  <tr key={item.type}>
                    <td className="p-2 border border-slate-300 font-semibold">{item.type}</td>
                    <td className="p-2 border border-slate-300 text-center">{reqs.length}</td>
                    <td className="p-2 border border-slate-300 text-center font-bold text-emerald-800">{issued}</td>
                    <td className="p-2 border border-slate-300 text-center">{item.fee > 0 ? formatCurrency(item.fee) : 'FREE'}</td>
                    <td className="p-2 border border-slate-300 text-right font-bold">{formatCurrency(rev)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Formal Signatures */}
        <div className="pt-8 border-t border-slate-300 grid grid-cols-2 sm:grid-cols-3 gap-6 text-center text-xs">
          <div>
            <p className="text-slate-400 italic mb-6">Prepared by:</p>
            <p className="font-bold text-slate-900 uppercase underline">{settings?.secretaryName}</p>
            <p className="text-[11px] text-slate-500">Barangay Secretary</p>
          </div>
          <div>
            <p className="text-slate-400 italic mb-6">Certified Correct:</p>
            <p className="font-bold text-slate-900 uppercase underline">{settings?.treasurerName}</p>
            <p className="text-[11px] text-slate-500">Barangay Treasurer</p>
          </div>
          <div>
            <p className="text-slate-400 italic mb-6">Attested by:</p>
            <p className="font-bold text-blue-950 uppercase underline">{settings?.captainName}</p>
            <p className="text-[11px] text-slate-700 font-semibold">Punong Barangay</p>
          </div>
        </div>
      </div>
    </div>
  );
};
