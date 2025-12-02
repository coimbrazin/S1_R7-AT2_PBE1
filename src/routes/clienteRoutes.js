const express = require('express');
const clienteRoutes = express.Router();
const { clienteController } = require('../controllers/clienteController');

clienteRoutes.get('/clientes/', clienteController.selecionaTodosClientes);
clienteRoutes.post('/clientes', clienteController.novoCliente);
// clienteRoutes.put('/clientes/:idCliente', clienteController.atualizarCliente);
// clienteRoutes.delete('/clientes/:idCliente', clienteController.deletarCliente);

module.exports = { clienteRoutes };
