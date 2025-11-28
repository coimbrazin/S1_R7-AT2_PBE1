const { pool } = require('../config/db');

const enderecosModel = {

  /**
     * Insere o Endereço na base de dados
     * @async
     * @function insertEndereco
     * @param {int} pIdCliente Id do Cliente - Na tabela de Clientes
     * @param {string} pCep Cep do cliente
     * @param {number} pUf Estado do Cep
     * @param {string} pCidade Cidade do cliente
     * @param {string} pBairro Bairro do Cliente
     * @param {string} pLogradouro Rua do Cliente
     * @param {number} pNumero Numero da Casa do Cliente
     * @param {string} pComplemento Complemento da  casa
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
  selectAll: async () => {
    const sql = 'SELECT * FROM enderecos;';
    const [rows] = await pool.query(sql);
    return rows;
  },
  insertEndereco: async (pIdCliente, pCep, pUf, pCidade, pBairro, pLogradouro, pNumero, pComplemento) => {
    const connection = await pool.getConnection();

    try {
      await connection.beginTransaction();

      const sqlEndereco = 'INSERT INTO enderecos (id_cliente, cep, uf, cidade, bairro, logradouro, numero, complemento) VALUES (?,?,?,?,?,?,?,?);';
      const valuesEndereco = [pIdCliente, pCep, pUf, pCidade, pBairro, pLogradouro, pNumero, pComplemento];
      const [rowsEndereco] = await pool.query(sqlEndereco, valuesEndereco);

      connection.commit();
      return rowsEndereco;
    } catch (error) {
      connection.rollback()
    }

  },
  updateEndereco: async (pIdCliente, pCep, pUf, pCidade, pBairro, pLogradouro, pNumero, pComplemento) => {
    const sql = 'UPDATE endereco cep=?, uf=?, cidade=?, bairro=?, logradouro=?, numero=?, complemento=? WHERE id_cliente=?;';
    const values = [pCep, pUf, pCidade, pBairro, pLogradouro, pNumero, pComplemento, pIdCliente]
    const [rows] = await pool.query(sql, values);
  },
  deleteEnderecoCliente: async (pIdCliente) => {
    const sql = 'DELETE FROM endereco WHERE id_cliente = ?;';
    const values = [pIdCliente];
    const [rows] = await pool.query(sql, values);
    return rows;
  }
}

module.exports = { enderecosModel };