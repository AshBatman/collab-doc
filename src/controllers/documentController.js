const Documents = require("../models/documentModel");
const Users = require("../models/userModel");
const { statusCodes } = require("../utils/constants");
const { v4: uuidv4 } = require("uuid");
const redisClient = require("../config/redis");

const createDocument = async (req, res) => {
  const { title, ownerId } = req.body;

  const newDocument = new Documents({
    documentId: uuidv4(),
    title,
    ownerId,
    collaborators: [],
  });

  await newDocument.save();
  res.status(statusCodes.CREATED.code).json(newDocument);
};

const getDocumentOwner = async (userID) => {
  return await Users.findOne({ userID: userID });
};

const getCollaborators = async (collaboratorIds) => {
  const collaborators = await Users.find({ userID: { $in: collaboratorIds } });
  return collaborators.map((collab) => ({
    userId: collab.userID,
    username: collab.userName,
  }));
};

const fetchAllDocuments = async (req, res) => {
  try {
    // will add lazy scrolling in future
    const documents = await Documents.find({});
    const documentsWithDetails = await Promise.all(
      documents.map(async (doc) => {
        const owner = await getDocumentOwner(doc.ownerId);
        let collaboratorIds = [];
        let collaborators = [];

        if (doc.collaborators) {
          collaboratorIds = doc.collaborators.map((collab) => collab.userId);
          collaborators = await getCollaborators(collaboratorIds);
        }

        return {
          documentId: doc.documentId,
          title: doc.title,
          owner: {
            userId: doc.ownerId,
            username: owner.userName,
            lastUpdated: owner.updatedAt,
          },
          collaborators: collaborators.filter((c) => c !== null),
        };
      })
    );
    res.status(statusCodes.SUCCESS.code).json(documentsWithDetails);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch documents", error });
  }
};

const fetchDocumentByID = async (req, res) => {
  try {
    const { id } = req.params;

    const redisKey = `document:${id}`;
    const redisDocument = await redisClient.hGetAll(redisKey);
    const redisUpdatedAt = redisDocument.updatedAt
      ? new Date(redisDocument.updatedAt)
      : null;

    let document = await Documents.findOne({ documentId: id });

    let collaboratorIds = [];
    let collaborators = [];

    if (document.collaborators) {
      collaboratorIds = document.collaborators.map((collab) => collab.userId);
      collaborators = await getCollaborators(collaboratorIds);
      collaborators = collaborators.map((user) => user.username);
    }

    const ownerName = await getDocumentOwner(document.ownerId);

    if (document) {
      const newDocumentResponse = {
        documentId: document.documentId,
        title: document.title,
        content:
        redisDocument.content && redisUpdatedAt && redisUpdatedAt > new Date(document.updatedAt)
            ? redisDocument.content
            : document.content,
        updatedAt:
        redisDocument.content && redisUpdatedAt && redisUpdatedAt > new Date(document.updatedAt)
            ? redisUpdatedAt
            : document.updatedAt,
        owner: document.ownerId,
        ownerName: ownerName.userName,
        collaborators: collaborators
      };

      res.status(statusCodes.SUCCESS.code).json(newDocumentResponse);
    } else {
      res.status(404).json({ message: "Document not found" });
    }
  } catch (error) {
    res.status(500).json({
      message: `Something went wrong while fetch the document ${req.params.id}`,
      error,
    });
  }
};

const addCollaborator = async (req, res) => {
  const { documentId, userId } = req.body;

  try {
    let document = await Documents.findOne({ documentId });

    if (!document) {
      return res
        .status(statusCodes.NOT_FOUND.code)
        .json({ error: "Document not found" });
    }

    const existingCollaborators = document.collaborators || [];

    const isAlreadyCollaborator = existingCollaborators.some(
      (collab) => collab.userId === userId
    );

    if (!isAlreadyCollaborator && !(document.ownerId == userId)) {
      existingCollaborators.push({ userId, permission: "write" });

      document.collaborators = existingCollaborators;

      document.save();

      res.json({ message: "Collaborator added successfully" });
    } else {
      res.json({ message: "User is already a collaborator" });
    }
  } catch (error) {
    res.status(500).json({
      message: `Something went wrong while adding collaborator ${documentId}`,
      error,
    });
  }
};

const saveDocumentsToMongo = async () => {
  try {
    const keys = await redisClient.keys("document:*");

    for (const key of keys) {
      const documentData = await redisClient.hGetAll(key);
      if (documentData && documentData.content) {
        const documentId = key.split(":")[1];

        await Documents.findOneAndUpdate(
          { documentId },
          {
            content: documentData.content,
            updatedAt: new Date(documentData.updatedAt),
          },
          { upsert: true }
        );

        console.log(`Document ${documentId} saved to MongoDB.`);
      }
    }
  } catch (error) {
    console.error("Error saving documents to MongoDB:", error);
  }
};

module.exports = {
  createDocument,
  fetchAllDocuments,
  fetchDocumentByID,
  addCollaborator,
  saveDocumentsToMongo,
};
