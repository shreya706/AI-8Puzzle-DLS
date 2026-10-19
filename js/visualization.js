let searchHistory = [];
let currentStep = 0;
let visualizationTimer = null;

let visualizationSpeed = 750;

function prepareVisualization(result) {
    searchHistory = result.events || [];
    currentStep = 0;

    stopVisualization();

    if (searchHistory.length) {
        renderVisualizationStep(0);
    } else {
        resetVisualizationDisplay();
    }
}

function renderVisualizationStep(index) {
    if (
        !searchHistory.length ||
        index < 0 ||
        index >= searchHistory.length
    ) {
        return;
    }

    currentStep = index;

    const event = searchHistory[index];

    renderCurrentNode(event);
    renderSearchStack(event);
    renderSuccessors(event);
    renderEventDetails(event);
    updateMetrics(event);
    updateStepIndicator(index + 1, searchHistory.length);
}

function renderCurrentNode(event) {
    const box = document.getElementById("currentNodeBoard");

    if (!box) {
        return;
    }

    if (!event.node) {
        box.innerHTML =
            `<p class="empty-message">No current node.</p>`;
        return;
    }

    box.innerHTML = createPuzzleHTML(
        event.node.state,
        getEventPuzzleClass(event.type)
    );
}

function renderSearchStack(event) {
    const box = document.getElementById("frontierList");

    if (!box) {
        return;
    }

    const stack = event.stack || [];

    if (!stack.length) {
        box.innerHTML =
            `<div class="empty-message">Search stack is empty.</div>`;
        return;
    }

    box.innerHTML = [...stack]
        .reverse()
        .map((node, index) => `
            <div class="state-list-item ${
                index === 0 && event.type !== "BACKTRACK"
                    ? "current-stack-item"
                    : ""
            }">
                <span>${node.depth}</span>
                <strong>${formatState(node.state)}</strong>
                <small>
                    ${
                        node.depth === event.depth
                            ? "CURRENT"
                            : `Depth ${node.depth}`
                    }
                </small>
            </div>
        `)
        .join("");
}

function renderExplored() {
    const box = document.getElementById("exploredList");

    if (!box) {
        return;
    }

    const expanded = searchHistory
        .slice(0, currentStep + 1)
        .filter(event =>
            event.type === "EXPAND" &&
            event.node
        )
        .map(event => event.node)
        .slice(-15)
        .reverse();

    box.innerHTML = expanded.length
        ? expanded.map(node => `
            <div class="state-list-item explored">
                <span>${node.depth}</span>
                <strong>${formatState(node.state)}</strong>
                <small>Expanded</small>
            </div>
        `).join("")
        : `<div class="empty-message">No states expanded yet.</div>`;
}

function renderEventDetails(event) {
    const type = document.getElementById("visualEventType");
    const message = document.getElementById("visualEventMessage");
    const move = document.getElementById("visualMove");
    const parent = document.getElementById("visualParent");

    if (type) {
        type.textContent = getEventLabel(event.type);
    }

    if (message) {
        message.textContent =
            event.details?.message ||
            getDefaultEventMessage(event.type);
    }

    if (move) {
        move.textContent = {
            GENERATE: event.node?.move || "GENERATE",
            CUTOFF: "CUTOFF",
            BACKTRACK: "BACKTRACK",
            GOAL: "GOAL"
        }[event.type] || "EXPAND";
    }

    if (parent) {
        parent.textContent = event.node?.parent
            ? formatState(event.node.parent.state)
            : "ROOT";
    }
}

function updateMetrics(event) {
    const values = {
        visualCurrentDepth: event.depth,
        metricCurrentDepth: event.depth,
        visualGenerated: event.generated,
        visualExpanded: event.expanded,
        visualCutoffs: event.cutoffs,
        visualBacktracks: event.backtracks
    };

    Object.entries(values).forEach(([id, value]) => {
        const element = document.getElementById(id);

        if (element) {
            element.textContent = value;
        }
    });

    renderExplored();
}

function renderSuccessors(event) {
    const box = document.getElementById("successorStates");

    if (!box) {
        return;
    }

    if (!event.node) {
        box.innerHTML = "";
        return;
    }

    const path = event.stack || [];

    const successors = generateSuccessors(event.node.state)
        .filter(successor =>
            !path.some(node =>
                stateToKey(node.state) ===
                stateToKey(successor.state)
            )
        );

    box.innerHTML = successors.length
        ? successors.map(successor => `
            <div class="successor-item">
                <div class="successor-move">
                    ${successor.move}
                </div>
                ${createPuzzleHTML(
                    successor.state,
                    "small-puzzle"
                )}
            </div>
        `).join("")
        : `<p class="empty-message">No unvisited successors.</p>`;
}

function createPuzzleHTML(state, className = "") {
    return `
        <div class="visual-puzzle ${className}">
            ${state.map(value => `
                <div class="visual-tile ${
                    value === 0 ? "blank" : ""
                }">
                    ${value === 0 ? "" : value}
                </div>
            `).join("")}
        </div>
    `;
}

function getEventLabel(type) {
    return {
        ENTER: "ENTER NODE",
        EXPAND: "EXPAND",
        GENERATE: "GENERATE",
        CUTOFF: "DEPTH CUTOFF",
        BACKTRACK: "BACKTRACK",
        GOAL: "GOAL FOUND"
    }[type] || type;
}

function getDefaultEventMessage(type) {
    return {
        ENTER: "DLS has reached this state.",
        EXPAND: "The current node is being expanded.",
        GENERATE: "A valid successor state has been generated.",
        CUTOFF:
            "The depth limit has been reached. The node cannot be expanded further.",
        BACKTRACK:
            "The search is returning to the parent and trying another branch.",
        GOAL: "The goal state has been reached."
    }[type] || "";
}

function getEventPuzzleClass(type) {
    return {
        CUTOFF: "cutoff-puzzle",
        GOAL: "goal-puzzle",
        BACKTRACK: "backtrack-puzzle"
    }[type] || "";
}

function updateStepIndicator(current, total) {
    const element = document.getElementById("stepIndicator");

    if (element) {
        element.textContent = `STEP ${current} / ${total}`;
    }
}

function nextVisualizationStep() {
    if (currentStep < searchHistory.length - 1) {
        renderVisualizationStep(currentStep + 1);
    }
}

function previousVisualizationStep() {
    if (currentStep > 0) {
        renderVisualizationStep(currentStep - 1);
    }
}

function startVisualization() {
    if (!searchHistory.length) {
        return;
    }

    stopVisualization();

    visualizationTimer = setInterval(() => {
        if (currentStep >= searchHistory.length - 1) {
            stopVisualization();
            return;
        }

        nextVisualizationStep();
    }, visualizationSpeed);
}

function stopVisualization() {
    if (!visualizationTimer) {
        return;
    }

    clearInterval(visualizationTimer);
    visualizationTimer = null;
}

function changeVisualizationSpeed(speed) {
    visualizationSpeed = speed;

    if (visualizationTimer) {
        startVisualization();
    }
}

function resetVisualizationDisplay() {
    const board = document.getElementById("currentNodeBoard");
    const indicator = document.getElementById("stepIndicator");

    if (board) {
        board.innerHTML =
            `<p class="empty-message">Run DLS to begin visualization.</p>`;
    }

    if (indicator) {
        indicator.textContent = "STEP 0 / 0";
    }
}
