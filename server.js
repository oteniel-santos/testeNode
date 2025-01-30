// Importações necessárias
import express from 'express';
import bodyParser from 'body-parser';
import { open } from 'sqlite';
import sqlite3 from 'sqlite3';
import dotenv from 'dotenv';

// Configuração do ambiente
dotenv.config();

// Configuração do servidor Express
const app = express();

// Middleware para processar formulários
app.use(bodyParser.urlencoded({ extended: true }));

// Servir arquivos estáticos
app.use(express.static('public'));

// Inicialização do banco de dados SQLite
let db;
(async () => {
  db = await open({
    filename: './database.sqlite',
    driver: sqlite3.Database
  });
  await db.exec(`
    CREATE TABLE IF NOT EXISTS clients (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL
    )
  `);
})();

// Rota para processar o formulário
app.post('/submit', async (req, res) => {
  const { name, email } = req.body;

  try {
    // Salvando no banco de dados
    await db.run('INSERT INTO clients (name, email) VALUES (?, ?)', [name, email]);

    // Redirecionando para o WhatsApp
    const whatsappLink = `https://wa.me/5566992028229?text=${encodeURIComponent(
      `Nome: ${name}\nEmail: ${email}`
    )}`;
    res.redirect(whatsappLink);
  } catch (error) {
    console.error('Erro ao salvar os dados:', error);
    res.status(500).send('Erro ao processar sua solicitação.');
  }
});

// Iniciando o servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
