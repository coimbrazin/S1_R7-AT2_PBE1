const { pool } = require('../config/db');

const telefonesModel = {

    /**
     * Na Rota GET: telefones/
     * Busca todos os telefones cadastrados
     */
    selectAllTelefones: async () => {
        const sql = 'SELECT * FROM telefones;';
        const [rows] = await pool.query(sql);
        return rows;
    },

    /**
     * Na Rota GET: telefones/:id_telefone
     * @param {number} id_telefone ID do telefone
     * Busca um telefone específico
     */
    selectByIdTelefone: async (id_telefone) => {
        const sql = 'SELECT * FROM telefones WHERE id_telefone = ?;';
        const [rows] = await pool.query(sql, [id_telefone]);
        return rows;
    },

    /**
     * Na Rota POST: telefones/
     * @param {Object} telefone
     * @param {string} telefone.telefone Número do telefone
     * @param {number} telefone.id_cliente ID do cliente relacionado
     * Insere um novo telefone
     */
    insertTelefone: async (telefone) => {
        const sql = `
            INSERT INTO telefones (telefone, id_cliente)
            VALUES (?, ?)
        `;
    
        const values = [
            telefone.telefone,
            telefone.id_cliente
        ];
    
        const [result] = await pool.query(sql, values);
        return result;
    },

    /**
     * Na Rota PUT: telefones/:id_telefone
     * @param {number} id ID do telefone
     * @param {Object} dados Dados atualizados
     * @param {string} dados.novoTelefone Novo número
     * @param {number} dados.novoIdCliente Novo ID do cliente
     * Atualiza os dados de um telefone
     */
    updateTelefone: async (id, dados) => {
        const sql = `
            UPDATE telefones
            SET telefone = ?, id_cliente = ?
            WHERE id_telefone = ?
        `;
    
        const values = [
            dados.novoTelefone,
            dados.novoIdCliente,
            id
        ];
    
        const [rows] = await pool.query(sql, values);
        return rows;
    },

    /**
     * Na Rota DELETE: telefones/:id_telefone
     * @param {number} pIdCliente ID do telefone
     * Deleta um telefone específico
     */
    deleteTelefone: async (pIdCliente) => {
        const sql = `DELETE FROM telefones WHERE id_telefone = ?;`;
        const [rows] = await pool.query(sql, [pIdCliente]);
        return rows;
    }
};

module.exports = { telefonesModel };