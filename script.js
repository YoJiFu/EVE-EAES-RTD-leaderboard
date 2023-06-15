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
    const mergedScores = previousScores.slice();

    // Parcourir les nouveaux scores
    newScores.forEach(newScore => {
        // Vérifier si le score existe déjà dans les scores précédents
        const existingScore = mergedScores.find(score => score.Name === newScore.Name);

        if (existingScore) {
            // Si le score existe déjà, mettre à jour les valeurs si nécessaire
            if (newScore.Score > existingScore.Score) {
                existingScore.Score = newScore.Score;
                existingScore.Grade = newScore.Grade;
                existingScore.Level = newScore.Level;
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
    while (tableBody.firstChild) {
        tableBody.removeChild(tableBody.firstChild);
    }

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
}
