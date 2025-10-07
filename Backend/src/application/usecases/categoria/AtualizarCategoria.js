const { NotFoundError } = require("../../../domain/errors");

class AtualizarCategoria {
  constructor(categoriaRepository) {
    this.categoriaRepository = categoriaRepository;
  }

  async execute(id, { nome, fkCliente }) {
    const categoria = await this.categoriaRepository.buscarPorIdCategoria(id);
    if (!categoria) throw new NotFoundError();

    const atualizado = await this.categoriaRepository.atualizar(id, { nome, fkCliente });
    if (!atualizado) throw new Error("Falha ao atualizar categoria");
    return { ...categoria, nome };
  }
}

module.exports = AtualizarCategoria;
