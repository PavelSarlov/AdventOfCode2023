import { getLines } from "../lib/helpers.js";

const file = "input.txt";

const cache = {};

function countValid(springs, counts) {
  if (!springs.length) return counts.reduce((a, b) => a + b, 0) ? 0 : 1;
  if (!counts.reduce((a, b) => a + b, 0)) return springs.includes("#") ? 0 : 1;

  const key = `${springs}${counts}`;

  if (key in cache) {
    return cache[key];
  }

  let valid = 0;

  if (springs[0].match(/[.?]/)) {
    valid += countValid(springs.slice(1), counts);
  }
  if (springs[0].match(/[#?]/)) {
    if (
      counts[0] <= springs.length &&
      !springs.slice(0, counts[0]).includes(".") &&
      (counts[0] === springs.length || springs[counts[0]] !== "#")
    ) {
      valid += Math.max(
        countValid(springs.slice(counts[0] + 1), counts.slice(1)),
      );
    }
  }

  cache[key] = valid;
  return valid;
}

function part1() {
  return getLines(file)
    .map((line) => {
      const [springs, counts] = line.split(" ");
      return {
        springs: springs.split(""),
        counts: counts.split(",").map(Number),
      };
    })
    .map(({ springs, counts }) => countValid(springs, counts))
    .reduce((a, b) => a + b);
}
function part2() {
  return getLines(file)
    .map((line) => {
      const [springs, counts] = line.split(" ");
      return {
        springs: `${springs}?`.repeat(5).slice(0, -1).split(""),
        counts: `${counts},`.repeat(5).slice(0, -1).split(",").map(Number),
      };
    })
    .map(({ springs, counts }) => countValid(springs, counts))
    .reduce((a, b) => a + b);
}

console.log(part1());
console.log(part2());
