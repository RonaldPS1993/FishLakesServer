import { createUser, getUserById } from "../modules/UserModules.js";
import { auth } from "../config/firebase.js";

const registerUser = async (data) => {
  try {
    let payload = {};
    const fetchUser = await auth.verifyIdToken(data.token);

    const getUserOnDb = await getUserById({ id: fetchUser.uid });

    if (getUserOnDb.status == "Fail") {
      Object.assign(payload, { uid: fetchUser.uid });
      Object.assign(payload, { createdAt: Date.now() });
      if (data.email == "admin@fishlakes.com") {
        Object.assign(payload, { role: "admin" });
      } else {
        Object.assign(payload, { role: "user" });
      }
      const newUser = await createUser(payload);
      return newUser;
    } else {
      return { status: "Error", msg: "User already exits." };
    }
  } catch (err) {
    return { status: "Error", msg: err };
  }
};

const loginUser = async (data) => {
  const fetchUser = await auth.verifyIdToken(data.token);

  const checkUserOnDb = await getUserById({ id: fetchUser.uid });

  return checkUserOnDb;
};

export { registerUser, loginUser };
