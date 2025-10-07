const repo = require("../../../config/repo");

class CalcularSaldoAtualCliente {
    async execute(idCliente) {
        const valores = await repo.registroRepository.calcularSaldoAtual(idCliente);

        let totalEntrada = 0;
        let totalSaida = 0;

        valores?.forEach(valor => {
            if (valor.tipo === 'Deposito') totalEntrada += valor.total;
            else if (valor.tipo === 'Saque') totalSaida += valor.total;
        });

        const saldoAtual = totalEntrada - totalSaida;

        return saldoAtual;
    }
}

module.exports = CalcularSaldoAtualCliente;