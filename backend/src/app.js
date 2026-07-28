const express = require('express');
const cors = require('cors');
const requestLogger = require('./middlewares/requestLogger');
const errorHandler = require('./middlewares/errorHandler');

const app = express();

app.use(cors());
app.use(express.json());
app.use(requestLogger);

app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// auth and note routes get mounted here in later steps

app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

app.use(errorHandler);

module.exports = app;