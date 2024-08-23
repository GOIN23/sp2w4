import { DeviceViewModel } from "./../types/generalType";
import { dbT } from "../db/mongo-.db";
import { CustomRateLimitT, userSessionT } from "../types/generalType";

export const repositryAuth = {
  async postRefreshTokenBlacKlist(token: string) {
    await dbT.getCollections().refreshTokenBlackList.insertOne({ refreshToken: token });
  },
  async addRateLlimit(metaData: CustomRateLimitT) {
    await dbT.getCollections().customRateLimit.insertOne(metaData);
  },
  async getRefreshTokenBlacKlist(token: string): Promise<string | null> {
    const oldToken = await dbT.getCollections().refreshTokenBlackList.findOne({ refreshToken: token });

    if (oldToken) {
      return oldToken.refreshToken;
    } else {
      return null;
    }
  },
  async checkingNumberRequests(body: CustomRateLimitT, data: Date) {
    const filter = {
      IP: body.IP,
      URL: body.URL,
      date: { $gte: data }, // Текущая дата - 10 секунд
    };

    const result = await dbT.getCollections().customRateLimit.countDocuments(filter);
    return result;
  },
  async addSesionUser(userSession: DeviceViewModel) {
    await dbT.getCollections().sesionsUser.insertOne(userSession);
  },
  async updateSesionUser(iat: string, userId: string, diveceId: string) {
    await dbT.getCollections().sesionsUser.updateOne({ userId: userId, deviceId: diveceId }, { $set: { lastActiveDate: iat } });
  },
  async findRottenSessions(userId: string, deviceId: string) {
    const userSesion = await dbT.getCollections().sesionsUser.findOne({
      userId: userId,
      deviceId: deviceId,
    });

    return userSesion;
  },
  async getSesions(userId: string) {
    const sesionsDivece = await dbT.getCollections().sesionsUser.find({ userId: userId }).toArray();
    const mapDateSesio = sesionsDivece.map((d) => {
      return {
        deviceId: d.deviceId,
        ip: d.ip,
        lastActiveDate: new Date(+d.lastActiveDate * 1000),
        title: d.title,
      };
    });
    return mapDateSesio;
  },
  async getSesionsId(deviceId: string) {
    const sesionsDivece = await dbT.getCollections().sesionsUser.findOne({ deviceId: deviceId });
    return sesionsDivece;
  },
  async deleteSesions(deviceId: string) {
    await dbT.getCollections().sesionsUser.deleteMany({ deviceId: { $ne: deviceId } });
  },
  async deleteSesionsId(deviceId: string) {
    await dbT.getCollections().sesionsUser.deleteOne({ deviceId: deviceId });
  },
  async completelyRemoveSesion(deviceId: string, userId: string) {
    await dbT.getCollections().sesionsUser.deleteOne({ deviceId: deviceId, userId: userId });
  },
};
