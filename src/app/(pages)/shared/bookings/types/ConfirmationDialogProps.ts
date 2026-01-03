import type { ConfirmDialogState } from './ConfirmDialogState';

export interface ConfirmationDialogProps {
  dialogState: ConfirmDialogState;
  onClose: () => void;
  onConfirm: () => void;
}
