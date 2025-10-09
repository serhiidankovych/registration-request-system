"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AlertCircle, LogIn, Mail } from "lucide-react";
import { ErrorState } from "@/hooks/useApiError";

interface ApiErrorAlertProps {
  errorState: ErrorState;
  onClear?: () => void;
}

export function ApiErrorAlert({ errorState, onClear }: ApiErrorAlertProps) {
  const getIcon = (type: ErrorState["type"]) => {
    switch (type) {
      case "conflict":
        return <LogIn className="h-4 w-4" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  return (
    <Alert
      variant="destructive"
      className="animate-in fade-in slide-in-from-top-2 duration-300"
    >
      {getIcon(errorState.type)}
      <AlertTitle className="font-semibold">{errorState.title}</AlertTitle>
      <AlertDescription className="mt-2 space-y-3">
        <p>{errorState.message}</p>
        <div className="flex gap-2 flex-wrap items-center mt-4">
          {errorState.actionLabel && errorState.actionHandler && (
            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={errorState.actionHandler}
            >
              {errorState.actionLabel}
            </Button>
          )}
          {errorState.secondaryActionLabel &&
            errorState.secondaryActionHandler && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={errorState.secondaryActionHandler}
                className="bg-background"
              >
                <Mail className="mr-2 h-4 w-4" />
                {errorState.secondaryActionLabel}
              </Button>
            )}
          {(errorState.canRetry || onClear) && (
            <Button type="button" variant="ghost" size="sm" onClick={onClear}>
              Dismiss
            </Button>
          )}
        </div>
      </AlertDescription>
    </Alert>
  );
}
