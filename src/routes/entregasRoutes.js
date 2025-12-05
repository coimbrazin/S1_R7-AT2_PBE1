const express = require('express');
const entregasRoutes = express.Router();
const { entregasController } = require('../controllers/entregasController');

entregasRoutes.get('/entregas/', entregasController.selecionaTodasEntregas);
entregasRoutes.put('/entregas/:id_entrega', entregasController.atualizarEntrega);
entregasRoutes.delete('/entregas/:id_entrega', entregasController.deletarEntrega);

module.exports = { entregasRoutes };