 // Fonction pour mettre à jour l'horloge
 function updateClock() {
    const now = new Date();
    
    // Format de l'heure (avec les secondes)
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    const timeString = `${hours}:${minutes}:${seconds}`;
    
    // Format de la date
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const dateString = now.toLocaleDateString('fr-FR', options);
    
    // Mise à jour des éléments HTML
    document.getElementById('clock').textContent = timeString;
    document.getElementById('date').textContent = dateString;
}

// Fonction pour gérer le bouton afficher/cacher
function setupToggleButton() {
    const toggleBtn = document.getElementById('toggle-btn');
    const clockContainer = document.getElementById('clock-container');
    
    toggleBtn.addEventListener('click', function() {
        if (clockContainer.classList.contains('hidden')) {
            clockContainer.classList.remove('hidden');
            toggleBtn.textContent = 'Cacher l\'horloge';
        } else {
            clockContainer.classList.add('hidden');
            toggleBtn.textContent = 'Afficher l\'horloge';
        }
    });
}

// Initialisation
document.addEventListener('DOMContentLoaded', function() {
    // Mettre à jour l'horloge immédiatement
    updateClock();
    
    // Mettre à jour l'horloge chaque seconde
    setInterval(updateClock, 1000);
    
    // Configurer le bouton
    setupToggleButton();
});