import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import {
  BaseRegistrationData,
  ResearcherRegistrationData,
} from "@/types/registration";
import { sendApprovalEmail, sendRejectionEmail } from "@/lib/emailjs";
import { AuthStorage } from "@/lib/auth-storage";

const api = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = AuthStorage.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      AuthStorage.clearAuth();
      if (typeof window !== "undefined") {
        window.location.href = "/auth/login";
      }
    }
    return Promise.reject(error);
  }
);

export function useSubmitRegistrationRequest() {
  return useMutation<
    RegistrationOptions,
    AxiosError<{ error: string }>,
    BaseRegistrationData | ResearcherRegistrationData
  >({
    mutationFn: async (
      data: BaseRegistrationData | ResearcherRegistrationData
    ) => {
      const response = await api.post("/registration-requests", data);
      return response.data;
    },
  });
}

export function useRegistrationRequests(
  status: string,
  page: number,
  limit: number
) {
  return useQuery({
    queryKey: ["registrationRequests", status, page, limit],
    queryFn: async () => {
      const { data } = await api.get("/registration-requests", {
        params: { status, page, limit },
      });
      return data;
    },
    enabled: typeof window !== "undefined" && AuthStorage.isAuthenticated(),
    retry: (failureCount, error: AxiosError) => {
      if (error.response?.status === 401) return false;
      return failureCount < 3;
    },
  });
}

export function useApproveRequest() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await api.post(`/registration-requests/${id}/approve`);
      return data;
    },
    onSuccess: async (data) => {
      await queryClient.invalidateQueries({
        queryKey: ["registrationRequests"],
      });
      try {
        await sendApprovalEmail(data.emailData);
      } catch (emailError) {
        console.error("Failed to send approval email via EmailJS:", emailError);
        alert(
          "User was approved and created, but the notification email failed to send. Please contact the user directly."
        );
      }
    },
    onError: (error: AxiosError<{ error: string }>) => {
      throw new Error(
        error.response?.data?.error || "Failed to approve the request."
      );
    },
  });
}

export function useRejectRequest() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, reason }: { id: string; reason: string }) => {
      const { data } = await api.post(`/registration-requests/${id}/reject`, {
        reason,
      });
      return data;
    },
    onSuccess: async (data) => {
      await queryClient.invalidateQueries({
        queryKey: ["registrationRequests"],
      });
      try {
        await sendRejectionEmail(data.emailData);
      } catch (emailError) {
        console.error(
          "Failed to send rejection email via EmailJS:",
          emailError
        );
      }
    },
    onError: (error: AxiosError<{ error: string }>) => {
      throw new Error(
        error.response?.data?.error || "Failed to reject the request."
      );
    },
  });
}
