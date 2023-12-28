import lodash from "lodash";
import { getLines } from "../lib/helpers.js";
import { PriorityQueue } from "datastructures-js";

const { isEqual } = lodash;

const input = getLines("input.txt").map((l) =>
  l.split("").map((x) => Number(x)),
);
const start = [0, 0];
const end = [input.length - 1, input[0].length - 1];
const comp = (a, b) => a.temp - b.temp;

function getPossibleDirections(dir, steps, min, max) {
  const nullAxis = dir.findIndex((a) => a == 0);
  return [
    [0, -1],
    [0, 1],
    [-1, 0],
    [1, 0],
  ].filter(
    (x) =>
      !isEqual(
        x,
        dir.map((x) => x * -1),
      ) &&
      (steps < min ? x[nullAxis] === dir[nullAxis] : true) &&
      (steps >= max ? !isEqual(x, dir) : true),
  );
}

function minimizeHeatLoss(min, max) {
  const visited = new Set();

  const pq = new PriorityQueue(comp, [
    {
      coords: start,
      temp: 0,
      dir: [0, 0],
      steps: 0,
    },
  ]);

  while (pq.size()) {
    const {
      coords: [row, col],
      temp,
      dir,
      steps,
    } = pq.pop();

    if (isEqual([row, col], end) && steps >= min) {
      return temp;
    }

    const pathStr = JSON.stringify([row, col, steps, dir]);

    if (visited.has(pathStr)) continue;

    visited.add(pathStr);

    const possibleDirs = getPossibleDirections(dir, steps, min, max);

    possibleDirs.forEach(([pRow, pCol]) => {
      const [nRow, nCol] = [row + pRow, col + pCol];
      const pDir = [pRow, pCol];

      if (
        nRow < 0 ||
        nRow >= input.length ||
        nCol < 0 ||
        nCol >= input[0].length
      )
        return;

      pq.push({
        coords: [nRow, nCol],
        temp: temp + input[nRow][nCol],
        dir: pDir,
        steps: !isEqual(dir, pDir) ? 1 : steps + 1,
      });
    });
  }
}

function part1() {
  return minimizeHeatLoss(0, 3);
}

function part2() {
  return minimizeHeatLoss(4, 10);
}

console.log(part1());
console.log(part2());
