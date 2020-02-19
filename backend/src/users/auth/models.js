import mongoose from "mongoose";
import uniqueValidator from "mongoose-unique-validator";
import _ from "lodash";

const roleNameSchema = {
  type: String,
  required: true,
  minlength: 3,
  maxlength: 50,
  unique: true
};

const RoleSchema = new mongoose.Schema({
  name: roleNameSchema,
  isActive: {
    type: Boolean,
    default: true
  },
  ownedPermissions: {
    type: [String]
  },
  inheritedPermissions: [
    {
      name: String,
      parent: roleNameSchema
    }
  ],
  permissions: {
    type: [String]
  }
});

RoleSchema.plugin(uniqueValidator);

RoleSchema.pre("save", async function(next) {
  // Update permissions when ownedPermissions or inheritedPermissions change
  if (
    !this.isModified("ownedPermissions") &&
    !this.isModified("inheritedPermissions")
  )
    return next();
  const ownedPermissions = this.ownedPermissions;
  const inheritedPermissions = this.inheritedPermissions.map(a => a.name);
  this.permissions = _.union(ownedPermissions, inheritedPermissions);
  next();
});

// RoleSchema.post("save", async function(next) {
//   // Update permissions when ownedPermissions or inheritedPermissions change
//   if (!this.isModified("permissions")) return next();
//   const ownedPermissions = this.ownedPermissions;
//   const inheritedPermissions = this.inheritedPermissionsArray();
//   this.permissions = _.union(ownedPermissions, inheritedPermissions);
//   next();
// });

RoleSchema.methods.inheritedPermissionsArray = async function() {
  const perms = this.inheritedPermissions;
  const inheritedPermissions = perms.map(a => a.name);
  return inheritedPermissions;
};

RoleSchema.methods.addPermissions = async function(permissions) {
  /* Expects array of permissions ({name, parent}) */
  permissions.forEach(async permission => {
    if (!permission.parent) {
      const ownedPermissions = this.ownedPermissions;
      if (ownedPermissions.includes(permission)) return;
      this.ownedPermissions.push(permission);
    } else {
      const inheritedPermissions = await this.inheritedPermissionsArray();
      if (inheritedPermissions.includes(permission)) return;
      this.inheritedPermissions.push({
        name: permission.name,
        parent: permission.parent
      });
    }
  });
  await this.save();
};

const Role = mongoose.model("Role", RoleSchema);

export default Role;
