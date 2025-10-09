import { NextRequest } from "next/server";
import { verifyJwt } from "./jwt";

interface AuthPayload {
  id: string;
  role: string;
}

export function getAuthPayload(req: NextRequest): AuthPayload | null {
  const authHeader = req.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null;
  }
  const token = authHeader.substring(7);
  const payload = verifyJwt(token);

  if (!payload) {
    return null;
  }

  return {
    id: payload.id,
    role: payload.role,
  };
}

export function isAdminAuthenticated(req: NextRequest): boolean {
  const payload = getAuthPayload(req);
  return payload?.role === "admin";
}
