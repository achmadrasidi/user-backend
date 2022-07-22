const { getUserDetail, searchUsers, getUserById, addUser, editUser, deleteUserById } = require("../controllers/user");
const { checkToken, checkRole } = require("../middlewares/auth");
const { registValidator } = require("../middlewares/validator");

const Router = require("express").Router();

// USER
// get user profile
Router.get("/profile/", checkToken, checkRole("user"), getUserDetail);

// ADMIN
// get all users, search users
Router.get("/", checkToken, checkRole("admin"), searchUsers);
// get user detail by id
Router.get("/:id", checkToken, checkRole("admin"), getUserById);
// add new user
Router.post("/", checkToken, checkRole("admin"), registValidator, addUser);
// edit user detail
Router.patch("/:id", checkToken, checkRole("admin"), editUser);
// delete user by id
Router.delete("/:id", checkToken, checkRole("admin"), deleteUserById);

module.exports = Router;
