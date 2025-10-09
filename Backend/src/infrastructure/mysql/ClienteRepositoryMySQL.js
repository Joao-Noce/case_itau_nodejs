const ClienteRepositoryInterface = require("../../domain/repositories/ClienteRepositoryInterface");
const Cliente = require("../../domain/entities/Cliente");
const pool = require("../../config/mysql");

class ClienteRepositoryMySQL extends ClienteRepositoryInterface {
    async listar() {
        const [rows] = await pool.query("SELECT * FROM clientes");
        return rows.map(r => new Cliente(r));
    }

    async buscarPorIdCliente(idCliente) {
        const [rows] = await pool.query("SELECT * FROM clientes WHERE idCliente = ?", [idCliente]);
        return rows.length ? new Cliente(rows[0]) : null;
    }

    async buscarPorEmail(email, idCliente) {
        const query = idCliente
            ? "SELECT * FROM clientes WHERE email = ? AND idCliente != ?"
            : "SELECT * FROM clientes WHERE email = ?";
        const params = idCliente ? [email, idCliente] : [email];

        const [rows] = await pool.query(query, params);
        return rows.length > 0 ? rows[0] : null;
    }

    async autenticar({ nome, email }) {
        const [rows] = await pool.query(
            "SELECT * FROM clientes WHERE nome = ? AND email = ?",
            [nome, email]
        );

        return rows.length > 0 ? rows[0] : null;
    }

    async criar(cliente) {
        const [result] = await pool.query(
            "INSERT INTO clientes (nome, email, saldo) VALUES (?, ?, ?)",
            [cliente.nome, cliente.email, cliente.saldo]
        );
        return new Cliente({ ...cliente, id: result.insertId });
    }

    async atualizar(id, cliente) {
        const [result] = await pool.query(
            "UPDATE clientes SET nome = ?, email = ? WHERE idCliente = ?",
            [cliente.nome, cliente.email, id]
        );
        return result.affectedRows > 0;
    }

    async deletar(id) {
        const [result] = await pool.query("DELETE FROM clientes WHERE idCliente = ?", [id]);
        return result.affectedRows > 0;
    }
}

module.exports = ClienteRepositoryMySQL;
