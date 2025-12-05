const { pool } = require('../config/db');

const clienteModel = {

  /**
   * Seleciona todos os clientes cadastrados.
   * @async
   * @function selectAllClientes
   * @returns {Promise<Array<Object>>} Retorna uma lista com todos os clientes.
   * @example
   * const clientes = await clienteModel.selectAllClientes();
   */
  selectAllClientes: async () => {
    const sql = 'SELECT * FROM clientes;';
    const [rows] = await pool.query(sql);
    return rows;
  },

  /**
   * Seleciona um cliente pelo ID.
   * @async
   * @function selectByCliente
   * @param {number} pId ID do cliente.
   * @returns {Promise<Object>} Retorna um objeto contendo os dados do cliente encontrado.
   * @example
   * const cliente = await clienteModel.selectByCliente(5);
   */
  selectByCliente: async (pId) => {
    const sql = 'SELECT * FROM clientes WHERE id_cliente=?;';
    const values = [pId];
    const [rows] = await pool.query(sql, values);
    return rows;
  },

  /**
   * Insere um cliente completo (cliente, telefones, endereço) na base de dados.
   * @async
   * @function insertCliente
   * @param {string} pNome Nome do cliente.
   * @param {string} pCpf CPF do cliente.
   * @param {string} pEmail Email do cliente.
   * @param {Array<string>} pTelefone Lista de telefones do cliente.
   * @param {string} pCep CEP do cliente.
   * @param {string} pNumero Número da residência.
   * @param {string} pComplemento Complemento do endereço.
   * @param {Object} pDadosEndereco Objeto contendo os dados retornados pelo ViaCEP.
   * @param {string} pDadosEndereco.uf Estado.
   * @param {string} pDadosEndereco.cidade Cidade.
   * @param {string} pDadosEndereco.bairro Bairro.
   * @param {string} pDadosEndereco.pLogradouro Logradouro.
   * @returns {Promise<Object>} Retorna objetos contendo os resultados.
   * @example
   * const result = await clienteModel.insertCliente(nome, cpf, email, telefones, cep, numero, complemento, viaCepData);
   */
  insertCliente: async (pNome, pCpf, pEmail, pTelefone, pCep, pNumero, pComplemento, pDadosEndereco) => {
    const connection = await pool.getConnection();

    try {
      await connection.beginTransaction();

      const sqlCliente = 'INSERT INTO clientes (nome, cpf, email) VALUES (?,?,?);';
      const valuesCliente = [pNome, pCpf, pEmail];
      const [rowsCliente] = await connection.query(sqlCliente, valuesCliente);

      const sqlTelefone = 'INSERT INTO telefones (id_cliente, telefone) VALUES (?,?);';
      const rowsTelefone = [];
      for (let tel of pTelefone) {
        const valuesTelefone = [rowsCliente.insertId, tel];
        const [rowsTel] = await connection.query(sqlTelefone, valuesTelefone);
        rowsTelefone.push(rowsTel);
      }

      const sqlEndereco = 'INSERT INTO enderecos (id_cliente, cep, uf, cidade, bairro, logradouro, numero, complemento) VALUES (?,?,?,?,?,?,?,?)';
      const valuesEndereco = [
        rowsCliente.insertId,
        pCep,
        pDadosEndereco.uf,
        pDadosEndereco.localidade,
        pDadosEndereco.bairro,
        pDadosEndereco.logradouro,
        pNumero,
        pComplemento
      ];

      const [rowsEndereco] = await connection.query(sqlEndereco, valuesEndereco);

      await connection.commit();
      return { rowsCliente, rowsTelefone, rowsEndereco };

    } catch (error) {
      await connection.rollback();
      throw error;
    }
  },

  /**
   * Busca um cliente pelo CPF.
   * @async
   * @function buscarPorCpf
   * @param {string} pCpf CPF do cliente.
   * @returns {Promise<Object|null>} Retorna o cliente encontrado ou vazio.
   * @example
   * const cliente = await clienteModel.buscarPorCpf("12345678900");
   */
  buscarPorCpf: async (pCpf) => {
    const sql = 'SELECT * FROM clientes WHERE cpf=?;';
    const values = [pCpf];
    const [rows] = await pool.query(sql, values);
    return rows[0];
  },

  /**
   * Busca um cliente pelo Email.
   * @async
   * @function buscarPorEmail
   * @param {string} pEmail Email do cliente.
   * @returns {Promise<Object|null>} Retorna o cliente encontrado ou vazio.
   * @example
   * const cliente = await clienteModel.buscarPorEmail("teste@email.com");
   */
  buscarPorEmail: async (pEmail) => {
    const sql = 'SELECT * FROM clientes WHERE email=?;';
    const values = [pEmail];
    const [rows] = await pool.query(sql, values);
    return rows[0];
  },

  /**
   * Atualiza um cliente existente.
   * @async
   * @function updateCliente
   * @param {number} pId ID do cliente.
   * @param {string} pNome Nome atualizado.
   * @param {string} pCpf CPF atualizado.
   * @param {string} pEmail Email atualizado.
   * @returns {Promise<Object>} Retorna o resultado informações da atualização do cliente.
   * @example
   * const result = await clienteModel.updateCliente(3, "João", "123...", "email@gmail.com");
   */
  updateCliente: async (pId, pNome, pCpf, pEmail) => {
    const sql = 'UPDATE clientes SET nome=?, cpf=?, email=? WHERE id_cliente=?;';
    const values = [pNome, pCpf, pEmail, pId];
    const [rows] = await pool.query(sql, values);
    return rows;
  },

  /**
   * Deleta um cliente pelo ID.
   * @async
   * @function deleteCliente
   * @param {number} pId ID do cliente que será deletado.
   * @returns {Promise<Object>} Retorna o resultado as informações do delete.
   * @example
   * const result = await clienteModel.deleteCliente(2);
   */
  deleteCliente: async (pId) => {
    const connection = await pool.getConnection();

    try {
      await connection.beginTransaction();

      const sqlTelefone = 'DELETE FROM telefones WHERE id_cliente=?;';
      const valuesTelefone = [pId]
      const [rowsTelefone] = await connection.query(sqlTelefone, valuesTelefone);

      const sqlEndereco = 'DELETE FROM enderecos WHERE id_cliente=?;';
      const valuesEndereco = [pId];
      const [rowsEndereco] = await connection.query(sqlEndereco, valuesEndereco);

      const sqlCliente = 'DELETE FROM clientes WHERE id_cliente=?;';
      const valuesCliente = [pId];
      const [rowsCliente] = await connection.query(sqlCliente, valuesCliente);

      await connection.commit();
      return { rowsCliente, rowsTelefone, rowsEndereco };

    } catch (error) {
      await connection.rollback();
      throw error;
    }
  }
}

module.exports = { clienteModel };
