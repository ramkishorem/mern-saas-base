import mongoose from "mongoose";
import uniqueValidator from "mongoose-unique-validator";

const RoleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 50,
    unique: true
  },
  isActive: {
    type: Boolean,
    default: true
  }
});

RoleSchema.plugin(uniqueValidator);

const Role = mongoose.model("Role", RoleSchema);

export default Role;
