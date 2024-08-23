import jwt from "jsonwebtoken";
import { ObjectId } from "mongodb";
import { repositryAuth } from "../../repository/repositryAuth";
import { DeviceViewModel, userSessionT } from "../../types/generalType";
import { SETTINGS } from "../../seting/seting";

export const sesionsService = {
  async creatSesion(userSession: DeviceViewModel) {
    await repositryAuth.addSesionUser(userSession);
  },
  async updateSesion(iat: string, userId: string, diveceId: string) {
    await repositryAuth.updateSesionUser(iat, userId, diveceId);
  },
  async getSesions(token: string) {
    try {
      const result: any = jwt.verify(token, SETTINGS.JWT_SECRET);
      const sesions = await repositryAuth.getSesions(result.userId);

      return sesions;
    } catch (error) {
      return null;
    }
  },
  async completelyRemoveSesion(token: string) {
    try {
      const result: any = jwt.verify(token, SETTINGS.JWT_SECRET);
      const sesions = await repositryAuth.completelyRemoveSesion(result.deviceId,result.userId);

      return sesions;
    } catch (error) {
      return null;
    }
  },
  async deleteSesions(token: string) {
    try {
      const result: any = jwt.verify(token, SETTINGS.JWT_SECRET);
      const sesions = await repositryAuth.deleteSesions(result.deviceId);

      return sesions;
    } catch (error) {
      return null;
    }
  },
  async deleteSesionsId(deviceId: string) {
   
    await repositryAuth.deleteSesionsId(deviceId);

    return true;
  },
};
