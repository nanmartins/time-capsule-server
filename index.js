const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
// app.use(cors());
app.use(cors({
  origin: ['http://localhost:5173', 'https://time-capsule-frontend.vercel.app'], // Adicione seu frontend da Vercel
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(bodyParser.json());
mongoose.connect(process.env.MONGO_URI);

// Routes
// const capsuleRoutes = require('./routes/capsuleRoutes');
const authRoutes = require('./routes/authRoute');
// app.use('/api/capsules', capsuleRoutes);
app.use('/api/auth', authRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
