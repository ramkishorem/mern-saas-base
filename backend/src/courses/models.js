import mongoose from "mongoose";

const CourseSchema = new mongoose.Schema({
  name: String,
  hours: Number,
  remaining: Number,
  tags: []
});

CourseSchema.statics.createNew = async function(name, hours, tags) {
  try {
    let course = new Course({
      name: name,
      hours: hours,
      remaining: 0,
      tags: tags
    });
    await course.save();
    return course;
  } catch (err) {
    throw err;
  }
};

const Course = mongoose.model("Course", CourseSchema);

export default Course;
