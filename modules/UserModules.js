import { UserCollectionRef } from "../models/UserModel.js";
import { auth } from "../config/firebase.js";

const createUser = async (payload) => {
  try {
    const userCreated = await UserCollectionRef.add(payload);
    if (userCreated.id != undefined && userCreated.id != null) {
      return { status: "Success", msg: "User added to DB", data: userCreated };
    } else {
      return { status: "Error", msg: "Error adding lake to DB" };
    }
  } catch (err) {
    return { status: "Error", msg: err };
  }
};

const authenticateUser = async (token) => {
  try {
    const fetchUser = await auth.verifyIdToken(token);

    const userDocs = await UserCollectionRef.where(
      "uid",
      "==",
      fetchUser.uid
    ).get();
    if (userDocs.empty) {
      return { status: "Error", msg: "No user found on DB", data: fetchUser };
    } else {
      return {
        status: "Success",
        msg: "User found in DB",
        data: userDocs.docs[0].data(),
      };
    }
  } catch (err) {
    return { status: "Error", msg: err };
  }
};

export { createUser, authenticateUser };
