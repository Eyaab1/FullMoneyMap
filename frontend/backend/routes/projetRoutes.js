// routes/projetRoutes.js

const express = require('express');
const router = express.Router();
const projetController = require('../controllers/projetController');

// Get all projects
router.get('/all', projetController.getAllProjets);

// Add new project
router.post('/create', projetController.addProjet);

// Get project by name
router.get('/name/:nom', projetController.getProjetByName);

// Get projects by chef ID
router.get('/chef/:id_chef', projetController.getProjetsByChef);

// Get project status (etat)
router.get('/etat/:id', projetController.getProjetEtat);

// Change project status (etat)
router.put('/etat/:id', projetController.changeProjetEtat);

// Change project end date (date_fin)
router.put('/date-fin/:id', projetController.changeDateFin);

module.exports = router;
