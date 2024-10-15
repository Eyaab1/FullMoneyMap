// controllers/transactionController.js

const pool = require('../config/database');

// Get all transactions
// Get all transactions with associated Depenses and Revenues
exports.getTransactions = async (req, res) => {
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
        console.error(err);
        res.status(500).json({ error: 'Error fetching transactions' });
    }
};


// Add a new expense (Dépense)
exports.addDepense = async (req, res) => {
    const { amount, date, description, addedBy, category } = req.body;

    try {
        // Insert into Transactions first
        const transactionResult = await pool.query(
            `INSERT INTO "Transactions" (amount, date, description, addedBy, type) 
            VALUES ($1, $2, $3, $4, 'depense') RETURNING *`,
            [amount, date, description, addedBy]
        );

        // Get the transaction_id
        const transactionId = transactionResult.rows[0].id;

        // Insert into Dépenses
        await pool.query(
            `INSERT INTO "Depenses" (transaction_id, category) 
            VALUES ($1, $2)`,
            [transactionId, category]
        );

        res.status(201).json({ message: 'Expense added successfully', transactionId });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error adding new expense' });
    }
};

// Add a new revenue (Revenu)
exports.addRevenu = async (req, res) => {
    const { amount, date, description, addedBy, id_projet } = req.body;

    try {
        // Insert into Transactions first
        const transactionResult = await pool.query(
            `INSERT INTO "Transactions" (amount, date, description, addedBy, type) 
            VALUES ($1, $2, $3, $4, 'revenu') RETURNING *`,
            [amount, date, description, addedBy]
        );

        // Get the transaction_id
        const transactionId = transactionResult.rows[0].id;

        // Insert into Revenues
        await pool.query(
            `INSERT INTO "Revenues" (transaction_id, id_projet) 
            VALUES ($1, $2)`,
            [transactionId, id_projet]
        );

        res.status(201).json({ message: 'Revenue added successfully', transactionId });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error adding new revenue' });
    }
};

// Get all expenses (Dépenses)
exports.getDepenses = async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT t.*, d.category 
            FROM "Transactions" t
            JOIN "Depenses" d ON t.id = d.transaction_id
        `);
        res.status(200).json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error fetching expenses' });
    }
};

// Get all revenues (Revenues)
exports.getRevenues = async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT t.*, r.id_projet 
            FROM "Transactions" t
            JOIN "Revenues" r ON t.id = r.transaction_id
        `);
        res.status(200).json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error fetching revenues' });
    }
};
