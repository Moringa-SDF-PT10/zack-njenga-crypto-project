const startBtn = document.getElementById('start-btn');
const challengeContainer = document.getElementById('challenge-container');
const summaryContainer = document.getElementById('summary-container');
const hintsDiv = document.getElementById('hints');
const feedbackDiv = document.getElementById('feedback');
const submitBtn = document.getElementById('submit-btn');
const guessInput = document.getElementById('guess-input');
const hintTitle = document.getElementById('hint-title');
const summary = document.getElementById('summary');
const restartBtn = document.getElementById('restart-btn');

let allCoins = [];
let currentCoin = null;
let round = 1;
let correctGuesses = 0;
let revealedCoins = [];


fetch("https://api.coinpaprika.com/v1/coins")
    .then(response => response.json())
    .then(data => {
        allCoins = data.filter(coin => coin.is_active && coin.rank); // Only active coins with rank
    });


startBtn.addEventListener('click', () => {
    startBtn.style.display = 'none';
    challengeContainer.style.display = 'block';
    startRound();
});


function startRound() {
    feedbackDiv.innerHTML = '';
    guessInput.value = '';

   
    const randomIndex = Math.floor(Math.random() * allCoins.length);
    currentCoin = allCoins[randomIndex];

  
    fetch(`https://api.coinpaprika.com/v1/tickers/${currentCoin.id}`)
        .then(response => response.json())
        .then(data => {
            displayHints(data);
        });
}


function displayHints(coinDetails) {
    const hints = [
        `Symbol: ${coinDetails.symbol}`,
        `Rank: ${coinDetails.rank}`,
        `Current Price (USD): $${coinDetails.quotes.USD.price.toFixed(2)}`,
        `Market Cap: $${coinDetails.quotes.USD.market_cap.toLocaleString()}`,
        `First Letter: ${currentCoin.name.charAt(0)}`,
        currentCoin.started_at ? `Launch Year: ${new Date(currentCoin.started_at).getFullYear()}` : `Launch Year: Unknown`
    ];

    hintsDiv.innerHTML = hints.map(hint => `<p>${hint}</p>`).join('');
}


submitBtn.addEventListener('click', () => {
    const userGuess = guessInput.value.trim().toLowerCase();
    if (userGuess === currentCoin.name.toLowerCase()) {
        correctGuesses++;
        feedbackDiv.innerHTML = `<p style="color: green;">Correct! The coin is ${currentCoin.name}.</p>`;
    } else {
        feedbackDiv.innerHTML = `<p style="color: red;">Incorrect. The correct answer was ${currentCoin.name}.</p>`;
    }

    revealedCoins.push(currentCoin.name);

    if (round < 3) {
        round++;
        hintTitle.innerText = `Round ${round}: Guess the Coin`;
        startRound();
    } else {
        endGame();
    }
});


function endGame() {
    challengeContainer.style.display = 'none';
    summaryContainer.style.display = 'block';

    const results = `
        You guessed correctly ${correctGuesses} out of 3 rounds.<br>
        Revealed Coins: ${revealedCoins.join(', ')}
    `;
    summary.innerHTML = results;
}


restartBtn.addEventListener('click', () => {
    round = 1;
    correctGuesses = 0;
    revealedCoins = [];
    summaryContainer.style.display = 'none';
    startBtn.style.display = 'block';
});