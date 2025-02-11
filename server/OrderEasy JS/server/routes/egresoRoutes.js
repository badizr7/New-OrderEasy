const express = require('express');
const router = express.Router();
const { registrarEgreso, obtenerEgresos } = require('../controllers/egresoController');
const { verificarToken } = require('../middleware/authMiddleware');


router.post('/', verificarToken, registrarEgreso);
router.get('/', verificarToken, obtenerEgresos);

module.exports = router;
