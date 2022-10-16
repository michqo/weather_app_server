/**
 * Endpoint tests
 */

import supertest from "supertest";
import { app, server, db } from "../server";

const request = supertest(app);

describe("Test endpoints", () => {
  it("temps", async () => {
    const date = new Date();
    const response = await request
      .get(`/temps/${date.getMonth() - 1}/${date.getDate()}`)
      .send();

    expect(response.body).toBeInstanceOf(Array);
    expect(response.status).toBe(200);
  });

  it("last_temp", async () => {
    const response = await request.get("/last_temp").send();

    expect(response.body).toBeInstanceOf(Object);
    expect(response.status).toBe(200);
  });
});

afterAll(async () => {
  server.close();
  await db.disconnect();
});
