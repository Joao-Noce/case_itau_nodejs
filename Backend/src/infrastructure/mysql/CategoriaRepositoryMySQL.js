const pool = require("../../config/mysql");
const Categoria = require("../../domain/entities/Categoria");
const CategoriaRepositoryInterface = require("../../domain/repositories/CategoriaRepositoryInterface");

class CategoriaRepositoryMySQL extends CategoriaRepositoryInterface {

  async buscarPorFkCliente(fkCliente) {
    const [rows] = await pool.query("SELECT * FROM categorias WHERE fkCliente IS NULL OR fkCliente = ? ORDER BY fkCliente IS NULL, fkCliente ASC", [fkCliente]);
    return rows.map(r => new Categoria(r));
  }

  async buscarPorIdCategoria(idCategoria) {
    const [rows] = await pool.query("SELECT * FROM categorias WHERE idCategoria = ?", [idCategoria]);
    return rows.length ? new Categoria(rows[0]) : null;
  }

  async criar({ nome, fkCliente }) {
    const [result] = await pool.query("INSERT INTO categorias (nome, fkCliente) VALUES (?, ?)", [nome, fkCliente]);
    return new Categoria({ idCategoria: result.insertId, nome, fkCliente });
  }

  async atualizar( idCategoria, { nome, fkCliente }) {
    const [result] = await pool.query("UPDATE categorias SET nome = ? WHERE idCategoria = ? AND fkCliente = ?", [nome, idCategoria, fkCliente]);
    return result.affectedRows > 0;
  }

  async deletar(idCategoria, fkCliente) {
    const [result] = await pool.query("DELETE FROM categorias WHERE idCategoria = ? AND fkCliente = ?", [idCategoria, fkCliente]);
    return result.affectedRows > 0;
  }
}

module.exports = CategoriaRepositoryMySQL;
