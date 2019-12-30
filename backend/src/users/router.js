import express from "express";
import _ from "lodash";
import { createValidator } from "express-joi-validation";
import * as qs from "./querySchema";
import User from "./models";
import getUser from "../middlewares/getUser";
import createGuard from "express-jwt-permissions";

const router = express.Router();
const isValid = createValidator();
const guard = createGuard();

router.get(
  "/",
  // guard.check("user:read"),
  async (req, res, next) => {
    const users = await User.find().limit(50);
    res.send(users);
  }
);

router.post(
  "/",
  getUser(),
  guard.check("user:create"),
  isValid.body(qs.NewUserBodySchema),
  async (req, res, next) => {
    const createObj = _.pick(req.body, [
      "firstName",
      "lastName",
      "email",
      "password"
    ]);
    const user = await User.create(createObj);
    res.send(user);
  }
);

router.get("/me", getUser(), async (req, res, next) => {
  const user = await User.findById(req.user._id, User.selectFields());
  if (!user) return res.status(404).send("User not found");
  res.send(user);
});

router.get(
  "/:id",
  getUser(),
  guard.check("status"),
  isValid.params(qs.GetUserParamsSchema),
  async (req, res, next) => {
    const user = await User.findById(req.params.id, User.selectFields());
    if (!user) return res.status(404).send("User not found");
    res.send(user);
  }
);

router.put(
  "/:id",
  getUser(),
  guard.check("user:write"),
  isValid.params(qs.GetUserParamsSchema),
  isValid.body(qs.UpdateUserBodySchema),
  async (req, res, next) => {
    const updateObj = _.pick(req.body, [
      "firstName",
      "lastName",
      "permissions"
    ]);
    const user = await User.findByIdAndUpdate(req.params.id, updateObj, {
      fields: User.selectFieldsForUpdate(),
      new: true
    });
    if (!user) return res.status(404).send("User not found");
    res.send(user);
  }
);

router.put(
  "/:id/deactivate",
  getUser(),
  guard.check("admin"),
  isValid.params(qs.GetUserParamsSchema),
  async (req, res, next) => {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      {
        isActive: false
      },
      {
        fields: User.selectFieldsForUpdate(),
        new: true
      }
    );
    if (!user) return res.status(404).send("User not found");
    res.send(user);
  }
);

export default router;
