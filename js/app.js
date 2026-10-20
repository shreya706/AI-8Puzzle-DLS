const DEFAULT_INITIAL_STATE = [
    2, 8, 3,
    1, 6, 4,
    7, 0, 5
];

const DEFAULT_GOAL_STATE = [
    1, 2, 3,
    8, 0, 4,
    7, 6, 5
];

let initialState = [...DEFAULT_INITIAL_STATE];
let goalState = [...DEFAULT_GOAL_STATE];
let depthLimit = 8;
document.addEventListener("DOMContentLoaded", initializeApplication);

function initializeApplication() {
    setupDepthSlider();
    setupButtons();
    setupVisualizationSpeed();
    setupPuzzleInputEditing();

    setPuzzleInputs("initialPuzzle", initialState);
    setPuzzleInputs("goalPreview", goalState);

    updateDepthDisplay();
    updateStatus("Ready to search", "ready");
    clearSearchResults();
    resetVisualizationDisplay();
}

function setupVisualizationSpeed() {
    const selector = document.getElementById("visualizationSpeed");

    selector?.addEventListener("change", () => {
        changeVisualizationSpeed(Number(selector.value));
    });
}

function setupDepthSlider() {
    const slider = document.getElementById("depthSlider");

    if (!slider) {
        return;
    }

    depthLimit = Number(slider.value);

    slider.addEventListener("input", () => {
        depthLimit = Number(slider.value);
        updateDepthDisplay();
    });
}

function setupButtons() {
    document
        .getElementById("randomPuzzle")
        ?.addEventListener("click", handleRandomPuzzle);

    document
        .getElementById("runDLS")
        ?.addEventListener("click", handleRunDLS);

    document
        .getElementById("resetSearch")
        ?.addEventListener("click", handleReset);

    document
        .getElementById("runVisualization")
        ?.addEventListener("click", startVisualization);

    document
        .getElementById("pauseVisualization")
        ?.addEventListener("click", stopVisualization);

    document
        .getElementById("previousStep")
        ?.addEventListener("click", previousVisualizationStep);

    document
        .getElementById("nextStep")
        ?.addEventListener("click", nextVisualizationStep);

    document
        .getElementById("resetVisualization")
        ?.addEventListener("click", resetVisualization);
}

function updateDepthDisplay() {
    const depthValue = document.getElementById("depthValue");
    const statusDepth = document.getElementById("statusDepth");
    const visualDepthLimit =
        document.getElementById("visualDepthLimit");

    if (depthValue) {
        depthValue.textContent = depthLimit;
    }

    if (statusDepth) {
        statusDepth.textContent = depthLimit;
    }

    if (visualDepthLimit) {
        visualDepthLimit.textContent = depthLimit;
    }
}

function setPuzzleInputs(containerId, state) {
    const container = document.getElementById(containerId);

    if (!container) {
        return;
    }

    const inputs = container.querySelectorAll("input");

    inputs.forEach((input, index) => {
        input.value = state[index];
        updateBlankInput(input);
    });
}

function updateBlankInput(input) {
    input.classList.toggle(
        "blank-input",
        input.value.trim() === "0"
    );
}

function setupPuzzleInputEditing() {
    document
        .querySelectorAll("#initialPuzzle input, #goalPreview input")
        .forEach(input => {
            input.addEventListener("input", () => {
                input.value = input.value
                    .replace(/[^0-8]/g, "")
                    .slice(0, 1);

                updateBlankInput(input);
            });
        });
}

function readPuzzleInputs(containerId) {
    const container = document.getElementById(containerId);

    if (!container) {
        return null;
    }

    const inputs = [...container.querySelectorAll("input")];

    if (inputs.length !== 9) {
        return null;
    }

    return inputs.map(input => {
        const value = input.value.trim();

        if (value === "") {
            return NaN;
        }

        return Number(value);
    });
}

function getCurrentPuzzleStates() {
    const newInitialState = readPuzzleInputs("initialPuzzle");
    const newGoalState = readPuzzleInputs("goalPreview");

    if (!newInitialState || !newGoalState) {
        return null;
    }

    initialState = newInitialState;
    goalState = newGoalState;

    return {
        initialState,
        goalState
    };
}

