const Developer = require("../models/Developer");
const { v4: uuidv4 } = require("uuid");
const myCrypto = require("crypto");

const generateApiKey = uuidv4;

const hash = (value) => {
  const algorithm = "sha512";
  return myCrypto.createHash(algorithm).update(value).digest("hex");
};

const postDeveloper = async (req, res, next) => {
  try {
    const { body: data } = req;
    const { email, name } = data;

    const findDeveloper = await Developer.find({ email });
    if (findDeveloper.length) {
      throw new Error("This email is already in use");
    }

    const apiKey = generateApiKey();
    const hashedApiKey = hash(apiKey);

    const developer = new Developer({
      name,
      email,
      apitoken: hashedApiKey,
    });

    await developer.save();

    return res.json({
      code: 200,
      status: "Success",
      body: apiKey,
    });
  } catch (err) {
    return next(err);
  }
};

module.exports = postDeveloper;
