// controllers/utilisateurController.js

const { pool } = require('../config/database'); // Adjust the path to where your pool is defined
const bcrypt = require('bcrypt'); // Library to hash passwords
const jwt = require('jsonwebtoken');
// Get all utilisateurs (users)

exports.getUtilisateurs = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM public."Utilisateurs"');
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ error: 'Error fetching utilisateurs' });
    }
};

exports.createUtilisateur = async (req, res) => {
    const { nom, prenom, email, password, role } = req.body;

    if (!nom || !prenom || !email || !password || !role) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    try {
        // Hash the password with bcrypt
        const hashedPassword = await bcrypt.hash(password, 10);
        const result = await pool.query(
            'INSERT INTO "Utilisateurs" (nom, prenom, email, password, role) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [nom, prenom, email, hashedPassword, role]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ error: 'Error creating utilisateur' });
    }
};

// Get utilisateurs by role
exports.getUtilisateursByRole = async (req, res) => {
    const { role } = req.params;

    try {
        const result = await pool.query(
            'SELECT * FROM "Utilisateurs" WHERE role = $1',
            [role]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'No users found with the specified role' });
        }
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error fetching users by role:', error);
        res.status(500).json({ error: 'Error fetching utilisateurs by role' });
    }
};

// getUtilisateurById
exports.getUtilisateurById = async (req, res) => {
    const { id } = req.params;

    try {
        const result = await pool.query('SELECT id, nom, prenom FROM "Utilisateurs" WHERE id = $1', [id]);
        
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error('Error fetching user by ID:', error);
        res.status(500).json({ error: 'Error fetching user by ID' });
    }
};


// Get all Financiers
exports.getFinanciers = async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT * FROM "Utilisateurs" WHERE role = $1',
            ['financier']
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'No financiers found' });
        }
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error fetching financiers:', error);
        res.status(500).json({ error: 'Error fetching financiers' });
    }
};

exports.getChefsDeProjet = async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT * FROM "Utilisateurs" WHERE role = $1',
            ['chef de projet']
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'No chefs de projet found' });
        }
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error fetching chefs de projet:', error.message, error.stack);
        res.status(500).json({ error: 'Error fetching chefs de projet' });
    }
};


exports.getUserIdByName = async (req, res) => {
    const { firstName, lastName } = req.params;

    try {
        const result = await pool.query(
            'SELECT id FROM "Utilisateurs" WHERE nom = $1 AND prenom = $2',
            [lastName, firstName] 
        );

        if (result.rows.length > 0) {
            res.status(200).json({ id: result.rows[0].id });
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (error) {
        console.error('Error fetching user ID:', error);
        res.status(500).json({ error: 'Error fetching user ID' });
    }
};

exports.getUserByEmailAndPassword = async (req, res) => {
    const { email, password } = req.body;

    try {
        const { rows } = await pool.query('SELECT * FROM "Utilisateurs" WHERE email = $1', [email]);

        if (rows.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        const user = rows[0];

        
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ message: 'Incorrect password' });
        }
        const token = jwt.sign({ id: user.id, email: user.email }, 'your_jwt_secret', { expiresIn: '1h' });
        res.json({
            user,
            token,
        });
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving user', error });
    }
};


exports.changePassword = async (req, res) => {
    const { email, oldPassword, newPassword } = req.body;

    try {
        
        const { rows } = await pool.query('SELECT * FROM "Utilisateurs" WHERE email = $1', [email]);

        if (rows.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        const user = rows[0];
        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Incorrect old password' });
        }
        const hashedNewPassword = await bcrypt.hash(newPassword, 10);
        await pool.query('UPDATE "Utilisateurs" SET password = $1 WHERE email = $2', [hashedNewPassword, email]);
        res.json({ message: 'Password updated successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error changing password', error });
    }
};
