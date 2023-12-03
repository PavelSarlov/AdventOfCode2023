import { getLines } from "../lib/helpers.js";

const input = getLines("input.txt");

function extractNumber(str, idx) {
  const num = [];
  let i = idx;
  let j = idx + 1;
  while (str[i]?.match(/\d/)) {
    num.unshift(str[i--]);
  }
  while (str[j]?.match(/\d/)) {
    num.push(str[j++]);
  }
  return num.length ? Number.parseInt(num.join(""), 10) : 0;
}

function part1() {
  let sum = 0;
  input.forEach((line, row) => {
    let skip = false;
    line.split("").forEach((char, col) => {
      if (!skip && char.match(/\d/)) {
        dance: for (let i = -1; i < 2; i++) {
          for (let j = -1; j < 2; j++) {
            const c = input?.[row + i]?.[col + j];
            if (c !== "." && c?.match(/\D/)) {
              sum += extractNumber(line, col);
              skip = true;
              break dance;
            }
          }
        }
      } else if (!char.match(/\d/)) {
        skip = false;
      }
    });
  });
  return sum;
}

function part2() {
  let sum = 0;
  input.forEach((line, row) => {
    line.split("").forEach((char, col) => {
      if (char.match(/\*/)) {
        const numbers = [];
        for (let i = -1; i < 2; i++) {
          let skip = false;
          for (let j = -1; j < 2; j++) {
            const c = input[row + i]?.[col + j];
            if (!skip && c?.match(/\d/)) {
              skip = true;
              numbers.push(extractNumber(input[row + i], col + j));
            } else if (c?.match(/\D/)) {
              skip = false;
            }
          }
        }
        sum += numbers.length === 2 ? numbers.reduce((a, b) => a * b) : 0;
      }
    });
  });
  return sum;
}

console.log(part1());
console.log(part2());
