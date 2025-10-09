const repo = require("../../config/repo");
const CriarCategoria = require("../../application/usecases/categoria/CriarCategoria");
const AtualizarCategoria = require("../../application/usecases/categoria/AtualizarCategoria");
const DeletarCategoria = require("../../application/usecases/categoria/DeletarCategoria");
const BuscarPorFkCliente = require("../../application/usecases/categoria/BuscarPorFkCliente");

class CategoriasController {
  async criar(req, res, next) {
    try {
      const categoria = await new CriarCategoria(repo.categoriaRepository).execute({
        nome: req.body.nome,
        fkCliente: req.body.fkCliente
      });
      res.status(201).json(categoria);
    } catch (err) {
      next(err);
    }
  }

  async buscarPorFkCliente(req, res, next) {
    try {
      const fkCliente = req.query.fkCliente ? Number(req.query.fkCliente) : null;
        const categoriasPorCliente = await new BuscarPorFkCliente(repo.categoriaRepository).execute(fkCliente);
        res.json(categoriasPorCliente);
    } catch (err) {
        next(err);
    }
  }

  async atualizar(req, res, next) {
    try {
      const atualizado = await new AtualizarCategoria(repo.categoriaRepository).execute(req.params.idCategoria, req.body);
      res.json(atualizado);
    } catch (err) {
      next(err);
    }
  }

  async deletar(req, res, next) {
    try {
      await new DeletarCategoria(repo.categoriaRepository).execute(req.params.idCategoria, req.body);
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new CategoriasController();
