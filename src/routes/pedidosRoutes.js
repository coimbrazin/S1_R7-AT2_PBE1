const express = require('express');
const router = express.Router();

const pedidosController = require('../controllers/pedidosController');

router.get('/', pedidosController.selecionarTodosPedidos);
router.post('/', pedidosController.incluirPedido);
router.put('/:id', pedidosController.alterarPedido);
router.delete('/:id_pedido', pedidosController.deletarPedido);

module.exports = router;