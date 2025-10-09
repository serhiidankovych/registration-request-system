export type RegistrationRequest = {
  _id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  about: string;
  requestedRole: "user" | "researcher";
  status: "pending" | "approved" | "rejected";
  createdAt: string;
  passportNumber?: string;
  passportIssuedBy?: string;
  passportIssueDate?: string;
  directorApprovalLetterUrl?: string;
  reviewedAt?: string;
  rejectionReason?: string;
};

export type RequestStatus = "pending" | "approved" | "rejected";

export type PaginationData = {
  page: number;
  pages: number;
  total: number;
};
