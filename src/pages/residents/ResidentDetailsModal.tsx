import React from 'react';
import { Resident } from '../../types/resident';
import { Modal } from '../../components/ui/Modal';
import { Badge, getStatusBadge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { formatDate, calculateAge } from '../../utils/formatters';
import { User, Phone, Mail, MapPin, Briefcase, GraduationCap, CheckCircle2, FileText, Edit2 } from 'lucide-react';

export interface ResidentDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  resident: Resident | null;
  onEdit?: (resident: Resident) => void;
  onRequestClearance?: (resident: Resident) => void;
}

export const ResidentDetailsModal: React.FC<ResidentDetailsModalProps> = ({
  isOpen,
  onClose,
  resident,
  onEdit,
  onRequestClearance
}) => {
  if (!resident) return null;

  const fullName = `${resident.firstName} ${resident.middleName ? resident.middleName + ' ' : ''}${resident.lastName}${resident.suffix ? ' ' + resident.suffix : ''}`;
  const age = calculateAge(resident.birthDate);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Resident Profile"
      subtitle={`Resident ID: ${resident.residentNumber}`}
      size="xl"
      hideFooter
    >
      <div className="space-y-6">
        {/* Top summary banner */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 bg-linear-to-r from-blue-50 to-slate-50 rounded-xl border border-blue-100">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gov-primary text-white flex items-center justify-center font-bold text-xl uppercase shadow-md shrink-0">
              {resident.firstName.charAt(0)}{resident.lastName.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-lg font-bold text-gov-text-primary">{fullName}</h2>
                {getStatusBadge(resident.status)}
              </div>
              <p className="text-xs text-gov-text-secondary mt-0.5">
                {resident.sex} • {age} years old • {resident.civilStatus}
              </p>
              <p className="text-xs text-blue-800 font-medium mt-1 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" />
                <span>{resident.address.purok}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            {onEdit && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onEdit(resident)}
                leftIcon={<Edit2 className="w-3.5 h-3.5" />}
              >
                Edit Profile
              </Button>
            )}
            {onRequestClearance && (
              <Button
                variant="primary"
                size="sm"
                onClick={() => onRequestClearance(resident)}
                leftIcon={<FileText className="w-3.5 h-3.5" />}
              >
                Issue Clearance
              </Button>
            )}
          </div>
        </div>

        {/* 3 Detail Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Personal & Demographics */}
          <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 pb-2 flex items-center gap-1.5">
              <User className="w-4 h-4 text-blue-600" />
              <span>Personal Details</span>
            </h3>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-500">Birth Date:</span>
                <span className="font-semibold">{formatDate(resident.birthDate)}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-500">Birth Place:</span>
                <span className="font-semibold">{resident.birthPlace}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-500">Nationality:</span>
                <span className="font-semibold">{resident.nationality}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-500">Occupation:</span>
                <span className="font-semibold">{resident.occupation || 'N/A'}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-500">Education:</span>
                <span className="font-semibold">{resident.educationalAttainment || 'N/A'}</span>
              </div>
            </div>
          </div>

          {/* Contact & Registered Address */}
          <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 pb-2 flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-blue-600" />
              <span>Contact & Address</span>
            </h3>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-500">Mobile Phone:</span>
                <span className="font-semibold text-blue-800">{resident.contactNumber}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-500">Email Address:</span>
                <span className="font-semibold">{resident.email || 'None'}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-500">Street / House:</span>
                <span className="font-semibold">{resident.address.houseNumber} {resident.address.street}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-500">Full Jurisdiction:</span>
                <span className="font-semibold text-right">{resident.address.barangay}, {resident.address.municipality}, {resident.address.province}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Special Classifications & Welfare Tags */}
        <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/70">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
            Electoral Status & Social Welfare Entitlements
          </h3>
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
              resident.voterStatus === 'Registered' ? 'bg-blue-100 text-blue-800' : 'bg-slate-200 text-slate-700'
            }`}>
              {resident.voterStatus === 'Registered' ? '✓ Registered Voter' : 'Unregistered Voter'}
            </span>

            {resident.seniorCitizenStatus && (
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-900 border border-amber-200">
                Senior Citizen (OSCA)
              </span>
            )}

            {resident.pwdStatus && (
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-900 border border-indigo-200">
                PWD Beneficiary
              </span>
            )}

            {resident.fourPsStatus && (
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-900 border border-emerald-200">
                4Ps Program Member
              </span>
            )}

            {resident.isHouseholdHead && (
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-900 border border-purple-200">
                Head of Household
              </span>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
};
