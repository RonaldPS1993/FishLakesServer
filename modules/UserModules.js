import { UserCollectionRef } from "../models/UserModel.js";

const createUser = async (payload) => {
  try {
    const userCreated = await UserCollectionRef.add(payload);
    if (userCreated.id != undefined && userCreated.id != null) {
      return { status: "Success", msg: "User added to DB" };
    } else {
      return { status: "Error", msg: "Error adding lake to DB" };
    }
  } catch (err) {
    return { status: "Error", msg: err };
  }
};

const getUser = async (data) => {
  try {
    const fetchUser = await UserCollectionRef.where("uid", "==", data.id).get();
    if (fetchUser.empty) {
      return { status: "Fail", msg: "No user exits" };
    }
    return { status: "Sucess", msg: "User found!" };
  } catch (err) {
    return { status: "Error", msg: err };
  }
};

export { createUser, getUser };
