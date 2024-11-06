const statusCodes = {
  SUCCESS: {
    code: 200,
    message: "Successfully processed your request",
  },
  CREATED: {
    code: 201,
    message: "Resource succssfully created",
  },
  BAD_REQUEST: {
    code: 400,
    message: "Bad request",
  },
  NOT_FOUND: {
    code: 400,
    message: "Not found",
  },
  INTERNAL_SERVER_ERROR: {
    code: 500,
    message: "Internal server error",
  },
};

REDIS_SYNC_INTERVAL = 2000;

module.exports = {
  statusCodes,
  REDIS_SYNC_INTERVAL,
};
