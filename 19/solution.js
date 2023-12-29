import { getLines } from "../lib/helpers.js";

const input = getLines("input.txt");
const empty = input.findIndex((x) => !x);
const [workflows, parts] = [
  new Map(
    input.slice(0, empty).map((line) =>
      line
        .split(/[{}]/g)
        .slice(0, 2)
        .map((x, i) =>
          i === 1
            ? x.split(",").map((step) => {
                const groups = [
                  ...step.matchAll(
                    /(?<category>[xmas])(?<condition>[<>])(?<rating>\d+):(?<next>\w+)/g,
                  ),
                ][0]?.groups;

                if (!groups) {
                  return step;
                }
                return groups;
              })
            : x,
        ),
    ),
  ),
  input
    .slice(empty + 1)
    .map((line) =>
      JSON.parse(line.replace(/=/g, ":").replace(/([xmas])/g, '"$1"')),
    ),
];

function part1() {
  const accepted = [];

  parts.forEach((part) => {
    let workflow = "in";

    while (true) {
      if (workflow.match(/[AR]/)) {
        workflow === "A" && accepted.push(part);
        return;
      }

      const steps = workflows.get(workflow);
      dance: for (const step of steps) {
        if (typeof step === "string") {
          workflow = step;
          break;
        }

        let { category, condition, rating, next } = step;
        rating = Number(rating);
        switch (condition) {
          case ">":
            if (part[category] > rating) {
              workflow = next;
              break dance;
            }
            break;
          default:
            if (part[category] < rating) {
              workflow = next;
              break dance;
            }
            break;
        }
      }
    }
  });
  return accepted.reduce(
    (prev, curr) => prev + Object.values(curr).reduce((a, b) => a + b),
    0,
  );
}

function countCombinations(ranges, workflow = "in") {
  switch (workflow) {
    case "A":
      return Object.values(ranges)
        .map(([from, to]) => to - from + 1)
        .reduce((a, b) => a * b);
    case "R":
      return 0;
  }

  let total = 0;
  const steps = workflows.get(workflow);

  for (const step of steps) {
    if (typeof step === "string") {
      total += countCombinations(ranges, steps[steps.length - 1]);
      break;
    }

    let { category, condition, rating, next } = step;
    rating = Number(rating);
    const [lower, upper] = ranges[category];
    let t, f;

    switch (condition) {
      case "<":
        t = [lower, Math.min(rating - 1, upper)];
        f = [Math.max(lower, rating), upper];
        break;
      default:
        t = [Math.max(rating + 1, lower), upper];
        f = [lower, Math.min(rating, upper)];
        break;
    }

    if (t[0] <= t[1]) {
      total += countCombinations({ ...ranges, [category]: t }, next);
    }
    if (f[0] <= f[1]) {
      ranges = { ...ranges, [category]: f };
    } else {
      break;
    }
  }

  return total;
}

function part2() {
  const ranges = {
    x: [1, 4000],
    m: [1, 4000],
    a: [1, 4000],
    s: [1, 4000],
  };
  return countCombinations(ranges);
}

console.log(part1());
console.log(part2());
