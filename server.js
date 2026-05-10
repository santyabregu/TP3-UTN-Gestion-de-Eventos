const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs'); // Agregamos bcrypt para encriptar claves
const db = require('./db');         // Traemos la base de datos
require('dotenv').config();

const app = express();

// Middlewares básicos para que Express entienda JSON y permita conexiones externas
app.use(cors());
app.use(express.json());

// Sirvo la carpeta public para que se vea mi HTML y el estilo visual
app.use(express.static('public'));

// Traigo mis archivos de rutas
const authRoutes = require('./routes/auth');
const eventosRoutes = require('./routes/eventos');

// Defino los prefijos de las rutas de mi API
app.use('/api/auth', authRoutes);
app.use('/api/eventos', eventosRoutes);

// Configuro el puerto y arranco el servidor
// --- 👑 CREACIÓN Y REPARACIÓN AUTOMÁTICA DEL ADMINISTRADOR ---
async function crearAdminPorDefecto() {
    try {
        // Encriptamos la clave 'admin123' de forma 100% real
        const hash = await bcrypt.hash('admin123', 10);
        
        // Buscamos si ya existe el admin
        const [rows] = await db.query('SELECT * FROM usuarios WHERE email = "admin123@gmail.com"');
        
        if (rows.length === 0) {
            // Si no existe, lo creamos de fábrica
            await db.query(
                'INSERT INTO usuarios (nombre, apellido, dni, email, password_hash, calle, ciudad, localidad, telefono, rol) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
                ['Admin', 'Principal', '00000000', 'admin123@gmail.com', hash, 'Sistema', 'Sistema', 'Sistema', '+54', 'administrador']
            );
            console.log('✅ Cuenta Administrador creada automáticamente (admin123@gmail.com / admin123)');
        } else {
            // FORZAR REPARACIÓN: Si ya existía pero estaba rota, le pisamos la contraseña con la correcta
            await db.query(
                'UPDATE usuarios SET password_hash = ?, rol = ? WHERE email = "admin123@gmail.com"',
                [hash, 'administrador']
            );
            console.log('🔧 Cuenta Administrador reparada. La clave es "admin123"');
        }
    } catch (error) {
        console.error('Error al crear o reparar el admin:', error);
    }
}

// Llamamos a la función
crearAdminPorDefecto();
// ------------------------------------------------

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor andando en el puerto ${PORT}`);
});