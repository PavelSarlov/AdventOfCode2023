import lodash from "lodash";
import { getLines } from "../lib/helpers.js";

const input = getLines("input.txt").join("").split(",");

function hash(str) {
  return str
    .split("")
    .reduce((prev, curr) => ((prev + curr.charCodeAt()) * 17) % 256, 0);
}

function part1() {
  return input.reduce((prev, curr) => prev + hash(curr), 0);
}

function part2() {
  const boxes = Array(256)
    .fill(0)
    .map(() => []);

  input.forEach((op) => {
    const [lensLabel, focalLength] = op.split(/[=-]/);
    const box = hash(lensLabel);
    const lensComp = ({ label }) => label === lensLabel;

    if (!focalLength) {
      boxes[box] = boxes[box].filter(lodash.negate(lensComp));
    } else {
      const idx = boxes[box].findIndex(lensComp);
      const lens = { label: lensLabel, focalLength: Number(focalLength) };
      idx !== -1 ? (boxes[box][idx] = lens) : boxes[box].push(lens);
    }
  });

  return boxes.reduce(
    (sum, box, boxIdx) =>
      sum +
      box.reduce(
        (sumBox, { focalLength }, lensIdx) =>
          sumBox + (boxIdx + 1) * focalLength * (lensIdx + 1),
        0,
      ),
    0,
  );
}

console.log(part1());
console.log(part2());
