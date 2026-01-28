export const searchLakeByNameSchema = {
  type: "object",
  properties: {
    name: { type: "string", minLength: 1, maxLength: 200 },
  },
  required: ["name"],
};

export const lakeDataSchema = {
    type: "object",
    properties: {
        id: { type: "string" },
        placeId: { type: "string" },
        searchName: { type: "string" },
        name: { type: "string" },
        location: { type: "object" },
        country: { type: "string", minLength: 1, maxLength: 200 },
        state: { type: "string", minLength: 1, maxLength: 200 },
        createdAt: { type: "timestamp" },
    },
    required: ["id", "placeId", "name", "location", "country", "state", "createdAt"],
    additionalProperties: false,
}

export const createLakeBodySchema = {
  type: "object",
  required: ["name", "location"],
  properties: {
    name: { type: "string", minLength: 1, maxLength: 200 },
    location: { 
      type: "object",
      properties: {
        latitude: { type: "number" },
        longitude: { type: "number" },
      },
      required: ["latitude", "longitude"],
      additionalProperties: false,
    },
    country: { type: "string", minLength: 1, maxLength: 200 },
    state: { type: "string", minLength: 1, maxLength: 200 },
    createdAt: { type: "timestamp" },
    placeId: { type: "string" },
    searchName: { type: "string", minLength: 1, maxLength: 200 },
  },
  required: ["name", "location", "country", "state", "createdAt", "placeId"],
  additionalProperties: false,
}




