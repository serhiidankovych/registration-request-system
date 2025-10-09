import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { getAuthPayload } from "@/lib/auth-utils";
import { RegistrationRequest } from "@/models/RegistrationRequest";
import { z } from "zod";

const rejectSchema = z.object({
  reason: z.string().min(10, "Rejection reason must be at least 10 characters"),
});

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    const authPayload = await getAuthPayload(req);
    if (!authPayload || authPayload.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const validation = rejectSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: "Validation failed", details: validation.error },
        { status: 400 }
      );
    }
    const { reason } = validation.data;

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

    request.status = "rejected";
    request.reviewedBy = authPayload.id;
    request.reviewedAt = new Date();
    request.rejectionReason = reason;
    await request.save();

    const emailData = {
      to: request.email,
      toName: request.fullName,
      reason,
    };

    return NextResponse.json({
      message: "Request rejected successfully.",
      emailData,
    });
  } catch (error) {
    console.error("Reject request error:", error);
    return NextResponse.json(
      { error: "An internal server error occurred" },
      { status: 500 }
    );
  }
}
