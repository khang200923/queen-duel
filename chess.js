function getQueenMoves(queenPos, blocks) { // ChatGPT
    const directions = [
        { x: 1, y: 0 },   // Right
        { x: -1, y: 0 },  // Left
        { x: 0, y: 1 },   // Up
        { x: 0, y: -1 },  // Down
        { x: 1, y: 1 },   // Up-Right
        { x: 1, y: -1 },  // Down-Right
        { x: -1, y: 1 },  // Up-Left
        { x: -1, y: -1 }  // Down-Left
    ];

    const moves = [];
    const [x, y] = queenPos;

    for (const { x: dx, y: dy } of directions) {
        let nx = x;
        let ny = y;

        // Keep moving in this direction until we hit a block or the edge of the board
        while (true) {
            nx += dx;
            ny += dy;

            // Check if out of bounds
            if (nx < 0 || nx > 7 || ny < 0 || ny > 7) {
                break;
            }

            // Check if there's a block
            if (blocks[`${nx},${ny}`]) {
                break;
            }

            // If valid position, add to moves
            moves.push([nx, ny]);
        }
    }

    return moves;
}

function parsePos(pos) {
    return `${pos[0]},${pos[1]}`;
}

class Chess {
    constructor() {
        this.wPos = [4, 0];
        this.bPos = [3, 7];
        this.blocks = {};
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                this.blocks[`${i},${j}`] = false;
            }
        }
        this.wFirst = true;
    }

    move(pos) {
        if (this.wFirst) {this.blocks[parsePos(this.wPos)] = true; this.wPos = pos;}
        else {this.blocks[parsePos(this.bPos)] = true; this.bPos = pos;};
        this.wFirst = !this.wFirst;
    }

    undo(pos) {
        this.wFirst = !this.wFirst;
        if (this.wFirst) {this.wPos = pos; this.blocks[parsePos(this.wPos)] = false;}
        else {this.bPos = pos; this.blocks[parsePos(this.bPos)] = false;};
    }

    end() {
        if (this.possibles().length == 0) {return !this.wFirst}
        if (this.wPos[0] == this.bPos[0] && this.wPos[1] == this.bPos[1]) {return !this.wFirst}
        return null;
    }

    possibles() {
        if (this.wFirst) {return getQueenMoves(this.wPos, this.blocks);}
        else {return getQueenMoves(this.bPos, this.blocks);};
    }

    *iterNexts() {
        let possibles = this.possibles();
        if (possibles.length == 0) {
            return;
        }

        let undoPrep;
        if (this.wFirst) {undoPrep = this.wPos;}
        else {undoPrep = this.bPos;}
        for (let i = 0; i < possibles.length; i++) {
            this.move(possibles[i]);
            yield [this, possibles[i]];
            this.undo(undoPrep);
        }
    }

    visualize() { // ChatGPT
        const board = Array.from({ length: 8 }, () => Array(8).fill('.'));

        // Place the white queen
        board[this.wPos[1]][this.wPos[0]] = 'W';

        // Place the black queen
        board[this.bPos[1]][this.bPos[0]] = 'B';

        // Mark blocked positions
        // console.log("sdfgdkf");
        for (let key of Object.keys(this.blocks)) {
            let value = this.blocks[key];
            // console.log(key, value, "sdkf");
            if (value) {
                const [x, y] = key.split(',').map(Number);
                board[y][x] = 'x'; // 'x' indicates a blocked square
            }
        }

        // Print the board
        console.log(board.map(row => row.join(' ')).join('\n'));
    }
}
