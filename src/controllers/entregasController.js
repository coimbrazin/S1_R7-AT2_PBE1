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

  atualizarEntrega: async (req, res) => {
    try {
      const id_entrega = Number(req.params.id_entrega);
      const {
        valor_da_distancia,
        valor_do_peso,
        acrescimo,
        desconto,
        taxa_extra,
        valor_final,
        status_entrega
      } = req.body;

      if (isNaN(id_entrega)) {
        return res.status(400).json({ message: 'ID da entrega inválido.' });
      }

      const entrega = await entregasModel.selectByEntregas(id_entrega);
      if (entrega.length === 0) {
        return res.status(404).json({ message: 'Entrega não encontrada.' });
      }

      const atual = entrega[0];

      const novoValores = {
        pValorDistancia: valor_da_distancia ?? atual.valor_da_distancia,
        pValorPeso: valor_do_peso ?? atual.valor_do_peso,
        pAcrescimo: acrescimo ?? atual.acrescimo,
        pDesconto: desconto ?? atual.desconto,
        pTaxaExtra: taxa_extra ?? atual.taxa_extra,
        pValorFinal: valor_final ?? atual.valor_final,
        pStatusEntrega: status_entrega ?? atual.status_entrega
      };

      const resultado = await entregasModel.updateEntregas(
        id_entrega,
        novoValores.pValorDistancia,
        novoValores.pValorPeso,
        novoValores.pAcrescimo,
        novoValores.pDesconto,
        novoValores.pTaxaExtra,
        novoValores.pValorFinal,
        novoValores.pStatusEntrega
      );

      if (resultado.affectedRows === 1 && resultado.changedRows === 0) {
        return res.status(200).json({ message: 'Não há alterações a serem realizadas' });
      }

      if (resultado.affectedRows === 1 && resultado.changedRows === 1) {
        return res.status(200).json({ message: 'Registro alterado com sucesso', data: resultado });
      }

    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Ocorreu um erro no servidor', errorMessage: error.message });
    }
  },

  deletarEntrega: async (req, res) => {
    try {
      const id_entrega = Number(req.params.id_entrega);

      if (isNaN(id_entrega)) {
        return res.status(400).json({ message: 'ID inválido.' });
      }

      const entrega = await entregasModel.selectByEntregas(id_entrega);

      if (entrega.length === 0) {
        return res.status(404).json({ message: 'Entrega não encontrada.' });
      }

      await entregasModel.deleteEntregas(id_entrega);

      return res.status(200).json({ message: 'Entrega deletada com sucesso.' });

    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Erro interno do servidor', errorMessage: error.message });
    }
  }
}

module.exports = { entregasController };