import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { residentService } from '../../services/residentService';
import { householdService } from '../../services/householdService';
import { documentService } from '../../services/documentService';
import { blotterService } from '../../services/blotterService';
import { complaintService } from '../../services/complaintService';
import { paymentService } from '../../services/paymentService';
import { auditService } from '../../services/systemService';
import { Resident } from '../../types/resident';
import { DocumentRequest } from '../../types/document';
import { BlotterRecord } from '../../types/blotter';
import { Complaint } from '../../types/complaint';
import { Payment } from '../../types/payment';
import { AuditLog } from '../../types/system';
import { StatCard } from '../../components/ui/StatCard';
import { Card, CardHeader, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { LoadingState } from '../../components/ui/Feedback';
import { calculateAge, formatCurrency, formatDateTime } from '../../utils/formatters';
import {
  DemographicsDonutChart,
  AgeDistributionBarChart,
  MonthlyVolumeChart,
  StatusBreakdownList
} from '../../components/charts/DashboardCharts';
import {
  Users,
  Home,
  FileText,
  FileCheck2,
  AlertTriangle,
  ShieldAlert,
  CreditCard,
  PlusCircle,
  Clock,
  ArrowRight
} from 'lucide-react';

export interface DashboardPageProps {
  onNavigate: (route: string) => void;
  onOpenNewRequestModal?: () => void;
  onOpenNewResidentModal?: () => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  onNavigate,
  onOpenNewRequestModal,
  onOpenNewResidentModal
}) => {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(true);

  const [residents, setResidents] = useState<Resident[]>([]);
  const [householdsCount, setHouseholdsCount] = useState(0);
  const [requests, setRequests] = useState<DocumentRequest[]>([]);
  const [blotters, setBlotters] = useState<BlotterRecord[]>([]);
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [recentAudits, setRecentAudits] = useState<AuditLog[]>([]);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const [resList, hhList, reqList, bltList, cmpList, payList, audList] = await Promise.all([
          residentService.getResidents(),
          householdService.getHouseholds(),
          documentService.getDocumentRequests(),
          blotterService.getBlotterRecords(),
          complaintService.getComplaints(),
          paymentService.getPayments(),
          auditService.getAuditLogs()
        ]);

        setResidents(resList);
        setHouseholdsCount(hhList.length);
        setRequests(reqList);
        setBlotters(bltList);
        setComplaints(cmpList);
        setPayments(payList);
        setRecentAudits(audList.slice(0, 5));
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) {
    return <LoadingState message="Loading barangay administrative overview..." />;
  }

  // Key KPI Computations
  const totalResidents = residents.length;
  const pendingRequests = requests.filter(r => ['REQUESTED', 'FOR_VERIFICATION', 'APPROVED', 'FOR_PAYMENT'].includes(r.status)).length;
  const documentsIssued = requests.filter(r => ['GENERATED', 'RELEASED'].includes(r.status)).length;
  const openComplaints = complaints.filter(c => ['SUBMITTED', 'UNDER_REVIEW', 'IN_PROGRESS'].includes(c.status)).length;
  const activeBlotter = blotters.filter(b => ['OPEN', 'UNDER_INVESTIGATION', 'FOR_MEDIATION'].includes(b.status)).length;
  const totalRevenue = payments.reduce((acc, p) => acc + p.amount, 0);

  // Demographics Breakdown
  const maleCount = residents.filter(r => r.sex === 'Male').length;
  const femaleCount = residents.filter(r => r.sex === 'Female').length;
  const seniorCount = residents.filter(r => r.seniorCitizenStatus || calculateAge(r.birthDate) >= 60).length;
  const pwdCount = residents.filter(r => r.pwdStatus).length;

  // Age Groups
  const ageGroups = [
    { range: '0–12', count: residents.filter(r => calculateAge(r.birthDate) <= 12).length },
    { range: '13–17', count: residents.filter(r => { const a = calculateAge(r.birthDate); return a >= 13 && a <= 17; }).length },
    { range: '18–24', count: residents.filter(r => { const a = calculateAge(r.birthDate); return a >= 18 && a <= 24; }).length },
    { range: '25–39', count: residents.filter(r => { const a = calculateAge(r.birthDate); return a >= 25 && a <= 39; }).length },
    { range: '40–59', count: residents.filter(r => { const a = calculateAge(r.birthDate); return a >= 40 && a <= 59; }).length },
    { range: '60+', count: residents.filter(r => calculateAge(r.birthDate) >= 60).length }
  ];

  // Request status counts for funnel
  const statusBreakdown = [
    { status: 'Requested', count: requests.filter(r => r.status === 'REQUESTED').length, color: '#3B82F6' },
    { status: 'For Verification', count: requests.filter(r => r.status === 'FOR_VERIFICATION').length, color: '#06B6D4' },
    { status: 'Approved / Ready', count: requests.filter(r => r.status === 'APPROVED').length, color: '#10B981' },
    { status: 'For Payment', count: requests.filter(r => r.status === 'FOR_PAYMENT').length, color: '#F59E0B' },
    { status: 'Released', count: requests.filter(r => r.status === 'RELEASED').length, color: '#16A34A' },
    { status: 'Rejected', count: requests.filter(r => r.status === 'REJECTED').length, color: '#EF4444' }
  ];

  // Monthly trends (mocked realistic volume)
  const monthlyData = [
    { month: 'Apr', count: 42 },
    { month: 'May', count: 58 },
    { month: 'Jun', count: 75 },
    { month: 'Jul', count: 68 },
    { month: 'Aug', count: 92 },
    { month: 'Sep', count: Math.max(requests.length * 3, 34) }
  ];

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-gov-text-primary">
            Good morning, {currentUser?.name?.split(' ')[0] || 'Admin'}
          </h1>
          <p className="text-xs sm:text-sm text-gov-text-secondary mt-1">
            Here's what's happening in your barangay today.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          {onOpenNewResidentModal && (
            <Button
              variant="outline"
              size="sm"
              onClick={onOpenNewResidentModal}
              leftIcon={<Users className="w-4 h-4" />}
            >
              Add Resident
            </Button>
          )}
          {onOpenNewRequestModal && (
            <Button
              variant="primary"
              size="sm"
              onClick={onOpenNewRequestModal}
              leftIcon={<PlusCircle className="w-4 h-4" />}
            >
              New Document Request
            </Button>
          )}
        </div>
      </div>

      {/* 7 Key Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Residents"
          value={totalResidents.toLocaleString()}
          icon={<Users />}
          trend="+5.2%"
          trendDirection="up"
          subtitle="Registered population"
          colorScheme="blue"
          onClick={() => onNavigate('/admin/residents')}
        />
        <StatCard
          title="Total Households"
          value={householdsCount.toLocaleString()}
          icon={<Home />}
          trend="+3.1%"
          trendDirection="up"
          subtitle="Registered families"
          colorScheme="indigo"
          onClick={() => onNavigate('/admin/households')}
        />
        <StatCard
          title="Pending Requests"
          value={pendingRequests}
          icon={<Clock />}
          trend={pendingRequests > 0 ? `${pendingRequests} queue` : 'Clear'}
          trendDirection={pendingRequests > 3 ? 'up' : 'neutral'}
          subtitle="Awaiting action"
          colorScheme="amber"
          onClick={() => onNavigate('/admin/documents')}
        />
        <StatCard
          title="Documents Issued"
          value={documentsIssued}
          icon={<FileCheck2 />}
          trend="+12%"
          trendDirection="up"
          subtitle="Released & validated"
          colorScheme="emerald"
          onClick={() => onNavigate('/admin/documents/issued')}
        />
        <StatCard
          title="Open Complaints"
          value={openComplaints}
          icon={<AlertTriangle />}
          subtitle="Under Lupon mediation"
          colorScheme={openComplaints > 0 ? 'rose' : 'blue'}
          onClick={() => onNavigate('/admin/complaints')}
        />
        <StatCard
          title="Active Blotter Cases"
          value={activeBlotter}
          icon={<ShieldAlert />}
          subtitle="Cases being heard"
          colorScheme="rose"
          onClick={() => onNavigate('/admin/blotter')}
        />
        <StatCard
          title="Today's Collections"
          value={formatCurrency(totalRevenue)}
          icon={<CreditCard />}
          trend="+8.5%"
          trendDirection="up"
          subtitle="Barangay Treasury"
          colorScheme="emerald"
          onClick={() => onNavigate('/admin/payments')}
        />
        <StatCard
          title="Public Verification"
          value="Online"
          icon={<FileText />}
          subtitle="QR code validator active"
          colorScheme="blue"
          onClick={() => onNavigate('/verify/DOC-2026-000145')}
        />
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Demographics Donut */}
        <Card>
          <CardHeader
            title="Resident Demographics"
            subtitle="Sex, Senior & PWD distribution"
            action={
              <button
                type="button"
                onClick={() => onNavigate('/admin/residents')}
                className="text-xs text-blue-600 hover:text-blue-800 font-semibold inline-flex items-center gap-1 cursor-pointer"
              >
                <span>View</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            }
          />
          <CardContent className="p-0">
            <DemographicsDonutChart
              data={{
                male: maleCount,
                female: femaleCount,
                senior: seniorCount,
                pwd: pwdCount
              }}
            />
          </CardContent>
        </Card>

        {/* Age Distribution Bars */}
        <Card>
          <CardHeader
            title="Age Distribution"
            subtitle="Population age demographic cohorts"
          />
          <CardContent>
            <AgeDistributionBarChart groups={ageGroups} />
          </CardContent>
        </Card>

        {/* Document Request Funnel */}
        <Card>
          <CardHeader
            title="Document Request Lifecycle"
            subtitle="Processing pipeline stages"
            action={
              <button
                type="button"
                onClick={() => onNavigate('/admin/documents')}
                className="text-xs text-blue-600 hover:text-blue-800 font-semibold inline-flex items-center gap-1 cursor-pointer"
              >
                <span>Manage</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            }
          />
          <CardContent>
            <StatusBreakdownList items={statusBreakdown} />
          </CardContent>
        </Card>
      </div>

      {/* Secondary Row: Monthly Trends + Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Monthly Trend Volume */}
        <Card className="lg:col-span-2">
          <CardHeader
            title="Monthly Request Volume"
            subtitle="Total clearances and certificates filed over the last 6 months"
          />
          <CardContent>
            <MonthlyVolumeChart data={monthlyData} />
          </CardContent>
        </Card>

        {/* Recent Audit Activities */}
        <Card>
          <CardHeader
            title="Recent System Activities"
            subtitle="Official administrative audit trail"
            action={
              <button
                type="button"
                onClick={() => onNavigate('/admin/audit-logs')}
                className="text-xs text-blue-600 hover:text-blue-800 font-semibold inline-flex items-center gap-1 cursor-pointer"
              >
                <span>Audit Logs</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            }
          />
          <CardContent className="p-0">
            <div className="divide-y divide-slate-100">
              {recentAudits.map(audit => (
                <div key={audit.id} className="p-3.5 hover:bg-slate-50 transition-colors">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-xs font-bold text-slate-900 leading-tight">
                      {audit.action}
                    </p>
                    <span className="text-[10px] text-slate-400 shrink-0">
                      {formatDateTime(audit.timestamp)}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mt-1 line-clamp-2 leading-relaxed">
                    {audit.details || audit.recordId}
                  </p>
                  <div className="mt-1 flex items-center gap-1.5 text-[10px] text-blue-700 font-medium">
                    <span>By: {audit.user}</span>
                    <span>•</span>
                    <span className="bg-blue-50 px-1 py-0.2 rounded border border-blue-200">
                      {audit.module}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
