const { enderecosModel } = require("../models/enderecosModel");
const { buscarCep } = require("../utils/viacep");

const enderecosController = {
  /**
   * Retorna todos os endereços cadastrados ou apenas um endereço
   * de um cliente específico.
   *
   * Na Rota GET: /enderecos
   *
   * @async
   * @function selecionarTodos
   * @param {Request} req Objeto de requisição HTTP
   * @param {Response} res Objeto de resposta HTTP
   * @returns {Promise<Response>} JSON com todos os endereços ou do cliente especificado
   */
  selecionarTodos: async (req, res) => {
    try {
      const { id_cliente } = req.query;
      let resultado;

      if (id_cliente) {
        resultado = await enderecosModel.selectByCliente(id_cliente);

        if (resultado.length === 0) {
          return res.status(200).json({
            message: 'Não tem endereço para o ID informado'
          });
        }

        return res.status(200).json({
          message: 'Endereços do cliente',
          data: resultado
        });
      }

      resultado = await enderecosModel.selectAll();

      if (resultado.length === 0) {
        return res.status(200).json({
          message: 'A consulta não retornou resultados'
        });
      }

      res.status(200).json({
        message: 'Todos os endereços',
        data: resultado
      });

    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: 'Ocorreu um erro no servidor',
        errorMessage: error.message
      });
    }
  },

  /**
   * Inclui um novo endereço no banco de dados.
   *
   * Na Rota POST: /enderecos
   *
   * @async
   * @function incluirEndereco
   * @param {Request} req Objeto de requisição HTTP contendo id_cliente, cep, numero e complemento
   * @param {Response} res Objeto de resposta HTTP
   * @returns {Promise<Response>} Mensagem de sucesso ou erro
   */
  incluirEndereco: async (req, res) => {
    try {
      const { id_cliente, cep, numero, complemento } = req.body;

      if (!id_cliente || !cep || !numero || !complemento) {
        return res.status(400).json({
          message: 'Verifique os dados enviado e tente novamente'
        });
      }

      const dadosCep = await buscarCep(cep);
      console.log("Endereço:", dadosCep);

      const resultado = await enderecosModel.insertEndereco(
        id_cliente,
        cep,
        numero,
        complemento,
        dadosCep
      );

      return res.status(201).json({
        message: 'Endereço incluído com sucesso',
        data: resultado
      });

    } catch (error) {
      console.error(error);
      return res.status(500).json({
        message: 'Erro interno no servidor',
        errorMessage: error.message
      });
    }
  },

  /**
   * Atualiza parcialmente ou completamente um endereço de um cliente.
   *
   * Na Rota PUT: /enderecos/:id_cliente
   *
   * @async
   * @function alterarEndereco
   * @param {Request} req Objeto de requisição HTTP contendo ID do cliente e campos a atualizar
   * @param {Response} res Objeto de resposta HTTP
   * @returns {Promise<Response>} Mensagem de sucesso ou erro
   */
  alterarEndereco: async (req, res) => {
    try {
      const id_cliente = Number(req.params.id_cliente);
      const { cep, numero, complemento } = req.body;

      if (isNaN(id_cliente)) {
        return res.status(400).json({ message: 'ID do cliente inválido' });
      }

      if (!cep && !numero && !complemento) {
        return res.status(400).json({
          message: 'Envie ao menos um campo para atualizar'
        });
      }

      const enderecoAtual = await enderecosModel.selectByCliente(id_cliente);

      if (enderecoAtual.length === 0) {
        return res.status(404).json({
          message: 'Endereço não encontrado para este cliente'
        });
      }

      let dadosCep = {
        uf: enderecoAtual[0].uf,
        localidade: enderecoAtual[0].cidade,
        bairro: enderecoAtual[0].bairro,
        logradouro: enderecoAtual[0].logradouro
      };

      if (cep) {
        const busca = await buscarCep(cep);
        if (!busca.logradouro) {
          return res.status(400).json({ message: 'CEP inválido' });
        }
        dadosCep = busca;
      }

      const novoCep = cep ?? enderecoAtual[0].cep;
      const novoNumero = numero ?? enderecoAtual[0].numero;
      const novoComplemento = complemento ?? enderecoAtual[0].complemento;

      const resultado = await enderecosModel.updateEndereco(
        id_cliente,
        novoCep,
        dadosCep.uf,
        dadosCep.localidade,
        dadosCep.bairro,
        dadosCep.logradouro,
        novoNumero,
        novoComplemento
      );

      if (resultado.affectedRows === 1 && resultado.changedRows === 0) {
        return res.status(200).json({ message: 'Nenhuma alteração realizada' });
      }

      if (resultado.affectedRows === 1 && resultado.changedRows === 1) {
        return res.status(200).json({
          message: 'Endereço atualizado com sucesso'
        });
      }

      return res.status(500).json({
        message: 'Erro inesperado ao atualizar o endereço'
      });

    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: 'Erro interno no servidor',
        errorMessage: error.message
      });
    }
  },

  /**
   * Deleta um endereço associado a um cliente.
   *
   * Na Rota DELETE: /enderecos/:id_cliente
   *
   * @async
   * @function deleteEndereco
   * @param {Request} req Objeto de requisição HTTP contendo id_cliente
   * @param {Response} res Objeto de resposta HTTP
   * @returns {Promise<Response>} Mensagem de sucesso ou erro
   */
  deleteEndereco: async (req, res) => {
    try {
      const id_cliente = Number(req.params.id_cliente);

      const enderecoSelecionado = await enderecosModel.selectByCliente(id_cliente);

      if (!enderecoSelecionado || enderecoSelecionado.length === 0) {
        return res.status(404).json({ message: 'Endereço não encontrado' });
      }

      const resultadoDelete = await enderecosModel.deleteEnderecoCliente(id_cliente);

      return res.status(200).json({
        message: 'Endereço excluído com sucesso.',
        data: resultadoDelete
      });

    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: 'Erro interno no servidor.',
        errorMessage: error.message
      });
    }
  }
};

module.exports = { enderecosController };