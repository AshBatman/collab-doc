const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const userSchema = new mongoose.Schema({
    userID: {
        type: String, // this should be UUID
        default: uuidv4,
        unique: true
    },
    userName: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

userSchema.pre('save', function (next){
    this.updatedAt = Date.now();
    next();
});

const Users = mongoose.model('users', userSchema);

module.exports = Users;