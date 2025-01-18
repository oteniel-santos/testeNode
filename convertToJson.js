import sqlite3 from 'sqlite3';
import fs from 'fs';
import path from 'path';

// Caminho do arquivo SQLite
const dbPath = path.resolve('./database/dados.sqlite');

// Conectar ao banco de dados
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Erro ao conectar ao banco de dados:', err.message);
        process.exit(1);
    } else {
        console.log(`Conectado ao banco de dados: ${dbPath}`);
    }
});

// Função para converter os dados para JSON
const exportToJson = () => {
    db.all('SELECT * FROM users', (err, rows) => {
        if (err) {
            console.error('Erro ao consultar o banco de dados:', err.message);
            process.exit(1);
        }

        // Converte os dados para JSON
        const jsonData = JSON.stringify(rows, null, 2);

        // Caminho para salvar o arquivo JSON
        const outputPath = path.resolve('./database/dados.json');

        // Salva o JSON em um arquivo
        fs.writeFileSync(outputPath, jsonData, 'utf8');
        console.log(`Dados exportados para JSON em: ${outputPath}`);
    });

    // Fecha a conexão com o banco de dados
    db.close((err) => {
        if (err) {
            console.error('Erro ao fechar a conexão com o banco:', err.message);
        } else {
            console.log('Conexão com o banco encerrada.');
        }
    });
};

// Executa a exportação
exportToJson();
