const { enderecosModel } = require("../models/enderecosModel");
const { buscarCep } = require("../utils/viacep");

const enderecoController = {
    /**
     * /**
     * Retorna os produtos cadastrados
     * Rota GET /produtos
     * @async
     * @function selecionaTodos
     * @param {Request} req Objeto da requisição HTTP
     * @param {Response} res Objeto da resposta HTTP
     * @returns {Promise<Array<Object>>} Objeto contendo o resultado da consulta 
     */
    // selecionarTodos: async (req, res) => {
    //     try {
    //         const resultado = await enderecosModel.selectAll();
    //         if (resultado.length === 0) {
    //             return res.status(200).json({ message: 'A consulta não retornou resultados' });
    //         }
    //         res.status(200).json({ data: resultado });
    //     } catch (error) {
    //         console.error(error);
    //         res.status(500).json({ message: 'Ocorreu um erro no servidor', errorMessage: error.message });
    //     }
    // },
    selecionarTodos: async (req, res) => {
        try {
          const { id_cliente } = req.query;
          let resultado;

          if (id_cliente) {
            resultado = await enderecosModel.selectByCliente(id_cliente);
      
            if (resultado.length === 0) {
              return res.status(200).json({ 
                message: 'Não há endereços para o ID informado' 
              });
            }
      
            return res.status(200).json({
              message: 'Endereços do cliente',
              data: resultado
            });
          }
          resultado = await enderecosModel.selectAll();
      
          if (resultado.length === 0) {
            return res.status(200).json({ 
              message: 'A consulta não retornou resultados' 
            });
          }
      
          res.status(200).json({
            message: 'Todos os endereços',
            data: resultado
          });
      
        } catch (error) {
          console.error(error);
          res.status(500).json({
            message: 'Ocorreu um erro no servidor',
            errorMessage: error.message
          });
        }
      },
    //CriaçãO De Endereços
    incluirEndereco: async (req, res) => {
        try {
            const { id_cliente, cep, numero, complemento } = req.body;
            if (!id_cliente || !cep || !numero || !complemento) {
                return res.status(400).json({ message: 'Verifique os dados enviado e tente novamente' });
            }

            const dadosCep = await buscarCep(cep);
            console.log("Endereço:", dadosCep);
            const resultado = await enderecosModel.insertEndereco (
                id_cliente,
                cep,
                numero,
                complemento,
                dadosCep
            );

            return res.status(201).json({ message: 'Endereço incluído com sucesso', data: resultado });

        } catch (error) {
            console.error(error);
            return res.status(500).json({
                message: 'Erro interno no servidor',
                errorMessage: error.message
            });
        }
    },
    // Alteração de Endereços
    alterarEndereco: async (req, res) => {
        try {
          const id_cliente = Number(req.params.id_cliente);
          const { cep, numero, complemento } = req.body;
      
          if (isNaN(id_cliente)) {
            return res.status(400).json({ message: 'ID do cliente inválido' });
          }
      
          if (!cep && !numero && !complemento) {
            return res.status(400).json({ message: 'Envie ao menos um campo para atualizar' });
          }
      
          // Busca o enderço do cliente atual
          const enderecoAtual = await enderecosModel.selectByCliente(id_cliente);
      
          if (enderecoAtual.length === 0) {
            return res.status(404).json({ message: 'Endereço não encontrado para este cliente' });
          }
      
          let dadosCep = {
            uf: enderecoAtual[0].uf,
            localidade: enderecoAtual[0].cidade,
            bairro: enderecoAtual[0].bairro,
            logradouro: enderecoAtual[0].logradouro
          };
      
          if (cep) {
            const busca = await buscarCep(cep);
            if (!busca.logradouro) {
              return res.status(400).json({ message: 'CEP inválido' });
            }
            dadosCep = busca;
          }
      
          const novoCep = cep ?? enderecoAtual[0].cep;
          const novoNumero = numero ?? enderecoAtual[0].numero;
          const novoComplemento = complemento ?? enderecoAtual[0].complemento;
    
          const resultado = await enderecosModel.updateEndereco(
            id_cliente,
            novoCep,
            dadosCep.uf,
            dadosCep.localidade,
            dadosCep.bairro,
            dadosCep.logradouro,
            novoNumero,
            novoComplemento
          );
      
          if (resultado.affectedRows === 1 && resultado.changedRows === 0) {
            return res.status(200).json({ message: 'Nenhuma alteração realizada' });
          }
      
          if (resultado.affectedRows === 1 && resultado.changedRows === 1) {
            return res.status(200).json({ message: 'Endereço atualizado com sucesso' });
          }
      
          return res.status(500).json({ message: 'Erro inesperado ao atualizar o endereço' });
      
        } catch (error) {
          console.error(error);
          res.status(500).json({
            message: 'Erro interno no servidor',
            errorMessage: error.message
          });
        }
      },
    // Deleção de clientes;
    deleteEndereco: async (req, res) => {
        try {
            const id_cliente = Number(req.params.id_cliente);

            const enderecoSelecionado = await enderecosModel.selectEnderecoPorCliente(id_cliente);
    
            if (!enderecoSelecionado || enderecoSelecionado.length === 0) {
                return res.status(404).json({ message: 'Endereço não encontrado' });
            }
            const resultadoDelete = await enderecosModel.deleteEnderecoCliente(id_cliente);
    
            return res.status(200).json({
                message: 'Endereço excluído com sucesso.',
                data: resultadoDelete
            });
    
        } catch (error) {
            console.error(error);
            res.status(500).json({
                message: 'Erro interno no servidor.',
                errorMessage: error.message
            });
        }
    }    
}
module.exports = enderecoController;