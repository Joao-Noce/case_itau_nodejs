class AgruparPorCategoria {
    constructor(registroRepository) {
        this.registroRepository = registroRepository;
    }

    async execute(fkCliente, ano, mes) {
        if (!fkCliente) throw new Error("fkCliente é obrigatório");
        if (!ano) throw new Error("ano é obrigatório");
        if (!mes) throw new Error("mes é obrigatório");

        const rows = await this.registroRepository.agruparPorCategoria(fkCliente, ano, mes);

        return rows;
    }
}

module.exports = AgruparPorCategoria;
