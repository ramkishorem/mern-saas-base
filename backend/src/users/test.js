import User from "./models";

describe("User values returned retriction", () => {
  test("fields returned are firstName, lastName", () => {
    const selectFields = User.selectFields();
    expect(selectFields).toContain("firstName");
    expect(selectFields).toContain("lastName");
    expect(selectFields.length).toBeLessThan(
      "firstName".length + "lastName".length + 2
    );
  });
  test("fields updated and returned are firstName, lastName, permissions", () => {
    const selectFieldsForUpdate = User.selectFieldsForUpdate();
    expect(selectFieldsForUpdate).toEqual({
      firstName: 1,
      lastName: 1,
      permissions: 1
    });
  });
});

describe("User Created", () => {
  beforeEach(() => {
    //   return initializeFoodDatabase();
  });
  test("");
});
