import mongoose from "mongoose";
import { isEmail } from "validator";
import bcrypt from "bcrypt";
import config from "config";
import jsonwebtoken from "jsonwebtoken";
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
  },
  permissions: {
    type: [String]
  }
});

UserSchema.plugin(uniqueValidator);

UserSchema.statics.selectFields = function() {
  return "firstName lastName permissions";
};

UserSchema.statics.selectFieldsForUpdate = function() {
  return { firstName: 1, lastName: 1, permissions: 1 };
};

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

UserSchema.methods.generateAuthToken = function() {
  if (!this.isActive) {
    const error = new Error("User is Inactive");
    error.name = "UnauthorizedError";
    throw error;
  }
  const token = jsonwebtoken.sign(
    { _id: this.id, permissions: this.permissions },
    process.env.JWT_SECRET_KEY
  );
  return token;
};

const User = mongoose.model("User", UserSchema);

export default User;
