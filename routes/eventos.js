const express = require('express');
const router = express.Router();
const eventosController = require('../controllers/eventosController');
const authMiddleware = require('../middleware/auth');

// Rutas para ver eventos (públicas o protegidas según prefieras)
router.get('/', eventosController.getEventos);
router.get('/:id', eventosController.getEventoById);

// Rutas protegidas (solo si estás logueado con el token)
router.post('/', authMiddleware, eventosController.crearEvento);
router.put('/:id', authMiddleware, eventosController.updateEvento);
router.delete('/:id', authMiddleware, eventosController.deleteEvento);

// LA RUTA PARA LA RESERVA
router.post('/reservar', authMiddleware, eventosController.reservarEntrada);

module.exports = router;