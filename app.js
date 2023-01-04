const express = require('express');
const app = express();
const dotenv = require('dotenv');

// Error middleware
const errorMiddleware = require('./middlewares/error');

dotenv.config({ path: 'server/config/config.env' });

app.use(express.json());

// Routes
const user = require('./routes/userRoutes');
app.use('/api/v1', user);

module.exports = app;
