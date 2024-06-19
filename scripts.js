const letters = document.querySelectorAll("[data-letter]");
const lifeElement = document.querySelector("[data-life]");
const winningContainer = document.querySelector("[data-winning-message]");
const contentMsg = document.querySelector("[data-message]");
const restartButton = document.querySelector("[data-restart]");
const player1 = document.querySelector("[player1]");
const scorePlayer1 = document.querySelector("[score-player1]");
const player2 = document.querySelector("[player2]");
const scorePlayer2 = document.querySelector("[score-player2]");

var player = 1;
var score1 = 0;
var score2 = 0;
var life = 10;
var firstCard = null;
var secondCard = null;
var lockBoard = false;
var cart = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
var lockCart = [];

function randomNumber() {
  var random = Math.floor(Math.random() * 20);

  while (lockCart.includes(random)) {
    random = Math.floor(Math.random() * 20);
  }

  lockCart.push(random);
  return cart[random];
}

function startGame() {
  player = 1;
  score1 = 0;
  score2 = 0;
  lockCart = [];
  life = 10;
  updateLife();
  winningContainer.style.display = "none";

  player1.classList.add("animation");
  player2.classList.remove("animation");
  scorePlayer1.innerText = `Score: ${score1}`;
  scorePlayer2.innerText = `Score: ${score2}`;

  letters.forEach((item) => {
    const random = randomNumber();
    item.innerText = `${random}`;
    item.classList.remove("letter-back");
  });

  setTimeout(() => {
    letters.forEach((item) => {
      item.classList.add("letter-back");
    });
  }, 1000);
}

function updateLife() {
  var i = life;
  lifeElement.textContent = "";

  for (i; i > 0; i--) {
    const heart = document.createElement("div");

    heart.innerHTML = `
            <img src="./assets/heart3.png" />
        `;

    lifeElement.appendChild(heart);
  }
}

function win() {
  winningContainer.style.display = "flex";
  contentMsg.innerText = "Parabéns você venceu!";
  restartButton.classList.add("win");
}

function lose() {
  winningContainer.style.display = "flex";
  contentMsg.innerText = "Perdeu otário haha!";
  restartButton.classList.add("lose");
}

function AllSelected() {
  return [...letters].every((item) => {
    return !item.classList.contains("letter-back");
  });
}

function checkForWinOrLose() {
  const won = AllSelected();
  const finish = AllSelected();

  // if (life == 0) {
  //   lose();
  // }

  // if (won) {
  //   win();
  // }

  if (finish) {
    winningContainer.style.display = "flex";
    restartButton.classList.add("win");

    if (score1 > score2) {
      contentMsg.innerText = "Player1 wins!!";
    } else if (score2 > score1) {
      contentMsg.innerText = "Player2 wins!!";
    } else {
      contentMsg.innerText = "Empate!!";
    }
  }
}

function resetBoard() {
  firstCard = null;
  secondCard = null;
  lockBoard = false;
}

function flipCard(item) {
  if (lockBoard) return;
  if (!item.classList.contains("letter-back")) return;

  item.classList.remove("letter-back");

  if (!firstCard) {
    firstCard = item;
  } else {
    secondCard = item;
    lockBoard = true;

    if (firstCard.innerText !== secondCard.innerText) {
      setTimeout(() => {
        firstCard.classList.add("letter-back");
        secondCard.classList.add("letter-back");
        resetBoard();
      }, 1000);

      changePlayer();
      life = life - 1;
    } else {
      firstCard.removeEventListener("click", flipCard);
      secondCard.removeEventListener("click", flipCard);
      resetBoard();
      pointsForPlayer();
    }

    updateLife();
    checkForWinOrLose();
  }
}

function pointsForPlayer() {
  if (player === 1) {
    score1++;
    scorePlayer1.innerText = `Score: ${score1}`;
  } else {
    score2++;
    scorePlayer2.innerText = `Score: ${score2}`;
  }
}

function changePlayer() {
  player = player === 1 ? 2 : 1;

  if (player === 1) {
    player1.classList.add("animation");
    player2.classList.remove("animation");
  } else {
    player1.classList.remove("animation");
    player2.classList.add("animation");
  }
}

startGame();

for (const letter of letters) {
  letter.addEventListener("click", () => {
    flipCard(letter);
  });
}

restartButton.addEventListener("click", startGame);
