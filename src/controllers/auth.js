const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { client } = require("../config/redis");
const User = require("../models/user");
const { ErrorHandler } = require("../helper/errorHandler");

const register = async (req, res) => {
  try {
    const { username, password, role } = req.body;
    const hashedPassword = await bcrypt.hash(password, 12);
    await User.create({ username, password: hashedPassword, role });
    res.status(201).json({
      message: "Register Success",
    });
  } catch (err) {
    const { message } = err;
    const status = err.status ? err.status : 500;
    res.status(status).json({
      error: message,
    });
  }
};
const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const data = await User.find({ username });

    if (!data.length) {
      throw new ErrorHandler({ status: 404, message: "username is not registered" });
    }

    const result = await bcrypt.compare(password, data[0].password);

    if (!result) {
      throw new ErrorHandler({ status: 400, message: "Invalid username or Password" });
    }

    const payload = {
      id: data[0].id,
      username,
      role: data[0].role,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, { issuer: process.env.JWT_ISSUER, expiresIn: "30d" });

    await client.set(`jwt${data[0].id}`, token);

    res.status(201).json({
      id: data[0].id,
      username,
      token,
      role: data[0].role,
      message: "Login Success",
    });
  } catch (err) {
    const { message } = err;
    const status = err.status ? err.status : 500;
    res.status(status).json({
      error: message,
    });
  }
};
const logout = async (req, res) => {
  try {
    const { id } = req.userPayload;

    await client.del(`jwt${id}`);

    res.status(201).json({
      message: "Logout Success",
    });
  } catch (err) {
    const { message } = err;
    const status = err.status ? err.status : 500;
    res.status(status).json({
      error: message,
    });
  }
};

module.exports = { register, login, logout };
