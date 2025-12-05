const { pool } = require('../config/db');

const enderecosModel = {

  /**
   * Na Rota GET: enderecos/
   * Na Rota GET: enderecos?id_cliente=1
   * Busca todos os endereços cadastrados
   */
  selectAll: async () => {
    const sql = 'SELECT * FROM enderecos;';
    const [rows] = await pool.query(sql);
    return rows;
  },

  /**
   * Na Rota GET: enderecos?id_cliente=1
   * @param {number} id_cliente ID do cliente
   * Busca endereço(s) de um cliente específico
   */
  selectByCliente: async (id_cliente) => {
    const sql = 'SELECT * FROM enderecos WHERE id_cliente = ?;';
    const [rows] = await pool.query(sql, [id_cliente]);
    return rows;
  },

  /**
   * Na Rota POST: enderecos/
   * @param {int} pIdCliente ID do Cliente
   * @param {string} pCep CEP do Cliente
   * @param {number} pNumero Número da residência
   * @param {string} pComplemento Complemento
   * @param {Object} pDadosEndereco Dados retornados pelo ViaCEP (uf, cidade, bairro, logradouro)
   * Insere um novo endereço no banco
   */
  insertEndereco: async (pIdCliente, pCep, pNumero, pComplemento, pDadosEndereco) => {
    const sqlEndereco = `
      INSERT INTO enderecos 
      (id_cliente, cep, uf, cidade, bairro, logradouro, numero, complemento) 
      VALUES (?,?,?,?,?,?,?,?);
    `;

    const valuesEndereco = [
      pIdCliente,
      pCep,
      pDadosEndereco.uf,
      pDadosEndereco.localidade,
      pDadosEndereco.bairro,
      pDadosEndereco.logradouro,
      pNumero,
      pComplemento
    ];

    const [rowsEndereco] = await pool.query(sqlEndereco, valuesEndereco);
    return rowsEndereco;
  },

  /**
   * Na Rota PUT: enderecos/:id_cliente
   * @param {number} pIdCliente ID do cliente
   * @param {string} pCep CEP atualizado
   * @param {string} pUf UFs
   * @param {string} pCidade Cidade
   * @param {string} pBairro Bairro
   * @param {string} pLogradouro Logradouro
   * @param {number} pNumero Número da residência
   * @param {string} pComplemento Complemento
   * Atualiza um endereço já existente
   */
  updateEndereco: async (pIdCliente, pCep, pUf, pCidade, pBairro, pLogradouro, pNumero, pComplemento) => {
    const sql = `
      UPDATE enderecos 
      SET cep=?, uf=?, cidade=?, bairro=?, logradouro=?, numero=?, complemento=? 
      WHERE id_cliente=?;
    `;
    const values = [pCep, pUf, pCidade, pBairro, pLogradouro, pNumero, pComplemento, pIdCliente];
    const [rows] = await pool.query(sql, values);
    return rows;
  },

  /**
   * Na Rota DELETE: enderecos/:id_cliente
   * @param {number} pIdCliente ID do Cliente
   * Deleta o endereço de um cliente específico
   */
  deleteEnderecoCliente: async (pIdCliente) => {
    const sql = 'DELETE FROM enderecos WHERE id_cliente = ?;';
    const values = [pIdCliente];
    const [rows] = await pool.query(sql, values);
    return rows;
  }
}

module.exports = { enderecosModel };
