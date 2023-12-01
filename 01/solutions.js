import { getLines } from "../lib/helpers.js";

const input = getLines("input.txt");

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

console.log(sum);
