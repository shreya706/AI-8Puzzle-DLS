# DLS 8-Puzzle Solver

An interactive web-based 8-Puzzle Solver that demonstrates **Depth Limited Search (DLS)** and visualizes the search process step by step.

## Student Details

- **Name:** Shreya Gupta
- **Registration Number:** 24BDS0393
- **Course:** Artificial Intelligence
- **Project:** Interactive 8-Puzzle Problem Solver
- **Assigned Algorithm:** Depth Limited Search (DLS)

## Project Description

The 8-Puzzle is a state-space search problem consisting of eight numbered tiles and one blank space arranged on a 3 × 3 board.

The objective is to move the tiles by sliding a tile into the blank position until the initial configuration reaches the specified goal configuration.

This project implements **Depth Limited Search (DLS)** to solve the 8-Puzzle problem. DLS performs depth-first exploration while restricting the search to a user-defined depth limit.

The application provides an interactive interface for entering puzzle states, running DLS, viewing search statistics, and observing the search process through step-by-step visualization.

## Objectives

- Implement Depth Limited Search for the 8-Puzzle problem.
- Allow users to define initial and goal states.
- Generate random solvable puzzle configurations.
- Allow the user to select a depth limit.
- Visualize the search process step by step.
- Display search performance statistics.
- Display and animate the final solution path.
- Demonstrate the behavior of DLS when the depth limit is reached.

## Features

- Custom initial puzzle state input.
- Custom goal state input.
- Random solvable puzzle generation.
- User-defined depth limit.
- Depth Limited Search execution.
- Initial state and goal state validation.
- Solvability checking.
- Solution depth calculation.
- Path cost calculation.
- Nodes generated count.
- Nodes expanded count.
- Maximum search depth.
- Cutoff count.
- Backtrack count.
- Execution time.
- Search stack visualization.
- Expanded-state history.
- Current-node visualization.
- Generated successor visualization.
- Search event visualization.
- Step-by-step search controls.
- Automatic search visualization playback.
- Previous and next search-step controls.
- Final solution path display.
- Final solution-path animation.

## Algorithm Implemented

### Depth Limited Search

Depth Limited Search is an uninformed search algorithm and a variation of Depth First Search.

DLS explores states in a depth-first manner while imposing a predefined depth limit. Nodes at the depth limit are not expanded further. If the goal is not found on the current branch, the algorithm backtracks and explores another branch.

In this project, DLS is applied to the state space of the 8-Puzzle.

### Working Principle

1. Start from the initial puzzle state.
2. Check whether the current state is the goal state.
3. Check whether the depth limit has been reached.
4. Generate valid successor states.
5. Explore successors recursively in depth-first order.
6. Avoid revisiting states already present on the current search path.
7. Backtrack when a branch fails or reaches the depth limit.
8. Return the solution when the goal state is reached.

## Complexity Analysis

Let:

- **b** = branching factor
- **l** = depth limit

### Time Complexity

`O(b^l)`

### Space Complexity

`O(b·l)`

### Completeness

DLS is complete when the solution exists within the selected depth limit and the search space has finite branching.

### Optimality

DLS is not optimal because it does not guarantee the shallowest or lowest-cost solution.

### Advantages

- Uses less memory than breadth-first search.
- Prevents exploration beyond the selected depth.
- Simple recursive implementation.
- Useful when a reasonable solution-depth bound is known.
- Supports explicit control over the search depth.

### Limitations

- May fail to find a solution if the selected depth limit is too small.
- Does not guarantee the shortest solution.
- Performance depends strongly on the selected depth limit.
- May explore many branches before finding a solution.
- Repeatedly searching with different depth limits would be required to obtain iterative deepening behavior.

## Puzzle Representation

The blank tile is represented internally by the value `0`.

Example initial state:

```text
2 8 3
1 6 4
7 0 5
```

Example goal state:

```text
1 2 3
8 0 4
7 6 5
```

A valid puzzle configuration must contain every value from 0 to 8 exactly once.

## Technologies Used

- HTML5
- CSS3
- JavaScript ES6
- Bootstrap 5.3.3

## Project Structure

```text
AI-8Puzzle-DLS/
│
├── index.html
│
├── css/
│   └── style.css
│
├── js/
│   ├── puzzle.js
│   ├── dls.js
│   ├── visualization.js
│   └── app.js
│
├── assets/
├── images/
├── docs/
└── README.md
```

## JavaScript Modules

### puzzle.js

Contains the puzzle-state operations, including:

- State representation.
- State comparison.
- Blank-tile detection.
- Valid move generation.
- Successor generation.
- Goal checking.
- Inversion counting.
- Solvability checking.
- Random solvable puzzle generation.

### dls.js

Contains the Depth Limited Search implementation.

The module records:

