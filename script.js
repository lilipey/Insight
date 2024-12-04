// document.querySelector('button:nth-of-type(7)').addEventListener('click', () => {
//     const playerName = document.querySelector('input').value;
//     if (playerName && scores[playerName]) {
//         players = players.filter(player => player !== playerName);
//         delete scores[playerName];
//         updateScores();
//     }
// });
document.addEventListener('DOMContentLoaded', () => {

    let players = [];
    let currentPlayerIndex = 0;
    let scores = {};
    let gameActive = true;
    let timeLeft = 60;
    let isLevelUp = false;

    

     // Tableau des difficultés disponibles
     const cardDifficulties = [
        "Increase speed",
        "Reduce time",
        "Extra challenge",
        "Random penalty",
        "Double points",
        "Lose a turn"
    ];
    const timeElement = document.querySelector('.time');
    const winnerElement = document.querySelector('.winner');
    const scoresElement = document.querySelector('.scores');
    const timeCount = document.querySelector(".time");
    const winnerDropdown = document.querySelector('.winner-dropdown');
    const scoreSelected = document.querySelector(".score-selected").value
    const indexPlayers = players.map((player, index) => ({ player, index }));
    
    if (players.length === 0) {
        const tr = document.createElement('tr'); // Créez une ligne de tableau
        const td = document.createElement('td'); // Créez une cellule de tableau
        td.textContent = "No players added"; // Texte par défaut
        td.colSpan = 4; // Étendre sur 4 colonnes pour alignement
        td.style.textAlign = "center"; // Centrez le texte
        tr.appendChild(td);
        scoresElement.appendChild(tr);
    }
    document.querySelector('.random-difficulty').addEventListener('click', () => {
        randomLevelup();
    });
    document.querySelector('.add_player_button').addEventListener('click', () => {
        console.log("hh")
        const playerName = document.querySelector('input').value;
        if (playerName && !scores[playerName]) {
            players.push(playerName);
            scores[playerName] = 0;
            updateScores();
            addPlayerDropDown(playerName);
        }
    });
    document.querySelector('.level-up').addEventListener('click', () => {
        if (isLevelUp == false) {
            isLevelUp = true;
            console.log(isLevelUp)
        }
        else {
            isLevelUp = false;
        }
        
    });

    const countdown = () => {
        if (timeLeft <= 0) {
            // Le temps est écoulé, exécuter le code ici
            clearTimeout(countdownTimer); // Arrêter le compte à rebours
        } else {
            timeLeft--;
            timeCount.textContent = timeLeft + "s";
            countdownTimer = setTimeout(countdown, 1000);
        }
    };


    // Démarrer le compte à rebours
    // countdown();
    function addPlayerDropDown(player) {
        // Vérifie si le joueur est déjà dans la liste déroulante
        const existingOptions = Array.from(winnerDropdown.options).map(option => option.value);
        if (!existingOptions.includes(player)) {
            const option = document.createElement('option');
            option.value = player;
            option.textContent = player;
            winnerDropdown.appendChild(option);
        }
    }
    function randomstartplayer() {
        if (gameActive) {
            currentPlayerIndex = Math.floor(Math.random() * players.length);
            console.log(players[currentPlayerIndex]);
            //random player
        }
    }
    function startGame() {
            gameActive = true;
            countdown();
            // Démarrer le jeu
    }

    document.querySelector('.start-game').addEventListener('click', () => {
        startGame();
    });
    document.querySelector('.pause-game').addEventListener('click', () => {
        pauseGame();
    });
    document.querySelector('.random-start').addEventListener('click', () => {
        randomstartplayer();
    });
    function turnPlayer() {
        if (gameActive) {
            // Passer au joueur suivant dans la liste
            currentPlayerIndex = (currentPlayerIndex + 1) % players.length;
            console.log(players[currentPlayerIndex]);  // Afficher le joueur actuel dans la console
    
            // Mettre à jour l'indicateur "Current" dans le tableau
            const rows = document.querySelectorAll('tbody tr');  // Sélectionner toutes les lignes du tableau
    
            rows.forEach((row, index) => {
                const turnTd = row.querySelector('.turn-cell');  // Sélectionner la cellule de la colonne "Current clue giver"
                if (turnTd) {
                    // Mettre "Current" si c'est le joueur actuel, sinon laisser vide
                    turnTd.textContent = index === currentPlayerIndex ? 'Current' : '';
                }
            });
        }
    }
    
    function removePlayer(playerName) {
        // Trouver l'index du joueur
        const playerIndex = players.indexOf(playerName);
        
        if (playerIndex !== -1) {
            // Supprimer le joueur du tableau
            players.splice(playerIndex, 1); // Retire complètement l'élément
            console.log(`${playerName} has been removed.`);
        } else {
            console.log(`${playerName} does not exist.`);
        }
    
        // Met à jour les scores
        updateScores();
    
        // Retirer le joueur de la liste déroulante
        const winnerDropdown = document.querySelector('.winner-dropdown');
        if (winnerDropdown) {
            const options = Array.from(winnerDropdown.options);
            options.forEach(option => {
                if (option.value === playerName) {
                    winnerDropdown.removeChild(option);
                }
            });
        }
    }
    
    document.querySelector(".remove-player").addEventListener('click', () => {
        removePlayer();
    })

    document.querySelector(".next-turn").addEventListener('click', () => {
        turnPlayer();
    })

    function updateScores() {
        scoresElement.innerHTML = '';
        winnerDropdown.innerHTML = '';
        players.forEach((player, index) => {
            const tr = document.createElement('tr');
            const playerTd = document.createElement('td');
            const scoreTd = document.createElement('td');
            const turnTd = document.createElement('td');
            const deletetd = document.createElement('td')
            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete';
            deleteButton.classList.add('btn-delete');
            deleteButton.addEventListener('click', () => {
                removePlayer(player);
            });
            playerTd.textContent = player;
            scoreTd.textContent = scores[player];
            turnTd.textContent = index === currentPlayerIndex ? 'Current' : '';
            turnTd.classList.add("turn-cell");

            tr.appendChild(playerTd);
            tr.appendChild(scoreTd);
            tr.appendChild(deletetd);
            deletetd.appendChild(deleteButton)
            tr.appendChild(turnTd);
            scoresElement.appendChild(tr);

            const option = document.createElement('option');
            option.value = player;
            option.textContent = player;
            winnerDropdown.appendChild(option);
        });
    }
    document.querySelector('.update-scores').addEventListener('click', () => {
        const selectedPlayer = winnerDropdown.value;
        const scoreInput = document.querySelector('.score-selected').value;
        console.log("hhh")
    
        if (selectedPlayer && scoreInput) {
            // Convertir le score en nombre avant de l'ajouter
            const scoreToAdd = parseInt(scoreInput, 10);
            if (!isNaN(scoreToAdd)) {
                scores[selectedPlayer] += scoreToAdd;
                updateScores();
                checkWinner();
            } else {
                alert('Veuillez entrer un score valide.');
            }
        } else {
            alert('Veuillez sélectionner un joueur et entrer un score.');
        }
    });

    function checkWinner() {
        for (const player in scores) {
            if (scores[player] >= 20) {
                winnerElement.textContent = player;
                gameActive = false;
                alert(`${player} a gagné !`);
                return; 
            }
        }
    }
   

   
    
    // Fonction pour appliquer la difficulté (à personnaliser)
    function applyDifficulty(difficulty) {
        switch (difficulty) {
            case "Increase speed":
                // Augmenter la vitesse du jeu
                console.log("Game speed increased!");
                break;
            case "Reduce time":
                // Réduire le temps restant
                console.log("Time reduced!");
                break;
            case "Extra challenge":
                // Ajouter un défi supplémentaire
                console.log("An extra challenge has been added!");
                break;
            case "Random penalty":
                // Appliquer une pénalité aléatoire
                console.log("A random penalty has been applied!");
                break;
            case "Double points":
                // Doubler les points pour une durée limitée
                console.log("Points are doubled for now!");
                break;
            case "Lose a turn":
                // Perdre un tour
                console.log("You lose a turn!");
                break;
            default:
                console.log("Unknown difficulty!");
        }
    }


    document.querySelector('button:nth-of-type(10)').addEventListener('click', () => {
        players = [];
        scores = {};
        currentPlayerIndex = 0;
        gameActive = false;
        updateScores();
        winnerElement.textContent = '';
    });
    function pauseGame() {
        if (gameActive) {
            clearTimeout(countdownTimer);
        }
    }

    // function randomLevelup() {
    //     if (gameActive && isLevelUp) {
    //         // Vérifie aléatoirement si une difficulté doit être ajoutée
    //         console.log("Checking for new difficulty...");
    //         if (Math.random() > 0.5) {
    //             // Choisir une difficulté aléatoire
    //             const randomIndex = Math.floor(Math.random() * cardDifficulties.length);
    //             const selectedDifficulty = cardDifficulties[randomIndex];

    //             // Ajouter la difficult é (par exemple, l'afficher ou l'appliquer)
    //             console.log(`New difficulty added: ${selectedDifficulty}`);

    //             // Appliquer la difficulté (logique supplémentaire selon votre jeu)
    //             applyDifficulty(selectedDifficulty);
    //         } else {
    //             console.log("No new difficulty this time.");
    //         }
    //     }
    // }
    function randomLevelup() {
        if (gameActive && isLevelUp) {
            console.log("Checking for new difficulty...");

            if (Math.random() > 0.5) {
                const randomIndex = Math.floor(Math.random() * cardDifficulties.length);
                const selectedDifficulty = cardDifficulties[randomIndex];

                // Update modal with selected difficulty
                const cardHtml = `
                    <div class="card">
                        <div class="card-header">New Difficulty</div>
                        <div class="card-body">
                            <h5 class="card-title">${selectedDifficulty}</h5>
                            <p class="card-text">This difficulty will be applied to your game. Brace yourself!</p>
                        </div>
                    </div>
                `;
                randomCardContent.innerHTML = cardHtml;
                randomModal.show(); // Show the popup modal
            } else {
                console.log("No new difficulty this time.");
                const cardHtml = `
                    <div class="card">
                        <div class="card-header">No Difficulty Added</div>
                        <div class="card-body">
                            <p class="card-text">Better luck next time! No new difficulty was added.</p>
                        </div>
                    </div>
                `;
                randomCardContent.innerHTML = cardHtml;
                randomModal.show(); // Show the popup modal
            }
        }
    }


});



///
