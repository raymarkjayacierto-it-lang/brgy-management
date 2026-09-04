import React, { useState, useEffect } from 'react';
import { Resident, Sex, CivilStatus, ResidentStatus, VoterStatus } from '../../types/resident';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Tabs } from '../../components/ui/Feedback';
import { User, MapPin, Phone, Award } from 'lucide-react';

export interface ResidentFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (residentData: any) => Promise<void>;
  initialResident?: Resident | null;
  isSaving?: boolean;
}

export const ResidentFormModal: React.FC<ResidentFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialResident,
  isSaving = false
}) => {
  const [activeTab, setActiveTab] = useState<'personal' | 'contact' | 'address' | 'status'>('personal');

  // Form states
  const [firstName, setFirstName] = useState('');
  const [middleName, setMiddleName] = useState('');
  const [lastName, setLastName] = useState('');
  const [suffix, setSuffix] = useState('');
  const [birthDate, setBirthDate] = useState('1990-01-01');
  const [birthPlace, setBirthPlace] = useState('Cainta, Rizal');
  const [sex, setSex] = useState<Sex>('Male');
  const [civilStatus, setCivilStatus] = useState<CivilStatus>('Single');
  const [nationality, setNationality] = useState('Filipino');

  // Contact
  const [contactNumber, setContactNumber] = useState('');
  const [email, setEmail] = useState('');

  // Address
  const [houseNumber, setHouseNumber] = useState('');
  const [street, setStreet] = useState('');
  const [purok, setPurok] = useState('Purok 1 - Pag-asa');
  const [barangay, setBarangay] = useState('San Isidro');
  const [municipality, setMunicipality] = useState('Cainta');
  const [province, setProvince] = useState('Rizal');

  // Additional
  const [occupation, setOccupation] = useState('');
  const [educationalAttainment, setEducationalAttainment] = useState('High School Graduate');
  const [voterStatus, setVoterStatus] = useState<VoterStatus>('Registered');
  const [pwdStatus, setPwdStatus] = useState(false);
  const [seniorCitizenStatus, setSeniorCitizenStatus] = useState(false);
  const [fourPsStatus, setFourPsStatus] = useState(false);
  const [status, setStatus] = useState<ResidentStatus>('Active');

  useEffect(() => {
    if (initialResident) {
      setFirstName(initialResident.firstName || '');
      setMiddleName(initialResident.middleName || '');
      setLastName(initialResident.lastName || '');
      setSuffix(initialResident.suffix || '');
      setBirthDate(initialResident.birthDate || '1990-01-01');
      setBirthPlace(initialResident.birthPlace || 'Cainta, Rizal');
      setSex(initialResident.sex || 'Male');
      setCivilStatus(initialResident.civilStatus || 'Single');
      setNationality(initialResident.nationality || 'Filipino');

      setContactNumber(initialResident.contactNumber || '');
      setEmail(initialResident.email || '');

      setHouseNumber(initialResident.address?.houseNumber || '');
      setStreet(initialResident.address?.street || '');
      setPurok(initialResident.address?.purok || 'Purok 1 - Pag-asa');
      setBarangay(initialResident.address?.barangay || 'San Isidro');
      setMunicipality(initialResident.address?.municipality || 'Cainta');
      setProvince(initialResident.address?.province || 'Rizal');

      setOccupation(initialResident.occupation || '');
      setEducationalAttainment(initialResident.educationalAttainment || 'High School Graduate');
      setVoterStatus(initialResident.voterStatus || 'Registered');
      setPwdStatus(!!initialResident.pwdStatus);
      setSeniorCitizenStatus(!!initialResident.seniorCitizenStatus);
      setFourPsStatus(!!initialResident.fourPsStatus);
      setStatus(initialResident.status || 'Active');
    } else {
      // Reset defaults
      setFirstName('');
      setMiddleName('');
      setLastName('');
      setSuffix('');
      setBirthDate('1995-05-15');
      setBirthPlace('Cainta, Rizal');
      setSex('Male');
      setCivilStatus('Single');
      setNationality('Filipino');
      setContactNumber('09');
      setEmail('');
      setHouseNumber('');
      setStreet('');
      setPurok('Purok 1 - Pag-asa');
      setOccupation('');
      setEducationalAttainment('College Graduate');
      setVoterStatus('Registered');
      setPwdStatus(false);
      setSeniorCitizenStatus(false);
      setFourPsStatus(false);
      setStatus('Active');
    }
  }, [initialResident, isOpen]);

  const handleSubmit = async () => {
    if (!firstName.trim() || !lastName.trim() || !contactNumber.trim()) {
      alert('Please fill out all required fields marked with *');
      return;
    }

    const payload = {
      firstName: firstName.trim(),
      middleName: middleName.trim() || undefined,
      lastName: lastName.trim(),
      suffix: suffix.trim() || undefined,
      birthDate,
      birthPlace,
      sex,
      civilStatus,
      nationality,
      contactNumber: contactNumber.trim(),
      email: email.trim() || undefined,
      address: {
        houseNumber,
        street,
        purok,
        barangay,
        municipality,
        province
      },
      occupation,
      educationalAttainment,
      voterStatus,
      pwdStatus,
      seniorCitizenStatus,
      fourPsStatus,
      status
    };

    await onSave(payload);
  };

  const tabs = [
    { id: 'personal', label: '1. Personal Info', icon: <User className="w-4 h-4" /> },
    { id: 'contact', label: '2. Contact', icon: <Phone className="w-4 h-4" /> },
    { id: 'address', label: '3. Address', icon: <MapPin className="w-4 h-4" /> },
    { id: 'status', label: '4. Status & Welfare', icon: <Award className="w-4 h-4" /> }
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialResident ? 'Edit Resident Record' : 'Register New Resident'}
      subtitle={initialResident ? `ID: ${initialResident.residentNumber}` : 'Record a new resident into the Barangay Registry of Inhabitants'}
      size="xl"
      onSave={handleSubmit}
      saveLabel={initialResident ? 'Update Record' : 'Save Resident'}
      isSaving={isSaving}
    >
      <div className="space-y-6">
        <Tabs
          tabs={tabs}
          activeTab={activeTab}
          onChange={(tab) => setActiveTab(tab as any)}
        />

        {/* 1. Personal Information */}
        {activeTab === 'personal' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 animate-in fade-in">
            <Input
              label="First Name"
              value={firstName}
              onChange={e => setFirstName(e.target.value)}
              placeholder="e.g. Juan"
              required
            />
            <Input
              label="Middle Name"
              value={middleName}
              onChange={e => setMiddleName(e.target.value)}
              placeholder="e.g. Mercado"
            />
            <Input
              label="Last Name"
              value={lastName}
              onChange={e => setLastName(e.target.value)}
              placeholder="e.g. Dela Cruz"
              required
            />
            <Input
              label="Suffix"
              value={suffix}
              onChange={e => setSuffix(e.target.value)}
              placeholder="Jr., Sr., III"
            />
            <Input
              label="Birth Date"
              type="date"
              value={birthDate}
              onChange={e => setBirthDate(e.target.value)}
              required
            />
            <Input
              label="Birth Place"
              value={birthPlace}
              onChange={e => setBirthPlace(e.target.value)}
              placeholder="e.g. Cainta, Rizal"
              required
            />
            <Select
              label="Sex"
              value={sex}
              onChange={e => setSex(e.target.value as Sex)}
              options={[
                { value: 'Male', label: 'Male' },
                { value: 'Female', label: 'Female' },
                { value: 'Other', label: 'Other' }
              ]}
              required
            />
            <Select
              label="Civil Status"
              value={civilStatus}
              onChange={e => setCivilStatus(e.target.value as CivilStatus)}
              options={[
                { value: 'Single', label: 'Single' },
                { value: 'Married', label: 'Married' },
                { value: 'Widowed', label: 'Widowed' },
                { value: 'Separated', label: 'Separated' }
              ]}
              required
            />
            <Input
              label="Nationality"
              value={nationality}
              onChange={e => setNationality(e.target.value)}
              required
            />
          </div>
        )}

        {/* 2. Contact Information */}
        {activeTab === 'contact' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-in fade-in">
            <Input
              label="Mobile Number"
              value={contactNumber}
              onChange={e => setContactNumber(e.target.value)}
              placeholder="0917-123-4567"
              required
              helperText="Active mobile number for SMS release notifications"
            />
            <Input
              label="Email Address (Optional)"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="resident@gmail.com"
              helperText="For electronic copies and account notices"
            />
          </div>
        )}

        {/* 3. Address */}
        {activeTab === 'address' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 animate-in fade-in">
            <Input
              label="House / Block / Lot No."
              value={houseNumber}
              onChange={e => setHouseNumber(e.target.value)}
              placeholder="e.g. 124 or Block 5 Lot 12"
              required
            />
            <Input
              label="Street / Subd / Alley"
              value={street}
              onChange={e => setStreet(e.target.value)}
              placeholder="e.g. Mabini Street"
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
              required
            />
            <Input
              label="Barangay"
              value={barangay}
              disabled
              className="bg-slate-50"
            />
            <Input
              label="Municipality"
              value={municipality}
              disabled
              className="bg-slate-50"
            />
            <Input
              label="Province"
              value={province}
              disabled
              className="bg-slate-50"
            />
          </div>
        )}

        {/* 4. Status & Welfare */}
        {activeTab === 'status' && (
          <div className="space-y-4 animate-in fade-in">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Occupation / Employment"
                value={occupation}
                onChange={e => setOccupation(e.target.value)}
                placeholder="e.g. Civil Engineer, Self-employed"
              />
              <Select
                label="Educational Attainment"
                value={educationalAttainment}
                onChange={e => setEducationalAttainment(e.target.value)}
                options={[
                  { value: 'Elementary Undergraduate', label: 'Elementary Undergraduate' },
                  { value: 'Elementary Graduate', label: 'Elementary Graduate' },
                  { value: 'High School Undergraduate', label: 'High School Undergraduate' },
                  { value: 'High School Graduate', label: 'High School Graduate' },
                  { value: 'Vocational Course', label: 'Vocational Course' },
                  { value: 'College Undergraduate', label: 'College Undergraduate' },
                  { value: 'College Graduate', label: 'College Graduate' },
                  { value: 'Postgraduate / Masteral', label: 'Postgraduate / Masteral' }
                ]}
              />
              <Select
                label="Voter Status in Barangay"
                value={voterStatus}
                onChange={e => setVoterStatus(e.target.value as VoterStatus)}
                options={[
                  { value: 'Registered', label: 'Registered Voter' },
                  { value: 'Unregistered', label: 'Unregistered' }
                ]}
              />
              <Select
                label="Resident Record Status"
                value={status}
                onChange={e => setStatus(e.target.value as ResidentStatus)}
                options={[
                  { value: 'Active', label: 'Active' },
                  { value: 'Inactive', label: 'Inactive' },
                  { value: 'Archived', label: 'Archived' }
                ]}
              />
            </div>

            {/* Special Social Welfare Checkboxes */}
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700 block">
                Social Welfare & Special Classifications
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <label className="flex items-center gap-2 text-xs font-semibold text-slate-800 cursor-pointer p-2 rounded-lg bg-white border border-slate-200 hover:border-blue-400">
                  <input
                    type="checkbox"
                    checked={seniorCitizenStatus}
                    onChange={e => setSeniorCitizenStatus(e.target.checked)}
                    className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                  />
                  <span>Senior Citizen (60+)</span>
                </label>
                <label className="flex items-center gap-2 text-xs font-semibold text-slate-800 cursor-pointer p-2 rounded-lg bg-white border border-slate-200 hover:border-blue-400">
                  <input
                    type="checkbox"
                    checked={pwdStatus}
                    onChange={e => setPwdStatus(e.target.checked)}
                    className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                  />
                  <span>Person with Disability (PWD)</span>
                </label>
                <label className="flex items-center gap-2 text-xs font-semibold text-slate-800 cursor-pointer p-2 rounded-lg bg-white border border-slate-200 hover:border-blue-400">
                  <input
                    type="checkbox"
                    checked={fourPsStatus}
                    onChange={e => setFourPsStatus(e.target.checked)}
                    className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                  />
                  <span>4Ps Beneficiary</span>
                </label>
              </div>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};
