import request from "supertest";
import server from "../../bin/www"; // to start db
import app from "../../app";
import User from "../models";

describe("/users", () => {
  // beforeEach(() => {
  //   app = require("../../app");
  // });
  afterEach(async () => {
    // app.close()
    await User.remove({});
  });

  describe("GET /", () => {
    // it("should require user to have users:read permission", () => {});
    it("should return list of users", async () => {
      await User.collection.insertMany([
        { firstName: "a", lastName: "b", email: "q@w.er" },
        { firstName: "c", firstName: "d", email: "z@we.r" }
      ]);
      const response = await request(app).get("/users");
      expect(response.status).toBe(200);
      expect(response.body.length).toBe(2);
    });
  });
});
