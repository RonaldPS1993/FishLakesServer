export {
  paginationSchema,
  authHeaderSchema,
  successResponseSchema,
  errorResponseSchema,
} from "./common.schema.js";

export {
  searchLakeByNameSchema,
  lakeDataSchema,
  getNearbyLakesSchema,
  createLakeBodySchema,
} from "./lake.schema.js";

export {
  registerUserSchema,
  loginUserSchema,
  userDataSchema,
} from "./user.schema.js";
