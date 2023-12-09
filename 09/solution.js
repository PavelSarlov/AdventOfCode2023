import { getLines } from "../lib/helpers.js";

const input = getLines("input.txt").map((line) =>
  line.split(" ").map((x) => Number(x)),
);

function extrapolate(history, backwards) {
  const prog = [history];
  while (prog[prog.length - 1].some((x) => x !== 0)) {
    prog.push(
      prog[prog.length - 1]
        .reduce(
          (prev, curr) =>
            prev.length
              ? [
                  ...prev.slice(0, prev.length - 1),
                  curr - prev[prev.length - 1],
                  curr,
                ]
              : [curr],
          [],
        )
        .slice(0, -1),
    );
  }
  return backwards
    ? prog.reverse().reduce((prev, curr) => curr[0] - prev, 0)
    : prog.reduce((prev, curr) => prev + curr.slice(-1)[0], 0);
}

function part1() {
  return input
    .map((history) => extrapolate(history, false))
    .reduce((a, b) => a + b);
}
function part2() {
  return input
    .map((history) => extrapolate(history, true))
    .reduce((a, b) => a + b);
}

console.log(part1());
console.log(part2());
