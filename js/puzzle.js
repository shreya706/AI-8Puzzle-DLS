const DEFAULT_GOAL = [
    1, 2, 3,
    8, 0, 4,
    7, 6, 5
];

function stateToKey(state) {
    return state.join(",");
}

function statesEqual(a, b) {
    return a.length === b.length &&
        a.every((value, index) => value === b[index]);
}

function findBlank(state) {
    return state.indexOf(0);
}

function getPossibleMoves(blankIndex) {
    const row = Math.floor(blankIndex / 3);
    const col = blankIndex % 3;
    const moves = [];

    if (row > 0) {
        moves.push({
            name: "UP",
            index: blankIndex - 3
        });
    }

    if (row < 2) {
        moves.push({
            name: "DOWN",
            index: blankIndex + 3
        });
    }

    if (col > 0) {
        moves.push({
            name: "LEFT",
            index: blankIndex - 1
        });
    }

    if (col < 2) {
        moves.push({
            name: "RIGHT",
            index: blankIndex + 1
        });
    }

    return moves;
}

function generateSuccessors(state) {
    const blankIndex = findBlank(state);

    return getPossibleMoves(blankIndex).map(move => {
        const newState = [...state];

        [newState[blankIndex], newState[move.index]] =
            [newState[move.index], newState[blankIndex]];

        return {
            state: newState,
            move: move.name
        };
    });
}

function isGoal(state, goal) {
    return statesEqual(state, goal);
}

function countInversions(state) {
    const values = state.filter(value => value !== 0);
    let inversions = 0;

    for (let i = 0; i < values.length; i++) {
        for (let j = i + 1; j < values.length; j++) {
            if (values[i] > values[j]) {
                inversions++;
            }
        }
    }

    return inversions;
}

function isSolvable(state, goal = DEFAULT_GOAL) {
    return countInversions(state) % 2 ===
        countInversions(goal) % 2;
}

function generateRandomPuzzle(goal = DEFAULT_GOAL) {
    let puzzle;

    do {
        puzzle = [0, 1, 2, 3, 4, 5, 6, 7, 8];

        for (let i = puzzle.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));

            [puzzle[i], puzzle[j]] =
                [puzzle[j], puzzle[i]];
        }
    } while (!isSolvable(puzzle, goal));

    return puzzle;
}

function formatState(state) {
    return state
        .map(value => value === 0 ? "_" : value)
        .join(" ");
}