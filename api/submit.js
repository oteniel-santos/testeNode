import db from '../database/db.js';


export default function handler(req, res) {
    if (req.method === 'POST') {
        const { name, email, phone } = req.body;

        // Validação simples para verificar se os campos estão preenchidos
        if (!name || !email || !phone) {
            return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
        }

        // Insere os dados no banco
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
    } else {
        res.status(405).json({ error: 'Método não permitido' });
    }
}
