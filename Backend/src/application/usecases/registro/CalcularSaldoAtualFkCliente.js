const Big = require("big.js");

class CalcularSaldoAtualFkCliente {
    constructor(registroRepository) {
        this.registroRepository = registroRepository;
    }

    async execute(idCliente) {
        const hoje = new Date();
        const dataHoje = hoje.toISOString().split("T")[0];

        const valores = await this.registroRepository.calcularSaldoAtualFkCliente(idCliente, dataHoje);

        let totalEntrada = new Big(0);
        let totalSaida = new Big(0);

        valores?.forEach(valor => {
            if (valor.tipo === 'Deposito') totalEntrada = totalEntrada.plus(Number(valor.total));
            else if (valor.tipo === 'Saque') totalSaida = totalSaida.plus(Number(valor.total));
        });

        const saldoAtual = totalEntrada.minus(totalSaida);

        return saldoAtual;
    }
}

module.exports = CalcularSaldoAtualFkCliente;