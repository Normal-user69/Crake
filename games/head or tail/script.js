var coinFlipButton = document.getElementById('coinFlipButton');
var outcome = document.querySelector('.outcome');
var historyBar = document.querySelector('.historyBar');
var restartButton = document.getElementById('restartButton');

function getRandomNumber() {
  return Math.floor(Math.random() * 2) + 1;
}

coinFlipButton.addEventListener('click', function() {
  var randomNumber = getRandomNumber();
  outcome.textContent = '';
  outcome.classList.toggle('flip');
  outcome.classList.add('toss');
  
  // Wait 0.8sec to display flip result
  setTimeout(function() {
    var result;
    if (randomNumber == 1) {
      result = 'heads';
    } else {
      result = 'tails';
    }
    outcome.textContent = result;
    historyBar.textContent += result + " | ";
    outcome.classList.remove('toss');
  }, 800);
});

restartButton.addEventListener('click', function() {
  historyBar.textContent = '';
  outcome.textContent = '';
  outcome.classList.remove('flip');
});
