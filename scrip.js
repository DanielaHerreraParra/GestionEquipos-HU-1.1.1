let teams = JSON.parse(localStorage.getItem('teams')) || [];
let players = JSON.parse(localStorage.getItem('players')) || [];

document.addEventListener('DOMContentLoaded', () => {
    renderAll();

    // BUSCADOR UNIFICADO: Filtra equipos y jugadores a la vez
    const searchInput = document.getElementById('searchInput');
    searchInput.addEventListener('input', (e) => {
        const term = e.target.value.toLowerCase().trim();
        
        // Filtrar Equipos
        const filteredTeams = teams.filter(t => t.name.toLowerCase().includes(term));
        renderTeams(filteredTeams);

        // Filtrar Jugadores
        const filteredPlayers = players.filter(p => {
            const team = teams.find(t => t.id === p.teamId);
            const teamName = team ? team.name.toLowerCase() : "";
            return p.name.toLowerCase().includes(term) || teamName.includes(term);
        });
        renderTable(filteredPlayers);
    });

    // Guardar Equipo
    document.getElementById('addTeamForm').addEventListener('submit', function(e) {
        e.preventDefault();
        const file = document.getElementById('teamLogo').files[0];
        const name = document.getElementById('teamName').value;
        const save = (img) => {
            teams.push({ id: Date.now().toString(), name, logo: img });
            updateStorage();
            this.reset();
        };
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => save(e.target.result);
            reader.readAsDataURL(file);
        } else { save('https://via.placeholder.com/50?text=Logo'); }
    });

    // Guardar Jugador
    document.getElementById('addPlayerForm').addEventListener('submit', function(e) {
        e.preventDefault();
        players.push({
            id: Date.now().toString(),
            name: document.getElementById('playerName').value,
            age: document.getElementById('playerAge').value,
            pos: document.getElementById('playerPos').value,
            teamId: document.getElementById('teamSelect').value
        });
        updateStorage();
        this.reset();
    });
});

function updateStorage() {
    localStorage.setItem('teams', JSON.stringify(teams));
    localStorage.setItem('players', JSON.stringify(players));
    renderAll();
}

function renderAll() {
    renderTeams(teams);
    
    document.getElementById('teamSelect').innerHTML = '<option value="">Selecciona equipo...</option>' + 
        teams.map(t => `<option value="${t.id}">${t.name}</option>`).join('');

    renderTable(players);
}

function renderTeams(data) {
    const container = document.getElementById('teamCardsContainer');
    container.innerHTML = data.map(t => `
        <div class="team-card" onclick="filterByTeam('${t.id}', this)">
            <img src="${t.logo}">
            <strong>${t.name}</strong>
        </div>`).join('');
}

window.filterByTeam = (id, element) => {
    document.querySelectorAll('.team-card').forEach(c => c.classList.remove('selected'));
    if (element) element.classList.add('selected');
    const filtered = players.filter(p => p.teamId === id);
    renderTable(filtered);
};

window.resetTable = () => {
    document.querySelectorAll('.team-card').forEach(c => c.classList.remove('selected'));
    document.getElementById('searchInput').value = "";
    renderAll();
};

window.deletePlayer = (id) => {
    players = players.filter(p => p.id !== id);
    updateStorage();
};

function renderTable(data) {
    const body = document.getElementById('playersTableBody');
    if (data.length === 0) {
        body.innerHTML = '<tr><td colspan="5" style="text-align:center; color:#94a3b8; padding:20px;">Sin resultados</td></tr>';
        return;
    }
    body.innerHTML = data.map(p => {
        const team = teams.find(t => t.id === p.teamId);
        return `<tr>
            <td><strong>${p.name}</strong></td>
            <td>${p.age}</td>
            <td>${p.pos}</td>
            <td>${team ? team.name : 'N/A'}</td>
            <td><button class="delete-btn" onclick="deletePlayer('${p.id}')">Eliminar</button></td>
        </tr>`;
    }).join('');
}
