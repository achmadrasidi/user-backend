const User = require("../models/user");
const bcrypt = require("bcrypt");
const { ErrorHandler } = require("../helper/errorHandler");

const getUserDetail = async (req, res) => {
  try {
    const { id } = req.userPayload;
    const _id = id.toString();
    const data = await User.findById({ _id });
    data.password = "encrypted";
    res.status(200).json({
      data,
    });
  } catch (err) {
    const { message, status = 500 } = err;
    res.status(status).json({
      error: message,
    });
  }
};

const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const _id = id.toString();
    const data = await User.findById({ _id });
    data.password = "encrypted";
    res.status(200).json({
      data,
    });
  } catch (err) {
    const { message, status = 500 } = err;
    res.status(status).json({
      error: message,
    });
  }
};

const searchUsers = async (_req, res) => {
  try {
    const data = await User.find({});

    res.status(200).json({
      data,
    });
  } catch (err) {
    const { message } = err;
    const status = err.status ? err.status : 500;
    res.status(status).json({
      error: message,
    });
  }
};

const addUser = async (req, res) => {
  try {
    const { username, password, role } = req.body;
    const hashedPassword = await bcrypt.hash(password, 12);
    const data = await User.create({ username, password: hashedPassword, role });

    res.status(201).json({
      data,
      message: "User successfully created",
    });
  } catch (err) {
    const { message, status } = err;
    res.status(status).json({
      error: message,
    });
  }
};

const editUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { username, password, role } = req.body;
    const hashedPassword = await bcrypt.hash(password, 12);
    const _id = id;
    const data = await User.findOneAndUpdate({ _id }, { username, password: hashedPassword, role }, { new: true });

    res.status(200).json({
      data,
      message: "User successfully updated",
    });
  } catch (err) {
    const { message } = err;
    const status = err.status ? err.status : 500;
    res.status(status).json({
      error: message,
    });
  }
};

const deleteUserById = async (req, res) => {
  try {
    const _id = req.params.id;

    const data = await User.findOneAndDelete({ _id });

    res.status(200).json({
      data,
      message: "User Successfully Deleted",
    });
  } catch (err) {
    const { message } = err;
    const status = err.status ? err.status : 500;
    res.status(status).json({
      error: message,
    });
  }
};

module.exports = {
  getUserDetail,
  getUserById,
  searchUsers,
  addUser,
  deleteUserById,
  editUser,
};
