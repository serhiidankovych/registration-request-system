import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { RegistrationRequest } from "@/models/RegistrationRequest";
import { getAuthPayload } from "@/lib/auth-utils";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    const authPayload = await getAuthPayload(req);
    if (!authPayload || authPayload.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return NextResponse.json(
        { error: "Invalid request ID format" },
        { status: 400 }
      );
    }

    const request = await RegistrationRequest.findById(id).lean();

    if (!request) {
      return NextResponse.json({ error: "Request not found" }, { status: 404 });
    }

    return NextResponse.json(request);
  } catch (error) {
    console.error("Fetch single request error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
