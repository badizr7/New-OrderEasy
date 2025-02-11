const express = require('express');
const router = express.Router();
const { registrarIngreso, obtenerIngresos } = require('../controllers/ingresoController');
const { verificarToken } = require('../middleware/authMiddleware');


router.post('/', verificarToken, registrarIngreso);
router.get('/', verificarToken, obtenerIngresos);

module.exports = router;
