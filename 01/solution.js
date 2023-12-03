import { getLines } from "../lib/helpers.js";

const input = getLines("input.txt");

function part1() {
  let sum = 0;
  for (const line of input) {
    let digits = [...line.replace(/\D/g, "")];
    digits = [...digits, digits[digits.length - 1]];
    digits.splice(1, digits.length - 2);
    const num = Number.parseInt(digits.join("") || 0, 10);
    sum += num;
  }
  return sum;
}

function part2() {
  let sum = 0;
  for (let line of input) {
    const digits = [];
    for (let i = 0; i < line.length; i++) {
      let slice = line.slice(i, i + 5);

      for (const [word, digit] of [
        ["twone", 2],
        ["one", 1],
        ["two", 2],
        ["three", 3],
        ["four", 4],
        ["five", 5],
        ["six", 6],
        ["seven", 7],
        ["eight", 8],
        ["nine", 9],
      ]) {
        slice = slice.replace(new RegExp(word), digit);
      }

      digits.push(
        ...slice
          .replace(/\D/g, "")
          .split("")
          .map((d) => Number(d)),
      );
    }
    sum += Number(`${digits[0] ?? ""}${digits[digits.length - 1] ?? ""}`);
  }

  return sum;
}

console.log(part1());
console.log(part2());
