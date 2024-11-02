

const express = require('express');
const router = express.Router();
const utilisateurController = require('../controllers/UtilisateurController');

router.get('/all', utilisateurController.getUtilisateurs);
router.get('/id/:firstName/:lastName', utilisateurController.getUserIdByName);
router.post('/add', utilisateurController.createUtilisateur);
router.get('/role/:role', utilisateurController.getUtilisateursByRole);
router.get('/financiers', utilisateurController.getFinanciers);
router.get('/chefs-de-projet', utilisateurController.getChefsDeProjet);
router.post('/login', utilisateurController.getUserByEmailAndPassword);
router.post('/change-password', utilisateurController.changePassword);


module.exports = router;
