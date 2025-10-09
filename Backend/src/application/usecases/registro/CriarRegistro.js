const { BadRequestError } = require("../../../domain/errors");
const Big = require("big.js");

class CriarRegistro {
  constructor(registroRepository) {
    this.registroRepository = registroRepository;
  }

  async execute({ descricao, valor, data, tipo, parcela, juros, repeticao, fkCliente, fkCategoria }) {
    if (!descricao || !valor || valor < 1 || !data || !tipo || !repeticao || !fkCliente)
      throw new BadRequestError("Campos obrigatórios faltando");

    let total = Big(valor);
    if (juros && juros >=0 ) {
      const jurosBig = Big(juros).div(100);
      total = total.plus(total.times(jurosBig));
    }

    let listaParcelas = [];

    if (parcela && parcela > 1) {
      const parcelaCount = Number(parcela);
      const totalBig = total;

      const base = totalBig.div(parcelaCount).round(2, 1);

      const dataAtual = new Date(data);

      for (let i = 1; i <= parcelaCount; i++) {
        const proximo = new Date(dataAtual);
        proximo.setMonth(proximo.getMonth() + i);
        const novaDescricao = descricao + ` ${i}/${parcelaCount}`;

        let valorParcelaBig;
        if (i < parcelaCount) {
          valorParcelaBig = base;
        } else {
          const somaAnterior = base.times(parcelaCount - 1);
          valorParcelaBig = totalBig.minus(somaAnterior).round(2, 1);
        }

        let parcelaDaVez = await this.registroRepository.criar({
          descricao: novaDescricao,
          valor: parseFloat(valorParcelaBig.toString()),
          data: proximo.toISOString().split("T")[0],
          tipo,
          repeticao,
          fkCliente,
          fkCategoria
        });
        listaParcelas.push(parcelaDaVez);
      }
    } else {
      const valorFinal = total.round(2, 1);

      const registro = await this.registroRepository.criar({
        descricao,
        valor: parseFloat(valorFinal.toString()),
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
          valor: parseFloat(valorFinal.toString()),
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
