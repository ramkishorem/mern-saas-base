import express from "express";
import _ from "lodash";
import { createValidator } from "express-joi-validation";
import * as qs from "./querySchema";
import User from "../models";

const router = express.Router();
const isValid = createValidator();

router.post(
  "/login",
  isValid.body(qs.LoginBodySchema),
  async (req, res, next) => {
    const loginObj = _.pick(req.body, ["email", "password"]);
    const user = await User.findOne({ email: loginObj.email });
    const errorCode = 400,
      errorMessage = "Invalid username or password";
    if (!user) return res.status(errorCode).send(errorMessage);

    const correctPassword = await user.comparePassword(loginObj.password);
    if (!correctPassword) return res.status(errorCode).send(errorMessage);
    const token = user.generateAuthToken();
    res.header({ "x-auth-token": token }).send("Login Successful!");
  }
);

export default router;
