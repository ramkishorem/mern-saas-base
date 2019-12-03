import asyncErrors from "express-async-errors";
import express from "express";
import path from "path";
import cookieParser from "cookie-parser";
import logger from "morgan";
import errorLogger from "./errorLogger";
import indexRouter from "./indexRouter";
import courseRouter from "./courses/router";
import userRouter from "./users/router";
import errorHandler from "./middlewares/error";

// var usersRouter = require("./routes/users");

const app = express();

//Throw exception on unhandledRejection to let winston log it and exit
process.on("unhandledRejection", ex => {
  throw ex;
});

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "../public")));

app.use("/", indexRouter);
app.use("/courses", courseRouter);
app.use("/users", userRouter);

app.use(errorHandler);

export default app;
