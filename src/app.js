const express = require('express');
const bodyParser = require('body-parser');
const healthzRoutes = require('./routes/healthz');

const app = express();

app.use(bodyParser.json())

app.get('/api', healthzRoutes);

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`)
})