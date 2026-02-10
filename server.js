const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());

app.post('/contato', (req, res) => {
    const { name, email, message } = req.body;
    const log = `[${new Date().toLocaleString()}] Nome: ${name} | Email: ${email} | Mensagem: ${message}\n`;

    fs.appendFile('mensagens.txt', log, (err) => {
        if (err) return res.status(500).send('Erro ao salvar');
        res.status(200).send('Mensagem recebida');
    });
});

app.listen(PORT, () => {
    console.log(`Backend rodando em http://localhost:${PORT}`);
});