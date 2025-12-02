const express = require('express');
const router = express.Router();

const enderecosController = require('../controllers/enderecosController');

router.get('/', enderecosController.selecionarTodos);
router.post('/', enderecosController.incluirEndereco);
router.put('/:id_cliente', enderecosController.alterarEndereco);
router.delete('/:id_cliente', enderecosController.deleteEndereco);

module.exports = router;

