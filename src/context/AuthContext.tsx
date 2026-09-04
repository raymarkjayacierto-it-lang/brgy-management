import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types/system';

export interface DemoUser {
  user: User;
  label: string;
  description: string;
}

export const DEMO_ACCOUNTS: DemoUser[] = [
  {
    user: {
      id: 'usr-admin',
      name: 'Hon. Roberto M. Dela Rosa',
      email: 'captain@sanisidro.gov.ph',
      role: 'Admin'
    },
    label: 'Punong Barangay (Captain / Admin)',
    description: 'Full administrative access and executive authority'
  },
  {
    user: {
      id: 'usr-sec',
      name: 'Elena V. Bautista',
      email: 'secretary@sanisidro.gov.ph',
      role: 'Secretary'
    },
    label: 'Barangay Secretary',
    description: 'Resident records, document requests & verification'
  },
  {
    user: {
      id: 'usr-tres',
      name: 'Ricardo P. Santos',
      email: 'treasurer@sanisidro.gov.ph',
      role: 'Treasurer'
    },
    label: 'Barangay Treasurer',
    description: 'Fee collection, payments, and official receipts'
  },
  {
    user: {
      id: 'usr-res',
      name: 'Juan M. Dela Cruz',
      email: 'juan.delacruz@gmail.com',
      role: 'Resident',
      residentId: 'res-1'
    },
    label: 'Resident Portal (Citizen)',
    description: 'Online clearance requests and document tracking'
  }
];

interface AuthContextType {
  currentUser: User | null;
  isAuthenticated: boolean;
  login: (email: string, role?: UserRole) => Promise<boolean>;
  logout: () => void;
  switchRole: (role: UserRole) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_STORAGE_KEY = 'bms_auth_user';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    try {
      const stored = localStorage.getItem(AUTH_STORAGE_KEY);
      if (stored) return JSON.parse(stored);
      // Default to Punong Barangay Admin
      return DEMO_ACCOUNTS[0].user;
    } catch {
      return DEMO_ACCOUNTS[0].user;
    }
  });

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(currentUser));
    } else {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    }
  }, [currentUser]);

  const login = async (email: string, role: UserRole = 'Admin'): Promise<boolean> => {
    const demo = DEMO_ACCOUNTS.find(d => d.user.email.toLowerCase() === email.toLowerCase() || d.user.role === role);
    if (demo) {
      setCurrentUser(demo.user);
      return true;
    }
    // Generic fallback user
    const newUser: User = {
      id: 'usr-' + Date.now(),
      name: email.split('@')[0],
      email,
      role
    };
    setCurrentUser(newUser);
    return true;
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const switchRole = (role: UserRole) => {
    const demo = DEMO_ACCOUNTS.find(d => d.user.role === role);
    if (demo) {
      setCurrentUser(demo.user);
    } else if (currentUser) {
      setCurrentUser({ ...currentUser, role });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAuthenticated: !!currentUser,
        login,
        logout,
        switchRole
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
