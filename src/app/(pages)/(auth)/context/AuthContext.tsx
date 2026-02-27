"use client";

import React, { createContext, useContext, ReactNode, useState } from 'react';
import type { AuthContextType } from './auth/types';
import type { UserRole } from '../types';
import { useAuthImplementation } from './auth/useAuthImplementation';
import { BOStaffMigrationModal } from '../components/BOStaffMigrationModal';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const impl = useAuthImplementation();
  const [showMigrationModal, setShowMigrationModal] = useState(false);

  // Show migration modal if user is a BO with isAlsoStaff
  React.useEffect(() => {
    if (impl.user?.role === 'BUSINESS_OWNER' && impl.user?.isAlsoStaff) {
      setShowMigrationModal(true);
    }
  }, [impl.user?.id, impl.user?.role, impl.user?.isAlsoStaff]);

  const handleAddSelfAsStaff = async () => {
    // This is called from the modal, but user already has isAlsoStaff = true
    // Just close the modal - they've already been added during migration
    setShowMigrationModal(false);
  };

  return (
    <>
      <AuthContext.Provider value={impl}>{children}</AuthContext.Provider>
      <BOStaffMigrationModal
        isOpen={showMigrationModal}
        user={impl.user}
        onClose={() => setShowMigrationModal(false)}
        onAddAsStaff={handleAddSelfAsStaff}
      />
    </>
  );
};

export type { UserRole };
