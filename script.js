var chess = new Chess();

const delay = ms => new Promise(res => setTimeout(res, ms));

function getLargestKeySmallerThan(num, dict) { // ChatGPT
    // Get all the keys from the dictionary and sort them in descending order
    const keys = Object.keys(dict).map(Number).sort((a, b) => b - a);

    // Find the largest key smaller than num
    for (const key of keys) {
        if (key < num) {
            return dict[key];
        }
    }

    // Return undefined if no key is smaller than num
    return undefined;
}

async function callUntilTimeout(f, maxTime) { // ChatGPT
    let n = 1; // Start with n = 1
    let lastResult;
    let startTime = performance.now();

    while (true) {
        let currentTime = performance.now();
        if (currentTime - startTime > maxTime) { // Check if time exceeds maxTime
            break; // Exit loop if time exceeds maxTime
        }

        lastResult = f(n);
        n++; // Increment n for next call
    }

    return lastResult; // Return the last computed result
}

const variableDepths = {
    48: 3,
    32: 4,
    21: 5,
    15: 6,
    8: 7,
    0: 8,
}

async function render() {
    let boardNode = document.getElementById("chess-board");
    boardNode.innerHTML = "";
    let tableBody = document.createElement("tbody");
    for (let i = 7; i >= 0; i--) {
        tableRow = document.createElement("tr");
        for (let j = 0; j < 8; j++) {
            tableCell = document.createElement("td");
            tableCell.id = `${j},${i}`;
            if (chess.blocks[tableCell.id]) {tableCell.innerText = "❌";};
            if (chess.wPos[0] == j && chess.wPos[1] == i) {tableCell.innerText = "♕";};
            if (chess.bPos[0] == j && chess.bPos[1] == i) {tableCell.innerText = "♛";};
            if (chess.end() != null) {
                if (chess.end() && chess.wPos[0] == j && chess.wPos[1] == i) {tableCell.innerText = "♕";}
                if ((!chess.end()) && chess.bPos[0] == j && chess.bPos[1] == i) {tableCell.innerText = "♛";};
            }
            if (chess.possibles().map((x) => `${x[0]},${x[1]}`).includes(tableCell.id)) {
                tableCell.classList.add("mov");
                tableCell.onclick = async function() {
                    if (chess.end() != null) {return;}
                    chess.move([j, i]);
                    await render();
                    if (chess.end() != null) {return;}
                    await delay(50);
                    let botMove = await callUntilTimeout((n) => optimize(n, chess), 250);
                    chess.move(botMove);
                    await render();
                }
            };
            if ((i+j) % 2 == 1) {tableCell.classList.add("light");}
            else {tableCell.classList.add("dark");}
            tableRow.appendChild(tableCell);
        }
        tableBody.appendChild(tableRow);
    }
    boardNode.appendChild(tableBody);
}

window.onload = function() {
    render()
}
