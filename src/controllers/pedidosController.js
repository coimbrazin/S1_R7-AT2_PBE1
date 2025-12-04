const { pedidosModel } = require("../models/pedidosModel");

const pedidosController = {
    selecionarTodosPedidos: async (req, res) => {
        try {
            const { id_cliente } = req.query;
            let resultado;

            if (id_cliente) {
                resultado = await pedidosModel.selectByIdPedido(id_cliente);

                if (resultado.length === 0) {
                    return res.status(200).json({
                        message: 'Não tem pedido para o ID informado'
                    });
                }

                return res.status(200).json({
                    message: 'Pedidos do cliente',
                    data: resultado
                });
            }

            resultado = await pedidosModel.selectAllPedidos();

            if (resultado.length === 0) {
                return res.status(200).json({
                    message: 'A consulta não retornou resultados'
                });
            }

            return res.status(200).json({
                message: 'Segue a lista de todos os pedidos',
                data: resultado
            });

        } catch (error) {
            console.error(error);
            return res.status(500).json({
                message: 'Ocorreu erro no servidor',
                errorMessage: error.message
            });
        }
    },
    incluirPedido: async (req, res) => {
        try {
            const { 
                id_cliente, 
                id_endereco, 
                data_do_pedido, 
                tipo_de_entrega, 
                distancia, 
                peso_da_carga, 
                valor_base_por_km, 
                valor_base_por_kg 
            } = req.body;

            if (!id_cliente || !id_endereco || !tipo_de_entrega) {
                return res.status(400).json({
                    message: "Informe id_cliente, id_endereco e tipo_de_entrega"
                });
            }
            const resultado = await pedidosModel.insertPedido({
                id_cliente,
                id_endereco,
                data_do_pedido,
                tipo_de_entrega,
                distancia,
                peso_da_carga,
                valor_base_por_km,
                valor_base_por_kg
            });

            return res.status(201).json({
                message: "Pedido inserido com sucesso",
                data: resultado
            });

        } catch (error) {
            console.error(error);
            return res.status(500).json({
                message: "Erro no servidor",
                errorMessage: error.message
            });
        } // Após incluir o pedido, a trigger "trg_calcular_entrega" é executada e insere automaticamente na tabela entrega, todos os calculos
    },
    alterarPedido: async (req, res) => {
        try {
            const { id } = req.params;
            const {
                id_cliente,
                id_endereco,
                tipo_de_entrega,
                distancia,
                peso_da_carga
            } = req.body;

            if (!id) {
                return res.status(400).json({ message: "Informe o ID do pedido" });
            }

            const resultado = await pedidosModel.updatePedido(id, {
                id_cliente,
                id_endereco,
                tipo_de_entrega,
                distancia,
                peso_da_carga
            });

            if (resultado.affectedRows === 0) {
                return res.status(404).json({ message: "Pedido não encontrado" });
            }

            return res.status(200).json({
                message: "Pedido atualizado com sucesso",
                data: resultado
            });

        } catch (error) {
            console.error(error);
            return res.status(500).json({
                message: "Erro ao atualizar pedido",
                errorMessage: error.message
            });
        }
    },
    deletarPedido: async (req, res) => {
        try {
            const { id_pedido } = req.params;

            if (!id_pedido) {
                return res.status(400).json({
                    message: "Informe o id_pedido"
                });
            }

            const resultado = await pedidosModel.deletePedidoCliente(id_pedido);

            if (resultado.affectedRows === 0) {
                return res.status(404).json({
                    message: "Nenhum pedido encontrado para esse cliente"
                });
            }

            return res.status(200).json({
                message: "Pedidos deletados com sucesso",
                data: resultado
            });

        } catch (error) {
            console.error(error);
            return res.status(500).json({
                message: "Erro ao deletar pedidos",
                errorMessage: error.message
            });
        }
    }
};
module.exports = pedidosController;
