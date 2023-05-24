let btnLancer = document.getElementById("btnLancer");
        let dice = document.querySelectorAll('.dice img');
        let pastry = '';
        let rulesContainer = document.querySelector('.rules-container');
        let btnInfos = document.getElementById("btnInfos");
        let closeBtn = document.querySelector('.close-btn');
        let diceSound = document.getElementById("diceSound");
        let confettiSound = document.getElementById("confettiSound");

        btnLancer.addEventListener('click', () => {
          let results = [];

          for (let i = 0; i < dice.length; i++) {
            let result = Math.floor(Math.random() * 6) + 1;
            results.push(result);
            dice[i].src = `/dice${result}.png`;
          }

          diceSound.currentTime = 0; // Rembobiner le son à chaque lancé
          diceSound.play();

          if (isYams(results)) {
            pastry = 'Brioche sucrée avec chocolat';
            // Ajouter la classe d'animation pour l'encadrement en vert
            dice.forEach((die) => die.classList.add('win'));
            // Activer l'animation de confettis pendant 12 secondes
            confettiAnimation();
          } else if (isCarré(results)) {
            pastry = 'Cake glacé fondant au chocolat';
            // Ajouter la classe d'animation pour l'encadrement en vert
            dice.forEach((die) => die.classList.add('win'));
          } else if (isFull(results)) {
            pastry = 'Tarte aux fruits';
            // Ajouter la classe d'animation pour l'encadrement en orange
            dice.forEach((die) => die.classList.add('partial-win'));
          } else if (isSuite(results)) {
            pastry = 'Éclair au café';
            // Ajouter la classe d'animation pour l'encadrement en orange
            dice.forEach((die) => die.classList.add('partial-win'));
          } else if (isTriple(results)) {
            pastry = 'Croissant aux amandes';
            // Ajouter la classe d'animation pour l'encadrement en orange
            dice.forEach((die) => die.classList.add('partial-win'));
          } else {
            pastry = 'Aucune pâtisserie gagnée';
            // Activer l'animation de tremblement
            shakeAnimation();
          }

          document.querySelector('p').textContent = `Pâtisserie gagnée : ${pastry}`;
        });

        btnInfos.addEventListener('click', () => {
          rulesContainer.style.display = 'block';
        });

        document.addEventListener('click', (event) => {
          if (!rulesContainer.contains(event.target) && event.target !== btnInfos) {
            rulesContainer.style.display = 'none';
          }
        });

        function isYams(results) {
          const uniqueResults = [...new Set(results)];
          return uniqueResults.length === 1;
        }

        function isCarré(results) {
          const counters = countOccurrences(results);
          for (const result in counters) {
            if (counters[result] >= 4) {
              return true;
            }
          }
          return false;
        }

        function isFull(results) {
          const counters = countOccurrences(results);
          return Object.values(counters).includes(2) && Object.values(counters).includes(3);
        }

        function isSuite(results) {
          const sortedResults = results.slice().sort((a, b) => a - b);
          for (let i = 0; i < sortedResults.length - 1; i++) {
            if (sortedResults[i] !== sortedResults[i + 1] - 1) {
              return false;
            }
          }
          return true;
        }

        function isTriple(results) {
          const counters = countOccurrences(results);
          return Object.values(counters).includes(3);
        }

        function countOccurrences(arr) {
          return arr.reduce((counters, result) => {
            counters[result] = (counters[result] || 0) + 1;
            return counters;
          }, {});
        }

        function shakeAnimation() {
          document.querySelector('.game-container').classList.add('win-animation', 'active');
          setTimeout(() => {
            document.querySelector('.game-container').classList.remove('win-animation', 'active');
          }, 1000);
        }

        function confettiAnimation() {
          confettiSound.currentTime = 0;
          confettiSound.play();
          dice.forEach((die, index) => {
            setTimeout(() => {
              die.src = `/dice${index + 1}.png`;
            }, (index + 1) * 2000);
          });
          setTimeout(() => {
            dice.forEach((die) => {
              die.src = `/dice${Math.floor(Math.random() * 6) + 1}.png`;
            });
          }, 12000);
        }
