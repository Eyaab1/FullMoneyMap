const express = require('express');
const router = express.Router();
const projetController = require('../controllers/projetController');

router.get('/all', projetController.getAllProjets);

router.get('/projet/:id', projetController.getProjetById);

router.get('/projetWithManager/:id', projetController.getProjetWithManager);

router.get('/upcomingDeadlines',projetController.getUpcomingDeadlines)
router.post('/create', projetController.addProjet);


router.get('/name/:nom', projetController.getProjetByName);



router.get('/chef/:id_chef', projetController.getProjetsByChef);


router.get('/etat/:id', projetController.getProjetEtat);

router.put('/edit/:id', projetController.updateProjet);
router.delete('/:id', projetController.deleteProject);
module.exports = router;
