import express, { Request, Response, Express } from "express";

const app: Express = express();
app.use(express.json());

interface Temp {
  y: number,
  m: number,
  d: number,
  h: number,
  averageTemp: string
}

app.post("/add_temp", (req: Request, res: Response) => {
  let temp = req.body as Temp;
  res.send(temp.averageTemp);
});

app.listen(3030, () => {
  console.log("started");
});
