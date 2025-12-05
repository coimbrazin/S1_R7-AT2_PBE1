const express = require('express');
const enderecoRoutes = express.Router();
const { enderecosController } = require('../controllers/enderecosController');

enderecoRoutes.get('/enderecos', enderecosController.selecionarTodos);
enderecoRoutes.post('/enderecos', enderecosController.incluirEndereco);
enderecoRoutes.put('/enderecos/:id_cliente', enderecosController.alterarEndereco);
enderecoRoutes.delete('/enderecos/:id_cliente', enderecosController.deleteEndereco);

module.exports = { enderecoRoutes };

