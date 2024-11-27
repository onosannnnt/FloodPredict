import { port } from "./config/app";
import { host } from "./config/database";
import { AppDataSource } from "./data-source";
import * as express from "express";
import { Logs } from "./entity/Logs";
import * as line from "@line/bot-sdk";
import { sendLineMessage } from "./libs/lineMessagine";

export const lineClient = new line.messagingApi.MessagingApiClient({
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
});
line.middleware({
  channelSecret: process.env.CHANNEL_SECRET,
});

const app = express();
app.use(express.json());

AppDataSource.initialize()
  .then(async () => {
    app.listen(port, () => {
      console.log(`Server running at http://${host}:${port}`);
    });
  })
  .catch((error) => console.log(error));

app.get("/", (req: express.Request, res: express.Response) => {
  res.send("Hello World!");
});

app.post("/", (req, res) => {
  const { water_level, sensor_no } = req.body;
  const logs = new Logs();
  logs.sensor_no = sensor_no;
  logs.water_level = water_level;
  AppDataSource.getRepository(Logs).save(logs);
  if (water_level < 10) {
    sendLineMessage(
      "Ufd79c6344c9a97376eb756961a7830af",
      `Sensor ${sensor_no} detected water level ${water_level}`
    );
  }
  return res.status(201).send("Data saved");
});
