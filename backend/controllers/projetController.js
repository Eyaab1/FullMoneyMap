
const { pool } = require('../config/database'); 


exports.getAllProjets = async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT 
                p.id, 
                p.nom, 
                p.date_debut, 
                p.date_fin, 
                p.budget, 
                p.etat, 
                p.id_chef, 
                u.nom AS manager_nom, 
                u.prenom AS manager_prenom
            FROM "Projets" p
            JOIN "Utilisateurs" u ON p.id_chef = u.id
        `);

        res.status(200).json(result.rows);
    } catch (err) {
        console.error('Query error:', err); 
        res.status(500).json({ error: 'Error fetching all projects' });
    }
};

exports.addProjet = async (req, res) => {
    const { nom, date_debut, date_fin, budget, etat, id_chef } = req.body;


    if (!nom || !date_debut || !date_fin || !budget || !etat || !id_chef) {
        return res.status(400).json({ error: 'All fields are required' });
    }

  
    if (typeof budget !== 'number') {
        return res.status(400).json({ error: 'Budget must be a number' });
    }

    try {
        const result = await pool.query(
            `INSERT INTO "Projets" (nom, date_debut, date_fin, budget, etat, id_chef) 
            VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
            [nom, date_debut, date_fin, budget, etat, id_chef]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        
        if (err.code === '23505') { 
            return res.status(409).json({ error: 'Project already exists' });
        }

        res.status(500).json({ error: 'Error adding new project' });
    }
};

exports.getProjetById = async (req, res) => {
    const { id } = req.params;

    try {
        const result = await pool.query('SELECT * FROM "Projets" WHERE id = $1', [id]);
        if (result.rows.length > 0) {
            res.status(200).json(result.rows[0]);
        } else {
            res.status(404).json({ error: 'Project not found' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error fetching project by id' });
    }
};

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

exports.getProjetById = async (req, res) => {
    const { id } = req.params;

    try {
        const result = await pool.query('SELECT * FROM "Projets" WHERE id = $1', [id]);
        if (result.rows.length > 0) {
            res.status(200).json(result.rows[0]);
        } else {
            res.status(404).json({ error: 'Project not found' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error fetching project by id' });
    }
};

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

exports.updateProjet = async (req, res) => {
    const { id } = req.params;
    const { nom, date_debut, date_fin, budget, etat, id_chef } = req.body;

    // Check for required fields (update as needed)
    if (!nom || !date_debut || !date_fin || !budget || !etat || !id_chef) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    try {
        const result = await pool.query(
            `UPDATE "Projets" 
            SET nom = $1, date_debut = $2, date_fin = $3, budget = $4, etat = $5, id_chef = $6 
            WHERE id = $7 RETURNING *`,
            [nom, date_debut, date_fin, budget, etat, id_chef, id]
        );

        if (result.rows.length > 0) {
            res.status(200).json(result.rows[0]);
        } else {
            res.status(404).json({ error: 'Project not found' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error updating project' });
    }
};


exports.getProjetWithManager = async (req, res) => {
    const { id } = req.params;

    try {
        const result = await pool.query(
            `SELECT 
                p.id AS project_id,
                p.nom AS project_name,
                p.date_debut,
                p.date_fin,
                p.budget,
                p.etat,
                u.prenom AS manager_prenom,
                u.nom AS manager_nom
            FROM 
                "Projets" p
            JOIN 
                "Utilisateurs" u ON p.id_chef = u.id
            WHERE 
                p.id = $1`,
            [id]
        );

        if (result.rows.length > 0) {
            res.status(200).json(result.rows[0]);
        } else {
            res.status(404).json({ error: 'Project not found' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error fetching project with manager' });
    }
};
exports.getUpcomingDeadlines = async (req, res) => {
    const daysAhead = req.query.days || 7;

    try {
        const result = await pool.query(`
            SELECT 
                p.id, 
                p.nom, 
                p.date_fin, 
                u.nom AS manager_nom, 
                u.prenom AS manager_prenom
            FROM "Projets" p
            JOIN "Utilisateurs" u ON p.id_chef = u.id
            WHERE p.date_fin BETWEEN NOW() AND NOW() + INTERVAL '${daysAhead} days'
            ORDER BY p.date_fin ASC
        `);

        res.status(200).json(result.rows);
    } catch (err) {
        console.error('Query error:', err); 
        res.status(500).json({ error: 'Error fetching upcoming deadlines' });
    }
};
