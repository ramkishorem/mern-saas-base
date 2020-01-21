import request from "supertest";
// import server from "../../bin/www"; // to start db
import app from "../../app";
import User from "../models";
import mongoose from "mongoose";
import http from "http";

let server;
let theHappyPath;
let testUser;
let testUser2;
let testUserEdit;
const basePath = "/users/";
let fixedPath;
const fakeID = new mongoose.Types.ObjectId().toHexString();

describe("/users", () => {
  beforeAll(() => {
    // server = require("../../bin/www");
    // app = require("../../app");
    server = http.createServer(app);
    server.listen(3002);
  });
  beforeEach(() => {
    testUser = {
      email: "q@w.er",
      firstName: "First",
      lastName: "Last",
      password: "Q1w2e3r4t5"
    };
  });
  afterEach(async () => {
    await User.deleteMany({}); //remove({});
  });

  afterAll(async () => {
    await server.close();
  });

  describe("GET /", () => {
    beforeAll(() => {
      theHappyPath = async () => {
        const user = new User(testUser);
        await user.save();
        await User.collection.insertOne({
          email: "w@w.er",
          firstName: "Second",
          lastName: "Last",
          password: "Q1w2e3r4t5"
        });
        const response = await request(app)
          .get(basePath)
          .set("Authorization", "Bearer " + user.generateAuthToken());
        return response;
      };
    });
    beforeEach(() => {
      testUser.permissions = ["user:read"];
    });
    it("should require user to be logged in", async () => {
      const response = await request(app).get(basePath);
      expect(response.status).toBe(401);
    });
    it("should require user to have users:read permission", async () => {
      testUser.permissions = [];
      const response = await theHappyPath();
      expect(response.status).toBe(401);
    });
    it("should return list of users", async () => {
      const response = await theHappyPath();
      expect(response.status).toBe(200);
      expect(response.body.length).toBe(2);
    });
  });

  describe("GET /:id", () => {
    beforeAll(() => {
      theHappyPath = async custID => {
        const user = new User(testUser);
        await user.save();
        const id = custID ? custID : user._id;
        const response = await request(app)
          .get(basePath + id)
          .set("Authorization", "Bearer " + user.generateAuthToken());
        return response;
      };
    });
    beforeEach(() => {
      testUser.permissions = ["user:read"];
    });
    it("should require user to be logged in", async () => {
      const response = await request(app).get(basePath + fakeID);
      expect(response.status).toBe(401);
    });
    it("should require user to have users:read permission", async () => {
      testUser.permissions = [];
      const response = await theHappyPath();
      expect(response.status).toBe(401);
    });
    it("should return 400 for id of incorrrect format", async () => {
      const response = await theHappyPath("aaa");
      expect(response.status).toBe(400);
    });
    it("should return 404 for invalid id", async () => {
      const response = await theHappyPath(fakeID);
      expect(response.status).toBe(404);
    });
    it("should return user with the id", async () => {
      const response = await theHappyPath();
      expect(response.status).toBe(200);
      expect(response.body.firstName).toBe("First");
    });
  });

  describe("GET /me", () => {
    beforeAll(() => {
      theHappyPath = async deleteUser => {
        const user = new User(testUser);
        await user.save();
        const token = user.generateAuthToken();
        if (deleteUser) await User.deleteOne({ _id: user._id });
        const response = await request(app)
          .get(fixedPath)
          .set("Authorization", "Bearer " + token);
        return response;
      };
    });
    beforeEach(() => {
      fixedPath = basePath + "me";
    });
    it("should require user to be logged in", async () => {
      const response = await request(app).get(fixedPath);
      expect(response.status).toBe(401);
    });
    it("should return 404 if user with id in token does not exist", async () => {
      const deleteUser = true;
      const response = await theHappyPath(deleteUser);
      expect(response.status).toBe(404);
    });
    it("should return user with the id", async () => {
      const response = await theHappyPath();
      expect(response.status).toBe(200);
      expect(response.body.firstName).toBe("First");
    });
  });

  describe("POST /", () => {
    beforeAll(() => {
      theHappyPath = async () => {
        const user = new User(testUser);
        await user.save();
        const response = await request(app)
          .post(basePath)
          .set("Authorization", "Bearer " + user.generateAuthToken())
          .send(testUser2);
        return response;
      };
    });
    beforeEach(() => {
      testUser.permissions = ["user:create"];
      testUser2 = {
        email: "w@w.er",
        firstName: "Second",
        lastName: "Last",
        password: "Q1w2e3r4t5"
      };
    });
    it("should require user to be logged in", async () => {
      const response = await request(app)
        .post(basePath)
        .send(testUser2);
      expect(response.status).toBe(401);
    });
    it("should require user to have user:create permissions", async () => {
      testUser.permissions = [];
      const response = await theHappyPath();
      expect(response.status).toBe(401);
    });
    it("should require email id", async () => {
      delete testUser2.email;
      const response = await theHappyPath();
      expect(response.status).toBe(400);
    });
    it("should require password", async () => {
      delete testUser2.password;
      const response = await theHappyPath();
      expect(response.status).toBe(400);
    });
    it("should require firstName", async () => {
      delete testUser2.firstName;
      const response = await theHappyPath();
      expect(response.status).toBe(400);
    });
    it("should require lastName", async () => {
      delete testUser2.lastName;
      const response = await theHappyPath();
      expect(response.status).toBe(400);
    });
    it("should require valid email id", async () => {
      testUser2.email = "aaa";
      const response = await theHappyPath();
      expect(response.status).toBe(400);
    });
    it("should require valid password of required strength", async () => {
      testUser2.password = "aaaa1234";
      const response = await theHappyPath();
      expect(response.status).toBe(400);
    });
    it("should require firstName to be of length 50 max", async () => {
      testUser2.firstName = "a".repeat(51);
      const response = await theHappyPath();
      expect(response.status).toBe(400);
    });
    it("should require lastName to be of length 50 max", async () => {
      testUser2.lastName = "a".repeat(51);
      const response = await theHappyPath();
      expect(response.status).toBe(400);
    });
    it("should return created user if everything is fine", async () => {
      const response = await theHappyPath();
      expect(response.status).toBe(200);
    });
  });

  describe("PUT /:id", () => {
    beforeAll(() => {
      theHappyPath = async custID => {
        const user = new User(testUser);
        await user.save();
        const id = custID ? custID : user._id;
        const response = await request(app)
          .put(basePath + id)
          .set("Authorization", "Bearer " + user.generateAuthToken())
          .send(testUserEdit);
        return response;
      };
    });
    beforeEach(() => {
      testUser.permissions = ["user:write"];
      testUserEdit = {
        firstName: "NewFirst",
        lastName: "NewLast",
        permissions: []
      };
    });
    it("should require user to be logged in", async () => {
      const response = await request(app).put(basePath + fakeID);
      expect(response.status).toBe(401);
    });
    it("should require user to have users:write permission", async () => {
      testUser.permissions = [];
      const response = await theHappyPath();
      expect(response.status).toBe(401);
    });
    it("should return 400 for id of incorrrect format", async () => {
      const response = await theHappyPath("aaa");
      expect(response.status).toBe(400);
    });
    it("should return 404 for invalid id", async () => {
      const response = await theHappyPath(fakeID);
      expect(response.status).toBe(404);
    });
    it("should require firstName to be of length 50 max", async () => {
      testUserEdit.firstName = "a".repeat(51);
      const response = await theHappyPath();
      expect(response.status).toBe(400);
    });
    it("should require lastName to be of length 50 max", async () => {
      testUserEdit.lastName = "a".repeat(51);
      const response = await theHappyPath();
      expect(response.status).toBe(400);
    });
    it("should return user with the id", async () => {
      const response = await theHappyPath();
      expect(response.status).toBe(200);
      expect(response.body.firstName).toBe("NewFirst");
    });
  });

  describe("PUT /:id/deactivate", () => {
    beforeAll(() => {
      theHappyPath = async custID => {
        const user = new User(testUser);
        await user.save();
        const user2 = new User(testUser2);
        await user2.save();
        const id = custID ? custID : user2._id;
        const response = await request(app)
          .put(basePath + id + "/deactivate")
          .set("Authorization", "Bearer " + user.generateAuthToken());
        return response;
      };
    });
    beforeEach(() => {
      testUser.permissions = ["admin"];
    });
    it("should require user to be logged in", async () => {
      const response = await request(app).put(
        basePath + fakeID + "/deactivate"
      );
      expect(response.status).toBe(401);
    });
    it("should require user to have admin privileges", async () => {
      testUser.permissions = [];
      const response = await theHappyPath();
      expect(response.status).toBe(401);
    });
    it("should return 400 for id of incorrrect format", async () => {
      const response = await theHappyPath("aaa");
      expect(response.status).toBe(400);
    });
    it("should return 404 for invalid id", async () => {
      const response = await theHappyPath(fakeID);
      expect(response.status).toBe(404);
    });
    it("should deactivate user with the id", async () => {
      const response = await theHappyPath();
      expect(response.status).toBe(200);
      const user = await User.findById(response.body._id);
      expect(user.isActive).toBe(false);
    });
  });
});
