import { port } from "./config/app";
import { host } from "./config/database";
import { AppDataSource } from "./data-source";
import * as express from "express";
import { Logs } from "./entity/Logs";
import { Humidity } from "./entity/humidity";
import * as line from "@line/bot-sdk";
import { sendLineMessage } from "./libs/lineMessagine";

export const lineClient = new line.messagingApi.MessagingApiClient({
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
});
line.middleware({
  channelSecret: process.env.CHANNEL_SECRET,
});

const sensor = [0, 0, 0, 0];

const app = express();
const is = app.use(express.json());

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
  sensor[sensor_no] = water_level;
  const logs = new Logs();
  logs.sensor_no = sensor_no;
  logs.water_level = water_level;
  AppDataSource.getRepository(Logs).save(logs);
  if (water_level < 10) {
    sendLineMessage(
      "Ufd79c6344c9a97376eb756961a7830af",
      `Sensor ${sensor_no} detected water at ${water_level} cm`
    );
  }
  return res.status(201).send("Data saved");
});

app.post("/humidity", (req, res) => {
  const { humidity } = req.body;
  const logs = new humidity();
  logs.sensor_no = "humidity";
  logs.water_level = humidity;
  if (humidity > 80) {
    sendLineMessage(
      "Ufd79c6344c9a97376eb756961a7830af",
      `Humidity detected ${humidity}`
    );
  }
  return res.status(201).send("Data saved");
});
