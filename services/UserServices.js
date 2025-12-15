import { createUser, getUser } from "../modules/UserModules.js";
import { auth } from "../config/firebase.js";

const registerUser = async (data) => {
  try {
    let payload = {};
    const fetchUser = await auth.verifyIdToken(data.token);

    const getUserOnDb = await getUser({ id: fetchUser.uid });

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
    }
  } catch (err) {
    return { status: "Error", msg: err };
  }
};

export { registerUser };
