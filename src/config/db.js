const mongoose = require('mongoose');
const config = require('../../config');

const connectDB = async () => {
    try {
        const uri = config.mongoURI;
        await mongoose.connect(uri, {
            useNewUrlParser: true,
        });
        console.log('MongoDB connected')
    } catch(error) {
        console.error('MongoDB connection failed:', error.message);
        process.exit(1);
    }
}

module.exports = connectDB;