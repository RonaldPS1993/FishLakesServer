import { db } from "../config/firebase.js";

const ForecastsCollectionRef = db.collection("LakeForecasts");

export { ForecastsCollectionRef };
