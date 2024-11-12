const { pool } = require('../config/database'); 

exports.getAllSalaires = async (req, res) => {
    try {
        const result = await pool.query(`SELECT * FROM "Salaires";`);
        res.status(200).json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error fetching Salaries' });
    }
};

// Add a new freelancer
exports.addSalaire = async (req, res) => {
    const { id_projet, id_freelancer, salaire } = req.body;

    // Basic validation
    if (!id_projet || !id_freelancer || !salaire) {
        return res.status(400).json({ error: 'id_projet, id_freelancer, and salaire are required' });
    }

    try {
        const result = await pool.query(`
            INSERT INTO "Salaires" ("id_projet", "id_freelancer", "salaire")
            VALUES ($1, $2, $3)
            RETURNING *;
        `, [id_projet, id_freelancer, salaire]);

        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error adding salary' });
    }
};

exports.getSalaireByFreelancer = async (req, res) => {
    const { id_freelancer } = req.params;

    if (!id_freelancer) {
        return res.status(400).json({ error: 'Freelancer ID is required' });
    }

    try {
        const result = await pool.query(`SELECT * FROM "Salaires" WHERE "id_freelancer" = $1`, [id_freelancer]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'No salary found for this freelancer' });
        }
        res.status(200).json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error fetching salary by freelancer' });
    }
};


exports.updateSalaire = async (req, res) => {
    const { id_salaire } = req.params;
    const { salaire } = req.body;

    if (!salaire) {
        return res.status(400).json({ error: 'Salary amount is required' });
    }

    try {
        const result = await pool.query(`
            UPDATE "Salaires"
            SET "salaire" = $1
            WHERE "id" = $2
            RETURNING *;
        `, [salaire, id_salaire]);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Salary record not found' });
        }

        res.status(200).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error updating salary' });
    }
};

exports.getFreelancerFromSalaire = async (req, res) => {
    const { id_salaire } = req.params;

    if (!id_salaire) {
        return res.status(400).json({ error: 'Salary ID is required' });
    }

    try {
        // Get salary details
        const salaireResult = await pool.query(`
            SELECT * FROM "Salaires"
            WHERE "id" = $1
        `, [id_salaire]);

        if (salaireResult.rows.length === 0) {
            return res.status(404).json({ message: 'Salary not found' });
        }

        const { id_freelancer } = salaireResult.rows[0];

        // Now, get the freelancer details based on the id_freelancer
        const freelancerResult = await pool.query(`
            SELECT * FROM "Freelancers" WHERE "id" = $1
        `, [id_freelancer]);

        if (freelancerResult.rows.length === 0) {
            return res.status(404).json({ message: 'Freelancer not found' });
        }

        res.status(200).json(freelancerResult.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error fetching freelancer from salary' });
    }
};

exports.getProjectFromSalaire = async (req, res) => {
    const { id_salaire } = req.params;

    if (!id_salaire) {
        return res.status(400).json({ error: 'Salary ID is required' });
    }

    try {
        // Get salary details
        const salaireResult = await pool.query(`
            SELECT * FROM "Salaires"
            WHERE "id" = $1
        `, [id_salaire]);

        if (salaireResult.rows.length === 0) {
            return res.status(404).json({ message: 'Salary not found' });
        }

        const { id_projet } = salaireResult.rows[0];

        // Now, get the project details based on the id_projet
        const projectResult = await pool.query(`
            SELECT * FROM "Projets" WHERE "id" = $1
        `, [id_projet]);

        if (projectResult.rows.length === 0) {
            return res.status(404).json({ message: 'Project not found' });
        }

        res.status(200).json(projectResult.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error fetching project from salary' });
    }
};

exports.deleteSalaire = async (req, res) => {
    const { id } = req.params;

    try {
        const result = await pool.query(
            'DELETE FROM "Salaires" WHERE id = $1 RETURNING *',
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'salaire not found' });
        }

        res.status(200).json({ message: 'salaire deleted successfully' });
    } catch (error) {
        console.error('Error deleting salaire:', error);
        res.status(500).json({ error: 'Error deleting salaire' });
    }
};