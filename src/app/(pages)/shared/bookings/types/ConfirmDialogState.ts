export interface ConfirmDialogState {
  open: boolean;
  type: 'cancel' | 'no_show' | null;
  bookingId: number | null;
  clientName: string;
  /** Current booking status — determines 'Reject' (PENDING) vs 'Cancel' (CONFIRMED) label */
  bookingStatus?: string;
}
