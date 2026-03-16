import type { ConfirmDialogState } from './ConfirmDialogState';

export interface ConfirmationDialogProps {
  dialogState: ConfirmDialogState;
  onClose: () => void;
  /** Receives the reason typed/selected by the staff member */
  onConfirm: (reason: string) => void;
  /** Business ID used to fetch predefined reason templates */
  businessId?: number | null;
  authToken?: string;
}
