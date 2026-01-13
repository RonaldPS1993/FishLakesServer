import { db } from "../config/firebase.js";

const ReportsCollectionRef = db.collection("Reports");

export { ReportsCollectionRef };
