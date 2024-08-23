import { ObjectId } from "mongodb";
import { SETTINGS } from "../../seting/seting";
import {  DeviceViewModel, LoginSuccessViewModel, userSessionT } from "../../types/generalType";
import { UserViewModelConfidential } from "../../types/typeUser";
import jwt from "jsonwebtoken";
import { repositryAuth } from "../../repository/repositryAuth";
import { sesionsService } from "./sesionsService";

export const jwtService = {
  async createJwt(id: string, ip: string | undefined, title: string | undefined): Promise<LoginSuccessViewModel> {
    const deviceId = String(new ObjectId());
    const accessToken = jwt.sign({ userId: id }, SETTINGS.JWT_SECRET, { expiresIn: "10s" });
    const refreshToken = await this.createRefreshToken(id, deviceId);
    const result: any = jwt.verify(refreshToken, SETTINGS.JWT_SECRET);

    const userSession: DeviceViewModel = {
      userId: id,
      deviceId: deviceId,
      lastActiveDate: result.iat,
      ip: ip,
      title: title,
    };
    await sesionsService.creatSesion(userSession);

    return {
      accessToken: accessToken,
      refreshToken: refreshToken,
    };
  },
  async getUserIdByToken(token: string) {
    try {
      const result: any = jwt.verify(token, SETTINGS.JWT_SECRET);
      // const checkSesionshToken = await repositryAuth.findRottenSessions(result.userId, result.deviceId);
      // if (!checkSesionshToken) {
      //   return null;
      // }
      // if (result.iat < checkSesionshToken!.lastActiveDate) {
      //   return null;
      // }

      return new ObjectId(result.userId);
    } catch (error) {
      return null;
    }
  },
  async createRefreshToken(id: string, deviceId: string): Promise<string> {
    const refreshToken = jwt.sign({ userId: id, deviceId: deviceId }, SETTINGS.JWT_SECRET, { expiresIn: "1m" });
    return refreshToken;
  },
  async updateToken(token: string, ip: string | undefined, title: string | undefined): Promise<LoginSuccessViewModel | null> {
    try {
      const result: any = jwt.verify(token, SETTINGS.JWT_SECRET);

      const accessToken = jwt.sign({ userId: result.userId }, SETTINGS.JWT_SECRET, { expiresIn: "10s" });
      const refreshToken = await this.createRefreshToken(result.userId, result.deviceId);

      const metaData: any = jwt.verify(refreshToken, SETTINGS.JWT_SECRET);

      await sesionsService.updateSesion(metaData.iat, metaData.userId, metaData.deviceId);

      return {
        accessToken,
        refreshToken,
      };
    } catch (error) {
      return null;
    }
  },
  async addRefreshTokenBlacKlist(token: string) {
    await repositryAuth.postRefreshTokenBlacKlist(token);
  },
  async checkRefreshToken(refreshToken: string) {
    try {
      const result: any = jwt.verify(refreshToken, SETTINGS.JWT_SECRET);
      const checkSesionshToken = await repositryAuth.findRottenSessions(result.userId, result.deviceId);
      if (!checkSesionshToken) {
        return null;
      }
      if (result.iat < checkSesionshToken!.lastActiveDate) {
        return null;
      }

      return result.userId;
    } catch (error) {
      return null;
    }
  },
};
