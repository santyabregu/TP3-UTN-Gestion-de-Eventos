const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    // Saco el token de los headers que manda el navegador
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.status(401).json({ error: "No hay token, acceso denegado" });

    // Verifico si el token es válido usando la clave secreta de mi .env
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ error: "Token no válido o vencido" });
        
        req.user = user; // Guardo la info del usuario para usarla en los controladores
        next(); // Lo dejo seguir a la siguiente función
    });
};