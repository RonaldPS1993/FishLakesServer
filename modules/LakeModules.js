import { LakesCollectionRef } from "../models/LakesModel.js";

const createLake = async (payload) => {
  try {
    const lakeCreated = await LakesCollectionRef.add(payload);
    if (lakeCreated.id != undefined && lakeCreated.id != null) {
      return { status: "Success", msg: "Lake added to DB" };
    } else {
      return { status: "Error", msg: "Error adding lake to DB" };
    }
  } catch (err) {
    return { status: "Error", msg: err };
  }
};

const getLakes = async (latitude, longitude) => {
  try {
    const lakes = await LakesCollectionRef.where("latitude", "==", latitude)
      .where("longitude", "==", longitude)
      .get();
    if (!lakes.empty) {
      return { status: "Success", data: lakes.docs[0].data() };
    } else {
      return { status: "Error", msg: "No lake found in database." };
    }
  } catch (err) {
    return { status: "Error", msg: err };
  }
};

export { createLake, getLakes };
