import { getLines } from "../lib/helpers.js";

const input = getLines("input.txt").map((line) => line.split(""));
const startRow = input.findIndex((line) => line.find((x) => x === "S"));
const startCol = input[startRow].findIndex((x) => x === "S");

function getNext(q, r, c, step, infinite) {
  const [l, w] = [input.length, input[0].length];
  const [tr, br, lc, rc] = [r - 1, r + 1, c - 1, c + 1];
  const [fr, fc] = [((r % l) + l) % l, ((c % w) + w) % w];
  const [ftr, fbr, flc, frc] = [
    ((tr % l) + l) % l,
    ((br % l) + l) % l,
    ((lc % w) + w) % w,
    ((rc % w) + w) % w,
  ];

  if (infinite) {
    if (input[ftr][fc] !== "#") {
      q.push([tr, c, step]);
    }
    if (input[fbr][fc] !== "#") {
      q.push([br, c, step]);
    }
    if (input[fr][flc] !== "#") {
      q.push([r, lc, step]);
    }
    if (input[fr][frc] !== "#") {
      q.push([r, rc, step]);
    }
  } else {
    if (tr >= 0 && input[tr][c] !== "#") {
      q.push([tr, c, step]);
    }
    if (br < input.length && input[br][c] !== "#") {
      q.push([br, c, step]);
    }
    if (lc >= 0 && input[r][lc] !== "#") {
      q.push([r, lc, step]);
    }
    if (rc < input[0].length && input[r][rc] !== "#") {
      q.push([r, rc, step]);
    }
  }
}

function countGardenPlots(steps, infinite) {
  const seen = new Set();
  const q = [[startRow, startCol, 0]];
  const parity = steps & 1;

  while (q.length) {
    const [row, col, step] = q[0];
    if (step === steps) {
      break;
    }
    q.shift();

    if ((step & 1) === parity) {
      const hash = JSON.stringify([row, col]);
      if (seen.has(hash)) continue;
      else seen.add(hash);
    }

    getNext(q, row, col, step + 1, infinite);
  }

  return new Set([...q.map(([x, y]) => JSON.stringify([x, y])), ...seen]).size;
}

function part1() {
  return countGardenPlots(64, false);
}

function part2() {
  // what the fuck

  const one = countGardenPlots(65, true);
  const two = countGardenPlots(196, true);
  const three = countGardenPlots(327, true);

  const a = (three - 2 * two + one) / 2;
  const b = two - one - a;
  const c = one;
  const n = (26501365 - 65) / 131;

  return a * n ** 2 + b * n + c;
}

console.log(part1());
console.log(part2());
