import { showToast as originalShowToast, dismissToast as originalDismissToast } from '../hooks/use-toast';

// Export functions that can be called from services
export const toastService = {
  success: (title: string, description?: string, duration?: number) => {
    originalShowToast({ title, description, variant: "success", duration });
  },

  error: (title: string, description?: string, duration?: number) => {
    originalShowToast({ title, description, variant: "destructive", duration });
  },

  info: (title: string, description?: string, duration?: number) => {
    originalShowToast({ title, description, variant: "default", duration });
  },

  warning: (title: string, description?: string, duration?: number) => {
    originalShowToast({ title, description, variant: "default", duration });
  },

  dismiss: originalDismissToast,
};

// For use in React components (re-export the hook)
export { useToast } from "@/hooks/use-toast";