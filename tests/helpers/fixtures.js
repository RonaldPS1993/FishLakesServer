/**
 * Test Fixtures
 */

export const validAuth = "Bearer valid-test-token";

export const mockAdmin = {
  id: "admin-123",
  username: "admin@fishlakes.com",
  role: "admin",
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

export const mockUser = {
  id: "user-123",
  username: "user@example.com",
  role: "user",
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};
