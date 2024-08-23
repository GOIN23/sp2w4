import jwt from "jsonwebtoken";
import express, { Request, Response } from "express";
import { authTokenMiddleware } from "../auth/authTokenMiddleware";
import { sesionsService } from "./application/sesionsService";
import { authRefreshTokenMiddleware } from "../auth/authRefreshTokenMiddleware";
import { countreQureyValidation } from "../validation/countreQureyValidation";
import { SETTINGS } from "../seting/seting";
import { repositryAuth } from "../repository/repositryAuth";

export const routerSecurity = () => {
  const router = express.Router();

  router.get("/devices", authRefreshTokenMiddleware, async (req: Request, res: Response) => {
    const refreshToken = req.cookies.refreshToken;

    const sesions = await sesionsService.getSesions(refreshToken);

    res.status(200).send(sesions);
  });

  router.delete("/devices", authRefreshTokenMiddleware, async (req: Request, res: Response) => {
    const refreshToken = req.cookies.refreshToken;

    await sesionsService.deleteSesions(refreshToken);

    res.sendStatus(204);
  });

  router.delete("/devices/:id", authRefreshTokenMiddleware, async (req: Request, res: Response) => {
    const refreshToken = req.cookies.refreshToken;

    if (!req.params.id) {
      res.sendStatus(404);
      return;
    }
    const sesionDevice = await repositryAuth.getSesionsId(req.params.id);

    if (!sesionDevice) {
      res.sendStatus(404);

      return;
    }
    const sesions = await sesionsService.getSesions(refreshToken);
    const resulDevaId = sesions?.find((s) => s.deviceId === req.params.id);

    if (!resulDevaId) {
      res.sendStatus(403);

      return;
    }

    await sesionsService.deleteSesionsId(req.params.id);

    res.sendStatus(204);
  });

  return router;
};
