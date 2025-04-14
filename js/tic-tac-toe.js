     // Variables du jeu
     let board = ['', '', '', '', '', '', '', '', ''];
     let currentPlayer = 'X';
     let gameActive = true;
     let scores = {
         'X': 0,
         'O': 0,
         'draws': 0
     };
     let timerEnabled = false;
     let timeLeft = 10;
     let timerId;
     let powerUpMode = false;
     let powerUpAvailable = {
         'X': false,
         'O': false
     };
     let activePowerUp = null;
     
     // Conditions de victoire
     const winPatterns = [
         [0, 1, 2], [3, 4, 5], [6, 7, 8], // lignes
         [0, 3, 6], [1, 4, 7], [2, 5, 8], // colonnes
         [0, 4, 8], [2, 4, 6]             // diagonales
     ];
     
     // Éléments DOM
     const cells = document.querySelectorAll('.cell');
     const statusDisplay = document.querySelector('.status');
     const resetButton = document.querySelector('.reset-btn');
     const resetScoreButton = document.querySelector('.reset-score-btn');
     const winModal = document.getElementById('win-modal');
     const drawModal = document.getElementById('draw-modal');
     const powerupModal = document.getElementById('powerup-modal');
     const modeButtons = document.querySelectorAll('.mode-btn');
     const timerDisplay = document.querySelector('.timer');
     const themeToggle = document.querySelector('.theme-toggle');
     
     // Initialiser le jeu
     function initGame() {
         board = ['', '', '', '', '', '', '', '', ''];
         gameActive = true;
         currentPlayer = 'X';
         updateScoreboard();
         updateStatus();

         // Réinitialiser les cellules
         cells.forEach(cell => {
             cell.textContent = '';
             cell.classList.remove('x', 'o', 'win-cell');
         });
         
         // Réinitialiser le chronomètre
         clearInterval(timerId);
         if (timerEnabled) {
             timeLeft = 10;
             timerDisplay.textContent = timeLeft;
             timerDisplay.classList.remove('warning');
             timerDisplay.style.display = 'flex';
             startTimer();
         } else {
             timerDisplay.style.display = 'none';
         }
         
         // Réinitialiser les power-ups
         if (powerUpMode) {
             if (Math.random() > 0.7) {
                 powerUpAvailable[currentPlayer] = true;
                 setTimeout(() => {
                     showPowerUpModal();
                 }, 500);
             }
         }
         
         // Nettoyer les animations
         document.querySelector('.win-animation').innerHTML = '';
     }
     
     // Fonction de mise à jour du statut
     function updateStatus() {
         statusDisplay.innerHTML = `Au tour du joueur <span class="player-turn player-${currentPlayer.toLowerCase()}">${currentPlayer}</span>`;
         
         // Mettre à jour la colonne active du tableau de score
         document.querySelector('.score-column.x').classList.toggle('active', currentPlayer === 'X');
         document.querySelector('.score-column.o').classList.toggle('active', currentPlayer === 'O');
     }
     
     // Fonction pour mettre à jour le tableau des scores
     function updateScoreboard() {
         document.getElementById('x-score').textContent = scores['X'];
         document.getElementById('o-score').textContent = scores['O'];
         document.getElementById('draws').textContent = scores['draws'];
     }
     
     // Gérer le clic sur une cellule
     function handleCellClick(clickedCellEvent) {
         const clickedCell = clickedCellEvent.target;
         const clickedCellIndex = parseInt(clickedCell.getAttribute('data-index'));
         
         // Vérifier si la cellule est déjà occupée ou si le jeu est inactif
         if (board[clickedCellIndex] !== '' || !gameActive) {
             return;
         }
         
         // Mode power-up
         if (activePowerUp === 'move' && clickedCellIndex !== null) {
             // Trouver une cellule de l'adversaire
             const enemySymbol = currentPlayer === 'X' ? 'O' : 'X';
             const enemyCells = [];
             board.forEach((val, idx) => {
                 if (val === enemySymbol) {
                     enemyCells.push(idx);
                 }
             });
             
             if (enemyCells.length > 0) {
                 // Choisir une cellule aléatoire de l'adversaire
                 const randomEnemyCell = enemyCells[Math.floor(Math.random() * enemyCells.length)];
                 
                 // Vider cette cellule
                 board[randomEnemyCell] = '';
                 cells[randomEnemyCell].textContent = '';
                 cells[randomEnemyCell].classList.remove('x', 'o');
                 
                 // Animation de déplacement
                 cells[randomEnemyCell].style.transition = 'transform 0.3s ease, opacity 0.3s ease';
                 cells[randomEnemyCell].style.transform = 'scale(0.8)';
                 cells[randomEnemyCell].style.opacity = '0.5';
                 
                 setTimeout(() => {
                     cells[randomEnemyCell].style.transform = '';
                     cells[randomEnemyCell].style.opacity = '';
                 }, 300);
                 
                 activePowerUp = null;
             }
         }
         
         // Mise à jour du jeu
         board[clickedCellIndex] = currentPlayer;
         clickedCell.textContent = currentPlayer;
         clickedCell.classList.add(currentPlayer.toLowerCase());
         
         // Animation d'apparition
         clickedCell.style.transform = 'scale(0)';
         setTimeout(() => {
             clickedCell.style.transform = 'scale(1)';
         }, 10);
         
         // Vérifier si la partie est terminée
         if (checkWin()) {
             handleWin();
             return;
         }
         
         if (checkDraw()) {
             handleDraw();
             return;
         }
         
         // Passer au joueur suivant
         currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
         updateStatus();
         
         // Réinitialiser le chronomètre si activé
         if (timerEnabled) {
             clearInterval(timerId);
             timeLeft = 10;
             timerDisplay.textContent = timeLeft;
             timerDisplay.classList.remove('warning');
             startTimer();
         }
         
         // Vérifier si un power-up doit être activé
         if (powerUpMode && !powerUpAvailable[currentPlayer] && Math.random() > 0.85) {
             powerUpAvailable[currentPlayer] = true;
             setTimeout(() => {
                 showPowerUpModal();
             }, 500);
         }
     }
     
     // Fonction pour vérifier une victoire
     function checkWin() {
         for (let i = 0; i < winPatterns.length; i++) {
             const [a, b, c] = winPatterns[i];
             if (board[a] && board[a] === board[b] && board[a] === board[c]) {
                 // Marquer les cellules gagnantes
                 cells[a].classList.add('win-cell');
                 cells[b].classList.add('win-cell');
                 cells[c].classList.add('win-cell');
                 return true;
             }
         }
         return false;
     }
     
     // Fonction pour vérifier un match nul
     function checkDraw() {
         return !board.includes('');
     }
     
     // Fonction pour gérer une victoire
     function handleWin() {
         gameActive = false;
         scores[currentPlayer]++;
         updateScoreboard();
         
         clearInterval(timerId);
         
         // Animation de confettis
         createConfetti();
         
         // Afficher la modal de victoire
         document.getElementById('winner').textContent = currentPlayer;
         setTimeout(() => {
             winModal.classList.add('active');
         }, 1000);
     }
     
     // Fonction pour gérer un match nul
     function handleDraw() {
         gameActive = false;
         scores['draws']++;
         updateScoreboard();
         
         clearInterval(timerId);
         
         setTimeout(() => {
             drawModal.classList.add('active');
         }, 500);
     }
     
     // Fonction pour créer les confettis
     function createConfetti() {
         const confettiContainer = document.querySelector('.win-animation');
         const colors = ['#00cec9', '#6c5ce7', '#00b894', '#fdcb6e', '#e84393'];
         
         for (let i = 0; i < 50; i++) {
             const confetti = document.createElement('div');
             confetti.classList.add('confetti');
             confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
             confetti.style.left = Math.random() * 100 + '%';
             confetti.style.top = -20 + 'px';
             confetti.style.transform = `scale(${Math.random() * 0.8 + 0.5})`;
             confettiContainer.appendChild(confetti);
             
             // Animation
             setTimeout(() => {
                 confetti.style.transition = `top ${Math.random() * 3 + 2}s ease, left ${Math.random() * 2 + 1}s ease, opacity 0.5s ease`;
                 confetti.style.top = 100 + 'vh';
                 confetti.style.left = `${Math.random() * 100}%`;
                 confetti.style.opacity = '1';
                 
                 setTimeout(() => {
                     confetti.style.opacity = '0';
                 }, 2000);
                 
                 setTimeout(() => {
                     confetti.remove();
                 }, 3000);
             }, Math.random() * 500);
         }
     }
     
     // Fonction pour démarrer le chronomètre
     function startTimer() {
         timerId = setInterval(() => {
             timeLeft--;
             timerDisplay.textContent = timeLeft;
             
             if (timeLeft <= 3) {
                 timerDisplay.classList.add('warning');
             }
             
             if (timeLeft <= 0) {
                 clearInterval(timerId);
                 // Passer automatiquement au joueur suivant
                 currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
                 updateStatus();
                 timeLeft = 10;
                 timerDisplay.textContent = timeLeft;
                 timerDisplay.classList.remove('warning');
                 startTimer();
             }
         }, 1000);
     }
     
     // Fonction pour afficher la modal de power-up
     function showPowerUpModal() {
         const powerups = [
             {action: 'déplacer une case adversaire', id: 'move'},
             {action: 'bloquer une case pour un tour', id: 'block'},
             {action: 'jouer deux fois d\'affilée', id: 'double'}
         ];
         
         const randomPowerup = powerups[Math.floor(Math.random() * powerups.length)];
         document.getElementById('powerup-action').textContent = randomPowerup.action;
         activePowerUp = randomPowerup.id;
         
         powerupModal.classList.add('active');
     }
     
     // Initialiser les écouteurs d'événements
     function initEventListeners() {
         cells.forEach(cell => {
             cell.addEventListener('click', handleCellClick);
         });
         
         resetButton.addEventListener('click', initGame);
         
         resetScoreButton.addEventListener('click', () => {
             scores = { 'X': 0, 'O': 0, 'draws': 0 };
             updateScoreboard();
             initGame();
         });
         
         // Gestion des modals
         document.querySelectorAll('.modal-btn').forEach(btn => {
             btn.addEventListener('click', () => {
                 winModal.classList.remove('active');
                 drawModal.classList.remove('active');
                 powerupModal.classList.remove('active');
                 if (btn.closest('#win-modal') || btn.closest('#draw-modal')) {
                     initGame();
                 }
             });
         });
         
         // Gestion des modes de jeu
         modeButtons.forEach(btn => {
             btn.addEventListener('click', () => {
                 const mode = btn.getAttribute('data-mode');
                 
                 if (mode === 'time') {
                     timerEnabled = !timerEnabled;
                     btn.classList.toggle('active', timerEnabled);
                     initGame();
                 } else if (mode === 'powerup') {
                     powerUpMode = !powerUpMode;
                     btn.classList.toggle('active', powerUpMode);
                     initGame();
                 }
             });
         });
         
         // Gestion du thème
         let theme = 0;
         const themes = [
             { primary: '#6c5ce7', secondary: '#a29bfe', accent: '#00cec9' },
             { primary: '#e84393', secondary: '#fd79a8', accent: '#fdcb6e' },
             { primary: '#2c3e50', secondary: '#34495e', accent: '#3498db' },
             { primary: '#16a085', secondary: '#1abc9c', accent: '#f1c40f' }
         ];
         
         themeToggle.addEventListener('click', () => {
             theme = (theme + 1) % themes.length;
             document.documentElement.style.setProperty('--primary', themes[theme].primary);
             document.documentElement.style.setProperty('--secondary', themes[theme].secondary);
             document.documentElement.style.setProperty('--accent', themes[theme].accent);
             
             // Animation du changement de thème
             document.body.style.transition = 'background 1s ease';
         });
     }
     
     // Initialiser le jeu
     initGame();
     initEventListeners();