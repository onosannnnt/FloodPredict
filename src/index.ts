import { port } from "./config/app";
import { host } from "./config/database";
import { AppDataSource } from "./data-source";
import * as express from "express";
import { Logs } from "./entity/Logs";

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
  return res.status(201).send("Data saved");
});
