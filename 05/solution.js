import { getLines } from "../lib/helpers.js";

const input = getLines("input.txt");

function part1() {
  const seedChains = input[0]
    .split(" ")
    .slice(1)
    .map((seed) => [Number(seed)]);

  let currentStep = 0;

  input.forEach((line) => {
    if (line.includes("map")) {
      currentStep++;
      for (const chain of seedChains) {
        chain.push(chain[currentStep - 1]);
      }
    }
    if (!line.match(/^\d+ \d+ \d+/)) {
      return;
    }

    const [destStart, sourceStart, length] = line
      .split(" ")
      .map((num) => Number(num));

    for (const chain of seedChains) {
      if (
        chain[currentStep - 1] >= sourceStart &&
        chain[currentStep - 1] <= sourceStart + length - 1
      ) {
        chain[currentStep] = destStart + chain[currentStep] - sourceStart;
      }
    }
  });

  return Math.min(...seedChains.map((chain) => chain[currentStep]));
}

function cut(range1, range2) {
  if (range2[0] > range1[1] || range1[0] > range2[1]) return null;

  const innerLower = Math.max(range1[0], range2[0]);
  const innerUpper = Math.min(range1[1], range2[1]);
  const outerLower = Math.min(range1[0], range2[0]);
  const outerUpper = Math.max(range1[1], range2[1]);

  return [
    [innerLower, innerUpper],
    [outerLower, innerLower - 1],
    [innerUpper + 1, outerUpper],
  ].filter(([x, y]) => x - y <= 0 && range1[0] <= x && range1[1] >= y);
}

function part2() {
  let ranges = input[0]
    .split(" ")
    .slice(1)
    .map((seed) => Number(seed))
    .reduce((prev, curr) => {
      if (typeof prev === "object") {
        const range = prev[prev.length - 1];
        return range.length === 1
          ? range.push(range[0] + curr - 1) && prev
          : prev.push([curr]) && prev;
      }
      return [[prev, prev + curr - 1]];
    });

  let mappings = [];

  input.every((line) => {
    if (line.includes("map")) {
      ranges = [...mappings, ...ranges];
      mappings = [];
    }
    if (!line.match(/^\d+ \d+ \d+/)) {
      return true;
    }

    const [destStart, sourceStart, length] = line
      .split(" ")
      .map((num) => Number(num));

    const rangesLength = ranges.length;
    ranges.forEach((range) => {
      const parts = cut(range, [sourceStart, sourceStart + length - 1]);
      if (parts) {
        const intersection = parts[0];
        const diff = intersection[0] - sourceStart;
        const len = intersection[1] - intersection[0];
        mappings.push([destStart + diff, destStart + diff + len]);
        ranges.push(...parts.slice(1));
      } else {
        ranges.push(range);
      }
    });
    ranges.splice(0, rangesLength);
    return true;
  });
  ranges = [...mappings, ...ranges];

  return Math.min(...ranges.map((range) => range[0]));
}

console.log(part1());
console.log(part2());
