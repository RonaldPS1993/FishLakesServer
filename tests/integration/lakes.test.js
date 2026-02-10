import { describe, it, expect, beforeAll, afterAll } from "@jest/globals";
import { buildTestApp } from "../helpers/testApp.js";
import { validAuth, mockAdmin } from "../helpers/fixtures.js";

describe("Lakes Endpoints", () => {
  let app;

  beforeAll(async () => {
    app = await buildTestApp(mockAdmin);
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  describe("GET /api/lakes/search", () => {
    it("returns 400 without authorization header", async () => {
      const res = await app.inject({
        method: "GET",
        url: "/api/lakes/search?name=Test lake",
      });

      expect(res.statusCode).toBe(400);
      expect(JSON.parse(res.body).code).toBe("FST_ERR_VALIDATION");
    });

    it("returns 400 without name query param", async () => {
      const res = await app.inject({
        method: "GET",
        url: "/api/lakes/search",
        headers: {
          authorization: validAuth,
        },
      });

      expect(res.statusCode).toBe(400);
      expect(JSON.parse(res.body).code).toBe("FST_ERR_VALIDATION");
    });

    it("returns 400 with empty name query param", async () => {
      const res = await app.inject({
        method: "GET",
        url: "/api/lakes/search?name=",
        headers: {
          authorization: validAuth,
        },
      });

      expect(res.statusCode).toBe(400);
      expect(JSON.parse(res.body).code).toBe("FST_ERR_VALIDATION");
    });

    it("accepts valid request (schema passes validation)", async () => {
      const res = await app.inject({
        method: "GET",
        url: "/api/lakes/search?name=Test lake",
        headers: {
          authorization: validAuth,
        },
      });

      expect(res.statusCode).not.toBe(400);
    });
  });
});
