import { Request, Response, NextFunction } from "express";
import * as jwt from "jsonwebtoken";

interface TokenPayload {
  email: string;
  role: string;
}

export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided" });
  }

  // Handle potential duplicated Bearer prefix or extra spaces
  const token = authHeader
    .split(/\s+/)
    .filter((part) => part.toLowerCase() !== "bearer")
    .join("");

  try {
    const secret = process.env.JWT_SECRET || "fallback_secret";
    console.debug(
      `[AuthMiddleware] Verifying token. Extracted length: ${
        token.length
      }, Starts with: ${token.substring(0, 10)}...`
    );
    console.debug(
      `[AuthMiddleware] Secret used: ${
        secret === "fallback_secret" ? "FALLBACK" : "ENV_SECRET"
      }, Length: ${secret.length}`
    );

    const decoded = jwt.verify(token, secret) as TokenPayload;
    (req as any).user = decoded;
    next();
  } catch (error) {
    console.error(
      `[AuthMiddleware] JWT Verification failed: ${(error as Error).message}`
    );
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

export const authorize = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user;
    if (!user || !roles.includes(user.role)) {
      return res.status(403).json({ message: "Unauthorized" });
    }
    next();
  };
};
