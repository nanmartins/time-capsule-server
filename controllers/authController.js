const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');

// User registration
exports.register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array()});

  const { name, email, password } = req.body;

  try {
    let user = await User.findOne({ email});
    if (user) return res.status(400).json({ msg: "User already exists"});

    const hashedPassword = await bcrypt.hash(password, 10);
    user = new User({ name, email, password: hashedPassword });

    await user.save();

    res.status(201).json({ msg: "User created successfully"});
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server error"});
  }
}

// User login
exports.login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array()});

  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "Email or password is incorrect"});

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Email or password is incorrect"});

    // const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server error"});
  }
}

// Get current user
exports.getUserProfile = async ( req, res) => {
  try {
    // const user = await User.findById(req.user.userId).select('-password');
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ msg: "User not found"});

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
