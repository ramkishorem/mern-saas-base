import User from "../models";
import jest from "jest-mock";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

describe("selectFields", () => {
  it("should return are firstName, lastName", () => {
    const selectFields = User.selectFields();
    expect(selectFields).toContain("firstName");
    expect(selectFields).toContain("lastName");
    expect(selectFields.length).toBeLessThan(
      "firstName".length + "lastcmderName".length + 2
    );
  });
});

describe("selectFieldsForUpdate", () => {
  it("should update and returne firstName, lastName, permissions", () => {
    const selectFieldsForUpdate = User.selectFieldsForUpdate();
    expect(selectFieldsForUpdate).toEqual({
      firstName: 1,
      lastName: 1,
      permissions: 1
    });
  });
});

describe("comparePassword", () => {
  it("should compare passwords", () => {
    bcrypt.compare = jest.fn().mockResolvedValue(true);
    const user = new User({ _id: 1, permissions: ["admin"], password: "a" });
    user.comparePassword("a");
    expect(bcrypt.compare).toBeCalled();
    expect(bcrypt.compare.mock.calls[0][0]).toBe("a");
  });
});

describe("generateAuthToken", () => {
  it("should return a valid Auth token with _id and permissions", () => {
    const payload = {
      _id: new mongoose.Types.ObjectId().toHexString(),
      permissions: ["admin"]
    };
    const user = new User(payload);
    const token = user.generateAuthToken();
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    expect(decoded).toMatchObject(payload);
  });
});

// describe("User Created", () => {
//   beforeEach(() => {
//     //   return initializeFoodDatabase();
//   });
//   test("");
// });
