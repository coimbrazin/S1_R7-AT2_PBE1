const express = require('express');
const clienteRoutes = express.Router();
const { clienteController } = require('../controllers/clienteController');

clienteRoutes.get('/clientes/', clienteController.selecionaTodosClientes);
clienteRoutes.post('/clientes', clienteController.novoCliente);
clienteRoutes.put('/clientes/:id_cliente', clienteController.atualizarCliente);
clienteRoutes.delete('/clientes/:id_cliente', clienteController.deletarCliente);

module.exports = { clienteRoutes };
