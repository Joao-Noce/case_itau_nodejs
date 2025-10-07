const ClienteRepositoryMySQL = require("../infrastructure/mysql/ClienteRepositoryMySQL");
const RegistroRepositoryMySQL = require("../infrastructure/mysql/RegistroRepositoryMySQL");
const CategoriaRepositoryMySQL = require("../infrastructure/mysql/CategoriaRepositoryMySQL");

const ClienteRepositorySQLite = require("../infrastructure/sqlite/ClienteRepositorySQLite");
const RegistroRepositorySQLite = require("../infrastructure/sqlite/RegistroRepositorySQLite");
const CategoriaRepositorySQLite = require("../infrastructure/sqlite/CategoriaRepositorySQLite");

const dbType = process.env.REPO || "sqlite";

let clienteRepository;
let registroRepository;
let categoriaRepository;

switch (dbType.toLowerCase()) {
  case "mysql":
    clienteRepository = new ClienteRepositoryMySQL();
    registroRepository = new RegistroRepositoryMySQL();
    categoriaRepository = new CategoriaRepositoryMySQL();
    break;

  case "sqlite":
    clienteRepository = new ClienteRepositorySQLite();
    registroRepository = new RegistroRepositorySQLite();
    categoriaRepository = new CategoriaRepositorySQLite();
    break;
}

module.exports = {
  clienteRepository,
  registroRepository,
  categoriaRepository
};
