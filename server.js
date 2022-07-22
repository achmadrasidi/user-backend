require("dotenv").config();
const express = require("express");
const path = require("path");
const cors = require("cors");

const mainRouter = require("./src/routes/index.js");
const { dbConn } = require("./src/config/db.js");
const { redisConn } = require("./src/config/redis");
const { errorHandling } = require("./src/helper/errorHandler.js");

dbConn();
redisConn();

const app = express();
const PORT = process.env.PORT;

const originList = ["http://localhost:3000", "::1"];

const corsOption = {
  origin: (origin, callback) => {
    if (originList.includes(origin) || !origin) return callback(null, true);
    return callback(new Error("Forbidden Origin"));
  },
  optionsSuccessStatus: 200,
  methods: ["OPTIONS", "GET", "POST", "PATCH", "DELETE"],
};

app.use(cors(corsOption));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(mainRouter);

app.use(errorHandling);

app.listen(PORT, console.log(`Server is Running at port ${PORT}`));
