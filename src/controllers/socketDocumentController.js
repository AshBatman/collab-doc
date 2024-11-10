const redisClient = require("../config/redis");
const Document = require("../models/documentModel");
const { syncDocumentChanges } = require("../services/syncService");

let documentChanges = {};

const setupSocketHandlers = (io) => {
  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on("join-document", async (documentId) => {
      socket.join(documentId);
      const redisKey = `document:${documentId}`;
      let documentData = await redisClient.hGetAll(redisKey);

      // If document is not in Redis, fetch from MongoDB and store in Redis
      if (Object.keys(documentData).length === 0) {
        const document = await Document.findOne({documentId});
        if (document) {
          documentData = {
            content: document.content,
            updatedAt: document.updatedAt.toISOString(),
          };
          await redisClient.hSet(redisKey, documentData);
        }
      }

      socket.emit("load-document", documentData.content);
    });

    socket.on("edit-document", ({ documentId, content, updatedAt }) => {
      documentChanges[documentId] = { content, updatedAt };
      socket.to(documentId).emit("receive-changes", { content, updatedAt });
      syncDocumentChanges(documentChanges);
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });
};

module.exports = { setupSocketHandlers };
