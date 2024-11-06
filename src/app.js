const express = require('express');
const bodyParser = require('body-parser');
const http = require('http');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');
const healthzRoutes = require('./routes/healthz');
const documentRoutes = require('./routes/documentRoutes');
const connectDB =  require('./config/db');
const { Server } = require('socket.io');
const { setupSocketHandlers } = require('./controllers/socketDocumentController');
const { saveDocumentsToMongo } = require('./controllers/documentController');
const { MONGO_SYNC_INTERVAL } = require('./utils/constants');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST', 'PUT'],
    }
})

connectDB();

setInterval(saveDocumentsToMongo, MONGO_SYNC_INTERVAL); 

// Keeping below code to test socket connections in the future
// io.on("connection", (socket) => {
//     console.log("A user connected");

//     socket.on("user-connected", (data) => {
//         console.log("User connected with data:", data);
//     });
// });

setupSocketHandlers(io);

app.use(cors());

app.use(bodyParser.json())

app.use('/api', userRoutes);
app.use('/api', documentRoutes);
app.use('/api', healthzRoutes);

const PORT = 5000;
server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`)
})