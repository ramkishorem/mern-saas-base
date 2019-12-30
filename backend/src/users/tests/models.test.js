import User from "../models";

describe("selectFields", () => {
  it("should return are firstName, lastName", () => {
    const selectFields = User.selectFields();
    expect(selectFields).toContain("firstName");
    expect(selectFields).toContain("lastName");
    expect(selectFields.length).toBeLessThan(
      "firstName".length + "lastName".length + 2
    );
  });
});

describe("selectFieldsForUpdate", () => {
  test("should update and returne firstName, lastName, permissions", () => {
    const selectFieldsForUpdate = User.selectFieldsForUpdate();
    expect(selectFieldsForUpdate).toEqual({
      firstName: 1,
      lastName: 1,
      permissions: 1
    });
  });
});

// describe("User Created", () => {
//   beforeEach(() => {
//     //   return initializeFoodDatabase();
//   });
//   test("");
// });
