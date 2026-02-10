import dotenv from "dotenv";
import { jest } from "@jest/globals";
process.env.NODE_ENV = "test";
process.env.LOG_LEVEL = "silent";
process.env.ADMIN_EMAILS = "admin@test.com,admin@fishlakes.com";
process.env.GOOGLE_MAPS_API_KEY = "test-api-key";
process.env.RATE_LIMIT_MAX = "1000";

jest.setTimeout(10000);
