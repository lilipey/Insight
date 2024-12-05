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
    let timeLeft = 120;
    let isLevelUp = true;
    let start = false;
    let pause = false;
    let explanation_difficulty = "";
    

     // Tableau des difficultés disponibles
     const cardDifficulties = [
        { name: "Reverse Logic", explanation: "The green and red pawn have swapped roles!" },
        { name: "Guess Again", explanation: "Players can only guess three times each during this round!" },
        { name: "Limited Space 1", explanation: "You can only place pawns in the first column!" },
        { name: "Limited Space 2", explanation: "You can only place pawns in the second column!" },
        { name: "Limited Space 3", explanation: "You can only place pawns in the third column!" },
        { name: "Limited Space 4", explanation: "You can only place pawns in the fourth column!" },
        { name: "No Green Zone", explanation: "You cannot use the green pawn for this turn!" },
        { name: "No Red Zone", explanation: "You cannot use the red pawn for this turn!" },
        { name: "Extra Bonus", explanation: "You have to also use the black pawn!" },
        { name: "Word Swap", explanation: "You must use the word on the card that you did not originally choose!" },
        { name: "Speed Round", explanation: "You must place all three pawns within 20 seconds of seeing the card!" }
    ];
    const timeElement = document.querySelector('.time');
    const winnerElement = document.querySelector('.winner');
    const scoresElement = document.querySelector('.scores');
    const timeCount = document.querySelector(".time");
    const winnerDropdown = document.querySelector('.winner-dropdown');
    const scoreSelected = document.querySelector(".score-selected").value
    const indexPlayers = players.map((player, index) => ({ player, index }));

    // const levelUpButton = document.querySelector('.level-up');
    const notification = document.getElementById('difficulty-notification');

    document.querySelector('.start-game').addEventListener('click', () => {
        if (start == false) {
            console.log("Game started");
            startGame();
        } else if (pause == false && start == true) {
            pauseGame();
        } else if (pause == true && start == true) {
            console.log("Game resumed");
            pause = false;
            startGame();
           
        }
    });
    document.querySelector('.restart-game').addEventListener('click', () => {
        resetGamePage();
    });
    document.querySelector('.reset-game').addEventListener('click', () => {
        resetGame();
        pauseGame();
    });

    document.querySelector('.random-start').addEventListener('click', () => {
        randomstartplayer();
        // Vérifie aléatoirement si une difficulté doit être ajoutée
        // Choisir une difficulté aléatoire

        // Appliquer la difficulté (logique supplémentaire selon votre jeu

        // Afficher la pop-up avec la nouvelle difficulté
        const popups = document.querySelector('#random-popup-start-player');
        const popupContent = document.querySelector('#pop-up-content-start-player p');
       
        popupContent.innerHTML = ` it's ${players[currentPlayerIndex]} who beggins`;
        popups.style.display = 'flex';
    
    });
    
    if (players.length === 0) {
        const tr = document.createElement('tr'); // Créez une ligne de tableau
        const td = document.createElement('td'); // Créez une cellule de tableau
        td.textContent = "No players added"; // Texte par défaut
        td.colSpan = 4; // Étendre sur 4 colonnes pour alignement
        td.style.textAlign = "center"; // Centrez le texte
        tr.appendChild(td);
        scoresElement.appendChild(tr);
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
    document.querySelector('.random-difficulty').addEventListener('click', () => {
        randomLevelup();
    });
    document.querySelector('.add_player_button').addEventListener('click', () => {
        const playerName = document.querySelector('input').value;
        if (players.includes(playerName)) {
            alert('Player already exists');
        }
        else {
            if (playerName && !scores[playerName]) {
                players.push(playerName);
                scores[playerName] = 0;
                updateScores();
                addPlayerDropDown(playerName);
                document.querySelector('input').value = '';
            }
        }
    });
    document.querySelector(".next-turn").addEventListener('click', () => {
        turnPlayer();
    })
    const notificationParagraph = notification.querySelector('p');

    // levelUpButton.addEventListener('click', () => {
    //     // Afficher la notification
    //     notification.classList.add('show');

    //     if (isLevelUp == false) {
    //         isLevelUp = true;
    //         console.log(isLevelUp);
    //         notificationParagraph.textContent = "You are on the difficulty level";
    //     } else {
    //         isLevelUp = false;
    //         notificationParagraph.textContent = "You are on the normal level";
    //     }

    //     // Masquer la notification après 3 secondes
    //     setTimeout(() => {
    //         notification.classList.remove('show');
    //         notification.classList.add('hide');

    //         // Réinitialiser la notification après la transition
    //         setTimeout(() => {
    //             notification.classList.remove('hide');
    //         }, 500);
    //     }, 3000);
    // });

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
            const currentPlayer = players[currentPlayerIndex];
            console.log(currentPlayer);
    
            // Mettre à jour le tableau avec le joueur actuel
            updateCurrentPlayerInTable(currentPlayer);
        }
    }
    
    function updateCurrentPlayerInTable(currentPlayer) {
        const tableRows = document.querySelectorAll('.custom-table tbody tr');
        tableRows.forEach(row => {
            const playerNameCell = row.querySelector('td:first-child');
            const currentClueGiverCell = row.querySelector('td:last-child');
    
            if (playerNameCell && currentClueGiverCell) {
                if (playerNameCell.textContent === currentPlayer) {
                    currentClueGiverCell.textContent = 'Current';
                } else {
                    currentClueGiverCell.textContent = '';
                }
            }
        });
    }
    function resetGamePage() {
        location.reload();
    }
    function startGame() {
            gameActive = true;
            countdown();
            start = true;
            // Démarrer le jeu
    }
    function resetGame() {
        timeLeft = 120;
        timeCount.textContent = timeLeft + "s";
    }
    
    document.querySelector('.pause-game').addEventListener('click', () => {
        pauseGame();
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
// Fonction pour appliquer la difficulté (à personnaliser)
function applyDifficulty(difficulty) {
    let explanation_difficulty;
    switch (difficulty) {
        case "Reverse Logic":
            // The green and red pawn have swapped roles, but you are not allowed to inform the others players.
            explanation_difficulty = "The green and red pawn have swapped roles!";
            console.log(explanation_difficulty);
            break;
        case "Guess Again":
            // Players can only guess three times each during this round.
            explanation_difficulty = "Players can only guess three times each during this round!";
            console.log(explanation_difficulty);
            break;
        case "Limited Space 1":
            // You can only place pawns in the first column.
            explanation_difficulty = "You can only place pawns in the first column!";
            console.log(explanation_difficulty);
            break;
        case "Limited Space 2":
            // You can only place pawns in the second column.
            explanation_difficulty = "You can only place pawns in the second column!";
            console.log(explanation_difficulty);
            break;
        case "Limited Space 3":
            // You can only place pawns in the third column.
            explanation_difficulty = "You can only place pawns in the third column!";
            console.log(explanation_difficulty);
            break;
        case "Limited Space 4":
            // You can only place pawns in the fourth column.
            explanation_difficulty = "You can only place pawns in the fourth column!";
            console.log(explanation_difficulty);
            break;
        case "No Green Zone":
            // You cannot use the green pawn for this turn.
            explanation_difficulty = "You cannot use the green pawn for this turn!";
            console.log(explanation_difficulty);
            break;
        case "No Red Zone":
            // You cannot use the red pawn for this turn.
            explanation_difficulty = "You cannot use the red pawn for this turn!";
            console.log(explanation_difficulty);
            break;
        case "Extra Bonus":
            // You have to also use the black pawn.
            explanation_difficulty = "You have to also use the black pawn!";
            console.log(explanation_difficulty);
            break;
        case "Word Swap":
            // You must use the word on the card that you did not originally choose.
            explanation_difficulty = "You must use the word on the card that you did not originally choose!";
            console.log(explanation_difficulty);
            break;
        case "Speed Round":
            // You must place all three pawns within 20 seconds of seeing the card.
            explanation_difficulty = "You must place all three pawns within 20 seconds of seeing the card!";
            console.log(explanation_difficulty);
            break;
        default:
            explanation_difficulty = "No challenge!";
            console.log(explanation_difficulty);
    }
}


    document.querySelector('.reset-game').addEventListener('click', () => {
        timeCount.textContent = 0 + "s";
    });
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
            pause = true;
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
            // Vérifie aléatoirement si une difficulté doit être ajoutée
            console.log("Checking for new difficulty...");
            // Choisir une difficulté aléatoire
            const randomIndex = Math.floor(Math.random() * cardDifficulties.length);
            const selectedDifficulty = cardDifficulties[randomIndex];
    
            // Ajouter la difficulté (par exemple, l'afficher ou l'appliquer)
            console.log(`New difficulty added: ${selectedDifficulty.name}<br>`);
            console.log(`Explanation: ${selectedDifficulty.explanation}`);
    
            // Appliquer la difficulté (logique supplémentaire selon votre jeu)
            applyDifficulty(selectedDifficulty.name);
    
            // Afficher la pop-up avec la nouvelle difficulté
            const popup = document.getElementById('random-popup');
            const popupContent = popup.querySelector('.popup-content p');
            if (Math.random() > 0.2) {
                popupContent.innerHTML = `${selectedDifficulty.name}\n <br>Explanation: ${selectedDifficulty.explanation}`;
                popup.style.display = 'flex';
            } else {
                popupContent.textContent = `No challenge`;
                popup.style.display = 'flex';
            }
        }
    }

});



///
