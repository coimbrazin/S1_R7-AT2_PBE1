const express = require('express');
const router = express.Router();
const { clienteRoutes } = require('./clienteRoutes');

router.use('/', clienteRoutes);
// router.use('/', telefoneRoutes);
// router.use('/', enderecoRoutes);
// router.use('/', pedidoRoutes);
// router.use('/', entregaRoutes);

module.exports = { router };
