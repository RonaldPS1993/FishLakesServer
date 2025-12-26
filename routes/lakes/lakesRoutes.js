import { getNearbyLakes } from "../../services/LakeServices.js";

const lakesRoutes = async (fastify) => {
  fastify.post("/", async (req, res) => {
    if (req.headers["bearer"] != undefined) {
      try {
        const userToken = req.headers["bearer"];

        if (!userData.empty) {
          let region = req.body.region;
          let lakesResult = await getNearbyLakes(region, userToken);
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

export { lakesRoutes };
