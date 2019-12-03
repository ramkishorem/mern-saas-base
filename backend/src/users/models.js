import mongoose from "mongoose";
import { isEmail } from "validator";
import bcrypt from "bcrypt";
import config from "config";
import uniqueValidator from "mongoose-unique-validator";
const SALT_WORK_FACTOR = config.has("SALT_WORK_FACTOR")
  ? config.get("SALT_WORK_FACTOR")
  : 10;

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

UserSchema.plugin(uniqueValidator);

UserSchema.pre("save", async function(next) {
  // only hash the password if it has been modified (or is new)
  if (!this.isModified("password")) return next();
  // generate a salt
  const salt = await bcrypt.genSalt(SALT_WORK_FACTOR);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

UserSchema.methods.comparePassword = async function(password) {
  const isMatch = await bcrypt.compare(password, this.password);
  return isMatch;
};

const User = mongoose.model("User", UserSchema);

export default User;
