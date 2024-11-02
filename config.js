require('dotenv').config();

const config = {
    mongoURI: `mongodb+srv://ashrit221:${process.env.DB_PASSWORD}@cluster0.qzwlw.mongodb.net/collab-doc?retryWrites=true&w=majority&appName=Cluster0`,
}

module.exports = config;