const Router = require("express").Router();
const authRouter = require("./auth");
const userRouter = require("./user");
Router.get("/", (_req, res) => {
  res.json({
    message: "This is user backend API",
  });
});
Router.use("/auth", authRouter);
Router.use("/user", userRouter);

Router.get("*", (_req, res) => {
  res.status(404).json({
    message: "Api Not Found",
  });
});

module.exports = Router;
