const express = require("express");
const { statusCodes } = require("../utils/constants");

const router = express.Router();

// Healthz API
router.get("/healthz", (req, res) => {
  res
    .status(statusCodes.SUCCESS.code)
    .json({ message: statusCodes.SUCCESS.message });
});

module.exports = router;
