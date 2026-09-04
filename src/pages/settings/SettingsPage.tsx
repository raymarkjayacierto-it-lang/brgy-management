import React, { useState, useEffect } from 'react';
import { settingsService, auditService } from '../../services/systemService';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { BarangaySettings } from '../../types/system';
import { PageHeader } from '../../components/ui/PageHeader';
import { Card, CardHeader, CardContent, CardFooter } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { LoadingState } from '../../components/ui/Feedback';
import { Building, Shield, User, Save, Clock, Phone, Mail, MapPin } from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { currentUser } = useAuth();
  const { showToast } = useToast();

  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const [barangayName, setBarangayName] = useState('');
  const [municipality, setMunicipality] = useState('');
  const [province, setProvince] = useState('');
  const [region, setRegion] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [email, setEmail] = useState('');
  const [officeHours, setOfficeHours] = useState('');
  const [address, setAddress] = useState('');
  const [captainName, setCaptainName] = useState('');
  const [secretaryName, setSecretaryName] = useState('');
  const [treasurerName, setTreasurerName] = useState('');

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const data = await settingsService.getSettings();
        setBarangayName(data.barangayName);
        setMunicipality(data.municipality);
        setProvince(data.province);
        setRegion(data.region);
        setContactNumber(data.contactNumber);
        setEmail(data.email);
        setOfficeHours(data.officeHours);
        setAddress(data.address);
        setCaptainName(data.captainName);
        setSecretaryName(data.secretaryName);
        setTreasurerName(data.treasurerName);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await settingsService.updateSettings({
        barangayName,
        municipality,
        province,
        region,
        contactNumber,
        email,
        officeHours,
        address,
        captainName,
        secretaryName,
        treasurerName
      });

      await auditService.logAction(
        currentUser?.name || 'Admin',
        currentUser?.role || 'Admin',
        'Updated Barangay Settings',
        'Settings',
        'LGU-CONFIG',
        'Updated barangay jurisdiction details and official signatories'
      );

      showToast('Barangay settings and signatories saved successfully.', 'success');
    } catch {
      showToast('Failed to save settings.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return <LoadingState message="Loading barangay configuration..." />;
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <PageHeader
        title="Barangay Configuration & Settings"
        subtitle="Manage official LGU jurisdiction info, seal branding, and official certificate signatories."
      />

      <form onSubmit={handleSave} className="space-y-6">
        {/* LGU Jurisdiction Information */}
        <Card>
          <CardHeader
            title="Local Government Unit (LGU) Information"
            subtitle="Details printed on official letterheads, clearances, and certificates"
          />
          <CardContent className="space-y-4">
            {/* Official Seal Preview */}
            <div className="p-4 rounded-xl bg-slate-50 border border-gov-border flex flex-col sm:flex-row items-center gap-4">
              <img
                src="/logo.png"
                alt="Official Seal"
                className="w-20 h-20 rounded-full object-cover shadow-xs border-2 border-emerald-600 bg-white shrink-0"
              />
              <div className="text-center sm:text-left">
                <div className="flex items-center justify-center sm:justify-start gap-2">
                  <span className="text-sm font-bold text-gov-text-primary">Official Barangay Seal</span>
                  <span className="text-[10px] uppercase font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                    Active System Logo
                  </span>
                </div>
                <p className="text-xs text-gov-text-secondary mt-1">
                  Parish of San Isidro Labrador • Diocese of Ilagan
                </p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Rendered across administrative headers, citizen portal, printable clearances, and official receipts.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Barangay Name"
                value={barangayName}
                onChange={e => setBarangayName(e.target.value)}
                required
              />
              <Input
                label="Municipality / City"
                value={municipality}
                onChange={e => setMunicipality(e.target.value)}
                required
              />
              <Input
                label="Province"
                value={province}
                onChange={e => setProvince(e.target.value)}
                required
              />
              <Input
                label="Region"
                value={region}
                onChange={e => setRegion(e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Official Contact Number(s)"
                value={contactNumber}
                onChange={e => setContactNumber(e.target.value)}
                required
              />
              <Input
                label="Official Government Email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>

            <Input
              label="Barangay Hall Physical Address"
              value={address}
              onChange={e => setAddress(e.target.value)}
              required
            />

            <Input
              label="Public Service Office Hours"
              value={officeHours}
              onChange={e => setOfficeHours(e.target.value)}
              required
            />
          </CardContent>
        </Card>

        {/* Certificate Signatories */}
        <Card>
          <CardHeader
            title="Official Signatories for Clearance Issuance"
            subtitle="Names printed on certificates, clearances, receipts, and reports"
          />
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Input
                label="Punong Barangay (Captain)"
                value={captainName}
                onChange={e => setCaptainName(e.target.value)}
                helperText="Primary signatory on all barangay certificates"
                required
              />
              <Input
                label="Barangay Secretary"
                value={secretaryName}
                onChange={e => setSecretaryName(e.target.value)}
                helperText="Attests all issued clearances"
                required
              />
              <Input
                label="Barangay Treasurer"
                value={treasurerName}
                onChange={e => setTreasurerName(e.target.value)}
                helperText="Signs Official Receipts (OR)"
                required
              />
            </div>
          </CardContent>

          <CardFooter className="flex justify-end">
            <Button
              type="submit"
              variant="primary"
              isLoading={isSaving}
              leftIcon={<Save className="w-4 h-4" />}
            >
              Save Configuration
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
};
