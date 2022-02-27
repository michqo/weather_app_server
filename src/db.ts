import * as mongoDB from "mongodb";
import { Temp } from "./types";

class Db {
    private client: mongoDB.MongoClient;
    private temps: mongoDB.Collection<Temp>;
    private lastTempColl: mongoDB.Collection<Temp>;

    constructor() {
        this.client = new mongoDB.MongoClient(process.env.MONGODB_URI!);
        this.client.connect();
        let db = this.client.db("weather-app");
        this.temps = db.collection<Temp>(process.env.MONGODB_NAME!);
        this.lastTempColl = db.collection<Temp>("last_temp");
    }

    async lastTemp(): Promise<Temp> {
        return await (this.lastTempColl.findOne({})) as Temp;
    }

    async addTemp(t: Temp) {
        let lastT = await this.lastTemp();
        t._id = new mongoDB.ObjectId();
        await this.temps.insertOne(t);
        t._id = lastT._id;
        // {} to update all (1 temp doc)
        await this.lastTempColl.replaceOne({}, t);
    }

    async getTemps(m: number, d: number): Promise<Temp[]> {
        return (await this.temps.find({ m: m, d: d }).toArray()) as Temp[];
    }

    async lastDays(d: number): Promise<Temp[]> {
		let now = new Date();
		let weekAgo = new Date();
		weekAgo.setDate(now.getDate() - d);
        return (await this.temps.find(
			{
				"d": { "$gt": weekAgo.getDate() - 1, "$lt": now.getDate() + 1 },
				"m": { "$in": [ weekAgo.getMonth() + 1, now.getMonth() + 1 ] }
			}
		).toArray()) as Temp[];
    }
}

export default Db;
