const { pool } = require('../config/db');

const entregasModel = {

  selectAllEntregas: async () => {
    const sql = 'SELECT * FROM entregas;';
    const [rows] = await pool.query(sql);
    return rows;
  },

  selectByEntregas: async (pId) => {
    const sql = 'SELECT * FROM entregas WHERE id_entrega=?;';
    const values = [pId];
    const [rows] = await pool.query(sql, values);
    return rows;
  },

  updateEntregas: async (pIdPedido, pValorDistancia, pValorPeso, pAcrescimo, pDesconto, pTaxa, pValorFinal, pStatus) => {
    const sql = 'UPDATE entregas SET valor_da_distancia=?, valor_do_peso=?, acrescimo=?, desconto=?, taxa_extra=?, valor_final=?, status_entrega=? WHERE id_entrega=?;';
    const values = [pValorDistancia, pValorPeso, pAcrescimo, pDesconto, pTaxa, pValorFinal, pStatus, pIdPedido];
    const [rows] = await pool.query(sql, values);
    return rows;
  },

  deleteEntregas: async (pId) => {
    const sql = 'DELETE FROM entregas WHERE id_entrega=?;';
    const values = [pId]
    const [rows] = await pool.query(sql, values);
  }
};

module.exports = { entregasModel };