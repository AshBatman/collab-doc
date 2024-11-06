const redisClient = require("../config/redis");

const syncDocumentChanges = async (documentChanges) => {
    const documentIds = Object.keys(documentChanges);

    for (const documentId of documentIds) {
      const { content, updatedAt } = documentChanges[documentId];
      const redisKey = `document:${documentId}`;
      await redisClient.hSet(redisKey, { content, updatedAt });
    }

    // Clear the in-memory changes after syncing
    for (const documentId of documentIds) {
      delete documentChanges[documentId];
    }
};

module.exports = { syncDocumentChanges };
