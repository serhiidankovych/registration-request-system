import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { User } from "@/models/User";
import { signJwt } from "@/lib/jwt";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();

    const validation = loginSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: "Validation failed", details: validation.error },
        { status: 400 }
      );
    }

    const { email, password } = validation.data;

    const user = await User.findOne({ email });

    if (!user || !(await user.comparePassword(password))) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    if (!user.isActive) {
      return NextResponse.json(
        { error: "Your account is inactive. Please contact support." },
        { status: 403 }
      );
    }

    const token = signJwt({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    });

    return NextResponse.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
