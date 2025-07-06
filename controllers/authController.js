const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const createToken = (user) => {
  return jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, {
    expiresIn: '1d'
  });
};

// SIGNUP
exports.signup = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.create({ email, password });

    const token = createToken(user);

    res.status(201).json({
      message: 'Signup successful',
      token,
      user: { id: user._id, email: user.email }
    });
  } catch (err) {
    res.status(400).json({ message: 'Signup failed', error: err.message });
  }
};

// LOGIN
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user || !(await user.correctPassword(password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = createToken(user);

    res.status(200).json({
      message: 'Login successful',
      token,
      user: { id: user._id, email: user.email }
    });
  } catch (err) {
    res.status(400).json({ message: 'Login failed', error: err.message });
  }
};
