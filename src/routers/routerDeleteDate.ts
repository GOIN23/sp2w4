import express, { Request, Response } from "express";
import { dbT } from "../db/mongo-.db";

export const routerDeletDate = () => {
  const router = express.Router();

  router.delete("/", (req: Request, res: Response) => {
    dbT.getCollections().blogCollection.deleteMany({});
    dbT.getCollections().postCollection.deleteMany({});
    dbT.getCollections().userCollection.deleteMany({});
    dbT.getCollections().commentCollection.deleteMany({});
    dbT.getCollections().refreshTokenBlackList.deleteMany({});
    dbT.getCollections().sesionsUser.deleteMany({});
    dbT.getCollections().customRateLimit.deleteMany({});




    res.sendStatus(204);
    return;
  });

  return router;
};
