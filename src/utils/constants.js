const statusCodes = {
    SUCCESS: {
        code: 200,
        message: 'Successfully processed your request'
    },
    CREATED: {
        code: 201,
        message: "Resource succssfully created"
    },
    BAD_REQUEST: {
        code: 400,
        message: "Bad request"
    },
    INTERNAL_SERVER_ERROR: {
        code: 500,
        message: "Internal server error"
    }
}

module.exports = statusCodes;