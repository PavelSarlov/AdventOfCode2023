import { getLines } from "../lib/helpers.js";

const input = getLines("input.txt");

function part1() {
  const bag = {
    red: 12,
    green: 13,
    blue: 14,
  };

  let sum = 0;

  for (let line of input.filter((line) => line)) {
    const game = Number(line.replace(/Game (\d*): .*/g, "$1"));
    const isPossible = line
      .replace(/.*: (.*)/g, "$1")
      .split(";")
      .every((take) =>
        take.split(",").every((t) => {
          const parts = t.trim().split(" ");
          const balls = Number(parts[0].trim());
          const color = parts[1].trim();

          return !!bag[color] && bag[color] >= balls;
        }),
      );
    sum += isPossible ? game : 0;
  }

  return sum;
}

function part2() {
  let sum = 0;
  for (let line of input.filter((line) => line)) {
    const bag = {
      red: 0,
      green: 0,
      blue: 0,
    };

    line
      .replace(/.*: (.*)/g, "$1")
      .split(";")
      .forEach((take) =>
        take.split(",").forEach((t) => {
          const parts = t.trim().split(" ");
          const balls = Number(parts[0].trim());
          const color = parts[1].trim();

          bag[color] = Math.max(balls, bag[color]);
        }),
      );
    sum += Object.values(bag).reduce((a, b) => a * b);
  }

  return sum;
}

console.log(part1());
console.log(part2());
