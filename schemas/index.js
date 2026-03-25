export {
  paginationSchema,
  authHeaderSchema,
  successResponseSchema,
  errorResponseSchema,
} from "./common.schema.js";

export {
  searchLakeByNameSchema,
  getNearbyLakesSchema,
  getLakeDetailSchema,
} from "./lake.schema.js";

export {
  registerUserSchema,
  loginUserSchema,
  userDataSchema,
} from "./user.schema.js";
