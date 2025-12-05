const express = require('express');
const pedidoRoutes = express.Router();
const { pedidosController } = require('../controllers/pedidosController');

pedidoRoutes.get('/pedidos', pedidosController.selecionarTodosPedidos);
pedidoRoutes.post('/pedidos', pedidosController.incluirPedido);
pedidoRoutes.put('/pedidos/:id', pedidosController.alterarPedido);
pedidoRoutes.delete('/pedidos/:id_pedido', pedidosController.deletarPedido);

module.exports = { pedidoRoutes };