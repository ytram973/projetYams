let btnLancer = document.getElementById("btnLancer")
let dice = document.querySelectorAll(".dice img")
let pastry = ""
let rulesContainer = document.querySelector(".rules-container")
let btnInfos = document.getElementById("btnInfos")
let closeBtn = document.querySelector(".close-btn")
let diceSound = document.getElementById("diceSound")
let confettiSound = document.getElementById("confettiSound")

btnLancer.addEventListener("click", () => {
  let results = []

  // Réinitialiser les classes d'encadrement et d'animation
  dice.forEach((die) => {
    die.classList.remove("win", "fade-up")
  })

  for (let i = 0; i < dice.length; i++) {
    let result = Math.floor(Math.random() * 6) + 1
    results.push(result)
    dice[i].src = `/dice${result}.png`
  }

  diceSound.currentTime = 0 // Rembobiner le son à chaque lancé
  diceSound.play()

  if (isYams(results)) {
    pastry = "Brioche sucrée avec chocolat"
    // Ajouter la classe d'encadrement en vert aux dés ayant la même valeur
    dice.forEach((die, index) => {
      if (results[index] === results[0]) {
        die.classList.add("win")
      }
    })
    // Activer l'animation de confettis pendant 12 secondes
    confettiAnimation()
  } else if (isCarré(results)) {
    pastry = "Cake glacé fondant au chocolat"
    const value = getMostCommonValue(results)
    // Ajouter la classe d'encadrement en vert aux dés ayant la même valeur
    dice.forEach((die, index) => {
      if (results[index] === value) {
        die.classList.add("win")
      }
    })
  } else if (isFull(results)) {
    pastry = "Tarte aux fruits"
    const counters = countOccurrences(results)
    const values = Object.keys(counters)
    const tripleValue = values.find((value) => counters[value] >= 3)
    const doubleValue = values.find((value) => counters[value] === 2)
    if (tripleValue && doubleValue) {
      // Ajouter la classe d'encadrement en vert aux dés ayant la même valeur
      dice.forEach((die, index) => {
        if (results[index] == tripleValue) {
          die.classList.add("win")
        }
      })
    }
  } else if (isSuite(results)) {
    pastry = "Éclair au café"
    // Vérifier si les dés sont consécutifs
    if (checkConsecutive(results)) {
      // Ajouter la classe d'animation pour le fade up aux dés consécutifs
      dice.forEach((die, index) => {
        if (index >= 0 && index <= 4) {
          die.classList.add("fade-up")
        }
      })
    }
  } else if (isTriple(results)) {
    pastry = "Croissant aux amandes"
    const counters = countOccurrences(results)
    const values = Object.keys(counters)
    const tripleValue = values.find((value) => counters[value] >= 3)
    if (tripleValue) {
      // Ajouter la classe d'encadrement en vert aux dés ayant la même valeur
      dice.forEach((die, index) => {
        if (results[index] == tripleValue) {
          die.classList.add("win")
        }
      })
    }
  } else {
    pastry = "Aucune pâtisserie gagnée"
    // Activer l'animation de tremblement
    shakeAnimation()
  }

  document.querySelector("p").textContent = `Pâtisserie gagnée : ${pastry}`
})

btnInfos.addEventListener("click", () => {
  rulesContainer.style.display = "block"
})

document.addEventListener("click", (event) => {
  if (!rulesContainer.contains(event.target) && event.target !== btnInfos) {
    rulesContainer.style.display = "none"
  }
})

function isYams(results) {
  const uniqueResults = [...new Set(results)]
  return uniqueResults.length === 1
}

function isCarré(results) {
  const counters = countOccurrences(results)
  return Object.values(counters).includes(4)
}

function isFull(results) {
  const counters = countOccurrences(results)
  return (
    Object.values(counters).includes(2) && Object.values(counters).includes(3)
  )
}

function isSuite(results) {
  const sortedResults = results.slice().sort((a, b) => a - b)
  for (let i = 0; i < sortedResults.length - 1; i++) {
    if (sortedResults[i] !== sortedResults[i + 1] - 1) {
      return false
    }
  }
  return true
}

function isTriple(results) {
  const counters = countOccurrences(results)
  return Object.values(counters).includes(3)
}

function countOccurrences(arr) {
  return arr.reduce((counters, result) => {
    counters[result] = (counters[result] || 0) + 1
    return counters
  }, {})
}

function getMostCommonValue(arr) {
  const counters = countOccurrences(arr)
  const maxCount = Math.max(...Object.values(counters))
  return parseInt(
    Object.keys(counters).find((key) => counters[key] === maxCount)
  )
}

function checkConsecutive(results) {
  const sortedResults = results.slice().sort((a, b) => a - b)
  for (let i = 0; i < sortedResults.length - 1; i++) {
    if (sortedResults[i + 1] - sortedResults[i] !== 1) {
      return false
    }
  }
  return true
}

function shakeAnimation() {
  document
    .querySelector(".game-container")
    .classList.add("win-animation", "active")
  setTimeout(() => {
    document
      .querySelector(".game-container")
      .classList.remove("win-animation", "active")
  }, 1000)
}

function confettiAnimation() {
  confettiSound.currentTime = 0
  confettiSound.play()
  dice.forEach((die, index) => {
    setTimeout(() => {
      die.src = `/dice${index + 1}.png`
    }, (index + 1) * 2000)
  })
  setTimeout(() => {
    dice.forEach((die) => {
      die.src = `/dice${Math.floor(Math.random() * 6) + 1}.png`
    })
  }, 1000)
}
