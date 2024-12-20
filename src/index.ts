import { port } from "./config/app";
import { host } from "./config/database";
import { AppDataSource } from "./data-source";
import * as express from "express";
import { Logs } from "./entity/Logs";
import { Humidity } from "./entity/humidity";
import * as line from "@line/bot-sdk";
import { sendLineMessage } from "./libs/lineMessagine";
import * as WebSocket from "ws";

export const lineClient = new line.messagingApi.MessagingApiClient({
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
});
line.middleware({
  channelSecret: process.env.CHANNEL_SECRET,
});

let sensor_value = [0, 0, 0, 0];
let humidity_value = [0, 0];

const app = express();
const server = new WebSocket.Server({ port: 8080 });
app.use(express.json());

server.on("connection", (websocket) => {
  websocket.send(JSON.stringify(sensor_value));
  websocket.on("message", (message) => {
    console.log(`Received message: ${message}`);
    server.clients.forEach((client) => {
      if (client !== websocket && client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
    websocket.send(JSON.stringify(sensor_value));
  });

  websocket.on("close", () => {
    console.log("Client disconnected");
  });
});

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
  sensor_value[sensor_no] = water_level;
  const logs = new Logs();
  logs.sensor_no = sensor_no;
  logs.water_level = water_level;
  AppDataSource.getRepository(Logs).save(logs);
  if (water_level <= 0) {
    return;
  } else if (water_level <= 5) {
    sendLineMessage(
      "Ufd79c6344c9a97376eb756961a7830af",
      `📢 แจ้งเตือนภัยน้ำท่วมขั้นวิกฤติ! 🚨\nระดับน้ำ: ${
        20 - parseInt(water_level)
      } เซนติเมตร\nความชื้น : ${humidity_value[0]} %\nอุณภูมิ : ${
        humidity_value[1]
      } เซลเซียส`
    );
  } else if (water_level < 7) {
    sendLineMessage(
      "Ufd79c6344c9a97376eb756961a7830af",
      `📢 แจ้งเตือนภัยน้ำท่วม: โปรดระมัดระวัง ⚠️🌊\nระดับน้ำ: ${
        20 - parseInt(water_level)
      } เซนติเมตร\nความชื้น : ${humidity_value[0]} %\nอุณภูมิ : ${
        humidity_value[1]
      } เซลเซียส`
    );
  }
  return res.status(201).send("Data saved");
});

app.post("/humidity", (req, res) => {
  const { humidity, temperature } = req.body;
  humidity_value[0] = humidity;
  humidity_value[1] = temperature;
  const logs = new Humidity();
  logs.humidity = humidity;
  logs.temperature = temperature;
  AppDataSource.getRepository(Humidity).save(logs);
  if (humidity > 80) {
    sendLineMessage(
      "Ufd79c6344c9a97376eb756961a7830af",
      `
      📢 แจ้งเตือนฝนตก: โปรดเก็บผ้าด้วย 🌧️`
    );
  }
  return res.status(201).send("Data saved");
});
