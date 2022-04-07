import { LastTemp, Temp, PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

class Db {
  async connect(): Promise<void> {
    await prisma.$connect().catch((e: Error) => {
      throw e;
    }).finally(async () => {
      await prisma.$disconnect();
    });
  }

  async disconnect(): Promise<void> {
    await prisma.$disconnect();
  }

  async lastTemp(): Promise<LastTemp | null> {
    return await prisma.lastTemp.findFirst()
  }

  async addLastTemp(t: LastTemp): Promise<void> {
    const lastT = await prisma.lastTemp.findFirst();
    if (!lastT) {
      await prisma.lastTemp.create({data: t});
      return;
    }
    await prisma.lastTemp.update({
      where: {
        id: lastT?.id
      },
      data: t
    })
  }

  async addTemp(t: Temp) {
    await prisma.temp.create({
      data: t
    })
  }

  async getTemps(m: number, d: number): Promise<Temp[]> {
    return await prisma.temp.findMany({ where: { m: m, d: d } });
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
            "d": { "in": nowDays },
            "m": new Date().getMonth() + 1
          },
          {
            "d": { "in": beforeDays },
            "m": weekAgo.getMonth() + 1
          }
        ]
      }
    });
  }
}

export default Db;
