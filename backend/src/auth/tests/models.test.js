import Role from "../models";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
require("../../db");

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
});
