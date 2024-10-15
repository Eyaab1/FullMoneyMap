// routes/utilisateurRoutes.js

const express = require('express');
const router = express.Router();
const utilisateurController = require('../controllers/UtilisateurController');

// Route to create a new user
router.post('/create', utilisateurController.createUtilisateur);

// Route to get all users
router.get('/all', utilisateurController.getAllUtilisateurs);

// Route to get a user by role
router.get('/role/:role', utilisateurController.getUtilisateursByRole);

// Route to get all financiers
router.get('/financiers', utilisateurController.getFinanciers);

// Route to get all chefs de projet
router.get('/chefs', utilisateurController.getChefsDeProjet);

// Route to get a user by email and password
router.post('/login', utilisateurController.getUtilisateurByEmailAndPassword);

// Route to change user password
router.put('/change-password', utilisateurController.changePassword);

module.exports = router;
