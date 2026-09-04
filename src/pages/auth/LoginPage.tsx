import React, { useState } from 'react';
import { useAuth, DEMO_ACCOUNTS } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Shield, Lock, Mail, ArrowRight, UserCheck } from 'lucide-react';

export interface LoginPageProps {
  onLoginSuccess: (role: string) => void;
  onNavigateVerify?: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess, onNavigateVerify }) => {
  const { login } = useAuth();
  const { showToast } = useToast();
  const [email, setEmail] = useState('captain@sanisidro.gov.ph');
  const [password, setPassword] = useState('password123');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const success = await login(email);
      if (success) {
        showToast('Authentication successful. Welcome to Barangay San Isidro!', 'success');
        onLoginSuccess('Admin');
      }
    } catch {
      showToast('Invalid credentials. Please try again.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickLogin = async (demoEmail: string, role: string) => {
    setIsLoading(true);
    try {
      await login(demoEmail);
      showToast(`Signed in as ${role}`, 'success');
      onLoginSuccess(role);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gov-bg flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden">
      {/* Decorative subtle background accents */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-200 h-100 bg-linear-to-b from-blue-100/60 to-transparent blur-3xl -z-10 pointer-events-none" />

      {/* Main Login Card */}
      <div className="w-full max-w-md bg-white rounded-2xl border border-gov-border shadow-xl p-8 sm:p-10">
        {/* Barangay Logo & Title */}
        <div className="text-center mb-8">
          <img
            src="/logo.png"
            alt="Barangay San Isidro Logo"
            className="w-24 h-24 rounded-full object-cover shadow-md border-4 border-blue-100 mx-auto mb-4 bg-white"
          />
          <h1 className="text-xl sm:text-2xl font-black tracking-tight text-gov-text-primary uppercase">
            BARANGAY MANAGEMENT SYSTEM
          </h1>
          <p className="text-xs font-semibold text-gov-primary mt-1 tracking-wider uppercase">
            Barangay San Isidro • Cainta, Rizal
          </p>
          <p className="text-xs text-gov-text-secondary mt-1">
            Official Administrative & Resident Services Portal
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Username / Email"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="e.g. captain@sanisidro.gov.ph"
            leftIcon={<Mail className="w-4 h-4" />}
            required
          />

          <Input
            label="Password"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="••••••••"
            leftIcon={<Lock className="w-4 h-4" />}
            required
          />

          <div className="flex items-center justify-between text-xs pt-1">
            <label className="flex items-center gap-2 cursor-pointer text-gov-text-secondary">
              <input type="checkbox" defaultChecked className="rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
              <span>Remember this device</span>
            </label>
            <button
              type="button"
              onClick={() => showToast('Please contact the Barangay Secretary to reset your administrative account credentials.', 'info')}
              className="text-gov-primary hover:underline font-medium cursor-pointer"
            >
              Forgot Password?
            </button>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            isLoading={isLoading}
            className="w-full mt-2 font-semibold shadow-md"
            rightIcon={<ArrowRight className="w-4 h-4" />}
          >
            Sign In
          </Button>
        </form>

        {/* Quick Demo Accounts Selection */}
        <div className="mt-8 pt-6 border-t border-gov-border">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 text-center mb-3">
            Quick Demo Login (Select Role)
          </p>
          <div className="grid grid-cols-2 gap-2 text-xs">
            {DEMO_ACCOUNTS.map(demo => (
              <button
                key={demo.user.role}
                type="button"
                onClick={() => handleQuickLogin(demo.user.email, demo.user.role)}
                className="p-2 rounded-lg border border-slate-200 hover:border-blue-400 hover:bg-blue-50 text-left transition-colors cursor-pointer group"
              >
                <span className="font-bold text-slate-800 group-hover:text-blue-900 block truncate">
                  {demo.user.role}
                </span>
                <span className="text-[10px] text-slate-500 truncate block">
                  {demo.user.name.split(' ')[0]}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Public QR Verification Link */}
        {onNavigateVerify && (
          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={onNavigateVerify}
              className="text-xs text-blue-700 hover:text-blue-900 font-semibold inline-flex items-center gap-1 cursor-pointer"
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Verify Document Authenticity (Public)</span>
            </button>
          </div>
        )}
      </div>

      {/* Trust & Legal Footer */}
      <div className="mt-8 text-center text-xs text-gov-text-muted max-w-sm">
        <p>Republic of the Philippines • Local Government of Cainta</p>
        <p className="mt-0.5 text-[11px]">Strictly for authorized barangay personnel and registered constituents.</p>
      </div>
    </div>
  );
};
