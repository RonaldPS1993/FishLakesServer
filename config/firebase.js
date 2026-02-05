import admin from "firebase-admin";
import { SERVICE_ACCOUNT_JSON } from "./index.js";

var serviceAccount = JSON.parse(SERVICE_ACCOUNT_JSON);

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const db = admin.firestore();
const auth = admin.auth();

export { db, auth };
