const Developer = require("../models/Developer");
const myCrypto = require("crypto");

const hash = (value) => {
  const algorithm = "sha512";
  return myCrypto.createHash(algorithm).update(value).digest("hex");
};

const validateKey = async (apiKey) => {

  if (apiKey == undefined) {
    return false;
  }

  const hashedKey = hash(apiKey);

  const findDeveloper = await Developer.find({ apitoken: hashedKey });

  if (findDeveloper.length > 0) {
    return true;
  } else {
    return false;
  }
};

module.exports = validateKey;
