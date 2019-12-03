import mongoose from "mongoose";
import { isEmail } from "validator";

const UserSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    maxlength: 50
  },
  lastName: {
    type: String,
    required: true,
    maxlength: 50
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: [isEmail, "Invalid email"]
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
    maxlength: 1024
  },
  isActive: {
    type: Boolean,
    default: true
  }
});

const User = mongoose.model("User", UserSchema);

export default User;
