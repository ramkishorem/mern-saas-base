import { unhandledListener } from "./errorLogger";
import express from "express";
import path from "path";
import cookieParser from "cookie-parser";
import logger from "morgan";
import asyncErrors from "express-async-errors";
import indexRouter from "./indexRouter";
import courseRouter from "./courses/router";
import userRouter from "./users/router";
import authRouter from "./auth/router";
import errorHandler from "./middlewares/error";

unhandledListener();
const app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "../public")));

app.use("/", indexRouter);
app.use("/courses", courseRouter);
app.use("/users", userRouter);
app.use("/auth", authRouter);

app.use(errorHandler);

export default app;