- Generated nodes.
- Expanded nodes.
- Search events.
- Current depth.
- Cutoffs.
- Backtracks.
- Parent relationships.
- Solution path.
- Execution time.
- Peak active search-stack depth.

### visualization.js

Controls the interactive search visualization.

It displays:

- Current search node.
- Search event.
- Current depth.
- Generated successors.
- Search stack.
- Expanded-state history.
- Search statistics.
- Previous and next search steps.
- Automatic visualization playback.

### app.js

Connects the user interface with the puzzle and DLS modules.

It handles:

- Puzzle input.
- Puzzle validation.
- Random puzzle generation.
- Depth-limit selection.
- Running DLS.
- Resetting the solver.
- Displaying search results.
- Displaying the solution path.
- Solution-path animation.

## Search Visualization

The visualization represents the actual DLS search process through individual events:

- **ENTER:** DLS reaches a node.
- **EXPAND:** The current node is expanded.
- **GENERATE:** A valid successor is generated.
- **CUTOFF:** The depth limit has been reached.
- **BACKTRACK:** The search returns to a previous node.
- **GOAL:** The goal state is reached.

The search stack represents the active depth-first path used by the recursive DLS implementation.

## Solution Path

When DLS finds the goal state, the application reconstructs the path from the goal node back to the initial node using parent relationships.

The final solution path displays:

- Starting state.
- Each move.
- Intermediate puzzle states.
- Depth of each state.
- Final goal state.

The solution path is also animated to demonstrate the movement of the blank tile through the sequence of solution states.

## Heuristics

DLS is an **uninformed search algorithm**, so heuristic functions are not used by the implemented DLS solver.

The following heuristics are therefore not used by this project:

- Misplaced Tiles.
- Manhattan Distance.

These heuristics are relevant to informed search algorithms such as Greedy Best First Search and A*.

## Comparison of Search Algorithms

The project includes a theoretical comparison of the search algorithms specified in the assignment.

| Algorithm | Type | Complete | Optimal | Time Complexity | Space Complexity |
|---|---|---|---|---|---|
| BFS | Uninformed | Yes* | Yes* | O(b^d) | O(b^d) |
| DFS | Uninformed | No | No | O(b^m) | O(bm) |
| DLS | Uninformed | Within depth limit | No | O(b^l) | O(b·l) |
| IDDLS | Uninformed | Yes* | Yes* | O(b^d) | O(bd) |
| GBFS | Informed | No* | No | O(b^m) | O(b^m) |
| A* | Informed | Yes* | Yes* | Exponential* | Exponential* |

Where:

- **b** = branching factor
- **d** = depth of the shallowest solution
- **l** = depth limit
- **m** = maximum search depth

Properties marked with * depend on conditions such as finite branching, repeated-state handling, admissibility of heuristics, and path-cost assumptions.

This project implements the assigned Depth Limited Search algorithm. Performance statistics displayed by the interactive solver are generated from the implemented DLS algorithm. Performance results for algorithms not implemented in this project are not fabricated.

## Validation

The application validates puzzle configurations before executing the search.

A valid puzzle state must:

1. Contain exactly 9 values.
2. Contain every value from 0 through 8 exactly once.
3. Have a solvability relationship compatible with the selected goal state.

Invalid configurations are rejected before DLS execution.

## How to Run Locally

1. Download or clone the repository.
2. Open the project folder.
3. Open `index.html` in a modern web browser.
4. Enter the initial puzzle state.
5. Enter the goal state.
6. Select a depth limit.
7. Click **Run DLS**.
8. View the search result and solution path.
9. Use the visualization controls to inspect the DLS search process.

## GitHub Repository

Repository URL: To be added after repository creation.

## GitHub Pages

Live Website URL: To be added after GitHub Pages deployment.

## Screenshots

The final repository should contain screenshots demonstrating:

1. Home page.
2. Puzzle input and solver.
3. Search result statistics.
4. Search visualization.
5. Solution-path animation.
6. DLS algorithm information.
7. Algorithm comparison.

Screenshots can be stored in the `images/` directory.

## References

1. Artificial Intelligence Digital Assignment specification provided for the course.
2. Bootstrap Documentation — https://getbootstrap.com/
3. MDN Web Docs — JavaScript — https://developer.mozilla.org/en-US/docs/Web/JavaScript
4. MDN Web Docs — HTML — https://developer.mozilla.org/en-US/docs/Web/HTML
5. MDN Web Docs — CSS — https://developer.mozilla.org/en-US/docs/Web/CSS

## Academic Project

This project was developed as an academic implementation of Depth Limited Search for the 8-Puzzle problem.

**Student:** Shreya Gupta  
**Registration Number:** 24BDS0393  
**Course:** Artificial Intelligence  
**Algorithm:** Depth Limited Search (DLS)
