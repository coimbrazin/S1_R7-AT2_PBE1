const { pool } = require('../config/db');

const entregasModel = {

  /**
   * Seleciona todas as entregas cadastradas no banco.
   * 
   * @async
   * @function selectAllEntregas
   * @returns {Promise<Array<Object>>} Retorna uma lista com todas as entregas.
   * @example
   * const entregas = await entregasModel.selectAllEntregas();
   */
  selectAllEntregas: async () => {
    const sql = 'SELECT * FROM entregas;';
    const [rows] = await pool.query(sql);
    return rows;
  },

  /**
   * Seleciona uma entrega específica pelo ID.
   * 
   * @async
   * @function selectByEntregas
   * @param {number} pId - ID da entrega a ser buscada.
   * @returns {Promise<Array<Object>>} Retorna um array contendo a entrega encontrada (ou vazio caso não exista).
   * @example
   * const entregas = await entregasModel.selectByEntregas(2);
   */
  selectByEntregas: async (pId) => {
    const sql = 'SELECT * FROM entregas WHERE id_entrega=?;';
    const values = [pId];
    const [rows] = await pool.query(sql, values);
    return rows;
  },

  /**
   * Atualiza os valores de uma entrega.
   * 
   * @async
   * @function updateEntregas
   * @param {number} pIdPedido - ID da entrega que será atualizada.
   * @param {number} pValorDistancia - Valor calculado da distância (R$).
   * @param {number} pValorPeso - Valor calculado do peso (R$).
   * @param {number} pAcrescimo - Acréscimo aplicado (R$).
   * @param {number} pDesconto - Desconto aplicado (R$).
   * @param {number} pTaxa - Taxa extra aplicada (R$).
   * @param {number} pValorFinal - Valor final da entrega.
   * @param {string} pStatus - Status da entrega (ex: "pendente", "enviado", "concluído").
   * @returns {Promise<Object>} Retorna um objeto contendo informações da atualização (affectedRows, changedRows, etc.).
   * @example
   * const entregas = await entregasModel.updateEntregas(<parâmetros para alterar>);
   */
  updateEntregas: async (pIdPedido, pValorDistancia, pValorPeso, pAcrescimo, pDesconto, pTaxa, pValorFinal, pStatus) => {
    const sql = 'UPDATE entregas SET valor_da_distancia=?, valor_do_peso=?, acrescimo=?, desconto=?, taxa_extra=?, valor_final=?, status_entrega=? WHERE id_entrega=?;';

    const values = [
      pValorDistancia,
      pValorPeso,
      pAcrescimo,
      pDesconto,
      pTaxa,
      pValorFinal,
      pStatus,
      pIdPedido
    ];

    const [rows] = await pool.query(sql, values);
    return rows;
  },

  /**
   * Deleta uma entrega pelo ID.
   * 
   * @async
   * @function deleteEntregas
   * @param {number} pId - ID da entrega que será deletada.
   * @returns {Promise<void>} Não retorna nada, apenas executa o delete.
   * @example
   * const entregas = await entregasModel.deleteEntregas(2);
   */
  deleteEntregas: async (pId) => {
    const sql = 'DELETE FROM entregas WHERE id_entrega=?;';
    const values = [pId];
    const [rows] = await pool.query(sql, values);
  }
};

module.exports = { entregasModel };
