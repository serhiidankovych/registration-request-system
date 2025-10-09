import { format } from "date-fns";
import { RegistrationRequest, RequestStatus } from "../types";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { FlaskConical, Loader2, User } from "lucide-react";
import React from "react";

type RequestDetailsDialogProps = {
  request: RegistrationRequest | null;
  isOpen: boolean;
  isApproving: boolean;
  onClose: () => void;
  onApprove: (id: string) => void;
  onOpenReject: (request: RegistrationRequest) => void;
};

const DetailItem = ({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) => (
  <div>
    <Label className="text-muted-foreground">{label}</Label>
    <div className="font-medium mt-1">{children}</div>
  </div>
);

const RoleInfo = ({ role }: { role: "user" | "researcher" }) => (
  <div className="flex items-center gap-2">
    {role === "researcher" ? (
      <FlaskConical className="h-4 w-4 text-blue-500" />
    ) : (
      <User className="h-4 w-4 text-gray-500" />
    )}
    <span className="capitalize">{role}</span>
  </div>
);

const StatusBadge = ({ status }: { status: RequestStatus }) => {
  const variants: Record<
    RequestStatus,
    "default" | "secondary" | "destructive"
  > = {
    pending: "secondary",
    approved: "default",
    rejected: "destructive",
  };
  return (
    <Badge variant={variants[status]} className="capitalize">
      {status}
    </Badge>
  );
};

export const RequestDetailsDialog = ({
  request,
  isOpen,
  isApproving,
  onClose,
  onApprove,
  onOpenReject,
}: RequestDetailsDialogProps) => {
  if (!request) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Registration Request Details</DialogTitle>
          <DialogDescription>
            A complete overview of the applicant&apos;s submission.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="space-y-4">
            <h3 className="font-semibold text-lg border-b pb-2">
              Applicant Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <DetailItem label="Full Name">{request.fullName}</DetailItem>
              <DetailItem label="Email Address">{request.email}</DetailItem>
              <DetailItem label="Phone Number">
                {request.phoneNumber}
              </DetailItem>
              <DetailItem label="Requested Role">
                <RoleInfo role={request.requestedRole} />
              </DetailItem>
            </div>
            <DetailItem label="About the Applicant">
              <p className="text-sm p-3 bg-gray-50 rounded-md border">
                {request.about}
              </p>
            </DetailItem>
          </div>

          {request.requestedRole === "researcher" && (
            <div className="space-y-4">
              <h3 className="font-semibold text-lg border-b pb-2">
                Researcher Verification
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <DetailItem label="Passport Number">
                  {request.passportNumber || "N/A"}
                </DetailItem>
                <DetailItem label="Passport Issued By">
                  {request.passportIssuedBy || "N/A"}
                </DetailItem>
                <DetailItem label="Passport Issue Date">
                  {request.passportIssueDate
                    ? format(new Date(request.passportIssueDate), "PP")
                    : "N/A"}
                </DetailItem>
              </div>
              {request.directorApprovalLetterUrl && (
                <DetailItem label="Director's Approval Letter">
                  <a
                    href={request.directorApprovalLetterUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-primary hover:underline block"
                  >
                    View Document →
                  </a>
                </DetailItem>
              )}
            </div>
          )}

          <div className="space-y-4">
            <h3 className="font-semibold text-lg border-b pb-2">
              Request Status
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <DetailItem label="Current Status">
                <StatusBadge status={request.status} />
              </DetailItem>
              <DetailItem label="Submitted On">
                {format(new Date(request.createdAt), "PPpp")}
              </DetailItem>
              {request.reviewedAt && (
                <DetailItem label="Reviewed On">
                  {format(new Date(request.reviewedAt), "PPpp")}
                </DetailItem>
              )}
            </div>
            {request.rejectionReason && (
              <DetailItem label="Rejection Reason">
                <p className="text-sm p-3 bg-red-50 text-red-800 rounded-md border border-red-200">
                  {request.rejectionReason}
                </p>
              </DetailItem>
            )}
          </div>
        </div>

        <DialogFooter>
          {request.status === "pending" && (
            <>
              <Button variant="outline" onClick={() => onOpenReject(request)}>
                Reject
              </Button>
              <Button
                onClick={() => onApprove(request._id)}
                disabled={isApproving}
              >
                {isApproving && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Approve
              </Button>
            </>
          )}
          <Button variant="secondary" onClick={onClose}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
