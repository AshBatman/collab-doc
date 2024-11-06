const express = require('express');
const { createDocument, fetchAllDocuments, fetchDocumentByID, addCollaborator  } = require('../controllers/documentController');

const router = express.Router();

// API to create a new document
router.post('/document/create', createDocument);

// API to fetch all the document in the DB
router.get('/document/all', fetchAllDocuments);

// API to add collaborators
router.put('/document/collaborators', addCollaborator);

// API to fetch document by ID
router.get('/document/:id', fetchDocumentByID);

module.exports = router;