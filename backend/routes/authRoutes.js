const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// POST route for login
router.post('/login', authController.login);


// Logout route (you may want to clear the cookie on logout)
router.post('/logout', (req, res) => {
    res.clearCookie('token'); // Clear the token cookie
    res.status(200).json({ message: 'Logged out successfully' });
});

module.exports = router;
