import { getLines, getPolygonArea } from "../lib/helpers.js";

const dir = {
  up: 0,
  right: 1,
  down: 2,
  left: 3,
};

const dirInv = {
  [dir.up]: dir.down,
  [dir.down]: dir.up,
  [dir.left]: dir.right,
  [dir.right]: dir.left,
};

const pipes = {
  F: [0, 1, 1, 0],
  7: [0, 0, 1, 1],
  J: [1, 0, 0, 1],
  L: [1, 1, 0, 0],
  "|": [1, 0, 1, 0],
  "-": [0, 1, 0, 1],
  S: [1, 1, 1, 1],
};

function isConnected(pipe1, pipe2, dir) {
  return !!(pipes[pipe1]?.[dir] && pipes[pipe2]?.[dirInv[dir]]);
}

function isVertex(pipe) {
  return "F7JLS".includes(pipe);
}

const file = "input.txt";

function part1() {
  const input = getLines(file).map((line) => line.split(""));
  const startRow = input.findIndex((line) => line.includes("S"));
  const startCol = input[startRow].findIndex((char) => char === "S");
  const startPos = [startRow, startCol];

  let max = 0;
  const queue = [{ pos: startPos, depth: 0 }];

  while (queue.length) {
    const {
      pos: [x, y],
      depth: currDepth,
    } = queue.shift();
    const depth = currDepth + 1;

    isConnected(input[x][y], input[x][y + 1], dir.right) &&
      queue.push({ pos: [x, y + 1], depth });
    isConnected(input[x][y], input[x][y - 1], dir.left) &&
      queue.push({ pos: [x, y - 1], depth });
    isConnected(input[x][y], input[x + 1]?.[y], dir.down) &&
      queue.push({ pos: [x + 1, y], depth });
    isConnected(input[x][y], input[x - 1]?.[y], dir.up) &&
      queue.push({ pos: [x - 1, y], depth });

    input[x][y] = currDepth;
    max = Math.max(max, currDepth);
  }

  return max;
}

function part2() {
  const input = getLines(file).map((line) => line.split(""));
  const startRow = input.findIndex((line) => line.includes("S"));
  const startCol = input[startRow].findIndex((char) => char === "S");
  const startPos = [startRow, startCol];

  const vertices = [];
  let current = startPos;

  const getNext = (x, y) => {
    switch (true) {
      case isConnected(input[x][y], input[x][y + 1], dir.right):
        return [x, y + 1];
      case isConnected(input[x][y], input[x][y - 1], dir.left):
        return [x, y - 1];
      case isConnected(input[x][y], input[x + 1]?.[y], dir.down):
        return [x + 1, y];
      case isConnected(input[x][y], input[x - 1]?.[y], dir.up):
        return [x - 1, y];
    }
  };

  do {
    const [x, y] = current;
    current = getNext(x, y);
    if (isVertex(input[x][y])) vertices.push([x, y]);
    input[x][y] = 0;
  } while (current);

  const area = getPolygonArea(vertices);

  return area - part1() + 1;
}

console.log(part1());
console.log(part2());
