import * as mongoDB from "mongodb";

export interface Temp extends mongoDB.Document {
    y: number,
    m: number,
    d: number,
    h: number,
    averageTemp: string
};
