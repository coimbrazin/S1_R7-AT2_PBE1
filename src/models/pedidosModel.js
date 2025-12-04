const { pool } = require('../config/db');

const pedidosModel = {

    selectAllPedidos: async () => {
        const sql = 'SELECT * FROM pedidos;';
        const [rows] = await pool.query(sql);
        return rows;
    },

    selectByIdPedido: async (id_cliente) => { //Relação Cliente e Pedido
        const sql = 'SELECT * FROM pedidos WHERE id_cliente = ?;';
        const [rows] = await pool.query(sql, [id_cliente]);
        return rows;
    },

    insertPedido: async (pedido) => {
        const sql = ` INSERT INTO pedidos 
            (id_cliente, id_endereco, data_do_pedido, tipo_de_entrega, distancia, peso_da_carga, valor_base_por_km, valor_base_por_kg)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

        const values = [
            pedido.id_cliente,
            pedido.id_endereco,
            pedido.data_do_pedido,
            pedido.tipo_de_entrega,
            pedido.distancia,
            pedido.peso_da_carga,
            pedido.valor_base_por_km,
            pedido.valor_base_por_kg
        ];

        const [resultado] = await pool.query(sql, values);
        return resultado;
    },

    updatePedido: async (id, dados) => {
        const sql = `
            UPDATE pedidos 
            SET id_cliente = ?, id_endereco = ?, tipo_de_entrega = ?, distancia = ?, peso_da_carga = ?
            WHERE id_pedido = ?
        `;
        const values = [
            dados.id_cliente,
            dados.id_endereco,
            dados.tipo_de_entrega,
            dados.distancia,
            dados.peso_da_carga,
            id
        ];

        const [rows] = await pool.query(sql, values);
        return rows;
    },

    deletePedidoCliente: async (pIdCliente) => {
        const sql = 'DELETE FROM pedidos WHERE id_pedido = ?;';
        const [rows] = await pool.query(sql, [pIdCliente]);
        return rows;
    }
};

module.exports = { pedidosModel };
