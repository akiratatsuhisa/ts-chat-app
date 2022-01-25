import { Request, Response, NextFunction } from "express";
import { UnauthorizedResponse } from "../helpers/constant";
import { verifyJwtToken } from "../services/auth.service";

export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  //init
  req.user = null;
  req.isAuthenticated = false;

  const { authorization } = req.headers;
  if (!authorization?.startsWith("Bearer ")) {
    return next();
  }

  const token: string = authorization.split(" ")[1];
  const user = verifyJwtToken(token);

  req.user = user;
  req.isAuthenticated = !!user;
  next();
};

export const authorize = (req: Request, res: Response, next: NextFunction) => {
  if (!req.isAuthenticated) return res.status(401).json(UnauthorizedResponse);
  next();
};
