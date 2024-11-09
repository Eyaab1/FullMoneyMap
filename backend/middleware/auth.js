const jwt = require('jsonwebtoken');
const { pool } = require('../config/database');  // Assuming you use the same pool for DB connection

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';

exports.authenticate = async (req, res, next) => {
    try {
        // Look for the token in cookies or Authorization header
        const token = req.cookies.token || req.headers.authorization?.split(' ')[1];

        if (!token) {
            return res.status(401).json({ error: 'Authentication token is required' });
        }

        // Verify token
        const decoded = jwt.verify(token, JWT_SECRET);

        // Optionally, fetch user from DB if needed
        const { rows } = await pool.query('SELECT * FROM "Utilisateurs" WHERE id = $1', [decoded.id]);
        
        if (rows.length === 0) {
            return res.status(401).json({ error: 'User not found' });
        }

        req.user = rows[0];  // Attach user info to the request object
        next();  // Proceed to the next middleware or route handler
    } catch (error) {
        console.error('Authentication error:', error);
        return res.status(401).json({ error: 'Invalid or expired token' });
    }
};
