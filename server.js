const express = require('express');
const path = require('path');
const fs = require('fs');
const db = require('./database/db');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware para lidar com dados JSON e arquivos estáticos
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Criação da tabela ao iniciar o servidor
const schemaPath = path.join(__dirname, 'database/schema.sql');
const schema = fs.readFileSync(schemaPath, 'utf-8');
db.exec(schema, (err) => {
    if (err) {
        console.error('Erro ao criar a tabela:', err.message);
    } else {
        console.log('Tabela verificada/criada com sucesso.');
    }
});

// Rota de API
app.use('/api/submit', require('./api/submit').default);

// Inicia o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
