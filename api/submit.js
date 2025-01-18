const db = require('../database/db');

export default (req, res) => {
    if (req.method === 'POST') {
        const { name, email, phone } = req.body;

        // Insere os dados no banco
        const query = `INSERT INTO users (name, email, phone) VALUES (?, ?, ?)`;
        db.run(query, [name, email, phone], function (err) {
            if (err) {
                console.error('Erro ao salvar os dados:', err.message);
                return res.status(500).send('Erro ao salvar os dados');
            }

            console.log(`Dados salvos com sucesso! ID do usuário: ${this.lastID}`);

            // Redireciona para o WhatsApp
            const whatsappMessage = `Olá, meu nome é ${name}. Meu e-mail é ${email} e meu telefone é ${phone}.`;
            const whatsappURL = `https://wa.me/?text=${encodeURIComponent(whatsappMessage)}`;
            res.redirect(302, whatsappURL);
        });
    } else {
        res.status(405).json({ error: 'Método não permitido' });
    }
};
