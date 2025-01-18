import express from 'express';
import bodyParser from 'body-parser';
import db from './database/db.js';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

// Configuração para resolver diretórios no formato ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware para processar JSON
app.use(bodyParser.json());

// Servir arquivos estáticos (como index.html) da pasta public
app.use(express.static(path.join(__dirname, 'public')));


// Endpoint para exportar dados para JSON
app.get('/export-json', (req, res) => {
    db.all('SELECT * FROM users', (err, rows) => {
        if (err) {
            console.error('Erro ao consultar o banco de dados:', err.message);
            return res.status(500).json({ error: 'Erro ao consultar o banco de dados' });
        }

        // Converte os dados para JSON
        const jsonData = JSON.stringify(rows, null, 2);

        // Envia o JSON como resposta
        res.setHeader('Content-Type', 'application/json');
        res.send(jsonData);
    });
});


// Endpoint para salvar os dados
app.post('/api/submit', (req, res) => {
    const { name, email, phone } = req.body;

    const query = `INSERT INTO users (name, email, phone) VALUES (?, ?, ?)`;
    db.run(query, [name, email, phone], function (err) {
        if (err) {
            console.error('Erro ao salvar os dados:', err.message);
            return res.status(500).json({ error: 'Erro ao salvar os dados' });
        }

        console.log(`Dados salvos com sucesso! ID do usuário: ${this.lastID}`);

        // Redireciona para o WhatsApp
        const whatsappMessage = `Olá, meu nome é ${name}. Meu e-mail é ${email} e meu telefone é ${phone}.`;
        const whatsappURL = `https://wa.me/?text=${encodeURIComponent(whatsappMessage)}`;
        res.status(200).json({ redirect: whatsappURL });
    });
});

// Inicia o servidor local
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
