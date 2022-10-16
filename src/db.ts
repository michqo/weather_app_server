import { LastTemp, Temp, PrismaClient } from "@prisma/client";
import { z } from "zod";
import { tempSchema, tempsSchema } from "./schemas";

const prisma = new PrismaClient();

type TempSchema = z.infer<typeof tempSchema>;
type TempsSchema = z.infer<typeof tempsSchema>;

class Db {
  async connect(): Promise<void> {
    await prisma
      .$connect()
      .catch((e: Error) => {
        throw e;
      })
      .finally(async () => {
        await prisma.$disconnect();
      });
  }

  async disconnect(): Promise<void> {
    await prisma.$disconnect();
  }

  async lastTemp(): Promise<LastTemp | null> {
    return await prisma.lastTemp.findFirst();
  }

  async addLastTemp(t: TempSchema): Promise<void> {
    const lastT = await prisma.lastTemp.findFirst();
    if (!lastT) {
      await prisma.lastTemp.create({ data: t });
      return;
    }
    await prisma.lastTemp.update({
      where: {
        id: lastT?.id,
      },
      data: t,
    });
  }

  async addTemp(t: TempSchema) {
    await prisma.temp.create({
      data: t,
    });
  }
  async addTemps(t: TempsSchema) {
    await prisma.temp.createMany({
      data: t,
    });
  }

  async deleteTemps(m: number, d: number): Promise<void> {
    await prisma.temp.deleteMany({ where: { m: m, d: d } });
  }

  async getTemps(m: number, d: number): Promise<Temp[]> {
    return await prisma.temp.findMany({ where: { m: m, d: d } });
  }

  async average(m: number, d: number): Promise<number | null> {
    const temps = await prisma.temp.findMany({ where: { m, d } });
    let sum = 0;
    const len = temps.length;
    if (len == 0) return null;
    for (let i = 0; i < len; i++) {
      sum += parseFloat(temps[i].averageTemp);
    }

    return parseFloat((sum / len).toFixed(2));
  }

  async lastDays(d: number): Promise<Temp[]> {
    let date = new Date();
    let weekAgo = new Date();
    weekAgo.setDate(date.getDate() - d);
    let nowDays: number[] = [];
    let beforeDays: number[] = [];
    for (let i = 0; i < d; i++) {
      if (date.getMonth() == weekAgo.getMonth()) {
        beforeDays.push(date.getDate());
      } else {
        nowDays.push(date.getDate());
      }
      date.setDate(date.getDate() - 1);
    }
    return await prisma.temp.findMany({
      where: {
        OR: [
          {
            d: { in: nowDays },
            m: new Date().getMonth() + 1,
          },
          {
            d: { in: beforeDays },
            m: weekAgo.getMonth() + 1,
          },
        ],
      },
    });
  }
}

export default Db;
