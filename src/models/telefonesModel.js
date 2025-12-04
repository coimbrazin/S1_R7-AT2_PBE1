const { pool } = require('../config/db');
const { pedidosModel } = require('./pedidosModel');

const telefonesModel = {
    selectAllTelefones: async () => {
        const sql = 'SELECT * FROM telefones;';
        const [rows] = await pool.query(sql);
        return rows;
    },
    selectByIdTelefone: async (id_cliente) => { //Relação Cliente e Telefone
        const sql = 'SELECT * FROM telefones WHERE id_cliente = ?;';
        const [rows] = await pool.query(sql, [id_cliente]);
        return rows;
    },
    insertTelefone: async (telefone) => {
        const sql = `INSERT INTO telefones
        (telefone, id_cliente)`;

        const values = [
            telefone.id_cliente
        ];
        const resultado = await pool.query(sql, values);
        return resultado;
    },
    updateTelefone: async (id, dados) => {
        const sql = `
        UPDATE telefones
        SET telefone = ?, id_cliente = ?
        WHERE id_telefone = ?`;

        const values = [
            dados.telefone,
            dados.id_cliente,
            id
        ];
        const [rows] = await pool.query(sql, values);
        return rows;
    },
    deleteTelefone: async (pIdCliente) => {
        const sql = `DELETE FROM telefones WHERE id_telefone = ?;`;
        const [rows] = await pool.query(sql, [pIdCliente]);
        return rows;
    }
};

module.exports = { pedidosModel };