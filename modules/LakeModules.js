import { LakesCollectionRef } from "../models/LakesModel.js";

const createLake = async (payload) => {
  try {
    const lakeCreated = await LakesCollectionRef.add(payload);
    if (lakeCreated.id != undefined && lakeCreated.id != null) {
      let response = payload;
      Object.assign(response, { id: lakeCreated.id });
      return { status: "Success", msg: "Lake added to DB", data: response };
    } else {
      return { status: "Error", msg: "Error adding lake to DB" };
    }
  } catch (err) {
    return { status: "Error", msg: err.message };
  }
};

const getLakeByName = async (searchName) => {
  try {
    const lakes = await LakesCollectionRef.where(
      "searchName",
      "==",
      searchName
    ).get();
    if (lakes.empty) {
      return { status: "Error", msg: "No lake found" };
    } else {
      return {
        status: "Success",
        data: lakes.docs[0].data(),
        msg: "Lake added to database",
      };
    }
  } catch (err) {
    return { status: "Error", msg: err };
  }
};

export { createLake, getLakeByName };
