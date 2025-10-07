const db = require("../../config/sqlite");
const Cliente = require("../../domain/entities/Cliente");
const ClienteRepositoryInterface = require("../../domain/repositories/ClienteRepositoryInterface");
const util = require("util");

class ClienteRepositorySQLite extends ClienteRepositoryInterface {
  constructor() {
    super();
    // Promisificando métodos do sqlite
    this.all = util.promisify(db.all).bind(db);
    this.get = util.promisify(db.get).bind(db);
    this.run = util.promisify(db.run).bind(db);
  }

  runAsync(sql, params = []) {
    return new Promise((resolve, reject) => {
      db.run(sql, params, function (err) {
        if (err) return reject(err);
        resolve({ lastID: this.lastID, changes: this.changes });
      });
    });
  }

  async listar() {
    const rows = await this.all("SELECT * FROM clientes");
    return rows.map(r => new Cliente(r));
  }

  async buscarPorIdCliente(idCliente) {
    const row = await this.get("SELECT * FROM clientes WHERE idCliente = ?", [idCliente]);
    return row ? new Cliente(row) : null;
  }

  async buscarPorEmail(email, idCliente) {
    console.log('sqliteeee')
    const query = idCliente
      ? "SELECT * FROM clientes WHERE email = ? AND idCliente != ?"
      : "SELECT * FROM clientes WHERE email = ?";
    const params = idCliente ? [email, idCliente] : [email];

    const rows = await this.all(query, params);
    return rows.length > 0 ? rows[0] : null;
  }

  async autenticar({ nome, email }) {
    console.log(nome, email);
    const rows = await this.all(
      "SELECT * FROM clientes WHERE nome = ? AND email = ?",
      [nome, email]
    );
    console.log(rows)
    return rows.length > 0 ? rows[0] : null;
  }

  async criar(cliente) {
    const result = await this.runAsync(
      "INSERT INTO clientes (nome, email, saldo) VALUES (?, ?, ?)",
      [cliente.nome, cliente.email, cliente.saldo]
    );
    return new Cliente({ ...cliente, idCliente: result.lastID });
  }

  async atualizar(id, cliente) {
    const result = await this.runAsync(
      "UPDATE clientes SET nome = ?, email = ? WHERE idCliente = ?",
      [cliente.nome, cliente.email, id]
    );
    return result.changes > 0;
  }

  async deletar(id) {
    const result = await this.runAsync("DELETE FROM clientes WHERE idCliente = ?", [id]);
    return result.changes > 0;
  }

  // async depositar(id, valor) {
  //     const cliente = await this.buscarPorIdCliente(id);
  //     if (!cliente) throw new Error("Cliente não encontrado");
  //     cliente.saldo += valor;
  //     await this.atualizar(id, cliente);
  //     return cliente;
  // }

  // async sacar(id, valor) {
  //     const cliente = await this.buscarPorIdCliente(id);
  //     if (!cliente) throw new Error("Cliente não encontrado");
  //     if (cliente.saldo < valor) throw new Error("Saldo insuficiente");
  //     cliente.saldo -= valor;
  //     await this.atualizar(id, cliente);
  //     return cliente;
  // }
}

module.exports = ClienteRepositorySQLite;
