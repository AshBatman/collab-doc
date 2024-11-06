const mongoose = require('mongoose');

const DocumentSchema = new mongoose.Schema({
    documentId: {
        type: String,
        required: true,
        unique: true
    },
    title: String,
    ownerId: String,
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
    collaborators: [
        {
            userId: String,
            permission: { type: String, default: 'write' }
        }
    ],
    content: { type: String, default: '' }
});

module.exports = mongoose.model('documents', DocumentSchema);