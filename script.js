const wordDisplay = document.getElementById("word-display");
const wordInput = document.getElementById("word-input");
const scoreDisplay = document.getElementById("score-value");
const tpsDisplay = document.getElementById("tps-value");
const timeDisplay = document.getElementById("time-left");
const startButton = document.getElementById("start-btn");
const resultMessage = document.getElementById("result-message");
const modeSelect = document.getElementById("mode-select");
const menuToggle = document.getElementById("menu-toggle");
const sideMenu = document.getElementById("side-menu");
const closeMenuButton = document.getElementById("close-menu");
const darkModeToggle = document.getElementById("dark-mode-toggle");
const livesDisplay = document.getElementById("lives-value");
const livesContainer = document.getElementById("lives");
const currentModeDisplay = document.getElementById("current-mode-display");
const multiplierDisplay = document.getElementById("multiplier");

let words = ["javascript", "developer", "framework", "performance", "syntax", "debugging", "algorithm", "data"];
let currentWord = "";
let score = 0;
let timeLeft = 60;
let totalWordsTyped = 0;
let isPlaying = false;
let tps = 0;
let gameMode = "60s"; // Default mode
let gameInterval;
let lives = 3; // Default lives for challenge modes
let multiplier = 1; // Multiplier starts at 1
let zenTimer; // Timer for Zen mode

// Mode descriptions
const modeDescriptions = {
    "60s": "60-Second Mode",
    "10s": "10-Second Challenge Mode",
    "5s-lives": "5-Second Challenge Mode with Lives",
    "3s-lives": "3-Second Challenge Mode with Lives",
    "7s-lives": "7-Second Challenge Mode with Lives",
    "2s-lives": "2-Second Challenge Mode with Lives",
    "hard": "Hard Mode",
    "extreme": "Extreme Mode",
    "zen": "Zen Mode",
    "sudden-death": "Sudden Death Mode"
};

function updateModeDisplayAndTimer() {
    currentModeDisplay.textContent = `Mode: ${modeDescriptions[gameMode]}`;
    
    switch(gameMode) {
        case "60s":
            timeLeft = 60;
            livesContainer.style.display = "none";
            break;
        case "10s":
            timeLeft = 10;
            livesContainer.style.display = "none";
            break;
        case "5s-lives":
        case "3s-lives":
        case "7s-lives":
        case "2s-lives":
            timeLeft = parseInt(gameMode.split('-')[0].slice(0, 1)); // Extract the number for the time limit
            livesContainer.style.display = "block";
            livesDisplay.textContent = 3;
            break;
        case "hard":
            timeLeft = 20; // Hard mode time
            livesContainer.style.display = "none";
            break;
        case "extreme":
            timeLeft = 10; // Extreme mode time
            livesContainer.style.display = "none";
            break;
        case "zen":
            livesContainer.style.display = "none"; // No lives in Zen mode
            break;
        case "sudden-death":
            livesContainer.style.display = "block"; // One life
            livesDisplay.textContent = 1;
            break;
    }
    timeDisplay.textContent = timeLeft;
}

function startGame() {
    score = 0;
    totalWordsTyped = 0;
    tps = 0;
    isPlaying = true;
    wordInput.value = "";
    resultMessage.textContent = "";
    wordInput.disabled = false;
    wordInput.focus();
    startButton.disabled = false; // Allow starting a new game
    startButton.textContent = "Playing...";
    lives = 3;
    livesDisplay.textContent = lives;

    multiplier = 1; // Reset multiplier
    multiplierDisplay.textContent = `Multiplier: x${multiplier}`;

    gameMode = modeSelect.value;
    updateModeDisplayAndTimer();
    
    nextWord();

    if (gameMode === "zen") {
        zenMode();
    } else {
        gameInterval = setInterval(() => {
            if (timeLeft > 0 && isPlaying) {
                timeLeft--;
                timeDisplay.textContent = timeLeft;
                updateTPS();

                if (gameMode === "sudden-death" && timeLeft === 0) {
                    endGame();
                }
            } else if (timeLeft === 0) {
                clearInterval(gameInterval);
                endGame();
            }
        }, 1000);
    }
}

function zenMode() {
    // No time limit in Zen mode; player must type a word within 3 seconds
    zenTimer = setInterval(() => {
        if (isPlaying) {
            endGame();
        }
    }, 3000);
}

function endGame() {
    isPlaying = false;
    wordInput.disabled = true;
    clearInterval(gameInterval);
    clearInterval(zenTimer); // Clear Zen mode timer if active
    startButton.disabled = false;
    startButton.textContent = "Start Game";
    resultMessage.textContent = `Game Over! Final Score: ${score} | TPS: ${tps.toFixed(2)}`;
}

function nextWord() {
    currentWord = words[Math.floor(Math.random() * words.length)];
    wordDisplay.textContent = currentWord;
}

function updateTPS() {
    tps = totalWordsTyped / (60 - timeLeft);
    tpsDisplay.textContent = tps.toFixed(2);
}

wordInput.addEventListener("input", () => {
    if (wordInput.value.trim() === currentWord) {
        totalWordsTyped++;
        score += multiplier; // Apply multiplier to the score
        scoreDisplay.textContent = score;

        multiplier++; // Increment multiplier for every correct word
        multiplierDisplay.textContent = `Multiplier: x${multiplier}`;

        wordInput.value = "";
        
        if (gameMode === "zen") {
            // Reset the timer in Zen mode
            clearInterval(zenTimer);
            zenTimer = setInterval(() => {
                endGame();
            }, 3000);
        } else {
            timeLeft = parseInt(gameMode.split('-')[0].slice(0, 1)); // Reset time in challenge modes
        }

        nextWord();
        updateTPS();
    }
});

startButton.addEventListener("click", startGame);

// Change mode event listener
modeSelect.addEventListener("change", () => {
    gameMode = modeSelect.value;
    updateModeDisplayAndTimer();
});

// Toggle Side Menu
menuToggle.addEventListener("click", () => {
    sideMenu.style.width = "250px";
});
closeMenuButton.addEventListener("click", () => {
    sideMenu.style.width = "0";
});

// Toggle Dark Mode
darkModeToggle.addEventListener("change", (e) => {
    document.body.classList.toggle("dark-mode", e.target.checked);
});

// Disable copy-paste to prevent cheating
wordInput.addEventListener('paste', (e) => e.preventDefault());
wordInput.addEventListener('copy', (e) => e.preventDefault());
wordInput.addEventListener('contextmenu', (e) => e.preventDefault());
