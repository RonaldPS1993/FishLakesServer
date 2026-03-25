export const searchLakeByNameSchema = {
  type: "object",
  properties: {
    name: { type: "string", minLength: 1, maxLength: 200 },
  },
  required: ["name"],
};

export const getNearbyLakesSchema = {
  type: "object",
  properties: {
    lat: { type: "number", minimum: -90, maximum: 90 },
    lng: { type: "number", minimum: -180, maximum: 180 },
    radius: { type: "number", minimum: 1, maximum: 200000, default: 50000 },
  },
  required: ["lat", "lng"],
};

export const getLakeDetailSchema = {
  type: "object",
  properties: {
    id: { type: "integer", minimum: 1 },
  },
  required: ["id"],
};
