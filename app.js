const express = require('express');
const app = express();
const dotenv = require('dotenv');
const user = require('./routes/userRoutes');
const list = require('./routes/listsRoutes');
// Error middleware
const errorMiddleware = require('./middlewares/error');

dotenv.config({ path: 'server/config/config.env' });

app.use(express.json());

// Routes
app.use('/api/v1', user);
app.use('/api/v1', list);

module.exports = app;
