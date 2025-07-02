const express = require('express');
const router = express.Router();
const meteoController = require('../controllers/meteoController');
const verifyToken = require('../middlewares/authMiddleware');
// Route principale de la météo
router.get('/', meteoController.getAllMeteo);


module.exports = router;
