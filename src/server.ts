import express, { Request, Response, Express } from "express";
import cors from "cors";
import rateLimit from "express-rate-limit";
import Db from "./db";
import validate from "./validate";
import { tempSchema, tempsSchema } from "./schemas";

const db = new Db();
db.connect();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

const app: Express = express();
app.use(cors());
app.use(limiter);
app.use(express.json());

app.post(
  "/add_temp",
  validate(tempSchema),
  async (req: Request, res: Response) => {
    db.addTemp(req.body);

    res.json("{}");
  }
);

app.post(
  "/add_temps",
  validate(tempsSchema),
  async (req: Request, res: Response) => {
    db.addTemps(req.body);

    res.json("{}");
  }
);

app.post(
  "/add_last_temp",
  validate(tempsSchema),
  async (req: Request, res: Response) => {
    db.addLastTemp(req.body);

    res.json("{}");
  }
);

app.delete("/delete_temps/:m/:d", async (req: Request, res: Response) => {
  let m = Number(req.params.m);
  let d = Number(req.params.d);
  if (!isNaN(m) && !isNaN(d)) {
    await db.deleteTemps(m, d);
  }
  res.json("{}");
});

app.get("/temps/:m/:d", async (req: Request, res: Response) => {
  let m = Number(req.params.m);
  let d = Number(req.params.d);
  if (!isNaN(m) && !isNaN(d)) {
    res.json(await db.getTemps(m, d));
  } else {
    res.json("[]");
  }
});

app.get("/last_days/:d", async (req: Request, res: Response) => {
  let d = Number(req.params.d);
  if (!isNaN(d)) {
    // Because of not using normal timestamps
    if (d == 0 || d > 29) {
      res.json("[]");
    } else {
      res.json(await db.lastDays(d));
    }
  } else {
    res.json("[]");
  }
});

app.get("/last_temp", async (_req: Request, res: Response) => {
  res.json((await db.lastTemp()) ?? "{}");
});

app.get("/average/:m/:d", async (req: Request, res: Response) => {
  let m = Number(req.params.m);
  let d = Number(req.params.d);
  if (!isNaN(m) && !isNaN(d)) {
    res.json({ average: (await db.average(m, d)) ?? NaN });
  } else {
    res.json("{}");
  }
});

const server = app.listen(8000, () => {
  console.log("started");
});

export { app, server, db };
