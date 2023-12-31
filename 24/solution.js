import { getLines } from "../lib/helpers.js";
import nerdamer from "nerdamer";
import "nerdamer/Algebra.js";
import "nerdamer/Solve.js";

const input = "input.txt";
const stones = getLines(input).map((line) =>
  line
    .replace(/[@]/g, ",")
    .split(",")
    .map((x) => Number(x.trim())),
);

function codirectional([x, y], [sx, sy, _sz, vx, vy, _vz]) {
  return (x - sx) * vx >= 0 && (y - sy) * vy >= 0;
}

function getIntersection(
  [x1, y1, _z1, xv1, yv1, _zv1],
  [x2, y2, _z2, xv2, yv2, _zv2],
) {
  const [a1, b1, c1] = [yv1, -xv1, yv1 * x1 - xv1 * y1];
  const [a2, b2, c2] = [yv2, -xv2, yv2 * x2 - xv2 * y2];

  if (a1 * b2 === b1 * a2) {
    return null;
  }

  const x = (c1 * b2 - c2 * b1) / (a1 * b2 - a2 * b1);
  const y = (c2 * a1 - c1 * a2) / (a1 * b2 - a2 * b1);
  return [x, y];
}

function part1() {
  const [tl, tu] = input.includes("example")
    ? [7, 27]
    : [200000000000000, 400000000000000];

  return stones
    .flatMap((s1, i) =>
      stones.slice(i + 1).map((s2) => {
        const pt = getIntersection(s1, s2);
        if (pt === null) {
          return false;
        }
        const [px, py] = pt;

        return (
          tl <= px &&
          px <= tu &&
          tl <= py &&
          py <= tu &&
          codirectional(pt, s1) &&
          codirectional(pt, s2)
        );
      }),
    )
    .filter((x) => x).length;
}

function part2() {
  // should find a single solutions for that many
  const equations = stones.slice(0, 5).flatMap(([x, y, z, vx, vy, vz]) => {
    const eq1 = `(x-${x})*(${vy}-v2)-(y-${y})*(${vx}-v1)==0`;
    const eq2 = `(y-${y})*(${vz}-v3)-(z-${z})*(${vy}-v2)==0`;
    return [eq1, eq2];
  });
  // solve with Mathematica (652666650475950)
  return equations.join(" &&\n");

  // doesn't work
  return nerdamer.solveEquations(equations, ["x", "y", "z", "vx", "vy", "vz"]);
}

console.log(part1());
console.log(part2());
