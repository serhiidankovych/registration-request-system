import mongoose, { Schema, Model } from "mongoose";
import bcrypt from "bcryptjs";
import { IUser } from "@/types/registration";

export interface IUserMethods {
  comparePassword(candidatePassword: string): Promise<boolean>;
}

type UserModelType = Model<IUser, object, IUserMethods>;

const UserSchema = new Schema<IUser, UserModelType>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
    },
    role: {
      type: String,
      enum: ["admin", "researcher", "staff", "user"],
      default: "user",
      required: true,
    },
    phoneNumber: {
      type: String,
      trim: true,
    },
    about: {
      type: String,
      trim: true,
    },

    passportNumber: {
      type: String,
      sparse: true,
    },
    passportIssuedBy: String,
    passportIssueDate: Date,

    isActive: {
      type: Boolean,
      default: true,
    },
    emailVerified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(new Error("Error hashing password"));
  }
});

UserSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

export const User: UserModelType =
  mongoose.models.User ||
  mongoose.model<IUser, UserModelType>("User", UserSchema);
