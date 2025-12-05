const { telefonesModel } = require('../models/telefonesModel');

const telefonesController = {

  /**
   * Na Rota GET: /telefones/
   * Seleciona todos os telefones ou um telefone específico pelo ID.
   *
   * @async
   * @function selecionarTelefones
   * @param {Request} req - Requisição contendo:
   * @param {int} req.query.id_telefone ID do telefone
   * @param {Response} res - Resposta HTTP
   * @returns {Promise<Response>} Lista de telefones
   */
  selecionarTelefones: async (req, res) => {
    try {
      const { id_telefone } = req.query;

      let resultado;

      if (id_telefone) {
        resultado = await telefonesModel.selectByIdTelefone(id_telefone);

        if (resultado.length === 0) {
          return res.status(404).json({ message: 'Telefone não encontrado.' });
        }

        return res.status(200).json({
          message: 'Telefone localizado',
          data: resultado
        });
      }

      resultado = await telefonesModel.selectAllTelefones();
      return res.status(200).json({
        message: 'Lista de telefones',
        data: resultado
      });

    } catch (error) {
      return res.status(500).json({
        message: 'Erro no servidor',
        errorMessage: error.message
      });
    }
  },

  /**
   * Na Rota POST: /telefones/
   * Insere um novo telefone.
   *
   * @async
   * @function novoTelefone
   * @param {Request} req - Corpo da requisição contendo:
   * @param {string} req.body.telefone Número de telefone
   * @param {int} req.body.id_cliente ID do cliente dono do telefone
   * @param {Response} res - Resposta HTTP
   * @returns {Promise<Response>} Telefone inserido com sucesso
   */
  novoTelefone: async (req, res) => {
    try {
      const { telefone, id_cliente } = req.body;

      if (!telefone || !id_cliente) {
        return res.status(400).json({
          message: 'Envie telefone e id_cliente'
        });
      }

      const resultado = await telefonesModel.insertTelefone({ telefone, id_cliente });

      return res.status(201).json({
        message: 'Telefone cadastrado com sucesso',
        data: resultado
      });

    } catch (error) {
      return res.status(500).json({
        message: 'Erro no servidor',
        errorMessage: error.message
      });
    }
  },

  /**
   * Na Rota PUT: /telefones/:id_telefone
   * Atualiza os dados de um telefone existente.
   *
   * @async
   * @function atualizarTelefone
   * @param {Request} req - Requisição contendo:
   * @param {int} req.params.id_telefone ID do telefone a ser atualizado
   * @param {string} req.body.novoTelefone Novo número de telefone
   * @param {int} req.body.novoIdCliente Novo ID do cliente
   * @param {Response} res - Resposta HTTP
   * @returns {Promise<Response>} Telefone atualizado
   */
  atualizarTelefone: async (req, res) => {
    try {
      const id_telefone = Number(req.params.id_telefone);
      const { novoTelefone, novoIdCliente } = req.body;

      if (isNaN(id_telefone)) {
        return res.status(400).json({ message: 'ID inválido' });
      }

      if (!novoTelefone || !novoIdCliente) {
        return res.status(400).json({
          message: 'Envie os campos novoTelefone e novoIdCliente'
        });
      }

      const resultado = await telefonesModel.updateTelefone(
        id_telefone,
        { novoTelefone, novoIdCliente }
      );

      return res.status(200).json({
        message: 'Telefone atualizado com sucesso',
        data: resultado
      });

    } catch (error) {
      return res.status(500).json({
        message: 'Erro no servidor',
        errorMessage: error.message
      });
    }
  },

  /**
   * Na Rota DELETE: /telefones/:id_telefone
   * Deleta um telefone pelo ID.
   *
   * @async
   * @function deletarTelefone
   * @param {Request} req - Requisição contendo:
   * @param {int} req.params.id_telefone ID do telefone a ser deletado
   * @param {Response} res - Resposta HTTP
   * @returns {Promise<Response>} Telefone deletado
   */
  deletarTelefone: async (req, res) => {
    try {
      const id_telefone = Number(req.params.id_telefone);

      if (isNaN(id_telefone)) {
        return res.status(400).json({ message: 'ID inválido' });
      }

      const resultado = await telefonesModel.deleteTelefone(id_telefone);

      if (resultado.affectedRows === 0) {
        return res.status(404).json({ message: 'Telefone não encontrado' });
      }

      return res.status(200).json({
        message: 'Telefone excluído com sucesso',
        data: resultado
      });

    } catch (error) {
      return res.status(500).json({
        message: 'Erro no servidor',
        errorMessage: error.message
      });
    }
  }
};

module.exports = { telefonesController };