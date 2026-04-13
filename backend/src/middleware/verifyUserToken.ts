import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import "dotenv/config";
import { Types } from "mongoose";

interface JwtPayload {
  id: string;
  email: string;
  role: "buyer" | "admin";
}

const verifyUserToken = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    res.status(401).json({ message: "No token provided" });
    return;
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_USERTOKEN as string
    ) as JwtPayload;


    req.user = {
       id: new Types.ObjectId(decoded.id),
      email: decoded.email,
      role: decoded.role,
    };

    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid or expired token" });
  }
};

export default verifyUserToken;