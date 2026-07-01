const express = require('express');
const path = require('path');
const app = express();

app.use(express.json());

// Serve os arquivos de Front-
// End (HTML, CSS, JS do cliente)
app.use(express.static("public"));

// Banco de dados em memória
let idCounter = 1;
let bolaoDatabase = [];

// [CREATE] - Cadastrar palpite
app.post('/api/palpites', (req, res) => {
    const { jogo, participante, palpite } = req.body;
    if (!jogo || !participante || !palpite) {
        return res.status(400).json({ erro: "Campos obrigatórios ausentes." });
    }
    const novoPalpite = { id: idCounter++, jogo, participante, palpite };
    bolaoDatabase.push(novoPalpite);
    res.status(201).json(novoPalpite);
});

// [READ] - Listar todos
app.get('/api/palpites', (req, res) => {
    res.json(bolaoDatabase);
});

// [UPDATE] - Atualizar palpite
app.put('/api/palpites/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const { jogo, participante, palpite } = req.body;
    const index = bolaoDatabase.findIndex(item => item.id === id);
    
    if (index === -1) return res.status(404).json({ erro: "Não encontrado." });

    bolaoDatabase[index] = {
        id,
        jogo: jogo || bolaoDatabase[index].jogo,
        participante: participante || bolaoDatabase[index].participante,
        palpite: palpite || bolaoDatabase[index].palpite
    };
    res.json(bolaoDatabase[index]);
});

// [DELETE] - Remover palpite
app.delete('/api/palpites/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = bolaoDatabase.findIndex(item => item.id === id);
    
    if (index === -1) return res.status(404).json({ erro: "Não encontrado." });

    bolaoDatabase.splice(index, 1);
    res.status(204).send();
});

// Rota principal para abrir a página HTML
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(3000, () => console.log('Servidor rodando em http://localhost:3000'));
