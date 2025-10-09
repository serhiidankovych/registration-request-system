import { z } from "zod";

export const RegistrationRequestStatus = {
  PENDING: "pending",
  APPROVED: "approved",
  REJECTED: "rejected",
} as const;

export type RegistrationRequestStatusType =
  (typeof RegistrationRequestStatus)[keyof typeof RegistrationRequestStatus];

export const UserRole = {
  ADMIN: "admin",
  RESEARCHER: "researcher",
  STAFF: "staff",
  USER: "user",
} as const;

export type UserRoleType = (typeof UserRole)[keyof typeof UserRole];

export const baseRegistrationSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phoneNumber: z
    .string()
    .min(10, "Phone number must be at least 10 characters"),
  about: z
    .string()
    .min(20, "Please provide at least 20 characters about yourself"),
  consentGiven: z.boolean().refine((val) => val === true, {
    message: "You must agree to the terms and conditions",
  }),
  requestedRole: z.enum(["user", "researcher"]),
});

export const researcherRegistrationSchema = baseRegistrationSchema.extend({
  requestedRole: z.literal("researcher"),
  passportNumber: z.string().min(5, "Passport number is required"),
  passportIssuedBy: z.string().min(3, "Issuing authority is required"),
  passportIssueDate: z.string().min(1, "Issue date is required"),
  directorApprovalLetterUrl: z
    .string()
    .url("Please provide a valid URL to the approval letter"),
});

export type BaseRegistrationData = z.infer<typeof baseRegistrationSchema>;
export type ResearcherRegistrationData = z.infer<
  typeof researcherRegistrationSchema
>;

export interface IRegistrationRequest {
  fullName: string;
  email: string;
  phoneNumber: string;
  about: string;
  consentGiven: boolean;
  requestedRole: "user" | "researcher";

  passportNumber?: string;
  passportIssuedBy?: string;
  passportIssueDate?: Date;
  directorApprovalLetterUrl?: string;

  status: RegistrationRequestStatusType;
  reviewedBy?: string;
  reviewedAt?: Date;
  rejectionReason?: string;

  userId?: string;

  createdAt: Date;
  updatedAt: Date;
}

export interface IUser {
  name: string;
  email: string;
  password: string;
  role: UserRoleType;
  phoneNumber?: string;
  about?: string;

  passportNumber?: string;
  passportIssuedBy?: string;
  passportIssueDate?: Date;

  exhibitsCount: number;
  commentsCount: number;
  notificationsCount: number;

  isActive: boolean;
  emailVerified: boolean;

  createdAt: Date;
  updatedAt: Date;
}

export interface RegistrationRequestResponse {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  about: string;
  requestedRole: "user" | "researcher";
  status: RegistrationRequestStatusType;
  passportNumber?: string;
  passportIssuedBy?: string;
  passportIssueDate?: string;
  directorApprovalLetterUrl?: string;
  reviewedBy?: string;
  reviewedAt?: string;
  rejectionReason?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ApprovalData {
  temporaryPassword: string;
}

export interface RejectionData {
  reason: string;
}
