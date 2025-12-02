const express = require('express');
const router = express.Router();

const enderecosRoutes = require('./enderecosRoutes');
router.use('/enderecos', enderecosRoutes);
router.use('/enderecoSelect', enderecosRoutes);


module.exports = router;
