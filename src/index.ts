import express, { Request, Response, Express } from "express";
import * as mongoDB from "mongodb";
import "dotenv/config";
import { Temp } from "./temp";

let client = new mongoDB.MongoClient(process.env.MONGODB_URI!);
client.connect();
const db = client.db("weather-app");
const tempsColl = db.collection(process.env.MONGODB_NAME!);
//const lastTempColl = db.collection("last_temp");

const app: Express = express();
app.use(express.json());

app.post("/add_temp", (req: Request, res: Response) => {
	const temp = req.body as Temp;

	tempsColl.insertOne(temp);
	// {} to update all (1 temp)
	//lastTempColl.replaceOne({}, temp);

	res.send(temp.averageTemp);
});

app.listen(3030, () => {
	console.log("started");
});
