const LakesRef = require("../models/LakesModel");

const createLake = async (payload) => {
  try {
    const lakeCreated = await LakesRef.add(payload);
    if (lakeCreated.id != undefined) {
      return { status: "Success", msg: "Lake added to DB" };
    }
  } catch (err) {
    return { status: "Error", msg: err };
  }
};

module.exports = createLake;
