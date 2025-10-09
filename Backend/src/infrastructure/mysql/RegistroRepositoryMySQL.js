const pool = require("../../config/mysql");
const Registro = require("../../domain/entities/Registro");
const RegistroRepositoryInterface = require("../../domain/repositories/RegistroRepositoryInterface");

class RegistroRepositoryMySQL extends RegistroRepositoryInterface {

  async buscarPorFkClienteData(fkCliente, inicio, fim) {

    const [rows] = await pool.query(
      `SELECT r.*, c.nome as nomeCategoria FROM registros r
      JOIN categorias c ON idCategoria = fkCategoria
      WHERE r.fkCliente = ? 
      AND data BETWEEN ? AND ? 
      ORDER BY data ASC`,
      [fkCliente, inicio, fim]
    );

    return rows;
  }

  async buscarPorId(id) {
    const [rows] = await pool.query("SELECT * FROM registros WHERE idRegistro = ?", [id]);
    return rows.length ? new Registro(rows[0]) : null;
  }

  async criar({ descricao, valor, data, tipo, repeticao, fkCliente, fkCategoria }) {
    const [result] = await pool.query(
      `INSERT INTO registros (descricao, valor, data, tipo, repeticao, fkCliente, fkCategoria) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [descricao, valor, data, tipo, repeticao, fkCliente, fkCategoria]
    );
    return new Registro({ idRegistro: result.insertId, descricao, valor, data, tipo, repeticao, fkCliente, fkCategoria });
  }

  async atualizar(id, { descricao, valor, data, tipo, repeticao, fkCategoria }) {
    const [result] = await pool.query(
      `UPDATE registros SET descricao = ?, valor = ?, data = ?, tipo = ?, repeticao = ?, fkCategoria = ? WHERE idRegistro = ?`,
      [descricao, valor, data, tipo, repeticao, fkCategoria, id]
    );
    return result.affectedRows > 0;
  }

  async deletar(id) {
    const [result] = await pool.query("DELETE FROM registros WHERE idRegistro = ?", [id]);
    return result.affectedRows > 0;
  }

  async agruparPorFkCategoria(fkCliente, inicio, fim) {
    const [rows] = await pool.query(
      `SELECT c.nome AS categoria, SUM(r.valor) AS total
   FROM registros r
   JOIN categorias c ON r.fkCategoria = c.idCategoria
   WHERE r.fkCliente = ?
   AND r.tipo = 'Saque'
   AND data BETWEEN ? AND ?
   GROUP BY r.fkCategoria`,
      [fkCliente, inicio, fim]
    );
    return rows;
  }

  async calcularSaldoAtualFkCliente(fkCliente, dataHoje) {
    const [rows] = await pool.query(
      `
            SELECT tipo, SUM(valor) as total
            FROM registros
            WHERE fkCliente = ? AND data <= ?
            GROUP BY tipo`,
      [fkCliente, dataHoje]
    );

    return rows;
  }

  async calcularSaldoMensalFkCliente(fkCliente, inicio, fim) {
    const [rows] = await pool.query(
      `SELECT 
        MONTH(r.data) AS mes,
        SUM(
          CASE 
            WHEN r.tipo = 'Deposito' THEN r.valor
            WHEN r.tipo = 'Saque' THEN -r.valor
            ELSE 0
          END
        ) AS saldo_mensal
    FROM registros r
    WHERE r.fkCliente = ?
      AND r.data BETWEEN ? AND ?
    GROUP BY mes
    ORDER BY mes ASC
    `,
      [fkCliente, inicio, fim]
    );
    return rows;
  }

  async buscarFixosPorFkClienteData(fkCliente, inicio, fim) {
    const [rows] = await pool.query(
      `SELECT * FROM registros WHERE repeticao != "NONE" AND fkCLiente = ? AND data BETWEEN ? AND ? ORDER BY data ASC`,
      [fkCliente, inicio, fim]
    );
    return rows;
  }

  async buscarPorData(hoje) {

    const [rows] = await pool.query(
      `SELECT * FROM registros WHERE data = ? AND repeticao != "NONE"`,
      [hoje]
    );
    return rows;
  }
}

module.exports = RegistroRepositoryMySQL;
