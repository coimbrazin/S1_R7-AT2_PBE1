const { entregasModel } = require('../models/entregasModel');

const entregasController = {
  selecionaTodasEntregas: async (req, res) => {
    try {
      const { id_entrega } = req.query;
      let resultado;
      if (id_entrega) {
        resultado = await entregasModel.selectByEntregas(id_entrega);
        if (resultado.length === 0) {
          return res.status(200).json({ message: 'Não a dados com o ID pesquisado' })
        }
        return res.status(200).json({ message: 'Dados da tabela entregas', data: resultado })
      }
      resultado = await entregasModel.selectAllEntregas();
      if (resultado.length === 0) {
        return res.status(200).json({ message: 'A consulta não retornou resultados' });
      }
      res.status(200).json({ message: 'Dados da tabela entregas', data: resultado })
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Ocorreu um erro no servidor', errorMessage: error.message });
    }
  },


}

module.exports = { entregasController };