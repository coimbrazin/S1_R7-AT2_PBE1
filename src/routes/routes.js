const express = require('express');
const router = express.Router();

const enderecosRoutes = require('./enderecosRoutes');
const pedidosRoutes = require('./pedidosRoutes');
router.use('/enderecos', enderecosRoutes);
router.use('/pedidos', pedidosRoutes);
module.exports = router;
