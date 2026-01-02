import React from 'react';
import { 
  AlertDialog, 
  AlertDialogContent, 
  AlertDialogHeader, 
  AlertDialogFooter, 
  AlertDialogTitle, 
  AlertDialogDescription 
} from '@components/ui/alert-dialog';
import { Button } from '@components/ui/button';
import { AlertTriangle, Ban } from 'lucide-react';
import type { ConfirmDialogState } from '../types/ConfirmDialogState';
import type { ConfirmationDialogProps } from '../types/ConfirmationDialogProps';

export const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  dialogState,
  onClose,
  onConfirm
}) => {
  const isCancel = dialogState.type === 'cancel';
  
  return (
    <AlertDialog open={dialogState.open} onOpenChange={(open: boolean) => !open && onClose()}>
      <AlertDialogContent className="max-w-sm sm:max-w-md p-0 overflow-hidden border-0 shadow-2xl">
        <div className={`p-6 border-t-4 ${isCancel ? 'border-red-500 bg-red-50/50 dark:bg-red-950/20' : 'border-amber-500 bg-amber-50/50 dark:bg-amber-950/20'}`}>
          <AlertDialogHeader>
            <div className="flex items-center gap-3 mb-4">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                isCancel 
                  ? 'bg-red-100 dark:bg-red-900/30' 
                  : 'bg-amber-100 dark:bg-amber-900/30'
              }`}>
                {isCancel ? (
                  <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400" />
                ) : (
                  <Ban className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                )}
              </div>
              <AlertDialogTitle className="text-xl font-bold text-foreground">
                {isCancel ? 'Cancel Booking?' : 'Mark as No-Show?'}
              </AlertDialogTitle>
            </div>
            <AlertDialogDescription className="text-muted-foreground text-base leading-relaxed">
              {isCancel ? (
                <>
                  Are you sure you want to cancel the booking for{' '}
                  <span className="font-semibold text-foreground">{dialogState.clientName}</span>?
                  <br />
                  <span className="text-sm mt-2 block text-amber-600 dark:text-amber-400">
                    This action cannot be undone, and the client will be notified.
                  </span>
                </>
              ) : (
                <>
                  Mark{' '}
                  <span className="font-semibold text-foreground">{dialogState.clientName}</span>
                  {' '}as a no-show?
                  <br />
                  <span className="text-sm mt-2 block text-muted-foreground">
                    This indicates the client did not attend their scheduled appointment.
                  </span>
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-6 flex-col sm:flex-row gap-2">
            <Button
              variant="outline"
              onClick={onClose}
              className="w-full sm:w-auto border-2 border-border hover:bg-muted font-semibold h-11 rounded-xl"
            >
              Go Back
            </Button>
            <Button
              onClick={onConfirm}
              className={`w-full sm:w-auto font-bold h-11 rounded-xl ${
                isCancel 
                  ? 'bg-red-600 hover:bg-red-700 text-white' 
                  : 'bg-amber-600 hover:bg-amber-700 text-white'
              }`}
            >
              {isCancel ? (
                <>
                  <AlertTriangle className="w-4 h-4 mr-2" />
                  Yes, Cancel Booking
                </>
              ) : (
                <>
                  <Ban className="w-4 h-4 mr-2" />
                  Yes, Mark No-Show
                </>
              )}
            </Button>
          </AlertDialogFooter>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
};
