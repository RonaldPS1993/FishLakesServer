const { db } = require("../config/firebase");

const UserCollectionRef = db.collection("Lakes");

module.exports = UserCollectionRef
