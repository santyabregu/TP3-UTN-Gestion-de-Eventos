const db = require('../db');

// Esta función busca todos los eventos para que se vean en las tarjetas de la web
exports.getEventos = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM eventos');
        res.json(rows);
    } catch (error) {
        // Si falla la conexión a la DB, aviso acá
        res.status(500).json({ error: "Error al obtener eventos" });
    }
};

// Función para ver los detalles de un evento específico por su ID
exports.getEventoById = async (req, res) => {
    try {
        const { id } = req.params;
        const [rows] = await db.query('SELECT * FROM eventos WHERE id = ?', [id]);
        if (rows.length === 0) return res.status(404).json({ error: "Evento no encontrado" });
        res.json(rows[0]);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener el evento" });
    }
};

// 3. Actualizar un evento (Requisito del PDF - PUT)
exports.updateEvento = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, descripcion, lugar, precio, capacidad_maxima } = req.body;
        await db.query(
            'UPDATE eventos SET nombre=?, descripcion=?, lugar=?, precio=?, capacidad_maxima=? WHERE id=?',
            [nombre, descripcion, lugar, precio, capacidad_maxima, id]
        );
        res.json({ mensaje: "Evento actualizado correctamente" });
    } catch (error) {
        res.status(500).json({ error: "Error al actualizar evento" });
    }
};

// Acá uso una TRANSACCIÓN (BEGIN/COMMIT). Si algo falla al crear, no se guarda nada a medias.
exports.crearEvento = async (req, res) => {
    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();
        const { nombre, descripcion, id_categoria, fecha, hora_inicio, hora_fin, lugar, capacidad_maxima, precio } = req.body;
        
        await connection.query(
            'INSERT INTO eventos (nombre, descripcion, id_categoria, fecha, hora_inicio, hora_fin, lugar, capacidad_maxima, precio) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [nombre, descripcion, id_categoria, fecha, hora_inicio, hora_fin, lugar, capacidad_maxima, precio]
        );

        await connection.commit(); // Si llegó acá, se guarda todo de una
        res.status(201).json({ mensaje: "Evento creado con éxito" });
    } catch (error) {
        await connection.rollback(); // Si hubo error, volvemos atrás para no dejar basura en la DB
        res.status(500).json({ error: "Error al crear evento" });
    } finally {
        connection.release(); // Suelto la conexión al pool
    }
};

// Aquí es donde conecto la lógica de Node con el PROCEDIMIENTO de MySQL
exports.reservarEntrada = async (req, res) => {
    try {
        // Saco los datos que vienen desde el modal de compra de la web
        const { id_evento, cantidad, metodo_pago, monto_total, codigo_acceso } = req.body;
        
        // El ID del usuario lo saco del token JWT (seguridad)
        const id_usuario = req.user.id; 

        // LLAMADA AL PROCEDIMIENTO ALMACENADO:
        // Uso 'CALL' para que la base de datos haga el trabajo pesado de 
        // verificar si hay lugar y restar la capacidad solita
        await db.query(
            'CALL registrar_reserva(?, ?, ?, ?, ?, ?)',
            [id_usuario, id_evento, cantidad, metodo_pago, monto_total, codigo_acceso]
        );

        // Si el procedimiento terminó bien, confirmo al usuario
        res.status(201).json({ mensaje: "Reserva hecha y stock actualizado en la DB" });
    } catch (error) {
        // Si en MySQL saltó el error de "Capacidad insuficiente", lo atrapamos acá
        console.error("Error al reservar:", error);
        res.status(400).json({ error: "No hay capacidad suficiente para este evento" });
    }
};
// Función para borrar un evento (Requisito de borrado físico)
exports.deleteEvento = async (req, res) => {
    try {
        const { id } = req.params;
        await db.query('DELETE FROM eventos WHERE id = ?', [id]);
        res.json({ mensaje: "Evento borrado físicamente de la base de datos" });
    } catch (error) {
        res.status(500).json({ error: "No se pudo eliminar el evento" });
    }
};