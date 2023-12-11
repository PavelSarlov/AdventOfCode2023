import { getLines } from "../lib/helpers.js";

const input = getLines("input.txt").map((line) => line.split(""));

const colsToExpand = input[0]
  .map((_, j) => (input.every((_, i) => input[i][j] === ".") ? j : undefined))
  .filter((x) => x !== undefined)
  .sort((a, b) => b - a);
const rowsToExpand = input
  .map((_, i) =>
    input[i].every((_, j) => input[i][j] === ".") ? i : undefined,
  )
  .filter((x) => x !== undefined)
  .sort((a, b) => b - a);

const galaxies = input
  .flatMap((line, row) =>
    line.map((tile, col) => (tile === "#" ? [row, col] : undefined)),
  )
  .filter((x) => x !== undefined);

function shortesPathsSum(expansion) {
  return galaxies
    .flatMap(([x1, y1], offset) =>
      galaxies.slice(offset + 1).map(([x2, y2]) => {
        const cols = colsToExpand.filter(
          (c) => Math.min(y1, y2) <= c && c <= Math.max(y1, y2),
        ).length;
        const rows = rowsToExpand.filter(
          (r) => Math.min(x1, x2) <= r && r <= Math.max(x1, x2),
        ).length;
        const dist =
          Math.abs(x1 - x2) +
          Math.abs(y1 - y2) +
          cols * expansion +
          rows * expansion -
          rows -
          cols;
        return dist;
      }),
    )
    .reduce((a, b) => a + b);
}

function part1() {
  return shortesPathsSum(2);
}
function part2() {
  return shortesPathsSum(1_000_000);
}

console.log(part1());
console.log(part2());
