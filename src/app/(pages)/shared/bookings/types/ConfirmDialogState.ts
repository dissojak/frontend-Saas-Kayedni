export interface ConfirmDialogState {
  open: boolean;
  type: 'cancel' | 'no_show' | null;
  bookingId: number | null;
  clientName: string;
}
