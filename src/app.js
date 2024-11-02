const express = require('express');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/userRoutes');
const healthzRoutes = require('./routes/healthz');
const connectDB =  require('./config/db');

const app = express();

connectDB();

app.use(bodyParser.json())

app.use('/api', userRoutes);
app.get('/api', healthzRoutes);

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`)
})