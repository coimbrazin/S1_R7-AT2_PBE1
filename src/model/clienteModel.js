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
  insertCliente: async (pIdCliente, pNome, pCpf, pEmail, pTelefone, pCep, pUf, pCidade, pBairro, pLogradouro, pNumero, pComplemento) => {
    const connection = await pool.getConnection();

    try {
      await connection.beginTransaction();

      const sqlCliente = 'INSERT INTO clientes (nome, cpf, email) VALUES (?,?,?);';
      const valuesCliente = [pNome, pCpf, pEmail];
      const [rowsCliente] = await pool.query(sqlCliente, valuesCliente);

      const sqlTelefone = 'INSERT INTO telefones (id_cliente, telefone) VALUES (?,?);';
      const valuesTelefone = [pIdCliente, pTelefone];
      const [rowsTelefone] = await pool.query(sqlTelefone, valuesTelefone);

      const sqlEndereco = 'INSERT INTO enderecos (id_cliente, cep, uf, cidade, bairro, logradouro, numero, complemento) VALUES (?,?,?,?,?,?,?,?)';
      const valuesEndereco = [pIdCliente, pCep, pUf, pCidade, pBairro, pLogradouro, pNumero, pComplemento];
      const [rowsEndereco] = await pool.query(sqlEndereco, valuesEndereco);

      connection.commit();
      return { rowsCliente, rowsTelefone, rowsEndereco };
    } catch (error) {
      connection.rollback()
    }
  }
}

module.exports = { clienteModel };