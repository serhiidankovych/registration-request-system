import jwt, { JwtPayload, SignOptions } from "jsonwebtoken";

export function signJwt(payload: JwtPayload) {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET is not defined in environment variables");
  }
  const options: SignOptions = {
    expiresIn: "1d",
  };

  const token = jwt.sign(payload, secret, options);
  return token;
}

export function verifyJwt(token: string) {
  try {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error("JWT_SECRET is not defined in environment variables");
    }
    const decoded = jwt.verify(token, secret);
    return decoded as JwtPayload;
  } catch (error) {
    console.error("JWT Verification Error:", error);
    return null;
  }
}
