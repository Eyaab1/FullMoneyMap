

const express = require('express');
const router = express.Router();
const utilisateurController = require('../controllers/UtilisateurController');

router.get('/all', utilisateurController.getUtilisateurs);
router.get('/:id', utilisateurController.getUtilisateurById);
router.get('/id/:firstName/:lastName', utilisateurController.getUserIdByName);
router.post('/add', utilisateurController.createUtilisateur);
router.get('/role/:role', utilisateurController.getUtilisateursByRole);
router.post('/login', utilisateurController.getUserByEmailAndPassword);
router.post('/change-password', utilisateurController.changePassword);
router.post('/create', utilisateurController.createUserByAdmin);
router.delete('/:id', utilisateurController.deleteUtilisateur);
router.put('/:id', utilisateurController.updateUtilisateur)

module.exports = router;
