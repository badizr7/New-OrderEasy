const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
require('dotenv').config();

const cors = require('cors');
const path = require('path'); // Añadido para servir archivos estáticos

// Rutas
const authRoutes = require('./routes/authRoutes');
const categoryRoutes = require('./routes/categoryRoutes'); // Añadido
const productRoutes = require('./routes/productRoutes');
const ingresoRoutes = require('./routes/ventaRoutes');
const egresoRoutes = require('./routes/egresoRoutes');

const app = express();

// Configuración de CORS (debe ir antes de las rutas)
app.use(cors({
  origin: 'http://localhost:5173', // Cambia esto por la URL de tu frontend en producción
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true, // Si manejas cookies o sesiones
}));

// Servir archivos estáticos (imágenes) desde la carpeta 'uploads'
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Middlewares
app.use(bodyParser.json());

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/', categoryRoutes); // Añadido
app.use('/api/productos', productRoutes);
app.use('/api/ventas', ingresoRoutes);
app.use('/api/egresos', egresoRoutes);

// Conectar a MongoDB
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/OrderEasy';

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log('Conexión a MongoDB exitosa');
    app.listen(PORT, () => console.log(`Servidor corriendo en el puerto ${PORT}`));
  })
  .catch((err) => console.error('Error al conectar a MongoDB:', err));
