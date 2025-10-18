import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle, Info, AlertTriangle } from "lucide-react";

type ToastType = "success" | "error" | "info" | "warning";

interface ToastProps {
  message: string;
  type: ToastType;
  action?: {
    label: string;
    onClick: () => void;
  };
}

const icons = {
  success: CheckCircle2,
  error: XCircle,
  info: Info,
  warning: AlertTriangle,
};

const variants = {
  success: "default",
  error: "destructive",
  info: "default",
  warning: "default",
} as const;

export default function Toast({ message, type, action }: ToastProps) {
  const Icon = icons[type];

  return (
    <Alert variant={variants[type]} className="fixed top-4 right-4 z-50 w-auto max-w-md animate-in fade-in-0 slide-in-from-top-2">
      <Icon className="h-4 w-4" />
      <AlertDescription className="flex items-center justify-between gap-3">
        <span>{message}</span>
        {action && (
          <Button
            variant="outline"
            size="sm"
            onClick={action.onClick}
            className="h-7 px-2 text-xs"
          >
            {action.label}
          </Button>
        )}
      </AlertDescription>
    </Alert>
  );
}
