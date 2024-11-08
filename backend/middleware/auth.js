const jwt = require('jsonwebtoken');
const { pool } = require('../config/database'); // Assuming you're using PostgreSQL connection pool

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';

exports.authenticate = async (req, res, next) => {
    // Check for token in cookies or Authorization header
    const token = req.cookies.token || req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Authorization token required' });
    }

    try {
        // Verify the token
        const decoded = jwt.verify(token, JWT_SECRET);
        
        // Attach user data to the request object from decoded JWT
        const { rows } = await pool.query('SELECT * FROM "Utilisateurs" WHERE id = $1', [decoded.id]);

        if (rows.length === 0) {
            return res.status(401).json({ error: 'User not found or invalid token' });
        }

        req.user = rows[0]; // Attach the user to the request object

        next(); // Proceed to the next middleware or route handler
    } catch (error) {
        console.error('Authentication error:', error);
        res.status(401).json({ error: 'Authentication failed. Invalid or expired token' });
    }
};
