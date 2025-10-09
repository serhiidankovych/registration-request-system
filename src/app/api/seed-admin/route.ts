import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { User } from "@/models/User";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const secret = searchParams.get("secret");
  const { ADMIN_SEED_SECRET, ADMIN_EMAIL, ADMIN_PASSWORD } = process.env;

  if (!ADMIN_SEED_SECRET || secret !== ADMIN_SEED_SECRET) {
    return NextResponse.json(
      {
        error: "Forbidden: You do not have permission to perform this action.",
      },
      { status: 403 }
    );
  }

  if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
    return NextResponse.json(
      {
        error:
          "Server configuration error: Admin email or password is not set in environment variables.",
      },
      { status: 500 }
    );
  }

  try {
    await connectDB();
    const existingAdmin = await User.findOne({ email: ADMIN_EMAIL });

    if (existingAdmin) {
      return NextResponse.json(
        {
          message: `Admin user with email '${ADMIN_EMAIL}' already exists. No action was taken.`,
        },
        { status: 200 }
      );
    }

    const adminUser = new User({
      name: "Default Admin",
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
      role: "admin",
      isActive: true,
      emailVerified: true,
    });

    await adminUser.save();

    return NextResponse.json(
      {
        success: true,
        message: `Admin user '${ADMIN_EMAIL}' created successfully. You can now log in.`,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Admin seeding error:", error);
    return NextResponse.json(
      {
        error: "An internal server error occurred during the seeding process.",
      },
      { status: 500 }
    );
  }
}
