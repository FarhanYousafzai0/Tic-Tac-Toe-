let boxes = document.querySelectorAll('.box');
let resetBtn = document.querySelector('.btn-reset');
let replayBtn = document.querySelector('.btn-replay');
let msg = document.querySelector('.msg');
let turnIndicator = document.querySelector('.turn-indicator');
let timerDisplay = document.querySelector('#time-left');
let historyList = document.querySelector('#history-list');
let clickSound = document.querySelector('#click-sound');
let winSound = document.querySelector('#win-sound');
let drawSound = document.querySelector('#draw-sound');

let scores = { X: 0, O: 0 };
let turnO = false;
let moves = [];
let timeLeft = 10;
let timer;

const winningPatterns = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
];

const resetGame = () => {
    turnO = false;
    enableBoxes();
    msg.classList.add('hide');
    msg.innerText = '';
    moves = [];
    clearInterval(timer);
    startTimer();
    updateTurnIndicator();
};

const enableBoxes = () => {
    boxes.forEach(box => {
        box.disabled = false;
        box.innerText = '';
        box.classList.remove('winner');
    });
};

const disableBoxes = () => {
    boxes.forEach(box => {
        box.disabled = true;
    });
};

const updateTurnIndicator = () => {
    turnIndicator.innerText = `Turn: ${turnO ? "O" : "X"}`;
    turnIndicator.style.color = turnO ? "blue" : "red";
};

const startTimer = () => {
    timeLeft = 10;
    timerDisplay.innerText = timeLeft;
    clearInterval(timer);
    timer = setInterval(() => {
        timeLeft--;
        timerDisplay.innerText = timeLeft;
        if (timeLeft === 0) {
            clearInterval(timer);
            turnO = !turnO;
            updateTurnIndicator();
            startTimer();
        }
    }, 1000);
};

const checkWinner = () => {
    for (let pattern of winningPatterns) {
        let [a, b, c] = pattern;
        if (boxes[a].innerText && boxes[a].innerText === boxes[b].innerText && boxes[a].innerText === boxes[c].innerText) {
            highlightWinner(pattern);
            winnerMessage(boxes[a].innerText);
            addToHistory(boxes[a].innerText);
            clearInterval(timer);
            return;
        }
    }
    if (Array.from(boxes).every(box => box.innerText !== "")) {
        msg.classList.remove('hide');
        msg.innerText = "It's a Draw! 🤝";
        drawSound.play();
        addToHistory(null);
        disableBoxes();
        clearInterval(timer);
    }
};

const highlightWinner = (pattern) => {
    pattern.forEach(index => boxes[index].classList.add('winner'));
};

const winnerMessage = (winner) => {
    msg.classList.remove('hide');
    msg.innerText = `${winner} Wins the Game! 🏆`;
    winSound.play();
    disableBoxes();
    scores[winner]++;
    document.querySelector(`#score-${winner.toLowerCase()}`).innerText = scores[winner];
};

const addToHistory = (winner) => {
    const listItem = document.createElement('li');
    listItem.innerText = winner ? `${winner} won the game!` : "It's a draw!";
    historyList.appendChild(listItem);
};

const replayGame = () => {
    enableBoxes();
    moves.forEach((move, i) => {
        setTimeout(() => {
            boxes[move.index].innerText = move.value;
        }, i * 1000);
    });
};

boxes.forEach((box, index) => {
    box.addEventListener('click', () => {
        if (box.innerText === "") {
            clickSound.play();
            box.innerText = turnO ? "O" : "X";
            moves.push({ index, value: box.innerText });
            turnO = !turnO;
            updateTurnIndicator();
            checkWinner();
        }
    });
});

resetBtn.addEventListener('click', resetGame);
replayBtn.addEventListener('click', replayGame);

resetGame();
