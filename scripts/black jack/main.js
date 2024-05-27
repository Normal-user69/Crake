// Blackjack game logic
const suits = ['Hearts', 'Diamonds', 'Clubs', 'Spades'];
const values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'Jack', 'Queen', 'King', 'Ace'];
let deck = [];
let playerScore = 0;
let dealerScore = 0;
let flag = true;
let stand = true;
const numberDisplay = document.getElementById('number');
const dealerHandDisplay = document.getElementById('dealer-hand');
const resultDisplay = document.getElementById('result');
const wins = document.getElementById('wins');
const loss = document.getElementById('loss');

checkPlayerScore();
createDeck();
shuffleDeck();

document.getElementById('hit').addEventListener('click', () => {
    if (flag) {

        const playerCard = deck.pop();
        playerScore = parseInt(playerScore) + calculateScore(playerCard);


        const dealerCard = deck.pop();
        dealerScore = parseInt(dealerScore) + calculateScore(dealerCard);


        dealerHandDisplay.textContent = "dealer :" + parseInt(dealerScore);
        numberDisplay.textContent = "player :" + parseInt(playerScore);

        window.localStorage.playerScore = playerScore||0;
        window.localStorage.dealerScore = dealerScore||0;
        checkResult();
    }
});

document.getElementById('stand').addEventListener('click', () => {
    stands();
});

document.getElementById('reset').addEventListener('click', () => {
    if (!flag) {
        playerScore = 0;
        dealerScore = 0;
        stand = true;
        flag = true;
        createDeck();
        shuffleDeck();
        numberDisplay.textContent = "player :" + 0;
        dealerHandDisplay.textContent = "dealer :" + 0;
        resultDisplay.textContent = '';
    }
});

function calculateScore(card) {
    if (card.value === 'Jack' || card.value === 'Queen' || card.value === 'King') {
        return 10;
    } else if (card.value === 'Ace') {
        return 11;
    } else {
        return Number(card.value);
    }
}

function createDeck() {
    for (let suit of suits) {
        for (let value of values) {
            deck.push({ suit, value });
        }
    }
}

function shuffleDeck() {
    for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
    }
}

function checkPlayerScore() {

    wins.textContent = "Wins :" + window.localStorage.getItem("winScore")||0;
    loss.textContent = "Loss :" + window.localStorage.getItem("lossScore")||0;

    playerScore = window.localStorage.playerScore||0;
    dealerScore = window.localStorage.dealerScore||0;
    dealerHandDisplay.textContent = "dealer :" + parseInt(dealerScore)||0;
    numberDisplay.textContent = "player :" + parseInt(playerScore)||0;
}



/*----------------------------------------------------------------------------------------------------------*/


function checkResult() {
    const playerScoreInt = parseInt(playerScore);
    const dealerScoreInt = parseInt(dealerScore);
    let bet = parseInt(window.localStorage.bet);
    let money = parseInt(window.localStorage.money);
    let multiplier = parseInt(window.localStorage.multiplier);
    alert("money :"+money+"  bet:"+bet+"  multiplier:"+multiplier);
    if ((dealerScoreInt > 21 && playerScoreInt > 21) || (playerScoreInt === 21 && dealerScoreInt === 21)) {
        resultDisplay.textContent = 'Tie';
        flag = false;
        window.localStorage.setItem("winScore", parseFloat(window.localStorage.getItem("winScore")) + 0.5);
        checkPlayerScore();
    } else if (playerScoreInt === 21) {
        resultDisplay.textContent = 'Black Jack, You win!';
        flag = false;
        window.localStorage.setItem("winScore", parseFloat(window.localStorage.getItem("winScore")) + 1);
        checkPlayerScore();
    } else if (dealerScoreInt === 21) {
        resultDisplay.textContent = 'Black Jack, Dealer wins!';
        flag = false;
        window.localStorage.setItem("lossScore", parseFloat(window.localStorage.getItem("lossScore")) + 1);
        checkPlayerScore();
    } else if (dealerScoreInt > 21) {
        resultDisplay.textContent = 'Dealer busts, you win!';
        flag = false;
        window.localStorage.setItem("winScore", parseFloat(window.localStorage.getItem("winScore")) + 1);
        checkPlayerScore();
    } else if (playerScoreInt > 21) {
        resultDisplay.textContent = 'You busts, Dealer wins!';
        flag = false;
        window.localStorage.setItem("lossScore", parseFloat(window.localStorage.getItem("lossScore")) + 1);
        checkPlayerScore();
    }

    if (!flag) {
        window.localStorage.playerScore = 0;
        window.localStorage.dealerScore = 0;
        return true;
    }
    return false;
}


function stands() {
    const playerScoreInt = parseInt(playerScore);
    let dealerScoreInt = parseInt(dealerScore);
    if (stand)
        if (dealerScoreInt > playerScoreInt) {
            resultDisplay.textContent = 'Dealer wins!';
            window.localStorage.setItem("lossScore", parseFloat(window.localStorage.getItem("lossScore")) + 1);
            loss.textContent = "Loss :" + window.localStorage.getItem("lossScore");
            flag = false;
            checkResult();
            stand = false;
        
        
        /* The Upove is done */

        }else if (flag) {
        while (dealerScoreInt < 21) {
            const deal = deck.pop();
            dealerScoreInt += calculateScore(deal);
            dealerHandDisplay.textContent = "dealer :" + dealerScoreInt;

            if ((dealerScoreInt > playerScoreInt || dealerScoreInt == 21) && dealerScoreInt <= 21) {
                resultDisplay.textContent = 'Dealer wins!';
                window.localStorage.setItem("lossScore", parseFloat(window.localStorage.getItem("lossScore")) + 1);
                loss.textContent = "Loss :" + window.localStorage.getItem("lossScore");
                flag = false;
                checkResult();
                stand = false;
                break;
            }
        }
        if (dealerScoreInt > 21) {
            resultDisplay.textContent = 'Dealer busts, you win!';
            flag = false;
            window.localStorage.setItem("winScore", parseFloat(window.localStorage.getItem("winScore")) + 1);
            wins.textContent = "Wins :" + window.localStorage.getItem("winScore");
            checkResult();
        }
    }
}

