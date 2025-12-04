const express = require('express');
const entregasRoutes = express.Router();
const { entregasController } = require('../controllers/entregasController');

entregasRoutes.get('/entregas/', entregasController.selecionaTodasEntregas);
// entregasRoutes.post('/entregas', entregasController.novaEntrega);
// entregasRoutes.put('/entregas/:id_cliente', entregasController.atualizarEntrega);
// entregasRoutes.delete('/entregas/:id_cliente', entregasController.deletarEntrega);

module.exports = { entregasRoutes };