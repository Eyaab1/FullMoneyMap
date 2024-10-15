// routes/transactionRoutes.js

const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactionController');

// Get all transactions
router.get('/all', transactionController.getAllTransactions);

// Add new expense
router.post('/depense', transactionController.addDepense);

// Add new revenue
router.post('/revenu', transactionController.addRevenu);

// Get all expenses (Dépenses)
router.get('/depenses', transactionController.getDepenses);

// Get all revenues (Revenues)
router.get('/revenues', transactionController.getRevenues);

module.exports = router;
