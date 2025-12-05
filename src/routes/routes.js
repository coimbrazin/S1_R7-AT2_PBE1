const express = require('express');
const router = express.Router();
const { clienteRoutes } = require('./clienteRoutes');
const { entregasRoutes } = require('./entregasRoutes');

router.use('/', clienteRoutes);
// router.use('/', telefoneRoutes);
// router.use('/', enderecoRoutes);
// router.use('/', pedidoRoutes);
router.use('/', entregasRoutes);

module.exports = { router };
