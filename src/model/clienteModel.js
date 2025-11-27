const { pool } = require('../config/db');

const clienteModel = {

/**
   * Insere os produtos na base de dados
   * @async
   * @function insert
   * @param {string} pNomeProd Descrição do nome do produto que deve ser inserido no BDDS. Ex: 'Teclado'
   * @param {number} pValorProd Valor do produto que será inserido no BDDS. Ex.: 199.90
   * @returns {Promise<Object} Retorna um objeto contendo propriedades sobre o resultado da execução da query.
   * @example 
   * const result = await produtoModel.insert(paramA, paramB);
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
  insertCliente: async (pNomeProd, pValorProd) => {
    const sql = 'INSERT INTO produtos (nome_produto, valor) VALUES (?,?);';
    const values = [pNomeProd, pValorProd]
    const [rows] = await pool.query(sql, values);
    return rows;
  }
}