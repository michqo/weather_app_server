import express, { Request, Response, Express } from "express";
import * as mongoDB from "mongodb";
import "dotenv/config";
import { Temp } from "./temp";

let client = new mongoDB.MongoClient(process.env.MONGODB_URI!);
client.connect();
const db = client.db("weather-app");
const tempsColl = db.collection<Temp>(process.env.MONGODB_NAME!);
const lastTempColl = db.collection<Temp>("last_temp");

const app: Express = express();
app.use(express.json());

app.post("/add_temp", async (req: Request, res: Response) => {
	const temp = req.body as Temp;

	tempsColl.insertOne(temp);
	const lastTempDoc = (await lastTempColl.findOne({})) as Temp;
	temp._id = lastTempDoc._id;
	// {} to update all (1 temp)
	lastTempColl.replaceOne({}, temp);

	res.send(temp.averageTemp);
});

app.get("/temps/:n", async (req: Request, res: Response) => {
	let n = Number(req.params.n);
	if (!isNaN(n)) {
		const temp = (await tempsColl.find({d: n}).toArray()) as Temp[];
		res.send(temp);
	} else {
		res.send("{}")
	}

});

app.get("/last_temp", async (_req: Request, res: Response) => {
	const lastTemp = (await lastTempColl.findOne({})) as Temp;
	res.send(lastTemp);
});

app.listen(3030, () => {
	console.log("started");
});
