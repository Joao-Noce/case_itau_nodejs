const CalcularSaldoAtualFkCliente = require("./CalcularSaldoAtualFkCliente");
const Big = require("big.js");

class BuscarRegistrosPorFkClienteData {
  constructor(registroRepository) {
    this.registroRepository = registroRepository;
  }

  async execute(fkCliente, ano, mes) {
    if (!fkCliente) throw new Error("fkCliente é obrigatório");
    if (!ano) throw new Error("ano é obrigatório");
    if (!mes) throw new Error("mes é obrigatório");

    const inicio = `${ano}-${String(mes).padStart(2, "0")}-01`;
    const fim = new Date(ano, mes, 0).toISOString().split("T")[0];

    const rows = await this.registroRepository.buscarPorFkClienteData(fkCliente, inicio, fim);

    let entradaTotal = new Big(0);
    let saidaTotal = new Big(0);

    for (const row of rows) {
      const valor = new Big(row.valor);
      if (row.tipo === "Deposito") entradaTotal = entradaTotal.plus(valor);
      else if (row.tipo === "Saque") saidaTotal = saidaTotal.plus(valor);
    }
    const saldoFinal = entradaTotal.minus(saidaTotal);

    const saldoAtual = await new CalcularSaldoAtualFkCliente(this.registroRepository).execute(fkCliente);

    return {
      entradaTotal: entradaTotal.toNumber(),
      saidaTotal: saidaTotal.toNumber(),
      saldoFinal: saldoFinal.toNumber(),
      saldoAtual,
      rows
    }
  }
}

module.exports = BuscarRegistrosPorFkClienteData;