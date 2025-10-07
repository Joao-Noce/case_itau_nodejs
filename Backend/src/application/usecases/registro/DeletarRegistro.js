const { NotFoundError } = require("../../../domain/errors");

class DeletarRegistro {
  constructor(registroRepository) {
    this.registroRepository = registroRepository;
  }

  async execute(id) {
    const registro = await this.registroRepository.buscarPorId(id);
    if (!registro) throw new NotFoundError();

    const deletado = await this.registroRepository.deletar(id);
    if (!deletado) throw new Error("Falha ao deletar registro");
    return true;
  }
}

module.exports = DeletarRegistro;
