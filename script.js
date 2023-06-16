let scores = [];

// Charger les scores depuis le stockage local (localStorage) lors du chargement de la page
window.onload = function() {
    const storedScores = localStorage.getItem('scores');
    if (storedScores) {
        scores = JSON.parse(storedScores);
        updateScoreTable();
    }
};

// Fonction pour charger le fichier JSON et mettre à jour le tableau de scores
function handleFileUpload() {
    const fileInput = document.getElementById('fileInput');
    const file = fileInput.files[0];

    if (!file) {
        alert('Aucun fichier sélectionné.');
        return;
    }

    const reader = new FileReader();

    reader.onload = function(e) {
        const contents = e.target.result;
        const newScores = JSON.parse(contents).PlayersHighscore;

        // Fusionner les nouveaux scores avec les scores précédents
        scores = mergeScores(scores, newScores);

        // Trier les scores par ordre décroissant
        scores.sort((a, b) => b.Score - a.Score);

        // Mettre à jour le classement des joueurs
        updateRanks();

        // Mettre à jour le tableau avec les scores fusionnés
        updateScoreTable();

        // Sauvegarder les scores dans le stockage local (localStorage)
        localStorage.setItem('scores', JSON.stringify(scores));
    };

    reader.readAsText(file);
}

// Fusionner les nouveaux scores avec les scores précédents
function mergeScores(previousScores, newScores) {
    // Copier les scores précédents
    const mergedScores = [...previousScores];

    // Parcourir les nouveaux scores
    newScores.forEach(newScore => {
        // Vérifier si le score existe déjà dans les scores précédents
        const existingScore = mergedScores.find(score => score.Name === newScore.Name);

        if (existingScore) {
            // Si le score existe déjà, mettre à jour les valeurs si nécessaire
            if (newScore.Score > existingScore.Score) {
                Object.assign(existingScore, newScore);
            }
        } else {
            // Si le score n'existe pas déjà, l'ajouter aux scores fusionnés
            mergedScores.push(newScore);
        }
    });

    return mergedScores;
}

// Mettre à jour le classement des joueurs
function updateRanks() {
    scores.forEach((score, index) => {
        score.Rank = index + 1;
    });
}

// Mettre à jour le tableau avec les scores actuels
function updateScoreTable() {
    const tableBody = document.getElementById('scoreTableBody');
    
    // Supprimer les lignes existantes
    tableBody.innerHTML = '';

    // Ajouter les nouvelles lignes de score
    scores.forEach(score => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${score.Name}</td>
            <td>${score.Grade}</td>
            <td>${score.Score}</td>
            <td>${score.Level}</td>
            <td>${score.Rank}</td>
        `;
        tableBody.appendChild(row);
    });

    // Mettre à jour le top 3 des meilleurs joueurs
    generateTop3();
}

// Générer le top 3 des meilleurs joueurs
function generateTop3() {
    const top3List = document.getElementById('top3List');

    // Vider le contenu précédent
    top3List.innerHTML = '';

    // Récupérer les trois meilleurs scores
    const top3Scores = scores.slice(0, 3);

    // Parcourir les trois meilleurs scores et générer les éléments HTML correspondants
    top3Scores.forEach((score, index) => {
        const rank = index + 1;
        const medalImage = getMedalImage(rank);
        const playerElement = document.createElement('div');
        playerElement.classList.add('top3Player', `rank-${rank}`); // Ajouter une classe CSS pour le classement
        playerElement.innerHTML = `
            <div class="medal">${medalImage}</div>
            <div class="playerName">${score.Name}</div>
            <div class="playerScore">${score.Score}</div>
        `;
        top3List.appendChild(playerElement);
    });
}

// Obtenir l'image de médaille correspondant au classement
function getMedalImage(rank) {
    let medalImage = '';
    switch (rank) {
        case 1:
            medalImage = '<img src="assets/medals/first.png" class="medal-image">';
            break;
        case 2:
            medalImage = '<img src="assets/medals/second.png" class="medal-image">';
            break;
        case 3:
            medalImage = '<img src="assets/medals/third.png" class="medal-image">';
            break;
    }
    return medalImage;
}

// Obtenir la date actuelle sous forme YY/MM/DD
function getCurrentDate() {
    const currentDate = new Date();
    const year = currentDate.getFullYear().toString().slice(-2);
    const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
    const day = currentDate.getDate().toString().padStart(2, '0');
    return `${year}/${month}/${day}`;
}

// Mettre à jour la date dans le sous-titre
function updateDate() {
    const dateElement = document.getElementById('date');
    dateElement.textContent = getCurrentDate();
}

// Appeler la fonction pour mettre à jour la date initialement
updateDate();
