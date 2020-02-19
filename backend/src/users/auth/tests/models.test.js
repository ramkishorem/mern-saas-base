import Role from "../models";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
require("../../../startup/db");

let testRole;
let testRole2;

describe("RoleSchema", () => {
  beforeAll(() => {});
  beforeEach(() => {
    testRole = {
      name: "role1"
    };
  });
  afterEach(async () => {
    await Role.deleteMany({}); //remove({});
  });

  afterAll(async () => {});
  describe("Model Validation", () => {
    it("should throw error when duplicate role name is used", async () => {
      const role = new Role(testRole);
      await role.save();
      try {
        const role2 = new Role({ name: "role1" });
        await role2.save();
      } catch (e) {
        expect(e.name).toBe("ValidationError");
      }
    });
  });

  describe("inheritedPermissionsArray Method", () => {
    it("should return an array of inheritedPermissions", async () => {
      testRole.inheritedPermissions = [
        { name: "permission1", parent: "parentRole1" }
      ];
      const role = new Role(testRole);
      await role.save();
      const roles = await role.inheritedPermissionsArray();
      expect(roles.length).toBe(1);
      expect(roles[0]).toBe("permission1");
    });
  });

  describe("pre Save Method to update permissions", () => {
    it("should update permissions field when ownedPermissions changes", async () => {
      const role = new Role(testRole);
      await role.save();
      await role.addPermissions(["permission1"]);
      expect(role.permissions.length).toBe(1);
      expect(role.permissions).toContain("permission1");
    });
    it("should update permissions field when inheritedPermissions changes", async () => {
      const role = new Role(testRole);
      await role.save();
      await role.addPermissions([
        { name: "permission1", parent: "parentRole" }
      ]);
      expect(role.permissions.length).toBe(1);
      expect(role.permissions).toContain("permission1");
    });
  });

  describe("addPermissions Method", () => {
    it("should add permissions without parent to owned permissions", async () => {
      const role = new Role(testRole);
      await role.save();
      await role.addPermissions(["permission1"]);
      expect(role.ownedPermissions.length).toBe(1);
      expect(role.ownedPermissions).toContain("permission1");
    });
    it("should add permissions with parent to inherited permissions", async () => {
      const role = new Role(testRole);
      await role.save();
      await role.addPermissions([
        { name: "permission1", parent: "parentRole" }
      ]);
      expect(role.inheritedPermissions.length).toBe(1);
      expect(role.inheritedPermissions[0].name).toBe("permission1");
      expect(role.inheritedPermissions[0].parent).toBe("parentRole");
    });
    it("should be add permissions of both kind at the same time", async () => {
      const role = new Role(testRole);
      await role.save();
      await role.addPermissions([
        { name: "permission0" },
        { name: "permission2" },
        { name: "permission1", parent: "parentRole" }
      ]);
      expect(role.ownedPermissions.length).toBe(2);
      expect(role.inheritedPermissions.length).toBe(1);
      expect(role.ownedPermissions).toContain("permission0");
      expect(role.inheritedPermissions[1].name).toBe("permission1");
      expect(role.inheritedPermissions[1].parent).toBe("parentRole");
    });
  });
});
