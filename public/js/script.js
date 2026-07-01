const API_URL = '/api/palpites';
const form = document.getElementById('bolaoForm');
const tabela = document.getElementById('tabelaPalpites');

// Carregar dados ao abrir a tela
document.addEventListener('DOMContentLoaded', listarPalpites);

async function listarPalpites() {
    const res = await fetch(API_URL);
    const palpites = await res.json();
    tabela.innerHTML = '';
    
    palpites.forEach(p => {
        tabela.innerHTML += `
            <tr>
                <td>${p.id}</td>
                <td>${p.participante}</td>
                <td>${p.jogo}</td>
                <td>${p.palpite}</td>
                <td>
                    <button class="btn-edit" onclick="prepararEdicao(${p.id}, '${p.participante}', '${p.jogo}', '${p.palpite}')">Editar</button>
                    <button class="btn-delete" onclick="deletarPalpite(${p.id})">Excluir</button>
                </td>
            </tr>
        `;
    });
}

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = document.getElementById('palpiteId').value;
    const participante = document.getElementById('participante').value;
    const jogo = document.getElementById('jogo').value;
    const palpite = document.getElementById('palpite').value;

    const payload = { participante, jogo, palpite };

    if (id) {
        // Modo Edição (PUT)
        await fetch(`${API_URL}/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
    } else {
        // Modo Criação (POST)
        await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
    }

    form.reset();
    document.getElementById('palpiteId').value = '';
    listarPalpites();
});

function prepararEdicao(id, participante, jogo, palpite) {
    document.getElementById('palpiteId').value = id;
    document.getElementById('participante').value = participante;
    document.getElementById('jogo').value = jogo;
    document.getElementById('palpite').value = palpite;
}

async function deletarPalpite(id) {
    if (confirm('Deseja excluir este palpite?')) {
        await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
        listarPalpites();
    }
}
