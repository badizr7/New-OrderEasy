const express = require('express');
const { createVenta, getVentas } = require('../controllers/ventaController');
const { verificarToken } = require('../middleware/authMiddleware');

const router = express.Router();

// 📌 Registrar una venta
router.post('/', verificarToken, createVenta);

// 📌 Obtener todas las ventas del usuario
router.get('/', verificarToken, getVentas);

module.exports = router;
