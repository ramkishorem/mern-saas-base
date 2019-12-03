import express from "express";
import _ from "lodash";
import { createValidator } from "express-joi-validation";
import * as qs from "./querySchema";
import User from "./models";

const router = express.Router();
const isValid = createValidator();

router.get("/", async (req, res, next) => {
  const users = await User.find().limit(50);
  res.send(users);
});

router.post("/", isValid.body(qs.NewUserBodySchema), async (req, res, next) => {
  const createObj = _.pick(req.body, [
    "firstName",
    "lastName",
    "email",
    "password"
  ]);
  // const salt = await bcrypt.genSalt(10);
  // createObj.password = await bcrypt.hash(createObj.password, salt);
  const user = await User.create(createObj);
  user.password;
  res.send(user);
});

router.get(
  "/:id",
  isValid.params(qs.GetUserParamsSchema),
  async (req, res, next) => {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).send("User not found");
    res.send(user);
  }
);

router.put(
  "/:id",
  isValid.params(qs.GetUserParamsSchema),
  isValid.body(qs.UpdateUserBodySchema),
  async (req, res, next) => {
    const updateObj = _.pick(req.body, ["firstName", "lastName"]);
    const user = await User.findByIdAndUpdate(req.params.id, updateObj, {
      new: true
    });
    if (!user) return res.status(404).send("User not found");
    res.send(user);
  }
);

router.put(
  "/:id/deactivate",
  isValid.params(qs.GetUserParamsSchema),
  async (req, res, next) => {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      {
        isActive: false
      },
      { new: true }
    );
    if (!user) return res.status(404).send("User not found");
    res.send(user);
  }
);

export default router;
