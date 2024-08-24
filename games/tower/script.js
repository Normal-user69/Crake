const gameContainer = document.getElementById('game-container');

function createGrid(numRows, numCols, numCorrect) {
    gameContainer.innerHTML = ''; // Clear existing grid
    let correctIndices = []; // Store correct box indices for each row
    let first = true; // Boolean variable to track the first iteration
    let currentRow = numRows - 1; // Start with the last row enabled

    function createRow(rowIndex) {
        const row = document.createElement('div');
        row.classList.add('row');

        const correctIndicesForRow = new Set();
        while (correctIndicesForRow.size < numCorrect) {
            correctIndicesForRow.add(Math.floor(Math.random() * numCols));
        }
        correctIndices.push([...correctIndicesForRow]);

        for (let i = 0; i < numCols; i++) {
            const box = document.createElement('div');
            box.classList.add('box');
            box.textContent = i + 1;

            if (correctIndicesForRow.has(i)) {
                box.classList.add('correct'); // Add a special class for the correct boxes
            }

            box.addEventListener('click', () => {
                if (!first && rowIndex !== currentRow) {
                    return; // Prevent clicks on rows that are not active
                }

                if (correctIndicesForRow.has(i)) {
                    alert('Correct! Moving to the previous row.');
                    row.classList.add('disabled'); // Disable the current row
                    row.querySelectorAll('.box').forEach(box => box.style.backgroundColor = 'gray'); // Gray out entire row
                    box.style.backgroundColor = '#007bff'; // Highlight correct button with the specified blue color

                    if (rowIndex - 1 >= 0) {
                        currentRow = rowIndex - 1; // Move to the previous row
                        enableRow(currentRow); // Enable the previous row
                    } else {
                        alert('Congratulations! You won the game.');
                        showRestartButton(); // Show restart button after winning
                        highlightEndGame(); // Highlight correct and wrong buttons at the end
                    }
                } else {
                    alert('Wrong box!');
                    showAllRows(); // Reset all rows to default colors
                    box.style.backgroundColor = 'red'; // Highlight wrong button
                    showCorrectButtonsInAllRows(); // Show correct buttons in all rows
                    turnWrongButtonsGray(); // Turn wrong buttons gray
                    showRestartButton(); // Show restart button on wrong selection
                }
            });

            row.appendChild(box);
        }

        gameContainer.appendChild(row);

        if (rowIndex === numRows - 1) {
            first = false; // Set first to false after creating the last row
        }
        
        if (!first) {
            row.classList.add('inactive'); // Make all rows inactive initially except the last row
        }
    }

    function enableRow(rowIndex) {
        const rows = document.querySelectorAll('.row');
        if (rowIndex < rows.length) {
            rows[rowIndex].classList.remove('inactive'); // Enable the specified row
        }
    }

    function disableAllRows() {
        const rows = document.querySelectorAll('.row');
        rows.forEach(row => {
            row.classList.add('inactive'); // Disable clicking and visually indicate
        });
    }

    function disableAllButtons() {
        const boxes = document.querySelectorAll('.box');
        boxes.forEach(box => {
            box.style.pointerEvents = 'none'; // Disable all buttons
        });
    }

    function showAllRows() {
        const rows = document.querySelectorAll('.row');
        rows.forEach(row => {
            row.querySelectorAll('.box').forEach(box => {
                if (box.classList.contains('correct')) {
                    box.style.backgroundColor = '#007bff'; // Highlight correct buttons with the specified blue color
                } else {
                    box.style.backgroundColor = 'gray'; // Turn wrong buttons gray
                }
            });
        });
    }

    function showCorrectButtonsInAllRows() {
        const rows = document.querySelectorAll('.row');
        rows.forEach(row => {
            row.querySelectorAll('.box').forEach(box => {
                if (box.classList.contains('correct')) {
                    box.style.backgroundColor = '#007bff'; // Highlight correct buttons with the specified blue color
                }
            });
        });
    }

    function turnWrongButtonsGray() {
        const boxes = document.querySelectorAll('.box');
        boxes.forEach(box => {
            if (!box.classList.contains('correct')) {
                box.style.backgroundColor = 'gray'; // Turn wrong buttons gray
            }
        });
    }

    function highlightEndGame() {
        correctIndices.forEach((indices, rowIndex) => {
            const row = gameContainer.children[rowIndex];
            row.querySelectorAll('.box').forEach((box, boxIndex) => {
                if (indices.includes(boxIndex)) {
                    box.style.backgroundColor = '#007bff'; // Highlight correct buttons with the specified blue color
                } else {
                    box.style.backgroundColor = 'gray'; // Gray out incorrect buttons
                }
            });
        });
        disableAllButtons(); // Disable all buttons at the end of the game
    }

    function showRestartButton() {
        const restartButton = document.createElement('button');
        restartButton.textContent = 'Restart Game';
        restartButton.classList.add('restart-button');
        restartButton.addEventListener('click', () => {
            restartGame(); // Restart the game when button is clicked
        });
        gameContainer.appendChild(restartButton);
        disableAllButtons(); // Disable all buttons when restart button is shown
    }

    function restartGame() {
        gameContainer.innerHTML = ''; // Clear the game container
        createGrid(numRows, numCols, numCorrect); // Recreate the grid
    }

    // Initialize grid
    for (let r = 0; r < numRows; r++) {
        createRow(r);
    }

    disableAllRows(); // Initially disable all rows
    enableRow(currentRow); // Enable only the last row initially
}

// Start the game with user input
const numRows = parseInt(prompt('Enter the number of rows:', '2'));
const numCols = parseInt(prompt('Enter the number of columns:', '4'));
const numCorrect = parseInt(prompt('Enter the number of correct boxes per row:', '1'));
createGrid(numRows, numCols, numCorrect);
