import React, { useEffect, useState } from 'react';
import { useLocale } from '@global/hooks/useLocale';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
} from '@components/ui/alert-dialog';
import { Button } from '@components/ui/button';
import { Textarea } from '@components/ui/textarea';
import { AlertTriangle, Ban, Plus, Trash2 } from 'lucide-react';
import type { ConfirmationDialogProps } from '../types/ConfirmationDialogProps';
import {
  addCancellationReason,
  deleteCancellationReason,
  getCancellationReasons,
} from '@/(pages)/(business)/actions/backend';
import type { LocaleCode } from '@global/lib/locales';
import { businessBookingsT } from '@/(pages)/(business)/business/bookings/i18n';

function getDialogTitle(locale: LocaleCode, isNoShow: boolean, isReject: boolean): string {
  if (isNoShow) {
    return businessBookingsT(locale, 'dialog_mark_no_show');
  }

  if (isReject) {
    return businessBookingsT(locale, 'dialog_reject_booking');
  }

  return businessBookingsT(locale, 'dialog_cancel_booking');
}

function getCancelActionLabel(locale: LocaleCode, isReject: boolean): string {
  if (isReject) {
    return businessBookingsT(locale, 'action_reject').toLowerCase();
  }

  return businessBookingsT(locale, 'action_cancel').toLowerCase();
}

