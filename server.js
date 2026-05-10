const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middlewares básicos para que Express entienda JSON y permita conexiones externas
app.use(cors());
app.use(express.json());

// Sirvo la carpeta public para que se vea mi HTML y el estilo
app.use(express.static('public'));

// Traigo mis archivos de rutas
const authRoutes = require('./routes/auth');
const eventosRoutes = require('./routes/eventos');

// Defino los prefijos de las rutas de mi API
app.use('/api/auth', authRoutes);
app.use('/api/eventos', eventosRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor andando en el puerto ${PORT}`);
});