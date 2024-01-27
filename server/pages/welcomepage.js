const express = require('express');
const router = express.Router();

// Function to render/show the welcome page
exports.show_WelcomePage = (req, res) => {
  // Render or return the HTML for the welcome page
  res.send('Welcome Page');
};

router.post('/', (req, res) => {
  const { action } = req.body;

  // Basic validation
  if (!action) {
    return res.status(400).json({ error: 'Please provide a valid action' });
  }

  // Route to registration or login based on user's action
  if (action === 'register') {
    res.send('Registration Page or Form');
  } else if (action === 'login') {
    res.send('Login Page or Form');
  } else {
    return res.status(400).json({ error: 'Invalid action' });
  }
});

module.exports = router;
