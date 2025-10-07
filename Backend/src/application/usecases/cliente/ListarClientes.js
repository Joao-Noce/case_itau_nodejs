class ListarClientes {
  constructor(clienteRepository) {
    this.clienteRepository = clienteRepository;
  }

  async execute() {
    return await this.clienteRepository.listar();
  }
}

module.exports = ListarClientes;
