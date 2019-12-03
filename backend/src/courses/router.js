import express from "express";
import _ from "lodash";
import { createValidator } from "express-joi-validation";
import * as qs from "./querySchema";
import Course from "./models";

const router = express.Router();
const isValid = createValidator();

router.get("/", async (req, res, next) => {
  const courses = await Course.find().limit(50);
  res.send(courses);
});

router.post(
  "/",
  isValid.body(qs.NewCourseBodySchema),
  async (req, res, next) => {
    const { name, hours, tags } = req.body;
    const course = await Course.createNew(name, hours, tags);
    res.send(course);
  }
);

router.get(
  "/:id",
  isValid.params(qs.GetCourseParamsSchema),
  async (req, res, next) => {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).send("Course not found");
    res.send(course);
  }
);

router.put(
  "/:id",
  isValid.params(qs.GetCourseParamsSchema),
  isValid.body(qs.UpdateCourseBodySchema),
  async (req, res, next) => {
    const updateObj = _.pick(req.body, ["name", "hours", "remaining", "tags"]);
    const course = await Course.findByIdAndUpdate(req.params.id, updateObj, {
      new: true
    });
    if (!course) return res.status(404).send("Course not found");
    res.send(course);
  }
);

router.delete(
  "/:id",
  isValid.params(qs.GetCourseParamsSchema),
  async (req, res, next) => {
    const result = await Course.deleteOne({ _id: req.params.id });
    if (result.n === 0) return res.status(404).send("Course not found");
    res.send("Course deleted");
  }
);

export default router;
