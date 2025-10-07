const CriarRegistro = require("./CriarRegistro");

class RepetirRegistro {
  constructor(registroRepository) {
    this.registroRepository = registroRepository;
  }

  async executar() {
    const hoje = new Date().toISOString().split("T")[0];
    const registros = await this.registroRepository.buscarPorData(hoje);

    for (const r of registros) {
      if (r.repeticao !== "NONE") {
        const proximo = new Date(r.data);

        switch (r.repeticao) {
          case "DAY": proximo.setDate(proximo.getDate() + 1); break;
          case "WEEK": proximo.setDate(proximo.getDate() + 7); break;
          case "MONTH": proximo.setMonth(proximo.getMonth() + 1); break;
          case "YEAR": proximo.setFullYear(proximo.getFullYear() + 1); break;
        }

        await new CriarRegistro(this.registroRepository).execute({
          descricao: r.descricao,
          valor: r.valor,
          data: proximo.toISOString().split("T")[0],
          tipo: r.tipo,
          parcela: 1,
          juros: 0,
          repeticao: r.repeticao,
          fkCliente: r.fkCliente,
          fkCategoria: r.fkCategoria
        });
        console.log(`✅ Repetição de ${r.descricao} | ${r.tipo} de R$${r.valor} criada para cliente ${r.fkCliente} em ${proximo.toISOString().split("T")[0]}`);
      }
    }
  }
}

module.exports = RepetirRegistro;
