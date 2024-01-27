const bcrypt = require('bcrypt');
const User = require('../models/users');

exports.show_loginPage = async (req, res, session) => {
  try {
    const { username, password } = req.body;

    // Find the user by username
    const user = await User.findOne({ username });

    if (!user) {
      return { loggedIn: false };
    }

    // Validate the password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return { loggedIn: false };
    }

    session.loggedIn = true;
    session.userID = user._id;

    return { loggedIn: true };
  } catch (error) {
    return { error };
  }
};


