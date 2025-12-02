const { clienteModel } = require('../models/clienteModel');
const { buscarCep } = require('../utils/viacep');

const clienteController = {

  selecionaTodosClientes: async (req, res) => {
    try {
      const { idCliente } = req.query;
      let resultado;
      if (idCliente) {
        resultado = await clienteModel.selectByCliente(idCliente);
        if (resultado.length === 0) {
          return res.status(200).json({ message: 'Não a dados com o ID pesquisado' })
        }
        return res.status(200).json({ message: 'Dados da tabela clientes', data: resultado })
      }
      resultado = await clienteModel.selectAllClientes();
      if (resultado.length === 0) {
        return res.status(200).json({ message: 'A consulta não retornou resultados' });
      }
      res.status(200).json({ message: 'Dados da tabela clientes', data: resultado })
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: 'Ocorreu um erro no servidor',
        errorMessage: error.message
      });
    }
  },

  /**
   * Insere um novo cliente no banco de dados
   * Rota GET /clientes/
   * @async
   * @param {Request} req Objeto da requisição HTTP
   * @param {Response} res Objeto da resposta HTTP
   * @returns {Promise<Array<Object} Objeto contendo o resultado da consulta
   */
  novoCliente: async (req, res) => {
    try {
      const { nome, cpf, email, telefone, cep, numero, complemento } = req.body;

      if (
        !nome || !cpf || !email || !telefone || !cep || !numero || !complemento ||

        typeof nome !== "string" || typeof cpf !== "string" || typeof email !== "string" || typeof cep !== "string" || typeof numero !== "string" || typeof complemento !== "string"
      ) {
        return res.status(400).json({ message: 'Verifique os dados enviados e tente novamente' });
      }


      // Verifica CPF
      if (isNaN(cpf) || cpf.length != 11) {
        return res.status(400).json({ message: 'O CPF deve conter 11 números.' });
      }

      const verificaCpf = await clienteModel.buscarPorCpf(cpf);
      if (verificaCpf) {
        return res.status(409).json({ message: 'O CPF informado já existe no banco de dados.' });
      }

      // Verifica Email
      const verificaEmail = await clienteModel.buscarPorEmail(email);
      if (verificaEmail) {
        return res.status(200).json({ message: 'O E-mail informado já existe no banco de dados.' });
      }

      if (!email.includes('@')) {
        return res.status(200).json({ message: 'O e-mail enviado é inválido.' });
      }

      if (!Array.isArray(telefone)) {
        return res.status(400).json({ message: 'O campo "telefone" deve ser um array.' });
      }

      const viaCepData = await buscarCep(cep);

      if (!viaCepData) {
        return res.status(400).json({ message: 'CEP inválido ou não encontrado.' });
      }

      const resultado = await clienteModel.insertCliente(
        nome,
        cpf,
        email,
        telefone,
        cep,
        numero,
        complemento,
        viaCepData
      );

      res.status(201).json({ message: 'Registro incluido com sucesso', data: resultado });

    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Ocorreu um erro no servidor', errorMessage: error.message });
    }
  }
}

module.exports = { clienteController };