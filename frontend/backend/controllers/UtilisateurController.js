// controllers/utilisateurController.js

const pool = require('../config/database'); // PostgreSQL connection
const bcrypt = require('bcrypt'); // Library to hash passwords

// Get all utilisateurs (users)
exports.getUtilisateurs = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM "Utilisateurs"');
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ error: 'Error fetching utilisateurs' });
    }
};

// Create a new utilisateur (user)
exports.createUtilisateur = async (req, res) => {
    const { nom, prenom, email, password, role } = req.body;

    // Validate required fields
    if (!nom || !prenom || !email || !password || !role) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    try {
        // Hash the password with bcrypt
        const hashedPassword = await bcrypt.hash(password, 10); // 10 is the salt rounds

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

// Get all Chefs de Projet
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
        console.error('Error fetching chefs de projet:', error);
        res.status(500).json({ error: 'Error fetching chefs de projet' });
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

        // Compare password with the hashed password in the database
        const isMatch = await bcrypt.compare(password, user.password);
        
        if (!isMatch) {
            return res.status(401).json({ message: 'Incorrect password' });
        }

        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving user', error });
    }
};
exports.changePassword = async (req, res) => {
    const { email, oldPassword, newPassword } = req.body;

    try {
        // Find user by email
        const { rows } = await pool.query('SELECT * FROM "Utilisateurs" WHERE email = $1', [email]);

        if (rows.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        const user = rows[0];

        // Compare old password with the hashed password in the database
        const isMatch = await bcrypt.compare(oldPassword, user.password);

        if (!isMatch) {
            return res.status(401).json({ message: 'Incorrect old password' });
        }

        // Hash the new password
        const hashedNewPassword = await bcrypt.hash(newPassword, 10);

        // Update the password in the database
        await pool.query('UPDATE "Utilisateurs" SET password = $1 WHERE email = $2', [hashedNewPassword, email]);

        res.json({ message: 'Password updated successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error changing password', error });
    }
};
