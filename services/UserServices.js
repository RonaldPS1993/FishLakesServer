import { createUser, authenticateUser } from "../modules/UserModules.js";

const registerUser = async (data) => {
  try {
    let payload = {};
    const fetchUser = await authenticateUser(data.token);

    if (fetchUser.status == "Error" && fetchUser.msg == "No user found on DB") {
      Object.assign(payload, { uid: fetchUser.data.uid });
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

  const authUser = await authenticateUser(data.token);

  return authUser;
};

export { registerUser, loginUser };
