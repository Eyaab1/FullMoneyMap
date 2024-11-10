// controllers/utilisateurController.js

const { pool } = require('../config/database'); // Adjust the path to where your pool is defined
const bcrypt = require('bcrypt'); // Library to hash passwords
const jwt = require('jsonwebtoken');

const crypto = require('crypto');
const nodemailer = require('nodemailer');

exports.createUserByAdmin = async (req, res) => {
    // Extract the token from the authorization header
    const token = req.headers.authorization && req.headers.authorization.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Authorization token required' });
    }

    try {
        // Verify the token to get the connected user's information
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const adminEmail = decoded.email;
        const userRole = decoded.role;  // Get the role from the decoded JWT

        // Check if the user is an administrator
        if (userRole !== 'administrateur') {
            return res.status(403).json({ error: 'Only administrators can create users' });
        }

        const { nom, prenom, email, role } = req.body;

        if (!nom || !prenom || !email || !role) {
            return res.status(400).json({ error: 'All fields except password are required' });
        }

        // Generate a random password for the new user
        const generatedPassword = crypto.randomBytes(8).toString('hex');
        const hashedPassword = await bcrypt.hash(generatedPassword, 10);

        // Insert the new user into the database
        const result = await pool.query(
            'INSERT INTO "Utilisateurs" (nom, prenom, email, password, role) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [nom, prenom, email, hashedPassword, role]
        );

        // Set up the email transporter using admin's email credentials
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: adminEmail, // Use the admin email from the decoded JWT
                pass: process.env.ADMIN_EMAIL_PASSWORD, // Admin's email password from the environment
            },
        });

        // Define the email content
        const mailOptions = {
            from: adminEmail,  // Use the admin's email address
            to: email,  // Recipient's email address
            subject: 'Your Account Details',
            text: `Hello ${prenom},\n\nYour account has been created successfully by the administrator. Here are your login details:\n\nEmail: ${email}\nPassword: ${generatedPassword}\n\nPlease change your password after logging in.\n\nBest regards,\nYour Admin Team`,
        };

        // Send the email
        await transporter.sendMail(mailOptions);

        // Respond with the created user details
        res.status(201).json({ ...result.rows[0], generatedPassword });
    } catch (error) {
        console.error('Error creating user or sending email:', error);
        res.status(500).json({ error: 'Error creating utilisateur or sending email' });
    }
};

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

exports.login = async (req, res) => {
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

exports.deleteUtilisateur = async (req, res) => {
    const { id } = req.params; // Get the user ID from the route parameter

    try {
        // Delete the user from the database
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
    const { id } = req.params; // Get the user ID from the route parameter
    const { nom, prenom, email, password, role } = req.body; // Extract the updated user data from the request body

    // Check if required fields are provided
    if (!nom || !prenom || !email || !role) {
        return res.status(400).json({ error: 'Nom, prenom, email, and role are required' });
    }

    try {
        // If password is provided, hash it
        let hashedPassword = null;
        if (password) {
            hashedPassword = await bcrypt.hash(password, 10);
        }

        // Prepare the update query
        let query = 'UPDATE "Utilisateurs" SET nom = $1, prenom = $2, email = $3, role = $4';
        const values = [nom, prenom, email, role];

        // If password is provided, include it in the query
        if (hashedPassword) {
            query += ', password = $5';
            values.push(hashedPassword);
        }

        query += ' WHERE id = $' + (values.length + 1) + ' RETURNING *'; // Add condition to update based on ID

        values.push(id);

        // Execute the query
        const result = await pool.query(query, values);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Return the updated user details
        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error('Error updating utilisateur:', error);
        res.status(500).json({ error: 'Error updating utilisateur' });
    }
};