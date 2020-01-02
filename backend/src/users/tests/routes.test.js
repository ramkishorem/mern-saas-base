import request from "supertest";
import server from "../../bin/www"; // to start db
import app from "../../app";
import User from "../models";
import mongoose from "mongoose";

const testUser = {
  email: "q@w.er",
  firstName: "First",
  lastName: "Last",
  password: "Q1w2e3r4t5"
};

let testUser2;

describe("/users", () => {
  beforeEach(() => {
    testUser2 = {
      email: "w@w.er",
      firstName: "Second",
      lastName: "Last",
      password: "Q1w2e3r4t5"
    };
  });
  afterEach(async () => {
    await User.remove({});
  });

  afterAll(async () => {
    await server.close();
  });

  describe("GET /", () => {
    // it("should require user to have users:read permission", () => {});
    it("should return list of users", async () => {
      await User.collection.insertMany([testUser, testUser2]);
      const response = await request(app).get("/users");
      expect(response.status).toBe(200);
      expect(response.body.length).toBe(2);
    });
  });

  describe("GET /:id", () => {
    // it("should require user to have users:read permission", () => {});
    it("should return user with the id", async () => {
      const user = new User(testUser);
      await user.save();
      const response = await request(app).get("/users/" + user._id);
      expect(response.status).toBe(200);
      expect(response.body.firstName).toBe("First");
    });
    it("should return 404 for invalid id", async () => {
      const fake_id = new mongoose.Types.ObjectId().toHexString();
      const response = await request(app).get("/users/" + fake_id);
      expect(response.status).toBe(404);
    });
  });

  describe("POST /", () => {
    it("should require user to be logged in", async () => {
      const response = await request(app)
        .post("/users")
        .send(testUser);
      expect(response.status).toBe(401);
    });

    it("should require user to have user:create permissions", async () => {
      const user = new User(testUser);
      await user.save();
      const response = await request(app)
        .post("/users")
        .set("Authorization", "Bearer " + user.generateAuthToken())
        .send(testUser2);
      expect(response.status).toBe(401);
    });

    it("should require valid email id", async () => {
      testUser.permissions = ["user:create"];
      const user = new User(testUser);
      await user.save();
      testUser2.email = "aaa";
      const response = await request(app)
        .post("/users")
        .set("Authorization", "Bearer " + user.generateAuthToken())
        .send(testUser2);
      expect(response.status).toBe(400);
    });

    it("should return created user if everything is fine", async () => {
      testUser.permissions = ["user:create"];
      const user = new User(testUser);
      await user.save();
      testUser2.email = "w@w.er";
      const response = await request(app)
        .post("/users")
        .set("Authorization", "Bearer " + user.generateAuthToken())
        .send(testUser2);
      expect(response.status).toBe(200);
    });
  });
});
