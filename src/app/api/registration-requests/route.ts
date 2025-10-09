import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { RegistrationRequest } from "@/models/RegistrationRequest";
import {
  baseRegistrationSchema,
  researcherRegistrationSchema,
  BaseRegistrationData,
  ResearcherRegistrationData,
} from "@/types/registration";
import { getAuthPayload } from "@/lib/auth-utils";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();

    const schema =
      body.requestedRole === "researcher"
        ? researcherRegistrationSchema
        : baseRegistrationSchema;

    const validatedData = schema.parse(body);

    const existingRequest = await RegistrationRequest.findOne({
      email: validatedData.email,
      status: { $in: ["pending", "approved"] },
    });

    if (existingRequest) {
      return NextResponse.json(
        { error: "A registration request with this email already exists" },
        { status: 409 }
      );
    }

    let requestData: BaseRegistrationData | ResearcherRegistrationData;

    if (validatedData.requestedRole === "researcher") {
      const researcherData = validatedData as ResearcherRegistrationData;

      requestData = {
        ...researcherData,
        passportIssueDate: researcherData.passportIssueDate,
      };
    } else {
      requestData = validatedData;
    }

    const documentData = {
      ...requestData,
      status: "pending" as const,
      ...(requestData.requestedRole === "researcher" &&
        "passportIssueDate" in requestData && {
          passportIssueDate: new Date(requestData.passportIssueDate),
        }),
    };

    const request = await RegistrationRequest.create(documentData);

    return NextResponse.json(
      {
        message: "Registration request submitted successfully",
        requestId: request._id,
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    if (
      error &&
      typeof error === "object" &&
      "name" in error &&
      error.name === "ZodError"
    ) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: "errors" in error ? error.errors : [],
        },
        { status: 400 }
      );
    }

    console.error("Registration request error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const authPayload = getAuthPayload(req);

    if (authPayload?.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");

    const query: Record<string, unknown> = {};

    if (status && ["pending", "approved", "rejected"].includes(status)) {
      query.status = status;
    }

    const requests = await RegistrationRequest.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    const total = await RegistrationRequest.countDocuments(query);

    return NextResponse.json({
      requests,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Fetch requests error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
