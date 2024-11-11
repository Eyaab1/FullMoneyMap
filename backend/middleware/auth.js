const jwt = require('jsonwebtoken');
const { pool } = require('../config/database'); 
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';

exports.authenticate = async (req, res, next) => {
    try {
        const token = req.cookies.token || req.headers.authorization?.split(' ')[1];

        if (!token) {
            return res.status(401).json({ error: 'Authentication token is required' });
        }

        const decoded = jwt.verify(token, JWT_SECRET);

    
        const { rows } = await pool.query('SELECT * FROM "Utilisateurs" WHERE id = $1', [decoded.id]);
        
        if (rows.length === 0) {
            return res.status(401).json({ error: 'User not found' });
        }

        req.user = rows[0];  
        next();
    } catch (error) {
        console.error('Authentication error:', error);
        return res.status(401).json({ error: 'Invalid or expired token' });
    }
};
