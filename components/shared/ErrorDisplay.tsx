import React from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface ErrorDisplayProps {
  error: Error | string | null;
  title?: string;
}

export default function ErrorDisplay({ error, title = "Error" }: ErrorDisplayProps) {
  if (!error) return null;

  const errorMessage = typeof error === "string" ? error : error.message;

  return (
    <Alert variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>{errorMessage}</AlertDescription>
    </Alert>
  );
}
