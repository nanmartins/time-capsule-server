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
mongoose.connect(process.env.MONGO_URI);

// Routes
// const capsuleRoutes = require('./routes/capsuleRoutes');
const authRoutes = require('./routes/authRoutes');
// app.use('/api/capsules', capsuleRoutes);
app.use('/api/auth', authRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
