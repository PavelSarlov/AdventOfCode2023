import { getLines } from "../lib/helpers.js";

const input = getLines("input.txt");

function extractNumbers(line) {
  return line
    .split(/[:|]/g)
    .slice(1)
    .map((nums) => [
      ...new Set(
        nums
          .replace(/\s+/g, " ")
          .trim()
          .split(" ")
          .map((num) => Number(num)),
      ),
    ]);
}

function part1() {
  return input
    .map((line) => {
      const [winning, mine] = extractNumbers(line);
      const intersection = mine.filter((num) => winning.includes(num));
      return intersection.length ? Math.pow(2, intersection.length - 1) : 0;
    })
    .reduce((a, b) => a + b);
}

function part2() {
  const copies = Object.fromEntries(input.map((_, idx) => [idx + 1, 1]));
  input.forEach((line, idx) => {
    const card = idx + 1;
    const [winning, mine] = extractNumbers(line);
    const intersection = mine.filter((num) => winning.includes(num));
    const currentCopies = copies[card] ?? 1;

    for (let i = 1; i <= intersection.length; i++) {
      const j = card + i;
      copies[j] = copies[j] + currentCopies;
    }
  });
  return Object.values(copies).reduce((a, b) => a + b);
}

console.log(part1());
console.log(part2());
