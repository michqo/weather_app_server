import express, { Express } from "express";
import cors from "cors";
import rateLimit from "express-rate-limit";

import Db from "./db";
import router from "./routes";

const db = new Db();
db.connect();

const app: Express = express();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});
app.use(limiter);

app.use(cors());
app.use(express.json());

app.use("/", router);

const server = app.listen(8000, () => {
  console.log("started");
});

export { app, server, db };