function handleRandomPuzzle() {
    const states = getCurrentPuzzleStates();

    if (!states || !isValidPuzzleState(goalState)) {
        updateStatus(
            "Enter a valid goal state before generating a random puzzle.",
            "error"
        );
        return;
    }

    initialState = generateRandomPuzzle(goalState, depthLimit);

    setPuzzleInputs("initialPuzzle", initialState);

    clearSearchResults();
    resetVisualizationDisplay();

    updateStatus(
        "Random puzzle generated within the selected depth limit.",
        "ready"
    );
}

function handleRunDLS() {
    const states = getCurrentPuzzleStates();

    if (!states) {
        updateStatus(
            "Unable to read the puzzle configuration.",
            "error"
        );
        return;
    }

    const slider = document.getElementById("depthSlider");

    if (slider) {
        depthLimit = Number(slider.value);
    }

    updateDepthDisplay();

    if (!isValidPuzzleState(initialState)) {
        updateStatus(
            "Initial state must contain digits 0–8 exactly once.",
            "error"
        );
        return;
    }

    if (!isValidPuzzleState(goalState)) {
        updateStatus(
            "Goal state must contain digits 0–8 exactly once.",
            "error"
        );
        return;
    }

    if (!isSolvable(initialState, goalState)) {
        updateStatus(
            "The initial state cannot reach this goal state.",
            "error"
        );
        return;
    }

    updateStatus(
        "Running Depth Limited Search...",
        "running"
    );

    const result = depthLimitedSearch(
        initialState,
        goalState,
        depthLimit
    );

    displaySearchResult(result);
    prepareVisualization(result);

    if (result.found) {
        updateStatus(
            `Solution found at depth ${result.solutionDepth}.`,
            "success"
        );
    } else if (result.result === "CUTOFF") {
        updateStatus(
            `Depth limit reached at ${result.maxDepth}.`,
            "warning"
        );
    } else {
        updateStatus(
            "No solution found within the selected depth.",
            "error"
        );
    }
}

function handleReset() {
    stopVisualization();

    initialState = [...DEFAULT_INITIAL_STATE];
    goalState = [...DEFAULT_GOAL_STATE];
    depthLimit = 8;
    const slider = document.getElementById("depthSlider");

    if (slider) {
        slider.value = depthLimit;
    }

    setPuzzleInputs("initialPuzzle", initialState);
    setPuzzleInputs("goalPreview", goalState);

    updateDepthDisplay();
    clearSearchResults();
    resetVisualizationDisplay();

    updateStatus(
        "Ready to search",
        "ready"
    );
}

function resetVisualization() {
    stopVisualization();

    currentStep = 0;

    if (searchHistory.length) {
        renderVisualizationStep(0);
    } else {
        resetVisualizationDisplay();
    }
}

function isValidPuzzleState(state) {
    if (!Array.isArray(state) || state.length !== 9) {
        return false;
    }

    if (state.some(value => !Number.isInteger(value))) {
        return false;
    }

    const sorted = [...state].sort((a, b) => a - b);

    return sorted.every(
        (value, index) => value === index
    );
}

function displaySearchResult(result) {
    setText(
        "resultStatus",
        result.found
            ? "SOLUTION FOUND"
            : result.result === "CUTOFF"
                ? "DEPTH LIMIT REACHED"
                : "NO SOLUTION FOUND"
    );

    setText(
        "resultDepth",
        result.solutionDepth ?? "—"
    );

    setText(
        "resultPathCost",
        result.pathCost ?? "—"
    );

    setText(
        "resultGenerated",
        result.generatedStates.length
    );

    setText(
        "resultExpanded",
        result.expandedStates.length
    );

    setText(
        "resultMaxDepth",
        result.maxDepth
    );

    setText(
        "resultCutoffs",
        result.cutoffCount
    );

    setText(
        "resultBacktracks",
        result.backtrackCount
    );

    setText(
        "resultTime",
        `${result.executionTime.toFixed(2)} ms`
    );

    setText(
        "memoryUsed",
        `${result.peakStackDepth} states`
    );

    setText(
        "solutionMoveCount",
        result.solutionDepth !== null
            ? `${result.solutionDepth} moves`
            : "—"
    );

    setText(
        "statusGenerated",
        result.generatedStates.length
    );

    setText(
        "statusExpanded",
        result.expandedStates.length
    );

    renderSolutionPath(result.solutionPath);
}

