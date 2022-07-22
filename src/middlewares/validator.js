const registValidator = (req, res, next) => {
  const { username, password } = req.body;
  if (!username) {
    res.status(400).json({
      error: "username Field Required",
    });
    return;
  }
  if (!password) {
    res.status(400).json({
      error: "password Field Required",
    });
    return;
  }

  next();
};

const loginValidator = (req, res, next) => {
  const { username, password } = req.body;
  if (!username) {
    res.status(400).json({
      error: "Username Field Required",
    });
    return;
  }
  if (!password) {
    res.status(400).json({
      error: "password Field Required",
    });
    return;
  }
  next();
};

module.exports = { registValidator, loginValidator };
