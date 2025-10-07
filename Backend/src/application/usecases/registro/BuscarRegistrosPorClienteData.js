const repo = require("../../../config/repo");
const CalcularSaldoAtualCliente = require("../cliente/CalcularSaldoAtualCliente");

class BuscarRegistrosPorClienteData {
  constructor(registroRepository) {
    this.registroRepository = registroRepository;
  }

  async execute(fkCliente, ano, mes) {
    if (!fkCliente) throw new Error("fkCliente é obrigatório");

    const rows = await this.registroRepository.buscarPorClienteId(fkCliente, ano, mes);

    let entradaTotal = 0;
    let saidaTotal = 0;

    for (const row of rows) {
      if (row.tipo === "Deposito") entradaTotal += Number(row.valor);
      else saidaTotal += Number(row.valor);
    }
    const saldoFinal = entradaTotal - saidaTotal;

    const saldoAtual = await new CalcularSaldoAtualCliente(repo.registroRepository).execute(fkCliente);

    return {
      entradaTotal,
      saidaTotal,
      saldoFinal,
      saldoAtual,
      rows
    }
  }
}

module.exports = BuscarRegistrosPorClienteData;