function renderSolutionPath(solutionPath) {
    const container = document.getElementById("solutionPath");

    if (!container) {
        return;
    }

    if (!solutionPath || !solutionPath.length) {
        container.innerHTML = `
            <p class="empty-message">
                No solution path available.
            </p>
        `;
        return;
    }

    container.innerHTML = `
        <div class="solution-animation">

            <div class="solution-animation-header">
                <span>SOLUTION ANIMATION</span>
                <strong id="animationStep">STEP 0</strong>
            </div>

            <div
                id="animatedSolutionBoard"
                class="animated-solution-board"
            ></div>

        </div>

        <div class="solution-path-static">
            ${solutionPath.map((node, index) => `
                <div class="solution-step">
                    <div class="solution-step-label">
                        ${
                            index === 0
                                ? "START"
                                : `MOVE ${index}: ${node.move}`
                        }
                    </div>

                    ${createPuzzleHTML(
                        node.state,
                        "solution-puzzle"
                    )}

                    <div class="solution-depth">
                        Depth ${node.depth}
                    </div>
                </div>

                ${
                    index < solutionPath.length - 1
                        ? `<div class="solution-arrow">→</div>`
                        : ""
                }
            `).join("")}
        </div>
    `;

    playSolutionAnimation(solutionPath);
}

let solutionAnimationTimer = null;

function playSolutionAnimation(solutionPath) {
    clearInterval(solutionAnimationTimer);

    const board = document.getElementById(
        "animatedSolutionBoard"
    );

    const stepLabel = document.getElementById(
        "animationStep"
    );

    if (!board || !solutionPath.length) {
        return;
    }

    let step = 0;

    function showStep() {
        const node = solutionPath[step];

        board.innerHTML = createPuzzleHTML(
            node.state,
            "animated-puzzle"
        );

        if (stepLabel) {
            stepLabel.textContent =
                step === 0
                    ? "STEP 0 · START"
                    : `STEP ${step} · ${node.move}`;
        }

        step++;
    }

    showStep();

    if (solutionPath.length === 1) {
        return;
    }

    solutionAnimationTimer = setInterval(() => {
        if (step >= solutionPath.length) {
            clearInterval(solutionAnimationTimer);
            solutionAnimationTimer = null;

            if (stepLabel) {
                stepLabel.textContent =
                    `STEP ${solutionPath.length - 1} · GOAL`;
            }

            return;
        }

        showStep();
    }, 900);
}

function clearSearchResults() {
    const resultIds = [
        "resultDepth",
        "resultPathCost",
        "resultGenerated",
        "resultExpanded",
        "resultMaxDepth",
        "resultCutoffs",
        "resultBacktracks",
        "resultTime",
        "memoryUsed"
    ];

    resultIds.forEach(id => {
        setText(id, "—");
    });

    setText("resultStatus", "READY");
    setText("solutionMoveCount", "—");
    setText("statusGenerated", "0");
    setText("statusExpanded", "0");

    const solutionPath =
        document.getElementById("solutionPath");

    if (solutionPath) {
        solutionPath.innerHTML = `
            <p class="empty-message">
                Run DLS to generate the solution path.
            </p>
        `;
    }
}

function updateStatus(message, type = "ready") {
    const status =
        document.getElementById("searchStatus");

    if (!status) {
        return;
    }

    status.textContent = message;
    status.className = `status-message ${type}`;
}

function setText(id, value) {
    const element = document.getElementById(id);

    if (element) {
        element.textContent = value;
    }
}
