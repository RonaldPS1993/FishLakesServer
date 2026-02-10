export const registerUserSchema = {
  type: "object",
  properties: {
    email: { type: "string", format: "email" },
  },
  required: ["email"],
  additionalProperties: false,
};

export const loginUserSchema = {
  type: "object",
  properties: {
    email: { type: "string", format: "email" },
  },
  required: ["email"],
  additionalProperties: false,
};

export const userDataSchema = {
  type: "object",
  properties: {
    uid: { type: "string" },
    email: { type: "string", format: "email" },
    role: { type: "string", enum: ["admin", "user"] },
    createdAt: { type: "number" },
  },
  required: ["uid", "email", "role", "createdAt"],
  additionalProperties: false,
};
