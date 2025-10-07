const express = require("express");
const CategoriasController = require("../controllers/CategoriasController");
const validateRequest = require("../middlewares/ValidateRequest");
const router = express.Router();

router.get("/", CategoriasController.buscarPorFkCliente);
router.post("/", validateRequest(["nome"]), CategoriasController.criar);
router.put("/:idCategoria", validateRequest([ "nome", "fkCliente" ]), CategoriasController.atualizar);
router.delete("/:idCategoria", validateRequest([ "fkCliente" ]), CategoriasController.deletar);

module.exports = router;