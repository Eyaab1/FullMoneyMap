// routes/transactionRoutes.js

const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactionController');
router.get('/test', (req, res) => {
    res.status(200).send('Test route working!');
});
// Get all transactions
router.get('/all', transactionController.getTransactions);

// Add new expense
router.post('/depense', transactionController.addDepense);

// Add new revenue
router.post('/revenu', transactionController.addRevenu);

// Get all expenses (Dépenses)
router.get('/depenses', transactionController.getDepenses);

// Get all revenues (Revenues)
router.get('/revenues', transactionController.getRevenues);

module.exports = router;
