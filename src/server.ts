import express, { Request, Response, Express } from "express";
import "dotenv/config";
import cors from "cors";
import { Temp } from "./types";
import Db from "./db";

let db = new Db();

const app: Express = express();
app.use(express.json());
app.use(cors());

app.post("/add_temp", async (req: Request, res: Response) => {
	const temp = req.body as Temp;

	db.addTemp(temp);

	res.send("{}");
});

app.get("/temps/:m/:d", async (req: Request, res: Response) => {
	let m = Number(req.params.m);
	let d = Number(req.params.d);
	if (!isNaN(m) && !isNaN(d)) {
		res.send(await db.getTemps(m, d));
	} else {
		res.send("[]")
	}

});

app.get("/last_days/:d", async (req: Request, res: Response) => {
	let d = Number(req.params.d);
	if (!isNaN(d)) {
		res.send(await db.lastDays(d));
	} else {
		res.send("[]")
	}

});

app.get("/last_temp", async (_req: Request, res: Response) => {
	res.send(await db.lastTemp());
});

app.listen(8080, () => {
	console.log("started");
});
