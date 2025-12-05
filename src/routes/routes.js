const express = require('express');
const router = express.Router();
const { clienteRoutes } = require('./clienteRoutes');
const { entregasRoutes } = require('./entregasRoutes');
const { enderecoRoutes } = require('./enderecosRoutes');
const { pedidoRoutes } = require('./pedidosRoutes');
const { telefoneRoutes } = require('./telefonesRoutes');


router.use('/', clienteRoutes);
router.use('/', telefoneRoutes);
router.use('/', enderecoRoutes);
router.use('/', pedidoRoutes);
router.use('/', entregasRoutes);

module.exports = { router };
