import { toast } from "sonner"

export const useToast = () => {
  const showSuccess = (message: string) => {
    toast.success(message)
  }

  const showError = (message: string) => {
    toast.error(message)
  }

  const showWarning = (message: string) => {
    toast.warning(message)
  }

  const showInfo = (message: string) => {
    toast.info(message)
  }

  return {
    success: showSuccess,
    error: showError,
    warning: showWarning,
    info: showInfo,
  }
}
