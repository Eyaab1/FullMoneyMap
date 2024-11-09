const express = require('express');
const router = express.Router();
const salaireController = require('../controllers/salaireController');

router.get('/', salaireController.getAllSalaires);

router.post('/add', salaireController.addSalaire);

router.get('/freelancer/:id_freelancer', salaireController.getSalaireByFreelancer);

router.put('/:id_salaire', salaireController.updateSalaire);

router.get('/:id_salaire/freelancer', salaireController.getFreelancerFromSalaire);

router.get('/:id_salaire/project', salaireController.getProjectFromSalaire);

router.put('/:id', salaireController.updateSalaire);
module.exports = router;