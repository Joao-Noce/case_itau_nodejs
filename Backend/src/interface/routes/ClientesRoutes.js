const express = require("express");
const router = express.Router();
const ClientesController = require("../controllers/ClientesController");
const validateRequest = require("../middlewares/ValidateRequest");

router.get("/", ClientesController.listar);
router.get("/:id", ClientesController.buscarPorIdCliente);
router.post("/", validateRequest(["nome", "email"]), ClientesController.criar);
router.post("/autenticar", validateRequest(["nome", "email"]), ClientesController.autenticar);
router.put("/:id", validateRequest(["nome", "email"]), ClientesController.atualizar);
router.delete("/:id", ClientesController.deletar);
// router.post("/:id/depositar", validateRequest(["valor"]), ClientesController.depositar);
// router.post("/:id/sacar", validateRequest(["valor"]), ClientesController.sacar);

module.exports = router;
