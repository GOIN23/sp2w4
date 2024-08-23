import { repositoryUsers } from "./../repository/repostiryUsers";
import { ObjectId } from "mongodb";
import { UserInputModel, UserViewModel2, userDb } from "../types/typeUser";
import bcrypt from "bcrypt";
import { randomUUID } from "crypto";
import { add } from "date-fns";
import { emailAdapter } from "../adapter/emailAdapter";
import { repositryAuth } from "../repository/repositryAuth";
import { CustomRateLimitT } from "../types/generalType";

export const authService = {
  async creatUser(userData: UserInputModel): Promise<UserViewModel2> {
    const passwordSalt = await bcrypt.genSalt(10);
    const passwordHash = await this._generatHash(userData.password, passwordSalt);

    const newUser: userDb = {
      _id: String(new ObjectId()),
      login: userData.login,
      passwordHash,
      passwordSalt,
      email: userData.email,
      createdAt: new Date().toISOString(),
      emailConfirmation: {
        // доп поля необходимые для подтверждения
        confirmationCode: randomUUID(),
        expirationDate: add(new Date(), {
          hours: 1,
          minutes: 30,
        }),
        isConfirmed: false,
      },
    };
    await repositoryUsers.createUsers(newUser);

    try {
      await emailAdapter.sendEmail(newUser.emailConfirmation.confirmationCode, newUser.email);
    } catch (error) {
      console.log(error);
    }

    return {
      id: newUser._id,
      createdAt: newUser.createdAt,
      email: newUser.email,
      login: newUser.login,
    };
  },
  async confirmEmail(code: string) {
    const user = await repositoryUsers.findUserByConfirEmail(code);

    if (!user) {
      return null;
    }
    if (user.emailConfirmation.confirmationCode === code && user.emailConfirmation.expirationDate > new Date()) {
      const result = await repositoryUsers.updateConfirmation(user._id);

      return result;
    }

    return null;
  },
  async resendingCode(email: string) {
    const user = await repositoryUsers.findBlogOrEmail(email);

    if (!user) {
      return null;
    }

    if (user.emailConfirmation.isConfirmed) {
      return null;
    }
    const newCode = randomUUID();
    const updateUser = await repositoryUsers.updateCodeUserByConfirEmail(user?._id, newCode);

    try {
      await emailAdapter.sendEmail(newCode, email);
    } catch (error) {
      console.log(error);
    }
    return true;
  },
  async _generatHash(password: string, salt: string) {
    const hash = await bcrypt.hash(password, salt);

    return hash;
  },
  async findBlogOrEmail(emailOrLogin: string) {
    const checkEmailorLogin = await repositoryUsers.findBlogOrEmail(emailOrLogin);

    if (checkEmailorLogin) {
      return null;
    }

    return true;
  },
  async addRateLlimit(metaData: CustomRateLimitT) {
    await repositryAuth.addRateLlimit(metaData);
  },
  async checkingNumberRequests(metaData: CustomRateLimitT) {
    const data = new Date(metaData.date.getTime() - 10000);
    const result = await repositryAuth.checkingNumberRequests(metaData, data);
    return result;
  },
};
