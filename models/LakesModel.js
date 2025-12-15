import { db } from "../config/firebase.js";

const LakesCollectionRef = db.collection("Lakes");

export { LakesCollectionRef };
