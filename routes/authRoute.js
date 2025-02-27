const express = require('express');
const { check } = require('express-validator');
const { register, login, getUserProfile } = require('../controllers/authControllers');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.post(
  '/register',
  [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Email is required').isEmail(),
    check('password', 'Password is required').isLength({ min: 6 }),
  ],
  register
);

router.post(
  '/login',
  [
    check('email', 'Email is required').isEmail(),
    check('password', 'Password is required').exists(),
  ],
  login
);

router.get('/profile', authMiddleware, getUserProfile);

module.exports = router;
