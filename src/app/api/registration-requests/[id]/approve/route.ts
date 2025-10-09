import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { getAuthPayload } from "@/lib/auth-utils";
import { RegistrationRequest } from "@/models/RegistrationRequest";
import { User } from "@/models/User";
import crypto from "crypto";

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  try {
    const authPayload = await getAuthPayload(req);
    if (!authPayload || authPayload.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const request = await RegistrationRequest.findById(id);
    if (!request) {
      return NextResponse.json({ error: "Request not found" }, { status: 404 });
    }

    if (request.status !== "pending") {
      return NextResponse.json(
        { error: "This request has already been reviewed" },
        { status: 400 }
      );
    }

    const existingUser = await User.findOne({ email: request.email });
    if (existingUser) {
      request.status = "rejected";
      request.reviewedBy = authPayload.id;
      request.reviewedAt = new Date();
      request.rejectionReason = `A user with the email '${request.email}' already exists.`;
      await request.save();

      return NextResponse.json(
        {
          error: `User with email ${request.email} already exists. The request has been rejected.`,
        },
        { status: 409 }
      );
    }

    const temporaryPassword = crypto.randomBytes(8).toString("hex");

    const user = new User({
      name: request.fullName,
      email: request.email,
      password: temporaryPassword,
      role: request.requestedRole,
      phoneNumber: request.phoneNumber,
      about: request.about,
      passportNumber: request.passportNumber,
      passportIssuedBy: request.passportIssuedBy,
      passportIssueDate: request.passportIssueDate,
      isActive: true,
      emailVerified: true,
    });

    await user.save();

    request.status = "approved";
    request.reviewedBy = authPayload.id;
    request.reviewedAt = new Date();
    request.userId = user._id.toString();
    await request.save();

    const emailData = {
      to: user.email,
      toName: user.name,
      email: user.email,
      temporaryPassword,
      loginUrl: `${process.env.NEXT_PUBLIC_APP_URL}/auth/login`,
    };

    return NextResponse.json({
      message: "Request approved and user created successfully.",
      userId: user._id,
      emailData,
    });
  } catch (error) {
    console.error("Approve request error:", error);
    return NextResponse.json(
      { error: "An internal server error occurred." },
      { status: 500 }
    );
  }
}
