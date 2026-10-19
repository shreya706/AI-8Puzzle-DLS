function depthLimitedSearch(initialState, goalState, depthLimit) {
    const startTime = performance.now();

    const generatedStates = [];
    const expandedStates = [];
    const events = [];

    let solutionNode = null;
    let maxDepthReached = 0;
    let cutoffCount = 0;
    let backtrackCount = 0;
    let peakStackDepth = 0;

    const root = {
        state: [...initialState],
        parent: null,
        move: null,
        depth: 0
    };

    const currentPath = [];

    generatedStates.push(root);

    function addEvent(type, node, details = {}, stack = currentPath) {
        events.push({
            type,
            node,
            depth: node ? node.depth : 0,
            stack: [...stack],
            generated: generatedStates.length,
            expanded: expandedStates.length,
            cutoffs: cutoffCount,
            backtracks: backtrackCount,
            maxDepth: maxDepthReached,
            peakStackDepth,
            details
        });
    }

    function search(node) {
        currentPath.push(node);
        peakStackDepth = Math.max(peakStackDepth, currentPath.length);
        maxDepthReached = Math.max(maxDepthReached, node.depth);

        addEvent("ENTER", node);

        if (isGoal(node.state, goalState)) {
            solutionNode = node;

            addEvent("GOAL", node, {
                message: "Goal state reached."
            });

            currentPath.pop();
            return "FOUND";
        }

        if (node.depth >= depthLimit) {
            cutoffCount++;

            addEvent("CUTOFF", node, {
                message: "Depth limit reached. Node cannot be expanded further."
            });

            currentPath.pop();
            return "CUTOFF";
        }

        expandedStates.push(node);

        addEvent("EXPAND", node, {
            message: "Expanding current node and generating successors."
        });

        const successors = generateSuccessors(node.state);
        let hasCutoff = false;

        for (const successor of successors) {
            const stateKey = stateToKey(successor.state);

            const alreadyInPath = currentPath.some(
                pathNode => stateToKey(pathNode.state) === stateKey
            );

            if (alreadyInPath) {
                continue;
            }

            const child = {
                state: [...successor.state],
                parent: node,
                move: successor.move,
                depth: node.depth + 1
            };

            generatedStates.push(child);

            addEvent(
                "GENERATE",
                child,
                {
                    parent: node,
                    message: `Generated successor using ${successor.move}.`
                },
                [...currentPath, child]
            );

            const result = search(child);

            if (result === "FOUND") {
                currentPath.pop();
                return "FOUND";
            }

            if (result === "CUTOFF") {
                hasCutoff = true;
            }

            backtrackCount++;

            addEvent("BACKTRACK", node, {
                from: child,
                message: `Backtracking from depth ${child.depth} to depth ${node.depth}.`
            });
        }

        currentPath.pop();

        return hasCutoff ? "CUTOFF" : "FAILURE";
    }

    const result = search(root);

    const solutionPath = [];

    if (solutionNode) {
        let current = solutionNode;

        while (current !== null) {
            solutionPath.unshift(current);
            current = current.parent;
        }
    }

    const solutionDepth = solutionPath.length > 0
        ? solutionPath.length - 1
        : null;

    const pathCost = solutionDepth;

    const executionTime = performance.now() - startTime;

    return {
        found: result === "FOUND",
        result,
        solutionPath,
        solutionDepth,
        pathCost,
        generatedStates,
        expandedStates,
        events,
        cutoffCount,
        backtrackCount,
        maxDepth: maxDepthReached,
        peakStackDepth,
        executionTime,
        depthLimit
    };
}

