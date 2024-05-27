const multDisplay = document.getElementById('mult');
let money = parseInt(window.localStorage.getItem("money")) || 100; // Initial money
let bet = parseInt(window.localStorage.getItem("bet")) || 0; // Initial bet
const moneyDisplay = document.getElementById('money');
const betDisplay = document.getElementById('bet');


moneyDisplay.textContent = "Balance: " + money + " $";
betDisplay.textContent = "Current Bet: " + bet + " $";

function updateDisplays() {
    window.localStorage.setItem("money", money);
    window.localStorage.setItem("bet", bet);
    moneyDisplay.textContent = "Balance: " + parseInt(window.localStorage.getItem("money")) + " $";
    betDisplay.textContent = "Current Bet: " + parseInt(window.localStorage.getItem("bet")) + " $";
}

document.getElementById('add').addEventListener('click', () => {
    const input = parseInt(prompt("Enter your bet:"));
    if (!isNaN(input) && input > 0 && input <= money) {
        money += bet;
        bet = input;
        money -= bet;
        window.localStorage.money = money;
        window.localStorage.bet = bet;
        updateDisplays();
    } else {
        alert("Invalid input or not enough money!");
    }
});

function calculateMultiplier(bet) {
    if (bet >= 400) return 5;
    if (bet >= 200) return 4;
    if (bet >= 100) return 3;
    if (bet >= 10) return 2;
    if (bet < 10) return 1;
    return 1;
}

function updateMultiplier(bet) {
    const multiplier = calculateMultiplier(bet);
    multDisplay.textContent = "Multiplay: x" + multiplier;
    window.localStorage.multiplier = multiplier;
}

updateMultiplier(bet);

document.getElementById('by2').addEventListener('click', () => {
    bet = parseInt(window.localStorage.bet);
    if (money >= 2) {
        bet += 2;
        money -= 2;
        updateDisplays();
        updateMultiplier(bet);
        window.localStorage.money = money;
        window.localStorage.bet = bet;
    } else {
        alert("Not enough money!");
    }
});

document.getElementById('div2').addEventListener('click', () => {
    bet = parseInt(window.localStorage.bet);
    if (bet >= 2) {
        bet -= 2;
        money += 2;
        updateDisplays();
        updateMultiplier(bet);
        window.localStorage.money = money;
        window.localStorage.bet = bet;
    } else {
        alert("Bet cannot be less than 2!");
    }
});

document.getElementById('clear').addEventListener('click', () => {
    bet = parseInt(window.localStorage.bet);
    money += bet;
    bet = 0;
    updateDisplays();
    updateMultiplier(bet);
    window.localStorage.money = money;
    window.localStorage.bet = bet;
});
