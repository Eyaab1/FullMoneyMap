// Get all freelancers
const pool = require('../config/database');

exports.getFreelancers = async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT * FROM "Freelancers";
        `);
        res.status(200).json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error fetching freelancers' });
    }
};

// Add a new freelancer
exports.addFreelancer = async (req, res) => {
    const { nom, prenom, specialty } = req.body;

    // Basic validation
    if (!nom || !prenom || !specialty) {
        return res.status(400).json({ error: 'Nom, prenom, and specialty are required' });
    }

    try {
        const result = await pool.query(`
            INSERT INTO "Freelancers" ("nom", "prenom", "specialty")
            VALUES ($1, $2, $3)
            RETURNING *;
        `, [nom, prenom, specialty]);
        
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error adding freelancer' });
    }
};
// Get freelancer salary by freelancer ID
exports.getFreelancerSalary = async (req, res) => {
    const { id_freelancer } = req.params; // Assuming freelancer ID is passed as a route parameter

    try {
        const result = await pool.query(`
            SELECT S."salaire", P."nom" AS project_name
            FROM "Salaires" S
            JOIN "Projets" P ON S."id_projet" = P."id"
            WHERE S."id_freelancer" = $1;
        `, [id_freelancer]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'No salary found for this freelancer' });
        }

        res.status(200).json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error fetching freelancer salary' });
    }
};
// Get freelancers by project ID
exports.getFreelancersByProject = async (req, res) => {
    const { id_projet } = req.params; // Assuming project ID is passed as a route parameter

    try {
        const result = await pool.query(`
            SELECT F.*, S."salaire"
            FROM "Freelancers" F
            JOIN "Salaires" S ON F."id" = S."id_freelancer"
            WHERE S."id_projet" = $1;
        `, [id_projet]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'No freelancers found for this project' });
        }

        res.status(200).json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error fetching freelancers by project' });
    }
};
