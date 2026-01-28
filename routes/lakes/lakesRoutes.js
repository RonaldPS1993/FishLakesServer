import { searchLakeByName } from "../../services/LakeServices.js";

const lakesRoutes = async (fastify) => {
  fastify.get("/search", async (req, reply) => {
    if (req.headers["bearer"] != undefined) {
      const userToken = req.headers["bearer"];
      const lakeName = req.query.name;
      let lakesResult = await searchLakeByName(lakeName, userToken);

      if (lakesResult.status == "Success") {
        reply.code(201).send({ msg: lakesResult.msg, data: lakesResult.data });
      } else {
        reply.code(400).send({ msg: lakesResult.msg });
      }
    } else {
      reply.code(401).send({ msg: "Authorization not valid" });
    }
  });
};

export { lakesRoutes };
