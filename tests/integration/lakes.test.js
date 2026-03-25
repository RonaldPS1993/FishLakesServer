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

  describe("GET /api/lakes/nearby", () => {
    it("returns 400 without authorization header", async () => {
      const res = await app.inject({
        method: "GET",
        url: "/api/lakes/nearby?lat=37.774929&lng=-122.419416&radius=1000",
      });

      expect(res.statusCode).toBe(400);
      expect(JSON.parse(res.body).code).toBe("FST_ERR_VALIDATION");
    });

    it("returns 400 without lat query param", async () => {
      const res = await app.inject({
        method: "GET",
        url: "/api/lakes/nearby?lng=-122.419416&radius=1000",
        headers: {
          authorization: validAuth,
        },
      });

      expect(res.statusCode).toBe(400);
      expect(JSON.parse(res.body).code).toBe("FST_ERR_VALIDATION");
    });

    it("returns 400 without lng query param", async () => {
      const res = await app.inject({
        method: "GET",
        url: "/api/lakes/nearby?lat=37.774929&radius=1000",
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
        url: "/api/lakes/nearby?lat=37.774929&lng=-122.419416&radius=1000",
        headers: {
          authorization: validAuth,
        },
      });

      expect(res.statusCode).not.toBe(400);
    });
  });

  describe("GET /api/lakes/:id", () => {
    it("returns 400 with non-numeric id", async () => {
      const res = await app.inject({
        method: "GET",
        url: "/api/lakes/abc",
        headers: {
          authorization: validAuth,
        },
      });

      expect(res.statusCode).toBe(400);
    });
  });

  describe("POST /api/lakes/:id/favorite", () => {
    it("returns 400 without authorization header", async () => {
      const res = await app.inject({
        method: "POST",
        url: "/api/lakes/123/favorite",
      });

      expect(res.statusCode).toBe(400);
    });
  });

  describe("DELETE /api/lakes/:id/favorite", () => {
    it("returns 400 without authorization header", async () => {
      const res = await app.inject({
        method: "DELETE",
        url: "/api/lakes/123/favorite",
      });

      expect(res.statusCode).toBe(400);
    });
  });
});
