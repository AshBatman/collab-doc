const Users = require("../models/userModel");
const { statusCodes } = require("../utils/constants");

const createUser = async (req, res) => {
  const { userName } = req.params;

  try {
    const isExistingUser = await Users.findOne({ userName });

    if (isExistingUser) {
      return res
        .status(statusCodes.SUCCESS.code)
        .json({
          message: "User already exists",
          userID: isExistingUser.userID,
        });
    }

    const newUser = new Users({ userName });

    await newUser.save();

    return res
      .status(statusCodes.CREATED.code)
      .json({ message: "User created", userID: newUser.userID });
  } catch (error) {
    console.log(error);
    return res
      .status(statusCodes.INTERNAL_SERVER_ERROR.code)
      .json({ message: statusCodes.INTERNAL_SERVER_ERROR.message });
  }
};

module.exports = { createUser };
