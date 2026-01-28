'use client';

import React, { useState, useEffect } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@components/ui/alert-dialog';
import { useToast } from '@global/hooks/use-toast';

interface BOStaffMigrationModalProps {
  isOpen: boolean;
  user: any;
  onClose: () => void;
  onAddAsStaff: () => Promise<void>;
}

/**
 * Modal shown to existing Business Owners on first login after migration
 * Allows them to opt-in to the new "Acting as Staff" feature
 */
export function BOStaffMigrationModal({
  isOpen,
  user,
  onClose,
  onAddAsStaff,
}: BOStaffMigrationModalProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  // Check if user is a BO and has never seen this modal before
  const shouldShow = React.useMemo(() => {
    if (!user || user.role !== 'BUSINESS_OWNER') return false;
    
    // Check if user already saw this modal (stored in localStorage)
    const seenKey = `bo_staff_migration_seen_${user.id}`;
    const hasSeenBefore = localStorage.getItem(seenKey);
    
    return isOpen && !hasSeenBefore;
  }, [user, isOpen]);

  const handleYes = async () => {
    setIsProcessing(true);
    try {
      await onAddAsStaff();
      
      // Mark that user has seen this modal
      const seenKey = `bo_staff_migration_seen_${user.id}`;
      localStorage.setItem(seenKey, 'true');
      
      onClose();
    } catch (error: any) {
      console.error('Error adding user as staff:', error);
      toast({
        variant: 'error',
        title: 'Failed to process request',
        description: error.message || 'Unable to add you as staff. You can do this manually later.',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleNo = () => {
    // Mark that user has seen and declined this modal
    const seenKey = `bo_staff_migration_seen_${user.id}`;
    localStorage.setItem(seenKey, 'true');
    onClose();
  };

  return (
    <AlertDialog open={shouldShow} onOpenChange={(open) => !open && handleNo()}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-xl">
            👤 Work as Staff Member?
          </AlertDialogTitle>
          <AlertDialogDescription className="text-base pt-2">
            We've added a new feature! You can now work as a staff member in your own business, giving you access to staff scheduling and booking management.
            <br />
            <br />
            <strong>Benefits:</strong>
            <ul className="list-disc list-inside mt-2 ml-2 space-y-1">
              <li>View your personal schedule</li>
              <li>Manage your own bookings</li>
              <li>Switch between Manager and Staff modes anytime</li>
            </ul>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="flex gap-3 justify-end pt-4">
          <AlertDialogCancel onClick={handleNo} disabled={isProcessing}>
            Not Now
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleYes}
            disabled={isProcessing}
            className="bg-primary hover:bg-primary-dark"
          >
            {isProcessing ? (
              <>
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Setting up...
              </>
            ) : (
              'Yes, Add Me'
            )}
          </AlertDialogAction>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}
