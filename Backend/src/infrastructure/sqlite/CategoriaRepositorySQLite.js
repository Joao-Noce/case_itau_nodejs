const db = require("../../config/sqlite");
const Categoria = require("../../domain/entities/Categoria");
const CategoriaRepositoryInterface = require("../../domain/repositories/CategoriaRepositoryInterface");
const util = require("util");

class CategoriaRepositorySQLite extends CategoriaRepositoryInterface {
  constructor() {
    super();
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

  async buscarPorFkCliente(fkCliente) {
    const rows = await this.all(
      "SELECT * FROM categorias WHERE fkCliente IS NULL OR fkCliente = ? ORDER BY fkCliente IS NULL, fkCliente ASC",
      [fkCliente]
    );
    return rows.map(r => new Categoria(r));
  }

  async buscarPorIdCategoria(idCategoria) {
    const row = await this.get("SELECT * FROM categorias WHERE idCategoria = ?", [idCategoria]);
    return row ? new Categoria(row) : null;
  }

  async criar({ nome, fkCliente }) {
    const result = await this.runAsync(
      "INSERT INTO categorias (nome, fkCliente) VALUES (?, ?)",
      [nome, fkCliente]
    );
    return new Categoria({ idCategoria: result.lastID, nome, fkCliente });
  }

  async atualizar(idCategoria, { nome, fkCliente }) {
    const result = await this.runAsync(
      "UPDATE categorias SET nome = ? WHERE idCategoria = ? AND fkCliente = ?",
      [nome, idCategoria, fkCliente]
    );
    return result.changes > 0;
  }

  async deletar(idCategoria, fkCliente) {
    const result = await this.runAsync(
      "DELETE FROM categorias WHERE idCategoria = ? AND fkCliente = ?",
      [idCategoria, fkCliente]
    );
    return result.changes > 0;
  }
}

module.exports = CategoriaRepositorySQLite;
