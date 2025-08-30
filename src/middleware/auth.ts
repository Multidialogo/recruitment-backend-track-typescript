import jwt, { JwtPayload } from "jsonwebtoken";
import type { Request, Response, NextFunction } from "express";

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret";

export type AppRole = "USER" | "ADMIN";

export interface JwtUser extends JwtPayload {
  id: string;
  email: string;
  role: AppRole;
}

export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  const auth = req.header("Authorization") || "";
  const hasBearer = auth.startsWith("Bearer ");
  const token = hasBearer ? auth.slice(7).trim() : "";

  if (!token) {
    return res
      .status(401)
      .type("application/problem+json")
      .json({ message: "Unauthorized", status: 401, detail: "Token mancante" });
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET) as JwtUser;
    (req as any).user = payload;
    return next();
  } catch (err: any) {
    return res
      .status(401)
      .type("application/problem+json")
      .json({
        message: "Invalid token",
        status: 401,
        detail: err?.message || "Token non valido",
      });
  }
};

export const requireRole = (role: AppRole) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user as JwtUser | undefined;
    if (!user) {
      return res
        .status(401)
        .type("application/problem+json")
        .json({ message: "Unauthorized", status: 401, detail: "Need authentication" });
    }
    if (user.role !== role) {
      return res
        .status(403)
        .type("application/problem+json")
        .json({ message: "Forbidden", status: 403, detail: "Insufficient role" });
    }
    next();
  };
};
