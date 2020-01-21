// import server from "../../bin/www";
import request from "supertest";
import _ from "lodash";
import app from "../../app";
import http from "http";
import User from "../../users/models";

let testUser;
let loginData;
const basePath = "/auth";
let currentURL;
let theHappyPath;
let server;

describe("/auth/login", () => {
  beforeAll(() => {
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
    loginData = _.pick(testUser, ["email", "password"]);
  });
  afterEach(async () => {
    await User.deleteMany({});
  });

  afterAll(async () => {
    await server.close();
  });
  describe("POST /", () => {
    beforeAll(() => {
      currentURL = basePath + "/login";
      theHappyPath = async () => {
        const user = new User(testUser);
        await user.save();
        expect(currentURL).toBe("/auth/login");
        const response = await request(app)
          .post(currentURL)
          .send(loginData);
        return response;
      };
    });
    it("should require valid email", async () => {
      loginData.email = "zz@qqq";
      const response = await theHappyPath();
      expect(response.status).toBe(400);
    });
    it("should return 400 when invalid username/password", async () => {
      loginData.email = "zz@w.er";
      const response = await theHappyPath();
      expect(response.status).toBe(400);
      expect(response.text).toContain("Invalid username or password");
    });
    it("should return a jwt token on successful login", async () => {
      const response = await theHappyPath();
      expect(response.status).toBe(200);
      expect(response.header).toHaveProperty("x-auth-token");
    });
  });
});
