import { getLines, transpose } from "../lib/helpers.js";

const input = getLines("input.txt");

function slideRocks(dish) {
  return dish.map((line) => {
    const a = line
      .split("#")
      .map((part) => part.split("").sort().reverse().join(""))
      .join("#");
    return a;
  });
}

function getLoad(dish) {
  return dish
    .map((line) =>
      line
        .split("")
        .reduce(
          (prev, curr, idx, arr) =>
            prev + (curr === "O" ? arr.length - idx : 0),
          0,
        ),
    )
    .reduce((a, b) => a + b);
}

function part1() {
  return getLoad(slideRocks(transpose(input)));
}

function part2() {
  const iter = 1000000000;
  const cache = new Set([input.join("")]);
  const cacheSeq = [input];

  let dish = input;

  for (let i = 1; i < iter; i++) {
    for (let j = 0; j < 4; j++) {
      dish = slideRocks(transpose(dish));
      dish = dish.map((row) => row.split("").reverse().join(""));
    }

    const gridStr = dish.join("");
    if (cache.has(gridStr)) {
      const loopIdx = cacheSeq.findIndex((d) => d.join("") === gridStr);
      console.log(loopIdx);
      return getLoad(
        transpose(cacheSeq[((iter - loopIdx) % (i - loopIdx)) + loopIdx]),
      );
    } else {
      cache.add(gridStr);
      cacheSeq.push(dish);
    }
  }
}

console.log(part1());
console.log(part2());
