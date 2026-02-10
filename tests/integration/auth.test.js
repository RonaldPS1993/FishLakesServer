import { buildTestApp } from "../helpers/testApp.js";
import { describe, it, expect, beforeAll, afterAll } from "@jest/globals";
import { validAuth, mockAdmin, mockUser } from "../helpers/fixtures.js";

describe("Auth Endpoints", () => {
  let app;
  beforeAll(async () => {
    app = await buildTestApp(mockAdmin);
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  describe("POST /api/auth/register", () => {
    it("returns 400 without authorization header", async () => {
      const res = await app.inject({
        method: "POST",
        url: "/api/auth/register",
        payload: {
          email: "test@test.com",
        },
      });

      expect(res.statusCode).toBe(400);
      expect(JSON.parse(res.body).code).toBe("FST_ERR_VALIDATION");
    });

    it("returns 400 with invalid Authorization format", async () => {
      const res = await app.inject({
        method: "POST",
        url: "/api/auth/register",
        headers: {
          authorization: "invalid-format",
        },
        payload: {
          email: "test@test.com",
        },
      });

      expect(res.statusCode).toBe(400);
      expect(JSON.parse(res.body).code).toBe("FST_ERR_VALIDATION");
    });

    it("returns 400 with missing email", async () => {
      const res = await app.inject({
        method: "POST",
        url: "/api/auth/register",
        headers: {
          authorization: validAuth,
        },
      });

      expect(res.statusCode).toBe(400);
      expect(JSON.parse(res.body).code).toBe("FST_ERR_VALIDATION");
    });

    it("returns 400 with invalid email", async () => {
      const res = await app.inject({
        method: "POST",
        url: "/api/auth/register",
        headers: {
          authorization: validAuth,
        },
        payload: {
          email: "invalid-email",
        },
      });

      expect(res.statusCode).toBe(400);
      expect(JSON.parse(res.body).code).toBe("FST_ERR_VALIDATION");
    });

    it("accepts valid request (schema passes validation)", async () => {
      const res = await app.inject({
        method: "POST",
        url: "/api/auth/register",
        headers: {
          authorization: validAuth,
        },
        payload: {
          email: "test@test.com",
        },
      });

      expect(res.statusCode).not.toBe(400);
    });
  });

  describe("POST /api/auth/login", () => {
    it("returns 400 without authorization header", async () => {
      const res = await app.inject({
        method: "POST",
        url: "/api/auth/login",
        payload: {
          email: "test@test.com",
        },
      });

      expect(res.statusCode).toBe(400);
      expect(JSON.parse(res.body).code).toBe("FST_ERR_VALIDATION");
    });

    it("returns 400 without email", async () => {
      const res = await app.inject({
        method: "POST",
        url: "/api/auth/login",
        headers: {
          authorization: validAuth,
        },
      });

      expect(res.statusCode).toBe(400);
      expect(JSON.parse(res.body).code).toBe("FST_ERR_VALIDATION");
    });

    it("accepts valid request (schema passes validation)", async () => {
      const res = await app.inject({
        method: "POST",
        url: "/api/auth/login",
        headers: {
          authorization: validAuth,
        },
        payload: {
          email: "test@test.com",
        },
      });

      expect(res.statusCode).not.toBe(400);
    });
  });
});
