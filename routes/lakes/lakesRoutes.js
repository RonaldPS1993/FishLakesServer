const UserRef = require("../../models/UserModel");
const getlakes = require("../../services/LakeServices")

const lakesRoutes = async (fastify) => {
  fastify.post("/", async (req, res) => {
    if (req.headers["bearer"] != undefined) {
      try {
        const userToken = req.headers["bearer"];

        const userData = await UserRef.where("token", "==", userToken).get();

        if (!userData.empty) {
          let region = req.body.region;
          let lakesResult = await getlakes(region)
          return { code: 200, body: lakesResult };
        } else {
          return { code: 401, msg: "Authorization not valid" };
        }
      } catch (err) {
        return { code: 400, body: err };
      }
    } else {
      return { code: 401, msg: "Authorization not valid" };
    }
  });
};

module.exports = lakesRoutes;
