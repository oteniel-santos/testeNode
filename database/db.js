import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

// Configuração para trabalhar com __dirname no ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Caminho para o arquivo SQLite
const dbPath = path.join(__dirname, 'dados.sqlite');



// Conectar ao banco de dados persistente
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Erro ao conectar ao banco de dados:', err.message);
    } else {
        console.log(`Conectado ao banco de dados em ${dbPath}`);
    }
});

// Criação da tabela, se não existir
db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT NOT NULL,
            phone TEXT NOT NULL
        )
    `, (err) => {
        if (err) {
            console.error('Erro ao criar a tabela:', err.message);
        } else {
            console.log('Tabela criada com sucesso');
        }
    });
});

export default db;
