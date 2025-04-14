const express = require(`express`);
const cors = require('cors');
const apiRoutes = require('./routes/api');
const errorHandler = require('./middleware/errorHandler');

const app = express ();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({  extended: false }));

app.use('/api', apiRoutes);

app.use(errorHandler);

// Export the app instance for testing
module.exports = app;