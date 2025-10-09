"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AuthStorage } from "@/lib/auth-storage";
import { useAdminDashboard } from "./hooks/useAdminDashboard";
import { RequestsTable } from "./components/RequestsTable";
import { RequestDetailsDialog } from "./components/RequestDetailsDialog";
import { RejectRequestDialog } from "./components/RejectRequestDialog";
import { RequestsPagination } from "./components/RequestsPagination";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, LogOut } from "lucide-react";
import { RequestStatus } from "./types";

export default function AdminRegistrationRequestsPage() {
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const payload = AuthStorage.getPayload();
    if (!payload || payload.role !== "admin") {
      router.push("/auth/login");
    }
  }, [router]);

  const {
    page,
    setPage,
    activeTab,
    setActiveTab,
    selectedRequest,
    setSelectedRequest,
    isRejectDialogOpen,
    rejectionReason,
    setRejectionReason,
    requestsData,
    isLoading,
    isError,
    approveMutation,
    rejectMutation,
    handleApprove,
    handleRejectSubmit,
    openRejectDialog,
    closeRejectDialog,
  } = useAdminDashboard();

  if (!isClient) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  const handleLogout = () => {
    AuthStorage.clearAuth();
    router.push("/auth/login");
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-3xl font-bold">
                Registration Requests
              </CardTitle>
              <CardDescription>
                Review and manage new user registration requests.
              </CardDescription>
            </div>
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs
            value={activeTab}
            onValueChange={(value) => setActiveTab(value as RequestStatus)}
          >
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="approved">Approved</TabsTrigger>
              <TabsTrigger value="rejected">Rejected</TabsTrigger>
            </TabsList>
            <TabsContent value={activeTab} className="mt-6">
              {isLoading && (
                <div className="flex justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin" />
                </div>
              )}
              {isError && (
                <Alert variant="destructive">
                  <AlertDescription>Failed to load requests.</AlertDescription>
                </Alert>
              )}
              {!isLoading &&
                !isError &&
                (requestsData?.requests?.length > 0 ? (
                  <>
                    <RequestsTable
                      requests={requestsData.requests}
                      onView={setSelectedRequest}
                      onApprove={handleApprove}
                      onOpenReject={openRejectDialog}
                      isApproving={approveMutation.isPending}
                      isRejecting={rejectMutation.isPending}
                    />

                    <RequestsPagination
                      currentPage={page}
                      totalPages={requestsData.pagination.pages}
                      onPageChange={setPage}
                    />
                  </>
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    No {activeTab} requests found.
                  </div>
                ))}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <RequestDetailsDialog
        request={selectedRequest}
        isOpen={!!selectedRequest && !isRejectDialogOpen}
        isApproving={approveMutation.isPending}
        onClose={() => setSelectedRequest(null)}
        onApprove={handleApprove}
        onOpenReject={openRejectDialog}
      />
      <RejectRequestDialog
        isOpen={isRejectDialogOpen}
        reason={rejectionReason}
        isRejecting={rejectMutation.isPending}
        onClose={closeRejectDialog}
        onReasonChange={setRejectionReason}
        onSubmit={handleRejectSubmit}
      />
    </div>
  );
}
