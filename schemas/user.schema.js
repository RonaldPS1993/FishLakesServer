// Register needs no body -- JWT provides email
export const registerUserSchema = {
  type: "object",
  nullable: true,
  additionalProperties: true,
};

// Login needs no body -- JWT provides identity
export const loginUserSchema = {
  type: "object",
  nullable: true,
  additionalProperties: true,
};

// Updated to match profiles table columns
export const userDataSchema = {
  type: "object",
  properties: {
    id: { type: "string", format: "uuid" },
    username: { type: "string" },
    role: { type: "string", enum: ["admin", "user"] },
    created_at: { type: "string" },
    updated_at: { type: "string" },
  },
  required: ["id", "username", "role"],
};
