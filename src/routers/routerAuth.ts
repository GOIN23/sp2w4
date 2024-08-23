import { countreQureyValidation } from "../validation/countreQureyValidation";
import express, { Request, Response } from "express";
import { usersService } from "../services/users-service";
import { SETTINGS } from "../seting/seting";
import { validaEmail, validaLoginPasswordEmail, validaPassword, validaloginOrEmail } from "../validation/validationUsers";
import { jwtService } from "./application/jwtService";
import { authTokenMiddleware } from "../auth/authTokenMiddleware";
import { validaError } from "../validation/generalvValidation";
import { authService } from "../services/auth-service";
import { validabAuthdCodeCustm, validabAuthdEmailCustm, validabAuthdLoginCustm, validabAuthdresendingCodeCustm } from "../validation/validatAuth";
import { errorValid } from "../utilt/errors";
import {  DeviceViewModel } from "../types/generalType";
import { ObjectId } from "mongodb";
import { authRefreshTokenMiddleware } from "../auth/authRefreshTokenMiddleware";
import { sesionsService } from "./application/sesionsService";

export const routerAuth = () => {
  const router = express.Router();

  router.post("/login", countreQureyValidation, validaloginOrEmail, validaPassword, validaError, async (req: Request, res: Response) => {
    const user = await usersService.checkCreadentlais(req.body.loginOrEmail, req.body.password);
    if (!user) {
      res.sendStatus(SETTINGS.HTTPCOD.HTTPCOD_401);
      return;
    }
    const userAgent = req.headers["user-agent"];

    const { accessToken, refreshToken } = await jwtService.createJwt(user._id, req.ip, userAgent);

    res.cookie("refreshToken", refreshToken, { httpOnly: true, secure: true });

    res.status(SETTINGS.HTTPCOD.HTTPCOD_200).send({ accessToken: accessToken });
  });

  router.post("/logout", authRefreshTokenMiddleware, async (req: Request, res: Response) => {
    const refreshToken = req.cookies.refreshToken;

    await sesionsService.completelyRemoveSesion(refreshToken)
    res.sendStatus(SETTINGS.HTTPCOD.HTTPCOD_204);
  });

  router.post(
    "/registration",
    countreQureyValidation,
    validaLoginPasswordEmail,
    validabAuthdLoginCustm,
    validabAuthdEmailCustm,
    validaError,
    async (req: Request, res: Response) => {
   
      await authService.creatUser(req.body);

      res.status(204).send("Input data is accepted. Email with confirmation code will be send to passed email address");
    }
  );

  router.post("/registration-confirmation", countreQureyValidation, validabAuthdCodeCustm, validaError, async (req: Request, res: Response) => {

    res.sendStatus(204);
  });

  router.post(
    "/registration-email-resending",
    countreQureyValidation,
    validaEmail,
    validabAuthdresendingCodeCustm,
    validaError,
    async (req: Request, res: Response) => {
      res.sendStatus(204);
      return;
    }
  );

  router.get("/me", authTokenMiddleware, async (req: Request, res: Response) => {
    // @ts-ignore
    const user = await usersService.findUsers(req.userId);
    res.status(200).send({ email: user?.email, login: user?.login, userId: req.userId });
  });

  router.post("/refresh-token", authRefreshTokenMiddleware, async (req: Request, res: Response) => {
    const refreshToken = req.cookies.refreshToken;
    const userAgent = req.headers["user-agent"];

    const JWT = await jwtService.updateToken(refreshToken, req.ip, userAgent);

    if (!JWT) {
      res.sendStatus(SETTINGS.HTTPCOD.HTTPCOD_401);
      return;
    }
    res.cookie("refreshToken", JWT.refreshToken, { httpOnly: true, secure: true });

    res.status(SETTINGS.HTTPCOD.HTTPCOD_200).send({ accessToken: JWT.accessToken });
  });

  return router;
};
