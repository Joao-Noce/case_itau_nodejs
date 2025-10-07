const { BadRequestError } = require("../../../domain/errors");

class CriarRegistro {
  constructor(registroRepository) {
    this.registroRepository = registroRepository;
  }

  async execute({ descricao, valor, data, tipo, parcela, juros, repeticao, fkCliente, fkCategoria }) {
    if (!descricao || !valor || !data || !tipo || !repeticao || !fkCliente)
      throw new BadRequestError("Campos obrigatórios faltando");

    if (juros) valor += valor * (juros / 100);
    let listaParcelas = [];

    if (parcela && parcela > 1) {

      valor = valor / parcela;

      const dataAtual = new Date(data);

      for (let i = 1; i <= parcela; i++) {
        const proximo = new Date(dataAtual);
        proximo.setMonth(proximo.getMonth() + i);
        const novaDescricao = descricao + ` ${i}/${parcela}`;
        let parcelaDaVez = await this.registroRepository.criar({
          descricao: novaDescricao,
          valor,
          data: proximo.toISOString().split("T")[0],
          tipo,
          repeticao,
          fkCliente,
          fkCategoria
        });
        listaParcelas.push(parcelaDaVez);
      }
    } else {

      const registro = await this.registroRepository.criar({
        descricao,
        valor,
        data,
        tipo,
        repeticao: repeticao || "NONE",
        fkCliente,
        fkCategoria
      });

      listaParcelas.push(registro);

      if (repeticao && repeticao !== "NONE") {
        const dataAtual = new Date(data);
        const proximo = new Date(dataAtual);

        switch (repeticao) {
          case "DAY": proximo.setDate(proximo.getDate() + 1); break;
          case "WEEK": proximo.setDate(proximo.getDate() + 7); break;
          case "MONTH": proximo.setMonth(proximo.getMonth() + 1); break;
          case "YEAR": proximo.setFullYear(proximo.getFullYear() + 1); break;
        }

        const novoRegistro = await this.registroRepository.criar({
          descricao,
          valor,
          data: proximo.toISOString().split("T")[0],
          tipo,
          repeticao,
          fkCliente,
          fkCategoria
        });
        listaParcelas.push(novoRegistro);
      }
    }
    return listaParcelas;
  }
}

module.exports = CriarRegistro;
