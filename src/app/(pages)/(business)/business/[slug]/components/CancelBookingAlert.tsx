import React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@components/ui/alert-dialog";
import { useLocale } from "@global/hooks/useLocale";
import { businessDetailT } from "../i18n";

interface CancelBookingAlertProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}

const CancelBookingAlert: React.FC<CancelBookingAlertProps> = ({
  open,
  onOpenChange,
  onConfirm,
}) => {
  const { locale } = useLocale();
  const t = (key: Parameters<typeof businessDetailT>[1], params?: Record<string, string | number>) =>
    businessDetailT(locale, key, params);

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t("cancel_booking_title")}</AlertDialogTitle>
          <AlertDialogDescription>{t("cancel_booking_desc")}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => onOpenChange(false)}>
            {t("no_continue_booking")}
          </AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm} className="bg-red-500 hover:bg-red-600">
            {t("yes_cancel")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default CancelBookingAlert;
