const express = require('express');
const telefoneRoutes = express.Router();
const { telefonesController } = require('../controllers/telefonesController');

telefoneRoutes.get('/telefones', telefonesController.selecionarTelefones);
telefoneRoutes.post('/telefones', telefonesController.novoTelefone);
telefoneRoutes.put('/telefones/:id_telefone', telefonesController.atualizarTelefone);
telefoneRoutes.delete('/telefones/:id_telefone', telefonesController.deletarTelefone);

module.exports = { telefoneRoutes };
