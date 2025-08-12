import { toast } from "sonner";

type ToastType = "success" | "error" | "warning" | "info";

interface ToastOptions {
  message: string | React.ReactNode;
  description?: string;
  duration?: number;
}

export const showToast = (type: ToastType, options: ToastOptions) => {
  const { message, description = "", duration = 2000 } = options;

  switch (type) {
    case "success":
      toast.success(message, {
        description,
        duration,
      });
      break;

    case "error":
      toast.error(message, {
        description,
        duration,
      });
      break;

    case "warning":
      toast.warning(message, {
        description,
        duration,
      });
      break;

    case "info":
      toast.info(message, {
        description,
        duration,
      });
      break;

    default:
      console.warn(`Unknown toast type: ${type}`);
      toast(message, { description, duration });
  }
};
