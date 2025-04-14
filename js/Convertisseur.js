     // Récupérer les éléments du DOM
     const weightInput = document.getElementById('weightInput');
     const unitSelect = document.getElementById('unitSelect');
     const gramResult = document.getElementById('gramResult');
     const kgResult = document.getElementById('kgResult');
     const lbResult = document.getElementById('lbResult');
     
     // Fonction pour convertir les poids
     function convertWeight() {
         // Récupérer la valeur et l'unité
         const value = parseFloat(weightInput.value) || 0;
         const unit = unitSelect.value;
         
         let grams, kg, lb;
         
         // Convertir en grammes d'abord
         switch(unit) {
             case 'g':
                 grams = value;
                 break;
             case 'kg':
                 grams = value * 1000;
                 break;
             case 'lb':
                 grams = value * 453.592;
                 break;
         }
         
         // Puis convertir en d'autres unités
         kg = grams / 1000;
         lb = grams / 453.592;
         
         // Afficher les résultats avec format
         gramResult.textContent = grams.toFixed(2);
         kgResult.textContent = kg.toFixed(4);
         lbResult.textContent = lb.toFixed(4);
     }
     
     // Ajouter les événements pour recalculer automatiquement
     weightInput.addEventListener('input', convertWeight);
     unitSelect.addEventListener('change', convertWeight);
     
     // Calculer initialement
     convertWeight();