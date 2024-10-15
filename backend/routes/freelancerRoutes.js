const express = require('express');
const router = express.Router();
const freelancerController = require('../controllers/freelancerController');

// Route to get all freelancers
router.get('/', freelancerController.getAllFreelancers);

// Route to add a new freelancer
router.post('/', freelancerController.addFreelancer);

// Route to get freelancer salary by freelancer ID
router.get('/salary/:id_freelancer', freelancerController.getFreelancerSalary);

// Route to get freelancers by project ID
router.get('/projects/:id_projet', freelancerController.getFreelancersByProject);

module.exports = router;
