class AgruparPorFkCategoria {
    constructor(registroRepository) {
        this.registroRepository = registroRepository;
    }

    async execute(fkCliente, ano, mes) {
        if (!fkCliente) throw new Error("fkCliente é obrigatório");
        if (!ano) throw new Error("ano é obrigatório");
        if (!mes) throw new Error("mes é obrigatório");

        const inicio = `${ano}-${String(mes).padStart(2, "0")}-01`;
        const fim = new Date(ano, mes, 0).toISOString().split("T")[0];

        const rows = await this.registroRepository.agruparPorFkCategoria(fkCliente, inicio, fim);

        return rows;
    }
}

module.exports = AgruparPorFkCategoria;
