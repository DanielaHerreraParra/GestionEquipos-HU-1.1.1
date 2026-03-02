let teams = [];

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('addTeamForm');
    const cardsContainer = document.getElementById('teamCardsContainer');
    const selectElement = document.getElementById('teamSelect');

    // --- FUNCIÓN PARA DIBUJAR TARJETAS (Acepta una lista filtrada o la total) ---
    const renderCards = (teamsToDisplay) => {
        cardsContainer.innerHTML = ""; 
        teamsToDisplay.forEach(equipo => {
            const card = document.createElement('div');
            card.className = 'team-card';
            card.innerHTML = `
                <img src="${equipo.logo}" alt="Logo">
                <h3>${equipo.name}</h3>
            `;
            cardsContainer.appendChild(card);
        });
    };

    // --- FUNCIÓN PARA ACTUALIZAR EL SELECT ---
    const updateSelect = () => {
        selectElement.innerHTML = '<option value="">Mostrar Equipos Registrados...</option>';
        teams.forEach(equipo => {
            const option = document.createElement('option');
            option.value = equipo.id;
            option.textContent = equipo.name;
            selectElement.appendChild(option);
        });
    };

    // --- EVENTO: AGREGAR EQUIPO ---
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const nameInput = document.getElementById('teamName');
        const logoInput = document.getElementById('teamLogo');

        let logoSrc = "https://via.placeholder.com/80?text=LOGO";
        if (logoInput.files && logoInput.files[0]) {
            logoSrc = URL.createObjectURL(logoInput.files[0]);
        }

        const nuevoEquipo = {
            id: Date.now().toString(), // ID único como String
            name: nameInput.value.trim(),
            logo: logoSrc
        };

        teams.push(nuevoEquipo);
        renderCards(teams); // Mostrar todos al agregar uno nuevo
        updateSelect();
        form.reset();
    });

    // --- EVENTO: FILTRAR POR SELECCIÓN (Lo que pediste) ---
    selectElement.addEventListener('change', (e) => {
        const selectedId = e.target.value;

        if (selectedId === "") {
            // Si no hay nada seleccionado, mostrar todos
            renderCards(teams);
        } else {
            // Filtrar el arreglo por el ID seleccionado
            const filteredTeam = teams.filter(t => t.id === selectedId);
            renderCards(filteredTeam);
        }
    });
});