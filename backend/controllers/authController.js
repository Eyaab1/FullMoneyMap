const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { pool } = require('../config/database');

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';

exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const { rows } = await pool.query('SELECT * FROM "Utilisateurs" WHERE email = $1', [email]);

        if (rows.length === 0) {
            return res.status(400).json({ error: 'Invalid email or password' });
        }

        const user = rows[0];

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ error: 'Invalid email or password' });
        }

        const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '24h' });

        res.cookie('token', token, {
            httpOnly: true, 
            secure: process.env.NODE_ENV === 'production',  
            maxAge: 24 * 60 * 60 * 1000 //24 heures (heure*secondes*minutes*milliesecondes)
        });

        return res.status(200).json({
            message: 'Login successful',
            user,
            token
        });
    } catch (error) {
        console.error('Login error:', error);
        return res.status(500).json({ error: 'An error occurred during login' });
    }
};
