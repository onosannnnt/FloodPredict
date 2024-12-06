import * as dotenv from "dotenv";

dotenv.config();

export const port = Number(process.env.PORT) || 3000;
