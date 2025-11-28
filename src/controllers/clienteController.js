const { clienteModel } = require('../models/clienteModel');

const clienteController = {
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

      if (!nome || !cpf || !email || !telefone || !cep || !numero || !complemento || !isNaN(nome) || !isNaN(email) || isNaN(cpf) || isNaN(telefone) || isNaN(cep) || isNaN(numero)) {
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

      const url = `https://viacep.com.br/ws/${cep}/json/`

      const response = await fetch(url)

      if (!response.ok) {
        return res.status(400).json({ message: 'Erro ao consultar o ViaCEP' })
      }

      const viaCepData = await response.json()

      if (viaCepData.erro) {
        return res.status(400).json({ message: "CEP inválido." });
      }

      const resultado = await clienteModel.insertCliente(
        nome,
        cpf,
        email,
        telefone,
        cep,
        uf,
        cidade,
        bairro,
        logradouro,
        numero,
        complemento
      );
      if (resultado.insertId === 0) {
        throw new Error("Ocorreu um erro ao incluir o cliente");
      }

      res.status(201).json({ message: 'Registro incluido com sucesso', data: resultado });

    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Ocorreu um erro no servidor', errorMessage: error.message });
    }
  }
}

module.exports = { clienteController };