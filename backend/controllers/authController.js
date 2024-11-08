const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { pool } = require('../config/database'); // Assuming you use the same pool for DB connection
const User = require('../models/Utilisateur');  // Assuming you have a User model or table

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';

exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Query user from DB
        const { rows } = await pool.query('SELECT * FROM "Utilisateurs" WHERE email = $1', [email]);
        
        if (rows.length === 0) {
            return res.status(400).json({ error: 'Invalid email or password' });
        }

        const user = rows[0];

        // Check if password matches
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ error: 'Invalid email or password' });
        }

        // Create JWT token
        const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '24h' });

        // Set token as cookie
        res.cookie('token', token, { httpOnly: true });

        // Respond with success message and token
        res.status(200).json({
            message: 'Login successful',
            user,
            token
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'An error occurred during login' });
    }
};
