const express = require('express');
const router = express.Router();
const eventosController = require('../controllers/eventosController');
const authMiddleware = require('../middleware/auth');

// Rutas para ver los eventos de la cartelera
router.get('/', authMiddleware, eventosController.getEventos);
router.get('/:id', authMiddleware, eventosController.getEventoById);

// Estas rutas son para crear, editar o borrar eventos de la base de datos
router.post('/', authMiddleware, eventosController.crearEvento);
router.put('/:id', authMiddleware, eventosController.updateEvento);
router.delete('/:id', authMiddleware, eventosController.deleteEvento);

// LA RUTA PARA HACER LA RESERVA
// Esta ruta es la que conecta con el Procedimiento Almacenado para descontar entradas
router.post('/reservar', authMiddleware, eventosController.reservarEntrada);

module.exports = router;