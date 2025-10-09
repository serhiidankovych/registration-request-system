import { useState } from "react";
import {
  useRegistrationRequests,
  useApproveRequest,
  useRejectRequest,
} from "@/hooks/useRegistrationRequest";
import { RegistrationRequest, RequestStatus } from "../types";

export const useAdminDashboard = () => {
  const [activeTab, _setActiveTab] = useState<RequestStatus>("pending");
  const [selectedRequest, setSelectedRequest] =
    useState<RegistrationRequest | null>(null);
  const [isRejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [page, setPage] = useState(1);

  const { data, isLoading, isError } = useRegistrationRequests(
    activeTab,
    page,
    5
  );
  const approveMutation = useApproveRequest();
  const rejectMutation = useRejectRequest();

  const setActiveTab = (tab: RequestStatus) => {
    _setActiveTab(tab);
    setPage(1);
  };

  const handleApprove = (requestId: string) => {
    if (window.confirm("Are you sure you want to approve this request?")) {
      approveMutation.mutate(requestId, {
        onSuccess: () => {
          alert("Request approved successfully! An email will be sent.");
          setSelectedRequest(null);
        },
        onError: (error: Error) => alert(`Error: ${error.message}`),
      });
    }
  };

  const handleRejectSubmit = () => {
    if (!selectedRequest || rejectionReason.trim().length < 10) return;
    rejectMutation.mutate(
      { id: selectedRequest._id, reason: rejectionReason },
      {
        onSuccess: () => {
          alert("Request rejected successfully.");
          closeRejectDialog();
        },
        onError: (error: Error) => alert(`Error: ${error.message}`),
      }
    );
  };

  const openRejectDialog = (request: RegistrationRequest) => {
    setSelectedRequest(request);
    setRejectDialogOpen(true);
  };

  const closeRejectDialog = () => {
    setRejectDialogOpen(false);
    setRejectionReason("");
  };

  return {
    page,
    setPage,
    activeTab,
    setActiveTab,
    selectedRequest,
    setSelectedRequest,
    isRejectDialogOpen,
    rejectionReason,
    setRejectionReason,
    requestsData: data,
    isLoading,
    isError,
    approveMutation,
    rejectMutation,
    handleApprove,
    handleRejectSubmit,
    openRejectDialog,
    closeRejectDialog,
  };
};
