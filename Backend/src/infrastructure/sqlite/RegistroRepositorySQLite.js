const db = require("../../config/sqlite");
const Registro = require("../../domain/entities/Registro");
const RegistroRepositoryInterface = require("../../domain/repositories/RegistroRepositoryInterface");
const util = require("util");

class RegistroRepositorySQLite extends RegistroRepositoryInterface {
    constructor() {
        super();
        // Promisificando métodos do sqlite para usar async/await
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

    async buscarPorClienteId(fkCliente, ano, mes) {
        const inicio = `${ano}-${String(mes).padStart(2, "0")}-01`;
        const fim = new Date(ano, mes, 0).toISOString().split("T")[0];

        const rows = await this.all(
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
        const row = await this.get("SELECT * FROM registros WHERE idRegistro = ?", [id]);
        return row ? new Registro(row) : null;
    }

    async criar({ descricao, valor, data, tipo, repeticao, fkCliente, fkCategoria }) {
        const result = await this.runAsync(
            `INSERT INTO registros (descricao, valor, data, tipo, repeticao, fkCliente, fkCategoria) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [descricao, valor, data, tipo, repeticao, fkCliente, fkCategoria]
        );

        // SQLite não retorna insertId direto, precisa pegar "this.lastID"
        return new Registro({ idRegistro: result.lastID, descricao, valor, data, tipo, repeticao, fkCliente, fkCategoria });
    }

    async atualizar(id, { descricao, valor, data, tipo, repeticao, fkCategoria }) {
        const result = await this.runAsync(
            `UPDATE registros SET descricao = ?, valor = ?, data = ?, tipo = ?, repeticao = ?, fkCategoria = ? WHERE idRegistro = ?`,
            [descricao, valor, data, tipo, repeticao, fkCategoria, id]
        );
        return result.changes > 0;
    }

    async deletar(id) {
        const result = await this.runAsync("DELETE FROM registros WHERE idRegistro = ?", [id]);
        return result.changes > 0;
    }

    async agruparPorCategoria(fkCliente, ano, mes) {
        const inicio = `${ano}-${String(mes).padStart(2, "0")}-01`;
        const fim = new Date(ano, mes, 0).toISOString().split("T")[0];

        const rows = await this.all(
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

    async calcularSaldoAtual(fkCliente) {
        const hoje = new Date();
        const dataHoje = hoje.toISOString().split("T")[0];

        const rows = await this.all(
            `SELECT tipo, SUM(valor) as total
       FROM registros
       WHERE fkCliente = ? AND data <= ?
       GROUP BY tipo`,
            [fkCliente, dataHoje]
        );

        return rows;
    }

    async calcularSaldoMensal(fkCliente, ano) {
        const inicio = `${ano}-01-01`;
        const fim = `${ano}-12-31`;

        const rows = await this.all(
            `SELECT 
         strftime('%m', data) AS mes,
         SUM(
           CASE 
             WHEN tipo = 'Deposito' THEN valor
             WHEN tipo = 'Saque' THEN -valor
             ELSE 0
           END
         ) AS saldo_mensal
       FROM registros
       WHERE fkCliente = ? AND data BETWEEN ? AND ?
       GROUP BY mes
       ORDER BY mes ASC`,
            [fkCliente, inicio, fim]
        );

        let acumulado = 0;
        const nomesMes = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];

        const resultado = rows.map(r => {
            acumulado += Number(r.saldo_mensal);
            return { mes: nomesMes[Number(r.mes) - 1], saldo: acumulado };
        });

        return resultado;
    }

    async buscarFixosPorClienteData(fkCliente, ano, mes) {
        const inicio = `${ano}-${String(mes).padStart(2, "0")}-01`;
        const fim = new Date(ano, mes, 0).toISOString().split("T")[0];

        const rows = await this.all(
            `SELECT * FROM registros WHERE repeticao != "NONE" AND fkCliente = ? AND data BETWEEN ? AND ? ORDER BY data ASC`,
            [fkCliente, inicio, fim]
        );

        return rows;
    }

    async buscarPorData(hoje) {
        const rows = await this.all(
            `SELECT * FROM registros WHERE data = ? AND repeticao != "NONE"`,
            [hoje]
        );

        return rows;
    }
}

module.exports = RegistroRepositorySQLite;
