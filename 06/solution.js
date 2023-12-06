import { getLines } from "../lib/helpers.js";

const input = getLines("input.txt");
const times = input[0]
  .replace(/\s+/g, " ")
  .split(" ")
  .slice(1)
  .map((x) => Number(x));
const distances = input[1]
  .replace(/\s+/g, " ")
  .split(" ")
  .slice(1)
  .map((x) => Number(x));

function getWays(time, distance) {
  let ways = 0;
  for (let i = 1; i < time; i++) {
    const playerDistance = (time - i) * i;
    ways += playerDistance > distance;
  }
  return ways;
}

function part1() {
  return times
    .map((time, idx) => getWays(time, distances[idx]))
    .reduce((a, b) => a * b);
}

function part2() {
  const time = Number(times.join(""));
  const distance = Number(distances.join(""));
  return getWays(time, distance);
}

console.log(part1());
console.log(part2());
