import { describe, it, expect, beforeAll, afterAll } from "@jest/globals";
import { buildTestApp } from "../helpers/testApp.js";
import { mockUser } from "../helpers/fixtures.js";

describe("Users Endpoints", () => {
  let app;

  beforeAll(async () => {
    app = await buildTestApp(mockUser);
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  describe("GET /api/users/me/favorite", () => {
    it("returns 400 without authorization header", async () => {
      const res = await app.inject({
        method: "GET",
        url: "/api/users/me/favorite",
      });

      expect(res.statusCode).toBe(400);
    });
  });
});
