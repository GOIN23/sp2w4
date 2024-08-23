import { app } from "./app";
import { SETTINGS } from "./seting/seting";
import { dbT } from "./db/mongo-.db";
import dotenv from "dotenv";

dotenv.config();

const startApi = async () => {
  await dbT.run(SETTINGS.MONGO_URL);
  app.set('trust proxy', true)

  app.listen(SETTINGS.PORT, () => {
    console.log(`server   start`);
  });
};
startApi();
