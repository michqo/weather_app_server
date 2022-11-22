import express, { Request, Response, Router } from "express";

import { db } from "./server";
import { validate, secretAuth } from "./helper";
import { tempSchema, tempSchema2, tempsSchema, tempsSchema2 } from "./schemas";

const router: Router = express.Router();

router.post(
  "/add_temp/:secret",
  secretAuth(),
  validate(tempSchema),
  async (req: Request, res: Response) => {
    db.addTemp(req.body);

    res.json("{}");
  }
);

router.post(
  "/add_temp2/:secret",
  secretAuth(),
  validate(tempSchema2),
  async (req: Request, res: Response) => {
    db.addTemp2(req.body);

    res.json("{}");
  }
);

router.post(
  "/add_temps/:secret",
  secretAuth(),
  validate(tempsSchema),
  async (req: Request, res: Response) => {
    db.addTemps(req.body);

    res.json("{}");
  }
);

router.post(
  "/add_temps_2/:secret",
  secretAuth(),
  validate(tempsSchema2),
  async (req: Request, res: Response) => {
    db.addTemps2(req.body);

    res.json("{}");
  }
);

// TODO: Make add_last_temp_2 route
router.post(
  "/add_last_temp/:secret",
  secretAuth(),
  validate(tempSchema2),
  async (req: Request, res: Response) => {
    db.addLastTemp(req.body);

    res.json("{}");
  }
);

// Uses UTC time
router.delete(
  "/delete_temps/:m/:d/:secret",
  secretAuth(),
  async (req: Request, res: Response) => {
    let m = Number(req.params.m);
    let d = Number(req.params.d);
    if (!isNaN(m) && !isNaN(d)) {
      await db.deleteTemps(m, d);
    }
    res.json("{}");
  }
);
router.delete(
  "/delete_temp/:m/:d/:h/:secret",
  secretAuth(),
  async (req: Request, res: Response) => {
    let m = Number(req.params.m);
    let d = Number(req.params.d);
    let h = Number(req.params.h);
    if (!isNaN(m) && !isNaN(d) && !isNaN(h)) {
      await db.deleteTemp(m, d, h);
    }
    res.json("{}");
  }
);

router.get("/temps/:m/:d", async (req: Request, res: Response) => {
  let m = Number(req.params.m);
  let d = Number(req.params.d);
  if (!isNaN(m) && !isNaN(d)) {
    res.json(await db.getTemps(m, d));
  } else {
    res.json("[]");
  }
});

router.get("/last_days/:d", async (req: Request, res: Response) => {
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

router.get("/last_temp", async (_req: Request, res: Response) => {
  res.json((await db.lastTemp()) ?? "{}");
});

router.get("/average/:m/:d", async (req: Request, res: Response) => {
  let m = Number(req.params.m);
  let d = Number(req.params.d);
  if (!isNaN(m) && !isNaN(d)) {
    res.json({ average: (await db.average(m, d)) ?? NaN });
  } else {
    res.json("{}");
  }
});

export default router;
