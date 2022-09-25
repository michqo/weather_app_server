import express, { Request, Response, Express } from "express";
import { LastTemp, Temp } from "@prisma/client";
import cors from "cors";
import Db from "./db";

const db = new Db();

db.connect();

const app: Express = express();
app.use(cors());
app.use(express.json());

app.post("/add_temp", async (req: Request, res: Response) => {
  const temp = req.body as Temp;

  db.addTemp(temp);

  res.send("{}");
});

app.post("/add_last_temp", async (req: Request, res: Response) => {
  const temp = req.body as LastTemp;

  db.addLastTemp(temp);

  res.send("{}");
});

app.delete("/delete_temps/:m/:d", async (req: Request, res: Response) => {
  let m = Number(req.params.m);
  let d = Number(req.params.d);
  if (!isNaN(m) && !isNaN(d)) {
    await db.deleteTemps(m, d);
  }
  res.send("{}");
});

app.get("/temps/:m/:d", async (req: Request, res: Response) => {
  let m = Number(req.params.m);
  let d = Number(req.params.d);
  if (!isNaN(m) && !isNaN(d)) {
    res.send(await db.getTemps(m, d));
  } else {
    res.send("[]");
  }
});

app.get("/last_days/:d", async (req: Request, res: Response) => {
  let d = Number(req.params.d);
  if (!isNaN(d)) {
    // Because of not using normal timestamps
    if (d == 0 || d > 29) {
      res.send("[]");
    } else {
      res.send(await db.lastDays(d));
    }
  } else {
    res.send("[]");
  }
});

app.get("/last_temp", async (_req: Request, res: Response) => {
  res.send((await db.lastTemp()) ?? "{}");
});

app.get("/average/:m/:d", async (req: Request, res: Response) => {
  let m = Number(req.params.m);
  let d = Number(req.params.d);
  if (!isNaN(m) && !isNaN(d)) {
    res.send({ average: (await db.average(m, d)) ?? NaN });
  } else {
    res.send("{}");
  }
});

const server = app.listen(8000, () => {
  console.log("started");
});

export { app, server, db };
