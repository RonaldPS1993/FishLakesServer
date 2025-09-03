const { db } = require("../config/firebase");

const UserCollectionRef = db.collection("Users");

module.exports = UserCollectionRef
