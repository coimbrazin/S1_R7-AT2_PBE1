const { clienteModel } = require('../models/clienteModel');
const { buscarCep } = require('../utils/viacep');

const clienteController = {

  /**
   * Seleciona todos os clientes ou um cliente específico por ID.
   * Rota GET /clientes/
   * 
   * @async
   * @function selecionaTodosClientes
   * @param {Request} req - Objeto da requisição HTTP.
   * @param {Response} res - Objeto da resposta HTTP.
   * @returns {Promise<Response>} Retorna JSON com todos os clientes ou um cliente específico.
   */
  selecionaTodosClientes: async (req, res) => {
    try {
      const { id_cliente } = req.query;
      let resultado;
      if (id_cliente) {
        resultado = await clienteModel.selectByCliente(id_cliente);
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
      return res.status(500).json({ message: 'Ocorreu um erro no servidor', errorMessage: error.message });
    }
  },

  /**
   * Insere um novo cliente no banco de dados.
   * Rota POST /clientes/
   * 
   * @async
   * @function novoCliente
   * @param {Request} req - Objeto da requisição HTTP contendo os dados do cliente.
   * @param {Response} res - Objeto da resposta HTTP.
   * @returns {Promise<Response>} Retorna JSON com o resultado da inserção.
   */
  novoCliente: async (req, res) => {
    try {
      const { nome, cpf, email, telefone, cep, numero, complemento } = req.body;

      if (
        !nome || !cpf || !email || !telefone || !cep || !numero ||

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
        return res.status(200).json({ message: 'O e-mail informado já existe no banco de dados.' });
      }

      if (!email.includes('@')) {
        return res.status(200).json({ message: 'O e-mail enviado é inválido.' });
      }

      if (!Array.isArray(telefone)) {
        return res.status(400).json({ message: 'O campo "telefone" deve ser um array.' });
      }

      const dadosCep = await buscarCep(cep);

      if (!dadosCep) {
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
        dadosCep
      );

      res.status(201).json({ message: 'Registro incluido com sucesso', data: resultado });

    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Ocorreu um erro no servidor', errorMessage: error.message });
    }
  },

  /**
   * Atualiza os dados de um cliente existente.
   * Rota PUT /clientes/:id_cliente
   * 
   * @async
   * @function atualizarCliente
   * @param {Request} req - Objeto da requisição HTTP contendo os novos dados do cliente.
   * @param {Response} res - Objeto da resposta HTTP.
   * @returns {Promise<Response>} Retorna JSON com o resultado da atualização.
   */
  atualizarCliente: async (req, res) => {
    try {
      const id_cliente = Number(req.params.id_cliente);
      const { nome, cpf, email } = req.body;

      if (isNaN(id_cliente)) {
        return res.status(400).json({ message: 'ID do cliente inválido.' });
      }

      if (nome === undefined && cpf === undefined && email === undefined) {
        return res.status(400).json({ message: 'Envie ao menos um campo para atualizar.' });
      }

      if (nome !== undefined && !isNaN(nome)) {
        return res.status(400).json({ message: 'O nome não pode ser um número.' });
      }

      if (cpf !== undefined) {
        if (isNaN(cpf) || cpf.length !== 11) {
          return res.status(400).json({ message: 'O CPF deve conter exatamente 11 números.' });
        }

        const verificaCpf = await clienteModel.buscarPorCpf(cpf);
        if (verificaCpf) {
          return res.status(409).json({ message: 'O CPF informado já está cadastrado em outro cliente.' });
        }
      }

      if (email !== undefined && !email.includes('@')) {
        return res.status(400).json({ message: 'O e-mail enviado é inválido.' });
      }

      const clienteAtual = await clienteModel.selectByCliente(id_cliente);
      if (clienteAtual.length === 0) {
        return res.status(404).json({ message: 'Cliente não encontrado.' });
      }

      const atual = clienteAtual[0];

      const novoNome = nome ?? atual.nome;
      const novoCpf = cpf ?? atual.cpf;
      const novoEmail = email ?? atual.email;

      const resultado = await clienteModel.updateCliente(id_cliente, novoNome, novoCpf, novoEmail);

      if (resultado.affectedRows === 1 && resultado.changedRows === 0) {
        return res.status(200).json({ message: 'Não há alterações a serem realizadas' });
      }

      if (resultado.affectedRows === 1 && resultado.changedRows === 1) {
        return res.status(200).json({ message: 'Registro alterado com sucesso', data: resultado });
      }

    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Ocorreu um erro no servidor', errorMessage: error.message });
    }
  },

  /**
   * Deleta um cliente do banco de dados.
   * Rota DELETE /clientes/:id_cliente
   * 
   * @async
   * @function deletarCliente
   * @param {Request} req - Objeto da requisição HTTP contendo o ID do cliente.
   * @param {Response} res - Objeto da resposta HTTP.
   * @returns {Promise<Response>} Retorna mensagem confirmando a exclusão.
   */
  deletarCliente: async (req, res) => {
    try {
      const id_cliente = Number(req.params.id_cliente)

      if (!id_cliente || !Number.isInteger(id_cliente)) {
        return res.status(400).json({ message: 'Forneça um ID válido' });
      }

      const clienteSelecionado = await clienteModel.selectByCliente(id_cliente);
      if (clienteSelecionado.length === 0) {
        return res.status(400).json({ message: 'Cliente não localizado na base de dados' });
      }

      const resultadoDelete = await clienteModel.deleteCliente(id_cliente);
      if (resultadoDelete.affectedRows === 0) {
        return res.status(200).json({ message: 'Ocorreu um erro ao excluir o cliente' });
      }

      res.status(400).json({ message: 'Cliente excluído com sucesso', data: resultadoDelete });

    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Ocorreu um erro no servidor', errorMessage: error.message });
    }
  }
}

module.exports = { clienteController };
