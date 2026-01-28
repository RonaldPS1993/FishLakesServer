export const paginationSchema = {
  type: "object",
  properties: {
    page: { type: "integer", default: 1, minimum: 1 },
    limit: { type: "integer", default: 20, minimum: 1, maximum: 100 },
  },
};

export const authHeaderSchema = {
  type: "object",
  properties: {
    authorization: { type: "string", minLength: 8, pattern: "^Bearer .+$" },
  },
  required: ["authorization"],
};

export const successResponseSchema = {
  type: "object",
  properties: {
    status: { type: "string", enum: ["Success"] },
    message: { type: "string" },
    data: { type: "object", nullable: true },
  },
  required: ["status", "message"],
};

export const errorResponseSchema = {
  type: "object",
  properties: {
    status: { type: "string", enum: ["Error"] },
    message: { type: "string" },
    code: { type: "string" },
  },
  required: ["status", "message", "code"],
};

