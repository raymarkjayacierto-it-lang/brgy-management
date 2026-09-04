import React, { useState, useEffect } from 'react';
import { officialService } from '../../services/officialService';
import { Official } from '../../types/official';
import { PageHeader } from '../../components/ui/PageHeader';
import { LoadingState } from '../../components/ui/Feedback';
import { Phone, Mail, Award, Shield } from 'lucide-react';

export const ResidentOfficialsPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [officials, setOfficials] = useState<Official[]>([]);

  useEffect(() => {
    officialService.getOfficials().then(list => {
      setOfficials(list);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return <LoadingState message="Loading barangay officials directory..." />;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Barangay San Isidro Officials Directory"
        subtitle="Elected public servants and appointed officers of our barangay council."
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {officials.map(official => (
          <div
            key={official.id}
            className="bg-white rounded-xl border border-[#E2E8F0] p-5 shadow-xs hover:shadow-md transition-shadow"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-blue-900 to-blue-700 text-white flex items-center justify-center font-bold text-base uppercase shadow-xs">
                {official.name.replace('Hon. ', '').replace('Mr. ', '').replace('Ms. ', '').charAt(0)}
              </div>
              <div>
                <h3 className="font-bold text-slate-900 leading-tight">{official.name}</h3>
                <p className="text-xs font-semibold text-blue-700">{official.position}</p>
              </div>
            </div>

            <div className="space-y-1.5 pt-3 border-t border-slate-100 text-xs text-slate-600">
              {official.committee && (
                <div className="text-[11px] text-slate-500 mb-2 bg-slate-50 p-2 rounded">
                  <span className="font-semibold block text-slate-700">Committee:</span>
                  {official.committee}
                </div>
              )}
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                <span>{official.contactNumber}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="truncate">{official.email}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
