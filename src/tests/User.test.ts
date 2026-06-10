import { User } from "../models/User";

describe("User Model Class Testing", () => {
  let user: User;

  beforeEach(() => {
    // Instantiate a new User object with default test values
    user = new User(1, "xyz", "xyz@univ.edu", "rahasia");
  });

  // Scenario 1: Constructor / Instantiation
  test("Scenario 1: Constructor should correctly initialize User attributes", () => {
    expect(user.userId).toBe(1);
    expect(user.name).toBe("xyz");
    expect(user.email).toBe("xyz@univ.edu");
    expect(user.password).toBe("rahasia");
  });

  // Scenario 2: updateProfile method
  test("Scenario 2: updateProfile should correctly modify name and email attributes", () => {
    user.updateProfile("Ahmad", "ahmad@univ.edu");

    expect(user.name).toBe("Ahmad");
    expect(user.email).toBe("ahmad@univ.edu");
    // Ensure password remains unchanged
    expect(user.password).toBe("rahasia");
  });

  // Scenario 3: changePassword method
  test("Scenario 3: changePassword should correctly modify password attribute", () => {
    user.changePassword("rahasia", "passwordBaru");

    expect(user.password).toBe("passwordBaru");
    // Ensure name and email remain unchanged
    expect(user.name).toBe("xyz");
    expect(user.email).toBe("xyz@univ.edu");
  });

  // Scenario 4: login method (default mock behavior returning false)
  test("Scenario 4: login should return false by default", () => {
    const loginResult = user.login("xyz@univ.edu", "rahasia");
    expect(loginResult).toBe(false);
  });
});
