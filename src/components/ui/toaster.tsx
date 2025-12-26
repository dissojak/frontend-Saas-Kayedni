'use client';
import { useToast } from "@global/hooks/use-toast"
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@components/ui/toast"
import { CheckCircle2, XCircle, AlertTriangle, Info, Sparkles } from "lucide-react"

const getToastIcon = (variant?: string) => {
  const iconClass = "h-5 w-5 flex-shrink-0"
  
  switch (variant) {
    case "success":
      return <CheckCircle2 className={`${iconClass} text-emerald-600 dark:text-emerald-400`} />
    case "error":
    case "destructive":
      return <XCircle className={`${iconClass} text-red-600 dark:text-red-400`} />
    case "warning":
      return <AlertTriangle className={`${iconClass} text-amber-600 dark:text-amber-400`} />
    case "info":
      return <Info className={`${iconClass} text-blue-600 dark:text-blue-400`} />
    default:
      return <Sparkles className={`${iconClass} text-slate-600 dark:text-slate-400`} />
  }
}

export function Toaster() {
  const { toasts } = useToast()

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, variant, ...props }) {
        return (
          <Toast key={id} variant={variant} {...props}>
            <div className="flex items-start gap-3 w-full">
              <div className="mt-0.5">
                {getToastIcon(variant)}
              </div>
              <div className="grid gap-1 flex-1">
                {title && <ToastTitle className="font-bold text-base">{title}</ToastTitle>}
                {description && (
                  <ToastDescription className="text-sm opacity-90">{description}</ToastDescription>
                )}
              </div>
            </div>
            {action}
            <ToastClose />
          </Toast>
        )
      })}
      <ToastViewport />
    </ToastProvider>
  )
}
