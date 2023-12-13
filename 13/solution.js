import { getLines } from "../lib/helpers.js";

const input = getLines("input.txt").reduce((a, b, i, arr) => {
  if (!b || i === arr.length - 1) {
    b = a.splice(a.findIndex((x) => typeof x === "string"));
  }
  return [...a, b];
}, []);

function transpose(pattern) {
  let transposed = [];
  for (let i = 0; i < pattern.length; i++) {
    for (let j = 0; j < pattern[i].length; j++) {
      transposed[j] = transposed[j] || "";
      transposed[j] += pattern[i][j];
    }
  }
  return transposed;
}

async function countReflections(pattern, mult, smudge) {
  for (let row = 1; row < pattern.length; row++) {
    let above = pattern.slice(0, row).reverse();
    let below = pattern.slice(row);
    above = above.slice(0, below.length).join().split("");
    below = below.slice(0, above.length).join().split("");

    if (
      above
        .map((_, i) => Number(above[i] !== below[i]))
        .reduce((a, b) => a + b) === smudge
    )
      return row * mult;
  }
  return 0;
}

async function summarize(smudge = 0) {
  return (
    await Promise.all([
      ...input.map(async (pattern) => {
        const [c1, c2] = await Promise.all([
          countReflections(pattern, 100, smudge),
          countReflections(transpose(pattern), 1, smudge),
        ]);
        return c1 + c2;
      }),
    ])
  ).reduce((a, b) => a + b);
}

async function part1() {
  return summarize();
}

async function part2() {
  return summarize(1);
}

console.log(await part1());
console.log(await part2());
