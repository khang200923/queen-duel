INF = 1000000000000000;

function heuristic(chess) {
    if (chess.end() === true) {return INF;};
    if (chess.end() === false) {return -INF;};
    return getQueenMoves(chess.wPos, chess.blocks).length - getQueenMoves(chess.bPos, chess.blocks).length;
}

// function minimax(depth, chess) {
//     if (chess.end() != null || depth <= 0) {return heuristic(chess);};
//     if (chess.wFirst) {
//         let maxRes = -INF;
//         let ite = chess.iterNexts();
//         for (let nex = ite.next(); nex.value !== undefined; nex = ite.next()) {
//             alt = minimax(depth-1, nex.value[0]);
//             maxRes = Math.max(maxRes, alt);
//         }
//         return maxRes;
//     }
//     else {
//         let minRes = INF;
//         let ite = chess.iterNexts();
//         for (let nex = ite.next(); nex.value !== undefined; nex = ite.next()) {
//             alt = minimax(depth-1, nex.value[0]);
//             minRes = Math.min(minRes, alt);
//         }
//         return minRes;
//     }
// }

function minimax(depth, chess, alpha = -INF, beta = INF) {
    if (chess.end() != null || depth <= 0) { return heuristic(chess); }

    if (chess.wFirst) {
        let maxRes = -INF;
        let ite = chess.iterNexts();
        for (let nex = ite.next(); nex.value !== undefined; nex = ite.next()) {
            if (beta <= alpha) {
                continue;
            }
            let alt = minimax(depth - 1, nex.value[0], alpha, beta);
            maxRes = Math.max(maxRes, alt);
            alpha = Math.max(alpha, maxRes);
        }
        return maxRes;
    } else {
        let minRes = INF;
        let ite = chess.iterNexts();
        for (let nex = ite.next(); nex.value !== undefined; nex = ite.next()) {
            if (beta <= alpha) {
                continue;
            }
            let alt = minimax(depth - 1, nex.value[0], alpha, beta);
            minRes = Math.min(minRes, alt);
            beta = Math.min(beta, minRes);
        }
        return minRes;
    }
}


function optimize(depth, chess) {
    if (chess.wFirst) {
        let maxRes = -INF*2;
        let ite = chess.iterNexts();
        let move;
        for (let nex = ite.next(); nex.value !== undefined; nex = ite.next()) {
            alt = minimax(depth-1, nex.value[0]);
            if (alt > maxRes) {move = nex.value[1];};
            maxRes = Math.max(maxRes, alt);
        }
        return move;
    }
    else {
        let minRes = INF*2;
        let ite = chess.iterNexts();
        let move;
        for (let nex = ite.next(); nex.value !== undefined; nex = ite.next()) {
            alt = minimax(depth-1, nex.value[0]);
            if (alt < minRes) {move = nex.value[1];};
            minRes = Math.min(minRes, alt);
        }
        return move;
    }
}
