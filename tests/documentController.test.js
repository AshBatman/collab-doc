// documentController.test.js

const Documents = require("../src/models/documentModel");
const Users = require("../src/models/userModel");
const redisClient = require("../src/config/redis");
const { statusCodes } = require("../src/utils/constants");
const { createDocument, fetchAllDocuments, fetchDocumentByID, addCollaborator, saveDocumentsToMongo } = require("../src/controllers/documentController");

jest.mock("../src/models/documentModel");
jest.mock("../src/models/userModel");
jest.mock('../src/config/redis', () => ({
  keys: jest.fn(),
  hGetAll: jest.fn(),
}));

describe("Document Controller", () => {
  let req, res;

  beforeEach(() => {
    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("createDocument", () => {
    it("should create a new document and return it", async () => {
      req.body = { title: "Test Document", ownerId: "123" };
      const newDocument = { documentId: "uuid", title: "Test Document", ownerId: "123", collaborators: [] };

      Documents.prototype.save = jest.fn().mockResolvedValue(newDocument);

      await createDocument(req, res);

      expect(Documents.prototype.save).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(statusCodes.CREATED.code);
      expect(res.json).toHaveBeenCalledWith(newDocument);
    });
  });

  describe("fetchAllDocuments", () => {
    it("should fetch all documents with details", async () => {
      const documents = [
        { documentId: "1", title: "Doc 1", ownerId: "owner1", collaborators: [] },
      ];
      const owner = { userID: "owner1", userName: "OwnerUser" };

      Documents.find.mockResolvedValue(documents);
      Users.findOne.mockResolvedValue(owner);

      await fetchAllDocuments(req, res);

      expect(Documents.find).toHaveBeenCalled();
      expect(Users.findOne).toHaveBeenCalledWith({ userID: "owner1" });
      expect(res.status).toHaveBeenCalledWith(statusCodes.SUCCESS.code);
      expect(res.json).toHaveBeenCalledWith([
        {
          documentId: "1",
          title: "Doc 1",
          owner: { userId: "owner1", username: "OwnerUser", lastUpdated: owner.updatedAt },
          collaborators: [],
        },
      ]);
    });

    it("should return a 500 error if fetching documents fails", async () => {
      Documents.find.mockRejectedValue(new Error("Database error"));

      await fetchAllDocuments(req, res);

      expect(Documents.find).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: "Failed to fetch documents", error: expect.any(Error) });
    });
  });

  describe("fetchDocumentByID", () => {
    it("should fetch a document by ID and return it", async () => {
      req.params = { id: "1" };
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);

      const today = new Date()
      const document = { documentId: "1", title: "Doc 1", content: "content", ownerId: "owner1", collaborators: [{ userId: "collab1" }], updatedAt: yesterday.toISOString() };
      const owner = { userID: "owner1", userName: "OwnerUser" };
      const collaborators = [{ userId: "collab1", userName: "Collaborator1" }];
      const redisDocument = { content: "cached content", updatedAt: today };

      redisClient.hGetAll.mockResolvedValue(redisDocument);
      Documents.findOne.mockResolvedValue(document);
      Users.findOne.mockResolvedValue(owner);
      Users.find.mockResolvedValue(collaborators);

      await fetchDocumentByID(req, res);

      expect(Documents.findOne).toHaveBeenCalledWith({ documentId: "1" });
      expect(res.status).toHaveBeenCalledWith(statusCodes.SUCCESS.code);
      expect(res.json).toHaveBeenCalledWith({
        documentId: "1",
        title: "Doc 1",
        content: "cached content",
        updatedAt: today,
        owner: "owner1",
        ownerName: "OwnerUser",
        collaborators: [],
      });
    });

    it("should return 404 if document is not found", async () => {
      req.params = { id: "1" };
      Documents.findOne.mockResolvedValue(null);

      await fetchDocumentByID(req, res);

      expect(Documents.findOne).toHaveBeenCalledWith({ documentId: "1" });
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: "Document not found" });
    });
  });

  describe("addCollaborator", () => {
    it("should add a collaborator to a document", async () => {
      req.body = { documentId: "1", userId: "collab1" };
      const document = { documentId: "1", collaborators: [], save: jest.fn().mockResolvedValue() };

      Documents.findOne.mockResolvedValue(document);

      await addCollaborator(req, res);

      expect(Documents.findOne).toHaveBeenCalledWith({ documentId: "1" });
      expect(document.save).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith({ message: "Collaborator added successfully" });
    });

    it("should return a 404 error if document is not found", async () => {
      req.body = { documentId: "1", userId: "collab1" };
      Documents.findOne.mockResolvedValue(null);

      await addCollaborator(req, res);

      expect(Documents.findOne).toHaveBeenCalledWith({ documentId: "1" });
      expect(res.status).toHaveBeenCalledWith(statusCodes.NOT_FOUND.code);
      expect(res.json).toHaveBeenCalledWith({ error: "Document not found" });
    });
  });

  describe("saveDocumentsToMongo", () => {
    it("should save documents from Redis to MongoDB", async () => {
      const redisKeys = ["document:1"];
      const redisDocument = { content: "cached content", updatedAt: new Date().toISOString() };

      redisClient.keys.mockResolvedValue(redisKeys);
      redisClient.hGetAll.mockResolvedValue(redisDocument);
      Documents.findOneAndUpdate.mockResolvedValue();

      await saveDocumentsToMongo();

      expect(redisClient.keys).toHaveBeenCalledWith("document:*");
      expect(redisClient.hGetAll).toHaveBeenCalledWith("document:1");
      expect(Documents.findOneAndUpdate).toHaveBeenCalledWith(
        { documentId: "1" },
        { content: "cached content", updatedAt: expect.any(Date) },
        { upsert: true }
      );
    });
  });
});