// eslint-disable-next-line sonarjs/cognitive-complexity
export const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  dialogState,
  onClose,
  onConfirm,
  businessId,
  authToken,
}) => {
  const { locale } = useLocale();
  const isNoShow = dialogState.type === 'no_show';
  const isReject = !isNoShow && dialogState.bookingStatus?.toUpperCase() === 'PENDING';
  const isCancelAction = !isNoShow;
  const dialogTitle = getDialogTitle(locale, isNoShow, isReject);

  const [reason, setReason] = useState('');
  const [presets, setPresets] = useState<{ id: number; reason: string }[]>([]);
  const [isManageView, setIsManageView] = useState(false);
  const [selectedReasonValue, setSelectedReasonValue] = useState('');
  const [manageSelectedId, setManageSelectedId] = useState('');
  const [manageText, setManageText] = useState('');

  const loadPresets = async () => {
    if (!isCancelAction || !businessId) return;
    try {
      const result = await getCancellationReasons(businessId, authToken);
      setPresets(Array.isArray(result) ? result : []);
    } catch {
      setPresets([]);
    }
  };

  useEffect(() => {
    if (dialogState.open) {
      loadPresets();
    }

    if (!dialogState.open) {
      setReason('');
      setSelectedReasonValue('');
      setIsManageView(false);
      setManageSelectedId('');
      setManageText('');
    }
  }, [dialogState.open, isCancelAction, businessId, authToken]);

  const openManageView = () => {
    setIsManageView(true);
    setManageSelectedId('');
    setManageText('');
  };

  const closeManageView = () => {
    setIsManageView(false);
    setManageSelectedId('');
    setManageText('');
  };

  const handleManageSave = async () => {
    if (!businessId || !manageText.trim()) return;
    try {
      if (manageSelectedId) {
        // No backend update endpoint yet; emulate edit with delete + add.
        await deleteCancellationReason(Number(manageSelectedId), authToken);
      }
      await addCancellationReason(businessId, manageText.trim(), authToken);
      await loadPresets();
      setManageSelectedId('');
      setManageText('');
    } catch {
      // Keep UX simple: silent failure to avoid blocking the flow
    }
  };

  const handleDeleteReason = async () => {
    if (!manageSelectedId) return;
    try {
      await deleteCancellationReason(Number(manageSelectedId), authToken);
      await loadPresets();
      setManageSelectedId('');
      setManageText('');
    } catch {
      // Keep UX simple: silent failure to avoid blocking the flow
    }
  };

  const onManageSelectChange = (value: string) => {
    setManageSelectedId(value);
    if (!value) {
      setManageText('');
      return;
    }
    const picked = presets.find((p) => p.id.toString() === value);
    setManageText(picked?.reason ?? '');
  };

  const onActionReasonChange = (value: string) => {
    setSelectedReasonValue(value);
    if (value === 'custom') {
      setReason('');
      return;
    }
    const picked = presets.find((p) => p.id.toString() === value);
    setReason(picked?.reason ?? '');
  };

  return (
    <AlertDialog open={dialogState.open} onOpenChange={(open: boolean) => !open && onClose()}>
      <AlertDialogContent className="max-w-sm sm:max-w-md p-0 overflow-hidden border-0 shadow-2xl">
        <div
          className={`p-6 border-t-4 ${isCancelAction ? 'border-red-500 bg-red-50/50 dark:bg-red-950/20' : 'border-amber-500 bg-amber-50/50 dark:bg-amber-950/20'}`}
        >
          <AlertDialogHeader>
            <div className="flex items-center gap-3 mb-4">
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  isCancelAction
                    ? 'bg-red-100 dark:bg-red-900/30'
                    : 'bg-amber-100 dark:bg-amber-900/30'
                }`}
              >
                {isCancelAction ? (
                  <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400" />
                ) : (
                  <Ban className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                )}
              </div>
              <AlertDialogTitle className="text-xl font-bold text-foreground">
                {dialogTitle}
              </AlertDialogTitle>
            </div>
            <AlertDialogDescription className="text-muted-foreground text-base leading-relaxed">
              {isCancelAction ? (
                <>
                    {businessBookingsT(locale, 'dialog_cancel_message', {
                      action: getCancelActionLabel(locale, isReject),
                      name: dialogState.clientName,
                    })}
                  <br />
                  <span className="text-sm mt-2 block text-amber-600 dark:text-amber-400">
                      {businessBookingsT(locale, 'dialog_client_notified')}
                  </span>
                </>
              ) : (
                <>
                    {businessBookingsT(locale, 'dialog_no_show_message', {
                      name: dialogState.clientName,
                    })}
                  <br />
                  <span className="text-sm mt-2 block text-muted-foreground">
                      {businessBookingsT(locale, 'dialog_no_show_hint')}
                  </span>
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>

          {isCancelAction && !isManageView && (
            <div className="mt-5 space-y-3">
              {presets.length > 0 && (
                <div className="space-y-2">
                  <select
                    className="w-full h-11 rounded-xl border border-input bg-background px-3 text-sm"
                    value={selectedReasonValue}
                    onChange={(e) => onActionReasonChange(e.target.value)}
                  >
                    <option value="">{businessBookingsT(locale, 'dialog_choose_saved_reason')}</option>
                    {presets.map((preset) => (
                      <option key={preset.id} value={preset.id.toString()}>
                        {preset.reason}
                      </option>
                    ))}
                    <option value="custom">{businessBookingsT(locale, 'dialog_custom_reason')}</option>
                  </select>
                </div>
              )}

              {(selectedReasonValue === 'custom' || presets.length === 0) && (
                <div className="space-y-2">
                  <Textarea
                    placeholder={businessBookingsT(locale, 'dialog_write_reason')}
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    className="resize-none rounded-xl border-input min-h-[90px] text-sm"
                    maxLength={500}
                  />
                </div>
              )}

              <button
                type="button"
                className="text-sm text-primary hover:underline font-medium"
                onClick={openManageView}
              >
                {businessBookingsT(locale, 'dialog_manage_reasons')}
              </button>
            </div>
          )}

          {isCancelAction && isManageView && (
            <div className="mt-5 space-y-3 rounded-xl border border-border bg-background/70 p-3">
              <p className="text-sm font-semibold text-foreground">{businessBookingsT(locale, 'dialog_list_of_reasons')}</p>

              <div className="flex gap-2">
                <select
                  className="flex-1 h-10 rounded-xl border border-input bg-background px-3 text-sm"
                  value={manageSelectedId}
                  onChange={(e) => onManageSelectChange(e.target.value)}
                >
                  <option value="">{businessBookingsT(locale, 'dialog_select_reason_edit')}</option>
                  {presets.map((preset) => (
                    <option key={preset.id} value={preset.id.toString()}>
                      {preset.reason}
                    </option>
                  ))}
                </select>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="h-10 w-10 text-destructive border-destructive/30 hover:bg-destructive/10"
                  onClick={handleDeleteReason}
                  disabled={!manageSelectedId}
                  title={businessBookingsT(locale, 'dialog_delete_selected_reason')}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>

              <Textarea
                placeholder={businessBookingsT(locale, 'dialog_write_reason')}
                value={manageText}
                onChange={(e) => setManageText(e.target.value)}
                className="resize-none rounded-xl border-input min-h-[100px] text-sm"
                maxLength={500}
              />

              <div className="flex flex-col sm:flex-row gap-2 sm:justify-end">
                <Button
                  type="button"
                  onClick={handleManageSave}
                  disabled={!manageText.trim()}
                  className="h-10 rounded-xl"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  {manageSelectedId ? businessBookingsT(locale, 'dialog_save') : businessBookingsT(locale, 'dialog_add')}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    if (manageText.trim()) {
                      setManageText('');
                      setManageSelectedId('');
                    } else {
                      closeManageView();
                    }
                  }}
                  className="h-10 rounded-xl"
                >
                  {manageText.trim() ? businessBookingsT(locale, 'action_cancel') : businessBookingsT(locale, 'dialog_done')}
                </Button>
              </div>
            </div>
          )}

          <AlertDialogFooter className="mt-6 flex-col sm:flex-row gap-2">
            <Button
              variant="outline"
              onClick={onClose}
              className="w-full sm:w-auto border-2 border-border hover:bg-muted font-semibold h-11 rounded-xl"
            >
              {businessBookingsT(locale, 'dialog_go_back')}
            </Button>
            {!isManageView && (
              <Button
                onClick={() => onConfirm(isCancelAction ? reason.trim() : '')}
                className={`w-full sm:w-auto font-bold h-11 rounded-xl ${
                  isCancelAction
                    ? 'bg-red-600 hover:bg-red-700 text-white'
                    : 'bg-amber-600 hover:bg-amber-700 text-white'
                }`}
              >
                {isCancelAction ? (
                  <>
                    <AlertTriangle className="w-4 h-4 mr-2" />
                    {isReject
                      ? businessBookingsT(locale, 'dialog_yes_reject')
                      : businessBookingsT(locale, 'dialog_yes_cancel')}
                  </>
                ) : (
                  <>
                    <Ban className="w-4 h-4 mr-2" />
                    {businessBookingsT(locale, 'dialog_yes_no_show')}
                  </>
                )}
              </Button>
            )}
          </AlertDialogFooter>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
};
