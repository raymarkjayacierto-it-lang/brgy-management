import React, { useState, useEffect } from 'react';
import { Household } from '../../types/household';
import { Resident } from '../../types/resident';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';

export interface HouseholdFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => Promise<void>;
  initialHousehold?: Household | null;
  residents: Resident[];
  isSaving?: boolean;
}

export const HouseholdFormModal: React.FC<HouseholdFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialHousehold,
  residents,
  isSaving = false
}) => {
  const [headResidentId, setHeadResidentId] = useState('');
  const [address, setAddress] = useState('');
  const [purok, setPurok] = useState('Purok 1 - Pag-asa');
  const [selectedMemberIds, setSelectedMemberIds] = useState<string[]>([]);
  const [incomeBracket, setIncomeBracket] = useState<Household['incomeBracket']>('Lower Middle (₱10,000 - ₱25,000)');
  const [housingType, setHousingType] = useState<Household['housingType']>('Owned');

  useEffect(() => {
    if (initialHousehold) {
      setHeadResidentId(initialHousehold.headResidentId || '');
      setAddress(initialHousehold.address || '');
      setPurok(initialHousehold.purok || 'Purok 1 - Pag-asa');
      setSelectedMemberIds(initialHousehold.memberResidentIds || []);
      setIncomeBracket(initialHousehold.incomeBracket);
      setHousingType(initialHousehold.housingType);
    } else {
      setHeadResidentId(residents[0]?.id || '');
      setAddress('');
      setPurok('Purok 1 - Pag-asa');
      setSelectedMemberIds([]);
      setIncomeBracket('Lower Middle (₱10,000 - ₱25,000)');
      setHousingType('Owned');
    }
  }, [initialHousehold, isOpen, residents]);

  const handleHeadChange = (id: string) => {
    setHeadResidentId(id);
    const chosen = residents.find(r => r.id === id);
    if (chosen) {
      setAddress(`${chosen.address.houseNumber} ${chosen.address.street}`);
      setPurok(chosen.address.purok);
      if (!selectedMemberIds.includes(id)) {
        setSelectedMemberIds(prev => [id, ...prev.filter(m => m !== id)]);
      }
    }
  };

  const toggleMember = (id: string) => {
    if (id === headResidentId) return; // Head is always a member
    if (selectedMemberIds.includes(id)) {
      setSelectedMemberIds(prev => prev.filter(m => m !== id));
    } else {
      setSelectedMemberIds(prev => [...prev, id]);
    }
  };

  const handleSubmit = async () => {
    const head = residents.find(r => r.id === headResidentId);
    if (!head || !address.trim()) {
      alert('Please select a household head and provide the residential address.');
      return;
    }

    const payload = {
      headResidentId,
      headName: `${head.firstName} ${head.lastName}`,
      address: `${address}, ${purok}`,
      purok,
      memberResidentIds: Array.from(new Set([headResidentId, ...selectedMemberIds])),
      membersCount: Math.max(1, selectedMemberIds.length),
      incomeBracket,
      housingType,
      status: 'Active' as const
    };

    await onSave(payload);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialHousehold ? 'Edit Household Record' : 'Register New Household'}
      subtitle="Organize residential family units and member affiliations"
      size="lg"
      onSave={handleSubmit}
      saveLabel={initialHousehold ? 'Update Household' : 'Create Household'}
      isSaving={isSaving}
    >
      <div className="space-y-4">
        <Select
          label="Designated Head of Household"
          value={headResidentId}
          onChange={e => handleHeadChange(e.target.value)}
          required
        >
          <option value="" disabled>Select resident</option>
          {residents.map(r => (
            <option key={r.id} value={r.id}>
              {r.lastName}, {r.firstName} ({r.residentNumber}) - {r.address.purok}
            </option>
          ))}
        </Select>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="House & Street Address"
            value={address}
            onChange={e => setAddress(e.target.value)}
            placeholder="e.g. 124 Mabini Street"
            required
          />
          <Select
            label="Purok / Zone"
            value={purok}
            onChange={e => setPurok(e.target.value)}
            options={[
              { value: 'Purok 1 - Pag-asa', label: 'Purok 1 - Pag-asa' },
              { value: 'Purok 2 - Maligaya', label: 'Purok 2 - Maligaya' },
              { value: 'Purok 3 - Mabuhay', label: 'Purok 3 - Mabuhay' },
              { value: 'Purok 4 - Masagana', label: 'Purok 4 - Masagana' },
              { value: 'Purok 5 - Kaunlaran', label: 'Purok 5 - Kaunlaran' },
              { value: 'Purok 6 - Kalinisan', label: 'Purok 6 - Kalinisan' },
              { value: 'Purok 7 - Mapayapa', label: 'Purok 7 - Mapayapa' }
            ]}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Select
            label="Monthly Income Bracket"
            value={incomeBracket}
            onChange={e => setIncomeBracket(e.target.value as any)}
            options={[
              { value: 'Low Income (Below ₱10,000)', label: 'Low Income (Below ₱10,000)' },
              { value: 'Lower Middle (₱10,000 - ₱25,000)', label: 'Lower Middle (₱10,000 - ₱25,000)' },
              { value: 'Middle (₱25,000 - ₱50,000)', label: 'Middle (₱25,000 - ₱50,000)' },
              { value: 'Upper (Above ₱50,000)', label: 'Upper (Above ₱50,000)' }
            ]}
          />
          <Select
            label="Housing Tenure / Type"
            value={housingType}
            onChange={e => setHousingType(e.target.value as any)}
            options={[
              { value: 'Owned', label: 'Owned Dwelling' },
              { value: 'Rented', label: 'Rented' },
              { value: 'Living with Relatives', label: 'Living with Relatives' },
              { value: 'Informal Settler', label: 'Informal Settler' }
            ]}
          />
        </div>

        {/* Member selection checklist */}
        <div className="pt-2">
          <label className="block text-xs font-semibold text-gov-text-primary mb-1.5">
            Select Household Family Members ({selectedMemberIds.length} chosen)
          </label>
          <div className="max-h-48 overflow-y-auto border border-[#CBD5E1] rounded-lg p-2 divide-y divide-slate-100 bg-slate-50/50">
            {residents.map(r => {
              const isHead = r.id === headResidentId;
              const isChecked = selectedMemberIds.includes(r.id) || isHead;

              return (
                <label
                  key={r.id}
                  className={`flex items-center justify-between p-2 rounded cursor-pointer text-xs ${
                    isChecked ? 'bg-blue-50/60 font-semibold text-blue-950' : 'hover:bg-white text-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={isChecked}
                      disabled={isHead}
                      onChange={() => toggleMember(r.id)}
                      className="rounded text-blue-600 focus:ring-blue-500"
                    />
                    <span>{r.lastName}, {r.firstName}</span>
                  </div>
                  <span className="text-[11px] text-slate-400">
                    {isHead ? '👑 Household Head' : r.address.purok}
                  </span>
                </label>
              );
            })}
          </div>
        </div>
      </div>
    </Modal>
  );
};
