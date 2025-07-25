const User = require('../models/User');
const generateToken = require('../utils/generateToken');

// @route POST /api/users/register
const registerUser = async (req, res) => {
  const { name, email, password, role } = req.body;

  const userExists = await User.findOne({ email });
  if (userExists) return res.status(400).json({ message: 'User already exists' });

  const user = await User.create({ name, email, password, role });
  res.json({ _id: user._id, name: user.name, email: user.email, role: user.role, token: generateToken(user._id) });
};

// @route POST /api/users/login
const loginUser = async (req, res) => {
  const { email, password } = req.body;
  
  const user = await User.findOne({ email });
  if (user && await user.matchPassword(password)) {
    res.json({ _id: user._id, name: user.name, email: user.email, role: user.role, token: generateToken(user._id) });
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
};

module.exports = { registerUser, loginUser };
