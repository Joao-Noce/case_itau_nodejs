const Big = require("big.js");

class CalcularSaldoMensalFkCliente {
    constructor(registroRepository) {
        this.registroRepository = registroRepository;
    }

    async execute(fkCliente, ano) {
        if (!fkCliente) throw new Error("fkCliente é obrigatório");
        if (!ano) throw new Error("ano é obrigatório");

        const inicio = `${ano}-01-01`;
        const fim = `${ano}-12-31`;

        const rows = await this.registroRepository.calcularSaldoMensalFkCliente(fkCliente, inicio, fim);

        let acumulado = new Big(0);
        const nomesMes = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];

        const resultado = rows.map(r => {
            acumulado = acumulado.plus(Number(r.saldo_mensal));
            return { mes: nomesMes[r.mes - 1], saldo: acumulado.toNumber() };
        });
        return resultado;
    }
}

module.exports = CalcularSaldoMensalFkCliente;
