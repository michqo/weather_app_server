import express, { Request, Response, Express } from "express";
import "dotenv/config";
import { Temp } from "./types";
import Db from "./db";

let db = new Db();

const app: Express = express();
app.use(express.json());

app.post("/add_temp", async (req: Request, res: Response) => {
	const temp = req.body as Temp;

	db.addTemp(temp);

	res.send("{}");
});

app.get("/temps/:n", async (req: Request, res: Response) => {
	let n = Number(req.params.n);
	if (!isNaN(n)) {
		res.send(await db.getTemps(n));
	} else {
		res.send("{}")
	}

});

app.get("/last_temp", async (_req: Request, res: Response) => {
	res.send(await db.lastTemp());
});

app.listen(3030, () => {
	console.log("started");
});
