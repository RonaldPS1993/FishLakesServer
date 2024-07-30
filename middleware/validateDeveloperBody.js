const validateDeveloper = (req, res, next) => {
  const { body: data } = req;

  if (!data.name) {
    res.status(400);
    return res.send({ error: "Name is required" });
  }
  if (!data.email) {
    res.status(400);
    return res.send({ error: "Email is required" });
  }

  return next();
};

module.exports = validateDeveloper;
