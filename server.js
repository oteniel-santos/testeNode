const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const PORT = 4000;

// Middleware para processar dados do formulário
app.use(bodyParser.urlencoded({ extended: true }));

// Servir o arquivo HTML
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Rota para lidar com o envio do formulário
app.post('/submit', (req, res) => {
    const { name, email, phone } = req.body;

    // Salvar os dados em um arquivo JSON
    const userData = { name, email, phone };
    fs.writeFile('dados.json', JSON.stringify(userData, null, 2), (err) => {
        if (err) {
            console.error('Erro ao salvar os dados:', err);
            return res.status(500).send('Erro ao salvar os dados');
        }

        console.log('Dados salvos com sucesso!');
        
        // Redirecionar para o WhatsApp com os dados capturados
        const whatsappMessage = `Olá, meu nome é ${name}. Meu e-mail é ${email} e meu telefone é ${phone}.`;
        const whatsappURL = `https://wa.me/?text=${encodeURIComponent(whatsappMessage)}`;
        res.redirect(whatsappURL);
    });
});

// Iniciar o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
