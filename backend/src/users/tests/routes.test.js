import request from "supertest";
import app from "../../app";

describe("/users", () => {
  // beforeEach(() => {
  //   app = require("../../app");
  // });
  // afterEach(() => app.close());

  describe("GET /", () => {
    // it("should require user to have users:read permission", () => {});
    it("should return list of users", () => {
      // const response = await request(app).get("/users");
      // expect(response.status).toBe(200);
      // expect(response).toContain();
      // async await is NOT WORKING
      request(app)
        .get("/users")
        .then(response => {
          expect(response.statusCode).toBe(200);
          done();
        });
    });
  });
});
