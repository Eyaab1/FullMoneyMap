
const { pool } = require('../config/database'); 
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

require('dotenv').config();

const crypto = require('crypto');
const nodemailer = require('nodemailer');

exports.createUserByAdmin = async (req, res) => {
    const token = req.headers.authorization && req.headers.authorization.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Authorization token required' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const adminEmail = decoded.email;
        const userRole = decoded.role;

        if (userRole !== 'administrateur') {
            return res.status(403).json({ error: 'Only administrators can create users' });
        }

        const { nom, prenom, email, role } = req.body;

        if (!nom || !prenom || !email || !role) {
            return res.status(400).json({ error: 'All fields except password are required' });
        }

        const generatedPassword = crypto.randomBytes(8).toString('hex');
        const hashedPassword = await bcrypt.hash(generatedPassword, 10);

        const result = await pool.query(
            'INSERT INTO "Utilisateurs" (nom, prenom, email, password, role) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [nom, prenom, email, hashedPassword, role]
        );

        console.log('User created:', result.rows[0]);

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.ADMIN_EMAIL,
                pass: process.env.ADMIN_EMAIL_PASSWORD,
            },
        });

        const mailOptions = {
            from: process.env.ADMIN_EMAIL,
            to: email,
            subject: 'Your Account Details',
            text: `Hello ${prenom},\n\nYour account has been created successfully by the administrator. Here are your login details:\n\nEmail: ${email}\nPassword: ${generatedPassword}\n\nPlease change your password after logging in.\n\nBest regards,\nYour Admin Team`,
        };

        console.log('Sending email to:', email);
        await transporter.sendMail(mailOptions);

        res.status(201).json({ ...result.rows[0], generatedPassword });
    } catch (error) {
        console.error('Error creating user or sending email:', error.stack);
        res.status(500).json({
            error: 'Error creating utilisateur or sending email',
            message: error.message || 'Unknown error occurred',
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
        });
    }
};


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



exports.changePassword = async (req, res) => {
    const { email, oldPassword, newPassword, confirmNewPassword } = req.body;

    try {
        if (newPassword !== confirmNewPassword) {
            console.log('Password mismatch');
            return res.status(400).json({ message: 'New passwords do not match' });
        }
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
        console.error('Error changing password:', error);
        res.status(500).json({ message: 'Error changing password', error });
    }
};


exports.deleteUtilisateur = async (req, res) => {
    const { id } = req.params; 

    try {
        
        const result = await pool.query(
            'DELETE FROM "Utilisateurs" WHERE id = $1 RETURNING *',
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ error: 'Error deleting utilisateur' });
    }
};

exports.updateUtilisateur = async (req, res) => {
    const { id } = req.params; 
    const { nom, prenom, email, password, role } = req.body; 

    
    if (!nom || !prenom || !email || !role) {
        return res.status(400).json({ error: 'Nom, prenom, email, and role are required' });
    }

    try {
        
        let hashedPassword = null;
        if (password) {
            hashedPassword = await bcrypt.hash(password, 10);
        }

        let query = 'UPDATE "Utilisateurs" SET nom = $1, prenom = $2, email = $3, role = $4';
        const values = [nom, prenom, email, role];

        if (hashedPassword) {
            query += ', password = $5';
            values.push(hashedPassword);
        }

        query += ' WHERE id = $' + (values.length + 1) + ' RETURNING *'; 

        values.push(id);

        
        const result = await pool.query(query, values);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        
        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error('Error updating utilisateur:', error);
        res.status(500).json({ error: 'Error updating utilisateur' });
    }
};