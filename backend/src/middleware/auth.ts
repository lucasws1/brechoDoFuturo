import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt";
import { UserType } from "../../generated/prisma";

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    type: UserType;
  };
}

export const authenticate = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Authentication required" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = verifyToken(token);

    req.user = {
      id: decoded.id,
      email: decoded.email,
      type: decoded.type as UserType,
    };

    return next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

export const authorize = (...allowedTypes: UserType[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ message: "Authentication required" });
    }

    if (!allowedTypes.includes(req.user.type)) {
      return res.status(403).json({ message: "Not authorized" });
    }

    next();
    return;
  };
};
