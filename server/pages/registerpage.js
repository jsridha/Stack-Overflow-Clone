const bcrypt = require('bcrypt');
const User = require('../models/users');
let Factory = require("../models/itemFactory");

exports.show_registerPage = async (req, res) => {
  const { username, email, password, repeatPassword } = req.body;

  // Basic validation -
  if (!username || !email || !password || password !== repeatPassword) {
    return res.status(400).json({ error: 'Please provide valid username, email, and matching passwords' });
  }

  // Email validation
  const emailRegex = /^\S+@\S+\.\S+$/; // Simple email regex pattern
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Please provide a valid email address' });
  }

  // Password validation - should not contain username or email
  if (password.includes(username) || password.includes(email)) {
    return res.status(400).json({ error: 'Password should not contain the username or email' });
  }

  try {
    // Check if the username or email already exists in the database
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });

    if (existingUser) {
      return res.status(400).json({ error: 'Username or email already exists' });
    }

    // Hash the password before saving it to the database
    const hashedPassword = await bcrypt.hash(password, 10); // 10 is the saltRounds

    // Create a new user using the User model and save it to the database
    const newUser = Factory.createElement("User", { username, email, password: hashedPassword, questions: [], answers: [], tags: [] });
    await newUser.save();

    res.status(201).json(newUser);
  } catch (err) {
    // Handle errors
    console.error('Error creating user:', err);
    res.status(500).json({ error: 'Server error' });
  }
};
