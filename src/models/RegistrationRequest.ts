import mongoose, { Schema, Model } from "mongoose";
import { IRegistrationRequest } from "@/types/registration";

const RegistrationRequestSchema = new Schema<IRegistrationRequest>(
  {
    fullName: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    phoneNumber: { type: String, required: true, trim: true },
    about: { type: String, required: true, trim: true },
    consentGiven: { type: Boolean, required: true },
    requestedRole: {
      type: String,
      enum: ["user", "researcher"],
      required: true,
    },
    passportNumber: String,
    passportIssuedBy: String,
    passportIssueDate: Date,
    directorApprovalLetterUrl: String,
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
      required: true,
      index: true,
    },
    reviewedBy: { type: String, ref: "User" },
    reviewedAt: Date,
    rejectionReason: String,
    userId: { type: String, ref: "User" },
  },
  { timestamps: true }
);

RegistrationRequestSchema.index({ status: 1, createdAt: -1 });
RegistrationRequestSchema.index({ email: 1, status: 1 });

export const RegistrationRequest: Model<IRegistrationRequest> =
  mongoose.models.RegistrationRequest ||
  mongoose.model<IRegistrationRequest>(
    "RegistrationRequest",
    RegistrationRequestSchema
  );
