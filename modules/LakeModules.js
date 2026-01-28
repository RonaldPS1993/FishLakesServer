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
      "searchNames",
      "array-contains",
      searchName
    ).get();
    if (lakes.empty) {
      return { status: "Error", msg: "No lake found" };
    }
    let lakeData = lakes.docs[0].data();
    Object.assign(lakeData, { id: lakes.docs[0].id });
    return {
      status: "Success",
      data: lakeData,
      msg: "Lake found in database",
    };
  } catch (err) {
    return { status: "Error", msg: err };
  }
};

export { createLake, getLakeByName };
