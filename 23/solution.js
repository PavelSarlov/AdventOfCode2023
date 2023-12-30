import { getLines, sumArray } from "../lib/helpers.js";

const input = getLines("input.txt").map((line) => line.split(""));
const start = [0, input[0].findIndex((x) => x === ".")];
const end = [
  input.length - 1,
  input[input.length - 1].findIndex((x) => x === "."),
];
const endStr = JSON.stringify(end);

const slopeDir = {
  "^": [-1, 0],
  ">": [0, 1],
  v: [1, 0],
  "<": [0, -1],
};

function isOutOfBounds([x, y]) {
  return x < 0 || x >= input.length || y < 0 || y >= input[0].length;
}

function isValidStep([x, y], visited) {
  return (
    !isOutOfBounds([x, y]) &&
    !visited.has(JSON.stringify([x, y])) &&
    input[x][y] !== "#"
  );
}

function getNext([x, y], visited, ignoreSlopes) {
  let dirs = Object.values(slopeDir);
  if (!ignoreSlopes && slopeDir[input[x][y]]) {
    dirs = [slopeDir[input[x][y]]];
  }
  const coords = [x, y];
  return dirs
    .map((dir) => sumArray(dir, coords))
    .filter((pos) => isValidStep(pos, visited));
}

function getGraph(ignoreSlopes) {
  const pointsOfInterest = [start, end].concat(
    input
      .flatMap((line, r) =>
        line.map((ch, c) => {
          if (ch === "#") {
            return;
          }

          const neighbours = Object.values(slopeDir)
            .map((dir) => sumArray(dir, [r, c]))
            .filter(
              ([dr, dc]) => !isOutOfBounds([dr, dc]) && input[dr][dc] !== "#",
            ).length;
          if (neighbours > 2) {
            return [r, c];
          }
        }),
      )
      .filter((a) => a),
  );

  const graph = Object.fromEntries(
    pointsOfInterest.map((pt) => [JSON.stringify(pt), {}]),
  );

  pointsOfInterest.forEach(([sr, sc]) => {
    const stack = [[sr, sc, 0]];
    const visited = new Set([JSON.stringify([sr, sc])]);

    while (stack.length) {
      const [r, c, depth] = stack.pop();

      if (
        depth !== 0 &&
        pointsOfInterest.find(([pr, pc]) => pr === r && pc === c)
      ) {
        graph[JSON.stringify([sr, sc])][JSON.stringify([r, c])] = depth;
        continue;
      }

      const next = getNext([r, c], visited, ignoreSlopes);
      next.forEach((pt) => {
        stack.push([...pt, depth + 1]);
        visited.add(JSON.stringify(pt));
      });
    }
  });

  return graph;
}

function dfs(ptStr, graph, visited) {
  if (ptStr === endStr) {
    return 0;
  }

  let max = -Infinity;

  visited.add(ptStr);
  Object.keys(graph[ptStr]).forEach((nptStr) => {
    if (!visited.has(nptStr)) {
      max = Math.max(max, dfs(nptStr, graph, visited) + graph[ptStr][nptStr]);
    }
  });
  visited.delete(ptStr);
  return max;
}

function part1() {
  const graph = getGraph(false);
  const visited = new Set();
  return dfs(JSON.stringify(start), graph, visited);
}

function part2() {
  const graph = getGraph(true);
  const visited = new Set();
  return dfs(JSON.stringify(start), graph, visited);
}

console.log(part1());
console.log(part2());
