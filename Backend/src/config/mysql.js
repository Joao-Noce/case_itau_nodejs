const mysql = require("mysql2/promise");

const pool = mysql.createPool({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});

(async () => {
    try {
        const connection = await pool.getConnection();
        console.log("✅ Conectado ao MySQL com sucesso!");

        await connection.query(`
      CREATE TABLE IF NOT EXISTS clientes (
        idCliente INT AUTO_INCREMENT PRIMARY KEY,
        nome VARCHAR(50) NOT NULL,
        email VARCHAR(50) NOT NULL UNIQUE
      );
    `);

        await connection.query(`
      CREATE TABLE IF NOT EXISTS categorias (
        idCategoria INT AUTO_INCREMENT PRIMARY KEY,
        nome VARCHAR(255) NOT NULL,
        fkCliente INT NULL,
        UNIQUE(nome, fkCliente),
        CONSTRAINT fk_categorias_cliente FOREIGN KEY (fkCliente)
          REFERENCES clientes(idCliente)
          ON DELETE CASCADE
      );
    `);

        await connection.query(`
      CREATE TABLE IF NOT EXISTS registros (
        idRegistro INT AUTO_INCREMENT PRIMARY KEY,
        descricao VARCHAR(255) NOT NULL,
        valor DECIMAL(12,2) NOT NULL,
        data DATE NOT NULL,
        tipo ENUM('Deposito','Saque') NOT NULL,
        repeticao ENUM('NONE','DAY','WEEK','MONTH','YEAR') DEFAULT 'NONE',
        fkCliente INT NOT NULL,
        fkCategoria INT NULL,
        FOREIGN KEY (fkCliente) REFERENCES clientes(idCliente) ON DELETE CASCADE,
        FOREIGN KEY (fkCategoria) REFERENCES categorias(idCategoria) ON DELETE CASCADE
      );
    `);

        const [rows] = await connection.query(`SELECT COUNT(*) AS total FROM categorias`);
        if (rows[0].total === 0) {
            console.log("🪄 Inserindo categorias padrão...");
            await connection.query(`
        INSERT INTO categorias (nome) VALUES
        ("Comida"),
        ("Transporte"),
        ("Casa"),
        ("Saúde"),
        ("Entretenimento"),
        ("Educação"),
        ("Serviços"),
        ("Roupas"),
        ("Viagem"),
        ("Presentes");
      `);
        } else {
            console.log("✅ Categorias já existentes, nenhum insert necessário.");
        }

        console.log("📦 Tabelas verificadas/criadas com sucesso!");

        connection.release();
    } catch (err) {
        console.error("❌ Erro ao conectar ou criar tabelas no MySQL:", err);
    }
})();

module.exports = pool;