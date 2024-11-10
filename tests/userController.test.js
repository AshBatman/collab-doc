const Users = require("../src/models/userModel");
const { statusCodes } = require("../src/utils/constants");
const { createUser } = require("../src/controllers/userController");

jest.mock("../src/models/userModel");

describe("createUser", () => {
  let req, res;

  beforeEach(() => {
    req = { params: { userName: "testUser" } };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return an existing user if found", async () => {
    Users.findOne.mockResolvedValue({ userID: "12345", userName: "testUser" });
    await createUser(req, res);

    expect(Users.findOne).toHaveBeenCalledWith({ userName: "testUser" });
    expect(res.status).toHaveBeenCalledWith(statusCodes.SUCCESS.code);
    expect(res.json).toHaveBeenCalledWith({
      message: "User already exists",
      userID: "12345",
    });
  });

  it("should create a new user if not found", async () => {
    Users.findOne.mockResolvedValue(null);
    
    const saveMock = jest.fn().mockResolvedValue();
    Users.mockImplementation(() => ({
      save: saveMock,
      userID: "67890",
    }));

    await createUser(req, res);

    expect(Users.findOne).toHaveBeenCalledWith({ userName: "testUser" });
    expect(saveMock).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(statusCodes.CREATED.code);
    expect(res.json).toHaveBeenCalledWith({
      message: "User created",
      userID: "67890",
    });
  });

  it("should handle errors and return a 500 status code", async () => {
    Users.findOne.mockRejectedValue(new Error("Database error"));

    await createUser(req, res);

    expect(Users.findOne).toHaveBeenCalledWith({ userName: "testUser" });
    expect(res.status).toHaveBeenCalledWith(statusCodes.INTERNAL_SERVER_ERROR.code);
    expect(res.json).toHaveBeenCalledWith({
      message: statusCodes.INTERNAL_SERVER_ERROR.message,
    });
  });
});
