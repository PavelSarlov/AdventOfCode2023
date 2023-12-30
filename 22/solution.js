import { getLines } from "../lib/helpers.js";
import lodash from "lodash";

const upwardsComp = (br1, br2) => br1.s.z - br2.s.z;
const bricks = getLines("input.txt")
  .map((line) => {
    const [s, e] = line.split("~").map((coords) => {
      const [x, y, z] = coords.split(",").map((x) => Number(x));
      return { x, y, z };
    });
    return { s, e };
  })
  .sort(upwardsComp)
  .map((br1, i, arr) => {
    const maxZ = arr
      .slice(0, i)
      .reduce(
        (maxZ, br2) =>
          overlaps(br1, br2) ? Math.max(maxZ, br2.e.z + 1) : maxZ,
        1,
      );
    br1.e.z -= br1.s.z - maxZ;
    br1.s.z = maxZ;
    return br1;
  })
  .sort(upwardsComp);

const supportedBy = Array(bricks.length)
  .fill(0)
  .map(() => new Set());
const supportOf = Array(bricks.length)
  .fill(0)
  .map(() => new Set());

bricks.forEach((br1, i) => {
  bricks.slice(0, i).forEach((br2, j) => {
    if (
      overlaps(br1, br2) &&
      Math.min(br1.s.z, br1.e.z) === Math.max(br2.s.z, br2.e.z) + 1
    ) {
      supportOf[j].add(i);
      supportedBy[i].add(j);
    }
  });
});

function overlaps(br1, br2) {
  return (
    Math.max(br1.s.x, br2.s.x) <= Math.min(br1.e.x, br2.e.x) &&
    Math.max(br1.s.y, br2.s.y) <= Math.min(br1.e.y, br2.e.y)
  );
}

function part1() {
  let disintegrated = 0;
  bricks.forEach((_, i) => {
    if (![...supportOf[i]].some((j) => supportedBy[j].size === 1)) {
      disintegrated++;
    }
  });
  return disintegrated;
}

function part2() {
  let fallen = 0;
  bricks.forEach((_, i) => {
    const q = [...supportOf[i]].filter((j) => supportedBy[j].size === 1);
    const wouldFall = new Set([...q]);
    while (q.length) {
      const k = q.shift();
      lodash.difference([...supportOf[k]], [...wouldFall]).forEach((j) => {
        if (
          lodash.difference([...supportedBy[j]], [...wouldFall]).length === 0
        ) {
          wouldFall.add(j);
          q.push(j);
        }
      });
    }
    fallen += wouldFall.size;
  });
  return fallen;
}

console.log(part1());
console.log(part2());
