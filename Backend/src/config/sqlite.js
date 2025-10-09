const sqlite3 = require("sqlite3").verbose();
const path = require("path");
const dbPath = path.resolve(__dirname, "database.sqlite"); // grava em arquivo, não apenas em memória

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error("❌ Erro ao conectar no SQLite:", err.message);
  } else {
    console.log("✅ Conectado ao SQLite com sucesso!");
  }
});

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS clientes (
      idCliente INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE
    );
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS categorias (
      idCategoria INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL,
      fkCliente INTEGER NULL,
      UNIQUE(nome, fkCliente),
      FOREIGN KEY (fkCliente) REFERENCES clientes(idCliente) ON DELETE CASCADE
    );
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS registros (
      idRegistro INTEGER PRIMARY KEY AUTOINCREMENT,
      descricao TEXT NOT NULL,
      valor DECIMAL(12,2) NOT NULL,
      data TEXT NOT NULL,
      tipo TEXT CHECK(tipo IN ('Deposito','Saque')) NOT NULL,
      repeticao TEXT CHECK(repeticao IN ('NONE','DAY','WEEK','MONTH','YEAR')) DEFAULT 'NONE',
      fkCliente INTEGER NOT NULL,
      fkCategoria INTEGER NULL,
      FOREIGN KEY (fkCliente) REFERENCES clientes(idCliente) ON DELETE CASCADE,
      FOREIGN KEY (fkCategoria) REFERENCES categorias(idCategoria) ON DELETE CASCADE
    );
  `);

  db.get(`SELECT COUNT(*) AS total FROM categorias`, (err, row) => {
    if (err) {
      console.error("❌ Erro ao verificar categorias:", err.message);
    } else if (row.total === 0) {
      console.log("🪄 Inserindo categorias padrão...");
      const insertStmt = db.prepare(`
        INSERT INTO categorias (nome) VALUES
        ('Comida'),
        ('Transporte'),
        ('Casa'),
        ('Saúde'),
        ('Entretenimento'),
        ('Educação'),
        ('Serviços'),
        ('Roupas'),
        ('Viagem'),
        ('Presentes')
      `);
      insertStmt.run((err) => {
        if (err) console.error("❌ Erro ao inserir categorias:", err.message);
        else console.log("✅ Categorias padrão inseridas!");
      });
      insertStmt.finalize();
    } else {
      console.log("✅ Categorias já existentes, nenhum insert necessário.");
    }
  });

  console.log("📦 Tabelas verificadas/criadas com sucesso!");
});

module.exports = db;
