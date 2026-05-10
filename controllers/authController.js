const db = require('../db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Función para registrar usuarios nuevos
exports.register = async (req, res) => {
    try {
        // Traigo todos los datos que el usuario pone en el formulario de registro
        const {nombre, apellido, dni, email, password, calle, ciudad, localidad, telefono } = req.body;
        
        // Uso bcrypt para que la contraseña no se vea como texto normal en la base de datos
        // El "10" es el nivel de seguridad del hasheo
        const hashedPassword = await bcrypt.hash(password, 10);
        
        // Si me registro con este mail, me doy permisos de administrador 
        // directamente para no tener que tocar la base de datos a mano.
        let rolAsignado = 'usuario';
        if (email === 'admin123@gmail.com') {
            rolAsignado = 'administrador';
        }
        
        // Inserto los datos en la tabla. Ojo: uso 'password_hash' que es el nombre de mi columna en SQL
        await db.query(
            'INSERT INTO usuarios (nombre, apellido, dni, email, password_hash, calle, ciudad, localidad, telefono, rol) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', 
            [nombre, apellido, dni, email, hashedPassword, calle, ciudad, localidad, telefono || '+54 ', rolAsignado]
        );

        // Si todo salió bien, devuelvo este mensaje
        res.status(201).json({ mensaje: "Usuario registrado con éxito" });
    } catch (error) {
        // Si hay error (como un DNI repetido), aviso por consola para saber qué pasó
        console.error("Error en registro:", error);
        res.status(500).json({ error: "Fallo el registro. Revisá si el DNI o Email ya existen." });
    }
};

// Función para entrar al sistema
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // Busco al usuario por su email para ver si existe
        const [rows] = await db.query('SELECT * FROM usuarios WHERE email = ?', [email]);

        if (rows.length === 0) return res.status(401).json({ error: "No existe el usuario" });

        const usuario = rows[0];
        
        // Aquí comparo la clave que escribió el usuario con el hash guardado en la DB
        // Uso .password_hash porque así llamé a la columna en mi script de SQL
        const validPassword = await bcrypt.compare(password, usuario.password_hash);

        if (!validPassword) return res.status(401).json({ error: "Clave incorrecta" });

        // Si la clave es correcta, armo el token JWT que dura 8 horas
        // Meto el ID y el ROL del usuario adentro del token
        const token = jwt.sign(
            { id: usuario.id, rol: usuario.rol }, 
            process.env.JWT_SECRET, 
            { expiresIn: '8h' }
        );

        // Le mando el token y los datos básicos del usuario al navegador
        res.json({ 
            token, 
            usuario: {
                id: usuario.id,
                nombre: usuario.nombre,
                apellido: usuario.apellido,
                email: usuario.email,
                telefono: usuario.telefono
            } 
        });
    } catch (error) {
        res.status(500).json({ error: "Error en el servidor al loguear" });
    }
};

// Función para Editar Perfil
exports.updateConfig = async (req, res) => {
    try {
        const { id, email, telefono, password } = req.body;
        if (password) {
            const salt = await bcrypt.genSalt(10);
            const hash = await bcrypt.hash(password, salt);
            await db.query('UPDATE usuarios SET email=?, telefono=?, password_hash=? WHERE id=?', 
                [email, telefono, hash, id]);
        } else {
            await db.query('UPDATE usuarios SET email=?, telefono=? WHERE id=?', [email, telefono, id]);
        }
        res.json({ mensaje: "Cuenta actualizada correctamente" });
    } catch(e) {
        res.status(500).json({ error: "Error al actualizar" });
    }
};