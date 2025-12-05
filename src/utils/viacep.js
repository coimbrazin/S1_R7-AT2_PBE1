const axios = require("axios");

/**
 * Busca informações de endereço usando o ViaCEP
 * @async
 * @function buscarCep
 * @param {string} pCep CEP enviado pelo cliente.
 * @returns {Promise<Object|null>} Retorna os dados do endereço ou null caso não encontre.
 */
async function buscarCep(pCep) {
  try {
    const cepLimpo = pCep.replace(/\D/g, "");

    if (cepLimpo.length !== 8) {
      throw new Error("CEP inválido. O CEP deve ter 8 dígitos.");
    }

    const url = `https://viacep.com.br/ws/${cepLimpo}/json/`;

    const response = await axios.get(url);

    if (response.data.erro) {
      throw new Error("CEP não encontrado.");
    }

    return response.data;
  } catch (erro) {
    console.error("Erro ao buscar CEP:", erro.message);
    return null;
  }
}

module.exports = { buscarCep };