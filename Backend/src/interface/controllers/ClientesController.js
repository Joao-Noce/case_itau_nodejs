const repo = require("../../config/repo");
const ListarClientes = require("../../application/usecases/cliente/ListarClientes");
const BuscarPorIdCliente = require("../../application/usecases/cliente/BuscarPorIdCliente");
const CriarCliente = require("../../application/usecases/cliente/CriarCliente");
const AtualizarCliente = require("../../application/usecases/cliente/AtualizarCliente");
const AutenticarCliente = require("../../application/usecases/cliente/AutenticarCliente");
const DeletarCliente = require("../../application/usecases/cliente/DeletarCliente");

class ClientesController {
    async listar(req, res, next) {
        try {
            const clientes = await new ListarClientes(repo.clienteRepository).execute();
            res.json(clientes);
        } catch (err) {
            next(err);
        }
    }

    async buscarPorIdCliente(req, res, next) {
        try {
            const cliente = await new BuscarPorIdCliente(repo.clienteRepository).execute(req.params.id);
            res.json(cliente);
        } catch (err) {
            next(err);
        }
    }

    async criar(req, res, next) {
        try {
            const { nome, email } = req.body;
            const novo = await new CriarCliente(repo.clienteRepository).execute({ nome, email });
            res.status(201).json(novo);
        } catch (err) {
            next(err);
        }
    }

    async autenticar(req, res, next) {
        try {
            const { nome, email } = req.body;
            const novo = await new AutenticarCliente(repo.clienteRepository, repo.registroRepository).execute({ nome, email });
            res.status(200).json(novo);
        } catch (err) {
            next(err);
        }
    }

    async atualizar(req, res, next) {
        try {
            const { nome, email } = req.body;
            const atualizado = await new AtualizarCliente(repo.clienteRepository).execute(req.params.id, { nome, email });
            res.status(200).json(atualizado);
        } catch (err) {
            next(err);
        }
    }

    async deletar(req, res, next) {
        try {
            await new DeletarCliente(repo.clienteRepository).execute(req.params.id);
            res.status(204).send();
        } catch (err) {
            next(err);
        }
    }
}

module.exports = new ClientesController();
