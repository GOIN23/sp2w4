import { NextFunction, Request, Response } from "express";
import { jwtService } from "../routers/application/jwtService";
import { usersService } from "../services/users-service";

export const authRefreshTokenMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    res.sendStatus(401);
    return;
  }
  const checkRefreshToken = await jwtService.checkRefreshToken(refreshToken);

  if (!checkRefreshToken) {
    res.sendStatus(401);

    return;
  }

  next();
};
