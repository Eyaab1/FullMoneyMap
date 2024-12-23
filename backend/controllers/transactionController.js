

const { pool } = require('../config/database');



exports.getTransactions = async (req, res) => {
    console.log('Fetching transactions...'); 
    try {
        const result = await pool.query(`
            SELECT t.*, 
                   d.category AS depense_category, 
                   r.id_projet AS revenue_project_id 
            FROM "Transactions" t
            LEFT JOIN "Depenses" d ON t.id = d.transaction_id
            LEFT JOIN "Revenues" r ON t.id = r.transaction_id
        `);
        res.status(200).json(result.rows);
    } catch (err) {
        console.error('Error fetching transactions:', err);
        res.status(500).json({ error: 'Error fetching transactions' });
    }
};



exports.addDepense = async (req, res) => {
    const { amount, date, description, addedBy, category } = req.body;


    if (!amount || !date || !description || !addedBy || !category) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        const transactionResult = await client.query(
            `INSERT INTO "Transactions" (amount, date, description, "addedBy", type) 
            VALUES ($1, $2, $3, $4, 'depense') RETURNING *`,
            [amount, date, description, addedBy]
        ); 
        
   
        const transactionId = transactionResult.rows[0].id;

        await client.query(
            `INSERT INTO "Depenses" (transaction_id, category) 
            VALUES ($1, $2)`,
            [transactionId, category]
        );

        await client.query('COMMIT'); 
        res.status(201).json({ message: 'Expense added successfully', transactionId });
    } catch (err) {
        await client.query('ROLLBACK'); 
        console.error('Error adding new expense:', err);
        res.status(500).json({ error: 'Error adding new expense' });
    } finally {
        client.release(); 
    }
};


exports.addRevenu = async (req, res) => {
    const { amount, date, description, addedBy, id_projet } = req.body;
    if (!amount || !date || !description || !addedBy ) {
        return res.status(400).json({ error: 'All fields are required' });
    }
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        const transactionResult = await client.query(
            `INSERT INTO "Transactions" (amount, date, description, "addedBy", type) 
            VALUES ($1, $2, $3, $4, 'revenu') RETURNING *`,
            [amount, date, description, addedBy]
        );        
        const transactionId = transactionResult.rows[0].id;
        await client.query(
            `INSERT INTO "Revenues" (transaction_id, id_projet) 
            VALUES ($1, $2)`,
            [transactionId, id_projet || null]
        );
        await client.query('COMMIT'); 
        res.status(201).json({ message: 'Revenue added successfully', transactionId });
    } catch (err) {
        await client.query('ROLLBACK');
        console.error('Error adding new revenue:', err);
        res.status(500).json({ error: 'Error adding new revenue' });
    } finally {
        client.release();
    }
};


exports.getDepenses = async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT t.*, d.category 
            FROM "Transactions" t
            JOIN "Depenses" d ON t.id = d.transaction_id
        `);
        res.status(200).json(result.rows);
    } catch (err) {
        console.error('Error fetching expenses:', err);
        res.status(500).json({ error: 'Error fetching expenses' });
    }
};

exports.getRevenues = async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT t.*, r.id_projet 
            FROM "Transactions" t
            JOIN "Revenues" r ON t.id = r.transaction_id
        `);
        res.status(200).json(result.rows);
    } catch (err) {
        console.error('Error fetching revenues:', err);
        res.status(500).json({ error: 'Error fetching revenues' });
    }
};
