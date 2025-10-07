class BuscarPorFkCliente {
    constructor(categoriaRepository) {
        this.categoriaRepository = categoriaRepository;
    }

    async execute(fkCliente) {
        return this.categoriaRepository.buscarPorFkCliente(fkCliente);
    }
}

module.exports = BuscarPorFkCliente;