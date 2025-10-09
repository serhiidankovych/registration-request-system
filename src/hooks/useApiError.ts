"use client";

import { useState } from "react";
import axios from "axios";

interface ErrorContext {
  email?: string;
}

export type ErrorType =
  | "conflict"
  | "network"
  | "validation"
  | "server"
  | "unauthorized"
  | "forbidden"
  | "unknown";

export interface ErrorState {
  type: ErrorType;
  title: string;
  message: string;
  canRetry?: boolean;
  actionLabel?: string;
  actionHandler?: () => void;
  secondaryActionLabel?: string;
  secondaryActionHandler?: () => void;
}

interface UseApiErrorOptions {
  onRetry?: () => void;
}

export function useApiError(options: UseApiErrorOptions = {}) {
  const [errorState, setErrorState] = useState<ErrorState | null>(null);

  const parseError = (
    error: unknown,
    context: ErrorContext = {}
  ): ErrorState => {
    const { onRetry } = options;

    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      const serverMessage = error.response?.data?.message || error.message;

      if (status === 409) {
        return {
          type: "conflict",
          title: "Email Already Registered",
          message:
            "An account with this email address already exists. Please log in or use a different email.",
          canRetry: false,
          actionLabel: "Go to Login",
          actionHandler: () => {
            window.location.href = "/auth/login";
          },
        };
      }

      if (status === 400) {
        return {
          type: "validation",
          title: "Invalid Data",
          message:
            serverMessage || "Please check the form for errors and try again.",
          canRetry: true,
        };
      }

      if (status === 401) {
        return {
          type: "unauthorized",
          title: "Authentication Error",
          message:
            "Your session has expired or is invalid. Please log in again.",
          canRetry: false,
          actionLabel: "Go to Login",
          actionHandler: () => {
            window.location.href = "/auth/login";
          },
        };
      }

      if (status && status >= 500) {
        return {
          type: "server",
          title: "Server Error",
          message:
            "Our server is experiencing issues. We are working on it. Please try again later.",
          canRetry: true,
          actionLabel: onRetry ? "Try Again" : undefined,
          actionHandler: onRetry,
        };
      }
    }

    if (
      error instanceof Error &&
      error.message.toLowerCase().includes("network")
    ) {
      return {
        type: "network",
        title: "Connection Error",
        message:
          "Unable to connect. Please check your internet connection and try again.",
        canRetry: true,
        actionLabel: "Try Again",
        actionHandler: onRetry,
      };
    }

    return {
      type: "unknown",
      title: "An Unexpected Error Occurred",
      message:
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again.",
      canRetry: true,
      actionLabel: onRetry ? "Try Again" : undefined,
      actionHandler: onRetry,
    };
  };

  const handleError = (error: unknown, context?: ErrorContext) => {
    console.error("API Error:", error);
    const parsedError = parseError(error, context);
    setErrorState(parsedError);

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const clearError = () => {
    setErrorState(null);
  };

  return {
    errorState,
    handleError,
    clearError,
    hasError: errorState !== null,
  };
}
