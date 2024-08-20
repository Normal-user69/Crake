const gameContainer = document.getElementById('game-container');

function createGrid(numRows, numCols) {
    gameContainer.innerHTML = ''; // Clear existing grid
    let correctIndices = []; // Store correct box indices for each row
    let first = true; // Boolean variable to track the first iteration
    let currentRow = numRows - 1; // Start with the last row enabled

    function createRow(rowIndex) {
        const row = document.createElement('div');
        row.classList.add('row');

        const correctIndex = Math.floor(Math.random() * numCols);
        correctIndices.push(correctIndex);

        for (let i = 0; i < numCols; i++) {
            const box = document.createElement('div');
            box.classList.add('box');
            box.textContent = i + 1;

            if (i === correctIndex) {
                box.classList.add('correct'); // Add a special class for the correct box
            }

            box.addEventListener('click', () => {
                if (!first && rowIndex !== currentRow) {
                    return; // Prevent clicks on rows that are not active
                }

                if (i === correctIndex) {
                    alert('Correct! Moving to previous row.');
                    row.classList.add('disabled'); // Disable the current row
                    if (rowIndex - 1 >= 0) {
                        currentRow = rowIndex - 1; // Move to the previous row
                        enableRow(currentRow); // Enable the previous row
                    } else {
                        alert('Congratulations! You won the game.');
                    }
                } else {
                    alert('Wrong box! Try again.');
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
createGrid(numRows, numCols);
