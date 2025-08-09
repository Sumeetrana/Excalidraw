import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config";

declare global {
  namespace Express {
    interface Request {
      userId: string;
    }
  }
}

export const auth = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers["authorization"] ?? "";

  const decodedData = jwt.verify(token, JWT_SECRET) as any;

  if (decodedData) {
    req.userId = decodedData.userId;
    next();
  } else {
    res.status(403).json({
      message: "Incorrect credentials!",
    });
  }
};
