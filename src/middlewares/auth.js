const jwt = require("jsonwebtoken");
const { client } = require("../config/redis");
const { ErrorHandler } = require("../helper/errorHandler");

const checkToken = (req, _res, next) => {
  const bearerToken = req.header("Authorization");

  if (!bearerToken) {
    next({ status: 401, message: "Please Login First" });
    return;
  }

  const token = bearerToken.split(" ")[1];
  jwt.verify(token, process.env.JWT_SECRET_KEY, { issuer: process.env.JWT_ISSUER }, async (err, payload) => {
    if (err && err.name === "TokenExpiredError") {
      next({ status: 403, message: "Please Login Again" });
      return;
    }
    if (err) {
      next({ status: 401, message: "Token Unauthorize, Please login again" });
      return;
    }
    try {
      const cachedToken = await client.get(`jwt${payload.id}`);
      if (!cachedToken) {
        throw new ErrorHandler({ status: 403, message: "Please Login First" });
      }

      if (cachedToken !== token) {
        throw new ErrorHandler({ status: 403, message: "Token Unauthorize, please login again" });
      }
      req.userPayload = payload;
      next();
    } catch (error) {
      const status = error.status ? error.status : 500;
      next({ status, message: error.message });
    }
  });
};

const checkRole = (role) => (req, _res, next) => {
  if (!req.userPayload) {
    next({ status: 500, message: "Something went wrong when trying to retrieve the user from the request" });
    return;
  }
  const roleRules = { admin: "user", user: "user" };

  if (req.userPayload.role === role || roleRules[req.userPayload.role] === role) {
    next();
    return;
  }

  next({ status: 403, message: `You dont have access, for ${role} only` });
};

module.exports = { checkRole, checkToken };
