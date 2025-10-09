const { NotFoundError, BadRequestError } = require("../../../domain/errors");

class AtualizarRegistro {
  constructor(registroRepository) {
    this.registroRepository = registroRepository;
  }

  async execute(id, { descricao, valor, data, tipo, repeticao, fkCategoria }) {
    if (!descricao || !valor || valor < 1 || !data || !tipo || !repeticao || !fkCliente)
      throw new BadRequestError("Campos obrigatórios faltando");

    const registro = await this.registroRepository.buscarPorId(id);
    if (!registro) throw new NotFoundError();

    const atualizado = await this.registroRepository.atualizar(id, {
      descricao: descricao ?? registro.descricao,
      valor: valor ?? registro.valor,
      data: data ?? registro.data,
      tipo: tipo ?? registro.tipo,
      repeticao: repeticao ?? registro.repeticao,
      fkCategoria: fkCategoria ?? registro.fkCategoria,
    });

    if (!atualizado) throw new Error("Falha ao atualizar registro");
    return { ...registro, descricao, valor, data, tipo, repeticao, fkCategoria };
  }
}

module.exports = AtualizarRegistro;
