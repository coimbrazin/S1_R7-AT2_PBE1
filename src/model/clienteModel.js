const { pool } = require('../config/db');

const clienteModel = {

/**
   * Insere os clientes na base de dados
   * @async
   * @function insertCliente
   * @param {string} pNome Descrição do nome do cliente que deve ser inserido no BDDS.
   * @param {number} pCpf CPF do cliente que vai ser inserido no BDDS.
   * @param {string} pEmail E-mail do cliente que será inserido no BDDS.
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
  insertCliente: async (pNome, pCpf, pEmail) => {
    const sql = 'INSERT INTO produtos (nome, cpf, email) VALUES (?,?,?);';
    const values = [pNome, pCpf, pEmail]
    const [rows] = await pool.query(sql, values);
    return rows;
  }
}