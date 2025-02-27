const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
// app.use(cors());
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*"); // Permite qualquer origem
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");

  if (req.method === "OPTIONS") {
    return res.status(200).json({});
  }

  next();
});

app.use(bodyParser.json());
mongoose.connect(process.env.MONGO_URI, {
  serverSelectionTimeoutMS: 5000,
});

// Routes
// const capsuleRoutes = require('./routes/capsuleRoutes');
const authRoutes = require('./routes/authRoute');
// app.use('/api/capsules', capsuleRoutes);
app.use('/api/auth', authRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
