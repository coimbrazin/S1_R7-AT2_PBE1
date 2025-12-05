const { pedidosModel } = require("../models/pedidosModel");
const pedidosController = {

  /**
   * Na Rota GET: /pedidos
   * Seleciona todos os pedidos ou pedidos de um cliente específico.
   *
   * @async
   * @function selecionarTodosPedidos
   * @param {Request} req - Objeto da requisição
   * @param {Response} res - Objeto da resposta
   * @returns {Promise<Response>} JSON contendo os pedidos encontrados
   */
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

  /**
   * Na Rota POST: /pedidos
   * Insere um novo pedido na tabela
   *
   * @async
   * @function incluirPedido
   * @param {Request} req - Corpo da requisição contendo:
   * @param {int} req.body.id_cliente ID do Cliente
   * @param {int} req.body.id_endereco ID do Endereço
   * @param {string} req.body.data_do_pedido Data do pedido
   * @param {string} req.body.tipo_de_entrega Tipo da entrega
   * @param {number} req.body.distancia Distância do trajeto
   * @param {number} req.body.peso_da_carga Peso da carga
   * @param {number} req.body.valor_base_por_km Valor base por KM
   * @param {number} req.body.valor_base_por_kg Valor base por KG
   *
   * @param {Response} res - Resposta HTTP
   * @returns {Promise<Response>}
   */
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
    }
  },

  /**
   * Na Rota PUT: /pedidos/:id
   * Atualiza um pedido existente.
   *
   * @async
   * @function alterarPedido
   * @param {Request} req - Parâmetros e corpo da requisição contendo:
   * @param {int} req.params.id ID do pedido
   * @param {int} req.body.id_cliente ID do cliente
   * @param {int} req.body.id_endereco ID do endereço
   * @param {string} req.body.tipo_de_entrega Tipo da entrega
   * @param {number} req.body.distancia Distância do trajeto
   * @param {number} req.body.peso_da_carga Peso da carga
   *
   * @param {Response} res - Resposta HTTP
   * @returns {Promise<Response>}
   */
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

  /**
   * Na Rota DELETE: /pedidos/:id_pedido
   * Deleta um pedido.
   *
   * @async
   * @function deletarPedido
   * @param {Request} req - Parâmetro contendo:
   * @param {int} req.params.id_pedido ID do pedido
   *
   * @param {Response} res - Resposta HTTP
   * @returns {Promise<Response>}
   */
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

module.exports = { pedidosController };