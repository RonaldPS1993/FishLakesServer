const UserRef = require("../../models/UserModel");
const getLakes = require("../../services/LakeServices");

const lakesRoutes = async (fastify) => {
  fastify.post("/", async (req, res) => {
    if (req.headers["bearer"] != undefined) {
      try {
        const userToken = req.headers["bearer"];

        const userData = await UserRef.where("token", "==", userToken).get();

        if (!userData.empty) {
          let region = req.body.region;
          let lakesResult = await getLakes(region);
          if (lakesResult.status == "Success") {
            res.status(201);
            res.send({ data: lakesResult.data });
          } else {
            res.status(402);
            res.send({ error: lakesResult.msg });
          }
        } else {
          res.status(401);
          res.send({ msg: "Unauthorized, token not valid" });
        }
      } catch (err) {
        res.status(400);
        res.send({ error: err });
      }
    } else {
      res.status(401);
      res.send({ msg: "Authorization not valid" });
    }
  });
};

module.exports = lakesRoutes;
