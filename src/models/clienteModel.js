const { pool } = require('../config/db');

const clienteModel = {

  /**
     * Insere os clientes na base de dados
     * @async
     * @function insertCliente
     * @param {number} pIdCliente Usado para identificar qual cliente e o detentor daquele telefone e endereco no BDDS.
     * @param {string} pNome Descrição do nome do cliente que deve ser inserido no BDDS.
     * @param {number} pCpf CPF do cliente que vai ser inserido no BDDS.
     * @param {string} pEmail E-mail do cliente que será inserido no BDDS.
     * @param {string} pTelefone Telefone do cliente que será inserido no BDDS.
     * @param {string} pCep CEP utilizado para puxar o endereco do cliente usando VIACEP
     * @param {string} pUf Preenchida a partir do retorno do VIACEP
     * @param {string} pCidade Preenchida a partir do retorno do VIACEP
     * @param {string} pBairro Preenchida a partir do retorno do VIACEP
     * @param {string} pLogradouro Preenchida a partir do retorno do VIACEP
     * @param {string} pNumero Número da casa do cliente
     * @param {string} pComplemento Complemento para identificar a casa do cliente
     * @param 
     * @returns {Promise<Object} Retorna um objeto contendo propriedades sobre o resultado da execução da query.
     * @example 
     * const result = await clienteModel.insertCliente(paramA, paramB, paramC);
     *  "result": {
     * "fieldCount": 0,
       *      "affectedRows": 1,
       *      "insertId": 1,
       *      "info": "",
       *      "serverStatus": 2,
       *      "warningStatus": 0,
       *      "changedRows": 0
       * } 
      */
  insertCliente: async (pNome, pCpf, pEmail, pTelefone, pCep, pUf, pCidade, pBairro, pLogradouro, pNumero, pComplemento) => {
    const connection = await pool.getConnection();

    try {
      await connection.beginTransaction();

      const sqlCliente = 'INSERT INTO clientes (nome, cpf, email) VALUES (?,?,?);';
      const valuesCliente = [pNome, pCpf, pEmail];
      const [rowsCliente] = await connection.query(sqlCliente, valuesCliente);

      const sqlTelefone = 'INSERT INTO telefones (id_cliente, telefone) VALUES (?,?);';
      for (let tel of pTelefone) {
        const valuesTelefone = [result.insertId, tel];
        await connection.query(sqlTelefone, valuesTelefone);
      }

      const sqlEndereco = 'INSERT INTO enderecos (id_cliente, cep, uf, cidade, bairro, logradouro, numero, complemento) VALUES (?,?,?,?,?,?,?,?)';
      const valuesEndereco = [result.insertId, pCep, pUf, pCidade, pBairro, pLogradouro, pNumero, pComplemento];
      const [rowsEndereco] = await connection.query(sqlEndereco, valuesEndereco);

      connection.commit();
      return { rowsCliente, rowsTelefone, rowsEndereco };
    } catch (error) {
      connection.rollback()
      throw error;
      
    }
  },

  buscarPorCpf: async (pCpf) => {
    const sql = 'SELECT * FROM clientes WHERE cpf=?;';
    const values = [pCpf];
    const [rows] = await pool.query(sql, values);
    return rows[0];
  },

  buscarPorEmail: async (pEmail) => {
    const sql = 'SELECT * FROM clientes WHERE email=?;';
    const values = [pEmail];
    const [rows] = await pool.query(sql, values);
    return rows[0];
  },


}

module.exports = { clienteModel };