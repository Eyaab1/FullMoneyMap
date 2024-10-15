// controllers/projetController.js

const pool = require('../config/database');

// Get all projects
exports.getAllProjets = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM "Projets"');
        res.status(200).json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error fetching all projects' });
    }
};

// Add a new project
exports.addProjet = async (req, res) => {
    const { nom, date_debut, date_fin, budget, etat, id_chef } = req.body;

    try {
        const result = await pool.query(
            `INSERT INTO "Projets" (nom, date_debut, date_fin, budget, etat, id_chef) 
            VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
            [nom, date_debut, date_fin, budget, etat, id_chef]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error adding new project' });
    }
};

// Get project by name
exports.getProjetByName = async (req, res) => {
    const { nom } = req.params;

    try {
        const result = await pool.query('SELECT * FROM "Projets" WHERE nom = $1', [nom]);
        if (result.rows.length > 0) {
            res.status(200).json(result.rows[0]);
        } else {
            res.status(404).json({ error: 'Project not found' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error fetching project by name' });
    }
};

// Get projects by chef ID
exports.getProjetsByChef = async (req, res) => {
    const { id_chef } = req.params;

    try {
        const result = await pool.query('SELECT * FROM "Projets" WHERE id_chef = $1', [id_chef]);
        res.status(200).json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error fetching projects by chef ID' });
    }
};

// Get project status (etat)
exports.getProjetEtat = async (req, res) => {
    const { id } = req.params;

    try {
        const result = await pool.query('SELECT etat FROM "Projets" WHERE id = $1', [id]);
        if (result.rows.length > 0) {
            res.status(200).json(result.rows[0]);
        } else {
            res.status(404).json({ error: 'Project not found' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error fetching project status' });
    }
};

// Change project status (etat)
exports.changeProjetEtat = async (req, res) => {
    const { id } = req.params;
    const { etat } = req.body;

    try {
        const result = await pool.query(
            'UPDATE "Projets" SET etat = $1 WHERE id = $2 RETURNING *',
            [etat, id]
        );
        if (result.rows.length > 0) {
            res.status(200).json(result.rows[0]);
        } else {
            res.status(404).json({ error: 'Project not found' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error updating project status' });
    }
};

// Change project end date (date_fin)
exports.changeDateFin = async (req, res) => {
    const { id } = req.params;
    const { date_fin } = req.body;

    try {
        const result = await pool.query(
            'UPDATE "Projets" SET date_fin = $1 WHERE id = $2 RETURNING *',
            [date_fin, id]
        );
        if (result.rows.length > 0) {
            res.status(200).json(result.rows[0]);
        } else {
            res.status(404).json({ error: 'Project not found' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error updating project end date' });
    }
};
