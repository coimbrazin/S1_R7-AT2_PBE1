const { enderecosModels } = require("../models/enderecosModel");

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
    selecionarTodos: async (req, res) => {
        try {
            const resultado = await enderecosModels.selectAll();
            if (resultado.length === 0) {
                return res.status(200).json({ message: 'A consulta não retornou resultados' });
            }
            res.status(200).json({ data: resultado });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Ocorreu um erro no servidor', errorMessage: error.message });
        }
    },
    //Criação de clientes
    incluirEndereco: async (req, res) => {
        try {
            const { idCliente, cep, numero, complemento} = req.body;
            if (!idCliente ||!cep || !numero || !complemento) {
                return res.status(400).json({ message: 'Verifique os dados enviado e tente novamente' });
            }
            const url = `https://viacep.com.br/ws/${cep}/json/`
            const response = await fetch(url)
            const dadosCep = await response.json();
            if (!dadosCep.error) {
                return res.status(400).json({ message: 'CEP inválido ou não encontrado' })
            }
            console.log("Endereço:", dadosCep);
            const resultado = await enderecosModels.InsertEndereco({
                idCliente,
                cep,
                numero,
                complemento,
                logradouro: dadosCep.logradouro,
                bairro: dadosCep.bairro,
                localidade: dadosCep.localidade,
                uf: dadosCep.uf
            });
    
            return res.status(201).json({ message: 'Endereço incluído com sucesso', data: resultado });
    
        } catch (error) {
            console.error(error);
            return res.status(500).json({
                message: 'Erro interno no servidor',
                errorMessage: error.message
            });
        }
    }
    // Alteração de clientes (se for alterar o CPF, verifique se o novo já existe e retorne a mesma mensagem da criação de clientes);
    alteraCliente: async (req, res) => {
        try {
            const idCliente = Number(req.params.idCliente);
            const { descri  cao, cpf } = req.body;

            if (!idCliente || (!descricao && !cpf) || isNaN(cpf) || typeof idCliente != 'number') {
                return res.status(400).json({ message: 'Verifiqueee os dados enviado e tente novamente' });
            }

            const clienteAtual = await produtoModel.selectById(idCliente);
            if (clienteAtual.length === 0) {
                return res.status(200).json({ message: 'Client não foi localizado não localizado' });
            }

            const novaDescricao = descricao ?? clienteAtual[0].nome_cliente;
            const novoCpf = cpf ?? clienteAtual[0].cpf_cliente;
            console.log(novaDescricao, novoCpf);

            const resultUpdate = await clienteModels.update(idCliente, novaDescricao, novoCpf);

            if (resultUpdate.affectedRows === 1 && resultUpdate.changedRows === 0) {
                return res.status(200).json({ message: 'Não há alterações a serem realizadas' });
            }
            if (resultUpdate.affectedRows === 1 && resultUpdate.changedRows === 1) {
                return res.status(200).json({ message: 'O registro foi alterado com sucesso' });
            }
            // res.json({message:'teste'})
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Ocorreu um erro no servidor', errorMessage: error.message })
        }
    },
    // Deleção de clientes;
    deleteCliente: async (req, res) => {
        try {
            const idCliente = Number(req.params.idCliente);

            if (!idCliente || !Number.isInteger(idCliente)) {
                return res.status(400).json({ message: 'Forneça um identificador válido' })
            }
            const clienteSelecionado = await clienteModels.delete(idCliente);
            if (clienteSelecionado.length === 0) {
                return res.status(200).json({ message: 'Cliente ñ localizado' });
            }
            const resultadoDelete = await clienteModels.delete(idCliente);
            if (resultadoDelete.affectedRows === 1) {
                return res.status(200).json({ message: 'Erro ao excluir cliente' })
            }
            res.status(200).json({
                message: 'CLiente excluído com sucesso',
                data: resultadoDelete
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Ocorreu erro no server', errorMessage: error.message })
        }
    }

}
module.exports = enderecoController;