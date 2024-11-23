const express = require('express');
const router = express.Router();
const freelancerController = require('../controllers/freelancerController');

router.get('/all', freelancerController.getAllFreelancers);

router.post('/add', freelancerController.addFreelancer);

router.get('/salary/:id_freelancer', freelancerController.getFreelancerSalary);

router.get('/projects/:id_projet', freelancerController.getFreelancersByProject);
router.delete('/:id',freelancerController.deleteFreelancer);
module.exports = router;