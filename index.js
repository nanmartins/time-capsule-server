const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());
app.use(bodyParser.json());

// Routes
const capsuleRoutes = require('./routes/capsule');
const authRoutes = require('./routes/authRoute');
app.use('/api/capsules', capsuleRoutes);
app.use('/api/auth', authRoutes);

mongoose.connect(process.env.MONGO_URI)

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
