import { buildTestApp } from "../helpers/testApp.js";
import { describe, it, expect, beforeAll, afterAll } from "@jest/globals";

describe("Health Endpoints", () => {
  let app;

  beforeAll(async () => {
    app = await buildTestApp();
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it("GET /api/ returns server status", async () => {
    const res = await app.inject({
      method: "GET",
      url: "/api/",
    });

    expect(res.statusCode).toBe(200);
    expect(JSON.parse(res.body).status).toBe("Success");
    expect(JSON.parse(res.body).message).toBe("Server is live");
  });

  it("GET /api/health returns health info", async () => {
    const res = await app.inject({
      method: "GET",
      url: "/api/health",
    });

    expect(res.statusCode).toBe(200);
    expect(JSON.parse(res.body).status).toBe("healthy");
    expect(JSON.parse(res.body).timestamp).toBeDefined();
  });

  it("GET /api/unknown returns 404", async () => {
    const res = await app.inject({
      method: "GET",
      url: "/api/unknown",
    });

    expect(res.statusCode).toBe(404);
    expect(JSON.parse(res.body).code).toBe("NOT_FOUND");
  });
});
