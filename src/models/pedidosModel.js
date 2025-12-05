const { pool } = require('../config/db');

const pedidosModel = {

    /**
     * Na Rota GET: pedidos/
     * Retorna todos os registros da tabela de pedidos.
     */
    selectAllPedidos: async () => {
        const sql = 'SELECT * FROM pedidos;';
        const [rows] = await pool.query(sql);
        return rows;
    },

    /**
     * Na Rota GET: pedidos/:id_cliente
     * @param {number} id_cliente ID do cliente
     * Retorna todos os pedidos de um cliente específico.
     */
    selectByIdPedido: async (id_cliente) => {
        const sql = 'SELECT * FROM pedidos WHERE id_cliente = ?;';
        const [rows] = await pool.query(sql, [id_cliente]);
        return rows;
    },

    /**
     * Na Rota POST: pedidos/
     * Insere um novo pedido no banco.
     * @param {Object} pedido
     * @param {number} pedido.id_cliente
     * @param {number} pedido.id_endereco
     * @param {string} pedido.data_do_pedido
     * @param {string} pedido.tipo_de_entrega
     * @param {number} pedido.distancia
     * @param {number} pedido.peso_da_carga
     * @param {number} pedido.valor_base_por_km
     * @param {number} pedido.valor_base_por_kg
     */
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

    /**
     * Na Rota PUT: pedidos/:id_pedido
     * Atualiza os dados de um pedido específico.
     * @param {number} id ID do pedido
     * @param {Object} dados Dados atualizados
     * @param {number} dados.id_cliente
     * @param {number} dados.id_endereco
     * @param {string} dados.tipo_de_entrega
     * @param {number} dados.distancia
     * @param {number} dados.peso_da_carga
     */
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

    /**
     * Na Rota DELETE: pedidos/:id_pedido
     * @param {number} pIdCliente ID do Pedido
     * Exclui um pedido pelo ID do pedido.
     */
    deletePedidoCliente: async (pIdCliente) => {
        const sql = 'DELETE FROM pedidos WHERE id_pedido = ?;';
        const [rows] = await pool.query(sql, [pIdCliente]);
        return rows;
    }
};

module.exports = { pedidosModel };
