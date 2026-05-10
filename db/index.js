const mysql = require('mysql2');
require('dotenv').config();

// Configuro la conexión usando lo que puse en mi archivo .env
const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'gestion_eventos',
    waitForConnections: true,
    connectionLimit: 10, // Maximo 10 personas conectadas a la vez a la DB
    queueLimit: 0
});

// Exporto el pool con .promise() para poder usar 'await' en mis otros archivos
// Sin esto, el código me daría error de callbacks
module.exports = pool.promise();