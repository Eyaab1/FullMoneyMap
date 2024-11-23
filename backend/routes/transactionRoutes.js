
const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactionController');
router.get('/test', (req, res) => {
    res.status(200).send('Test route working!');
});
router.get('/all', transactionController.getTransactions);

router.post('/depense', transactionController.addDepense);

router.post('/revenu', transactionController.addRevenu);

router.get('/depenses', transactionController.getDepenses);

router.get('/revenues', transactionController.getRevenues);

module.exports = router;
