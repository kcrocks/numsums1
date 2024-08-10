document.addEventListener('DOMContentLoaded', function () {
    const cells = document.querySelectorAll('.cell');
    const checkButton = document.getElementById('check-button');
    const message = document.getElementById('message');
    const movesDisplay = document.getElementById('moves');
    let moves = 0;

    // Initialize the grid with random numbers
    const grid = [
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 0]
    ];

    const maxCellValue = 9; // Maximum value for any cell

    // Fill the grid with random numbers
    for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 3; col++) {
            grid[row][col] = Math.floor(Math.random() * maxCellValue) + 1;
        }
    }

    // Calculate the totals with excess values
    function calculateTotalsWithExcess(grid) {
        const rowTotals = [0, 0, 0];
        const colTotals = [0, 0, 0];

        for (let row = 0; row < 3; row++) {
            for (let col = 0; col < 3; col++) {
                rowTotals[row] += grid[row][col];
                colTotals[col] += grid[row][col];
            }
        }

        // Increase totals by randomly removing numbers
        for (let i = 0; i < 3; i++) {
            let rowToRemove = Math.floor(Math.random() * 3);
            let colToRemove = Math.floor(Math.random() * 3);
            const valueToRemove = grid[rowToRemove][colToRemove];

            // Adjust totals to create the challenge
            rowTotals[rowToRemove] -= valueToRemove;
            colTotals[colToRemove] -= valueToRemove;
        }

        return { rowTotals, colTotals };
    }

    const { rowTotals, colTotals } = calculateTotalsWithExcess(grid);

    // Set the grid numbers and totals in the DOM
    cells.forEach(cell => {
        const row = parseInt(cell.dataset.row) - 1;
        const col = parseInt(cell.dataset.col) - 1;
        const value = grid[row][col];

        cell.textContent = value;
        cell.dataset.originalValue = cell.textContent;
        cell.dataset.currentValue = cell.textContent;

        cell.addEventListener('click', () => {
            // Toggle the cell's content between its original value and empty
            if (cell.textContent !== '') {
                cell.dataset.currentValue = cell.textContent; // Save current value before clearing
                cell.textContent = ''; // Clear the cell
                cell.classList.add('empty');
            } else {
                cell.textContent = cell.dataset.currentValue || cell.dataset.originalValue; // Restore the value
                cell.classList.remove('empty');
            }
            moves++; // Increment the moves counter
            movesDisplay.textContent = `Moves: ${moves}`; // Update the display
        });
    });

    // Set the totals in the DOM
    for (let i = 0; i < 3; i++) {
        document.getElementById(`row-total-${i + 1}`).textContent = rowTotals[i];
        document.getElementById(`col-total-${i + 1}`).textContent = colTotals[i];
    }

    // Function to check if the current solution is valid
    checkButton.addEventListener('click', checkSolution);

    function checkSolution() {
        let valid = true;

        // Check row totals
        for (let row = 1; row <= 3; row++) {
            let rowTotal = 0;
            for (let col = 1; col <= 3; col++) {
                const cell = document.querySelector(`.cell[data-row='${row}'][data-col='${col}']`);
                rowTotal += cell.textContent ? parseInt(cell.textContent) : 0;
            }
            if (rowTotal !== parseInt(document.getElementById(`row-total-${row}`).textContent)) {
                valid = false;
                break;
            }
        }

        // Check column totals
        for (let col = 1; col <= 3; col++) {
            let colTotal = 0;
            for (let row = 1; row <= 3; row++) {
                const cell = document.querySelector(`.cell[data-row='${row}'][data-col='${col}']`);
                colTotal += cell.textContent ? parseInt(cell.textContent) : 0;
            }
            if (colTotal !== parseInt(document.getElementById(`col-total-${col}`).textContent)) {
                valid = false;
                break;
            }
        }

        message.textContent = valid ? 'Congratulations! Solution is correct!' : 'Try again!';
    }
});
