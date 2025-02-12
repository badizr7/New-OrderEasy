const express = require("express");
const { createEgreso, getEgresos } = require("../controllers/egresoController");
const { verificarToken } = require("../middleware/authMiddleware");

const router = express.Router();

// 📌 Registrar un egreso
router.post("/", verificarToken, createEgreso);

// 📌 Obtener todos los egresos del usuario
router.get("/", verificarToken, getEgresos);

module.exports = router;
