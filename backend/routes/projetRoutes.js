const express = require('express');
const router = express.Router();
const projetController = require('../controllers/projetController');

// Get all projects
router.get('/all', projetController.getAllProjets);

router.get('/projet/:id', projetController.getProjetById);

router.get('/projetWithManager/:id', projetController.getProjetWithManager);

router.get('/upcomingDeadlines',projetController.getUpcomingDeadlines)
// Add new project
router.post('/create', projetController.addProjet);

// Get project by name
router.get('/name/:nom', projetController.getProjetByName);

router.get('/projet/:id', projetController.getProjetById);

// Get projects by chef ID
router.get('/chef/:id_chef', projetController.getProjetsByChef);

// Get project status (etat)
router.get('/etat/:id', projetController.getProjetEtat);

router.put('/projets/:id', projetController.updateProjet);
router.delete('/:id', projetController.deleteProject);
module.exports = router;
