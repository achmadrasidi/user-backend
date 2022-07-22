const { register, login, logout } = require("../controllers/auth");
const { checkToken } = require("../middlewares/auth");

const Router = require("express").Router();
const valueValidator = require("../middlewares/validator");
Router.post("/register", valueValidator.registValidator, register);
Router.post("/login", valueValidator.loginValidator, login);
Router.delete("/logout", checkToken, logout);

module.exports = Router;
