import React from 'react';
import { Household } from '../../types/household';
import { Resident } from '../../types/resident';
import { Modal } from '../../components/ui/Modal';
import { getStatusBadge } from '../../components/ui/Badge';
import { calculateAge } from '../../utils/formatters';
import { Home, Users, MapPin, DollarSign, Building } from 'lucide-react';

export interface HouseholdDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  household: Household | null;
  residents: Resident[];
  onViewResident?: (resident: Resident) => void;
}

export const HouseholdDetailsModal: React.FC<HouseholdDetailsModalProps> = ({
  isOpen,
  onClose,
  household,
  residents,
  onViewResident
}) => {
  if (!household) return null;

  const members = residents.filter(r => household.memberResidentIds.includes(r.id));

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Household Details"
      subtitle={`Household ID: ${household.householdNumber}`}
      size="lg"
      hideFooter
    >
      <div className="space-y-6">
        {/* Banner */}
        <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-100 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gov-primary text-white flex items-center justify-center font-bold">
              <Home className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-gov-text-primary">Head: {household.headName}</h3>
              <p className="text-xs text-gov-text-secondary flex items-center gap-1 mt-0.5">
                <MapPin className="w-3.5 h-3.5 text-blue-600" />
                <span>{household.address}</span>
              </p>
            </div>
          </div>
          {getStatusBadge(household.status)}
        </div>

        {/* Socioeconomic Details */}
        <div className="grid grid-cols-2 gap-4 text-xs">
          <div className="p-3 bg-white border border-slate-200 rounded-lg">
            <span className="text-slate-400 block mb-1">Income Bracket:</span>
            <span className="font-semibold text-slate-800">{household.incomeBracket}</span>
          </div>
          <div className="p-3 bg-white border border-slate-200 rounded-lg">
            <span className="text-slate-400 block mb-1">Tenure / Housing:</span>
            <span className="font-semibold text-slate-800">{household.housingType}</span>
          </div>
        </div>

        {/* Member list */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-1.5">
            <Users className="w-4 h-4 text-blue-600" />
            <span>Associated Household Members ({members.length})</span>
          </h4>

          <div className="border border-gov-border rounded-xl overflow-hidden divide-y divide-slate-100">
            {members.length === 0 ? (
              <p className="p-4 text-xs text-slate-500 text-center">No individual resident profiles linked yet.</p>
            ) : (
              members.map(member => (
                <div
                  key={member.id}
                  className="p-3 hover:bg-slate-50 flex items-center justify-between text-xs transition-colors"
                >
                  <div>
                    <span className="font-semibold text-slate-900">
                      {member.firstName} {member.lastName}
                    </span>
                    {member.id === household.headResidentId && (
                      <span className="ml-2 px-2 py-0.5 bg-blue-100 text-blue-800 text-[10px] font-bold rounded-full">
                        Head
                      </span>
                    )}
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      {calculateAge(member.birthDate)} yrs • {member.sex} • {member.occupation || 'No occupation'}
                    </p>
                  </div>
                  {onViewResident && (
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        onViewResident(member);
                      }}
                      className="text-blue-600 hover:text-blue-800 font-medium cursor-pointer"
                    >
                      View Profile
                    </button>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
};
