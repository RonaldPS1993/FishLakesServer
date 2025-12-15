import { db } from "../config/firebase.js";

const UserCollectionRef = db.collection("Users");

export { UserCollectionRef };
