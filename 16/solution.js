import lodash from "lodash";
import { getLines } from "../lib/helpers.js";

const { cloneDeep } = lodash;

const contraption = getLines("input.txt").map((line) => line.split(""));
let visited;
let beams;

function outOfBounds([row, col]) {
  return (
    row < 0 ||
    row >= contraption.length ||
    col < 0 ||
    col >= contraption[0].length
  );
}

function handleDirChange([prevRow, prevCol], [newRow, newCol]) {
  const rowOffset = prevRow - newRow;
  const colOffset = prevCol - newCol;
  switch (true) {
    case rowOffset < 0:
      return "down";
    case rowOffset > 0:
      return "up";
    case colOffset < 0:
      return "right";
    case colOffset > 0:
      return "left";
  }
}

function splitBeam(splitter, dir, coords) {
  const shouldSplit =
    (splitter === "-" && ["up", "down"].includes(dir)) ||
    (splitter === "|" && ["left", "right"].includes(dir));
  const axis = splitter === "-" ? 1 : 0;

  if (shouldSplit) {
    const coords1 = cloneDeep(coords);
    coords1[axis]++;
    const coords2 = cloneDeep(coords);
    coords2[axis]--;
    beams.push({ coords: coords1, dir: splitter === "-" ? "right" : "down" });
    beams.push({ coords: coords2, dir: splitter === "-" ? "left" : "up" });
  } else {
    const offset = ["left", "up"].includes(dir) ? -1 : 1;
    coords[axis] += offset;
  }
}

function reflectBeam(mirror, dir, coords) {
  const axis = ["left", "right"].includes(dir) ? 0 : 1;
  const offset =
    mirror === "/"
      ? ["left", "up"].includes(dir)
        ? 1
        : -1
      : ["right", "down"].includes(dir)
        ? 1
        : -1;
  coords[axis] += offset;
}

function handleEncounter(coords, dir) {
  if (outOfBounds(coords)) {
    return;
  }

  const [row, col] = coords;
  const tile = contraption[row][col];
  switch (tile) {
    case "/":
    case "\\":
      reflectBeam(tile, dir, coords);
      break;
    case "-":
    case "|":
      if (visited[row][col] === "#") return;
      splitBeam(tile, dir, coords);
      break;
    default:
      const axis = ["left", "right"].includes(dir) ? 1 : 0;
      const offset = ["left", "up"].includes(dir) ? -1 : 1;
      coords[axis] += offset;
  }

  visited[row][col] = "#";

  return coords;
}

function shootBeam(coords, dir) {
  while (true) {
    const prevCoords = cloneDeep(coords);
    coords = handleEncounter(coords, dir);
    if (!coords) {
      break;
    }
    dir = handleDirChange(prevCoords, coords);
  }
}

function countEnergized() {
  return visited.reduce(
    (prev, curr) => prev + curr.filter((tile) => tile === "#").length,
    0,
  );
}

function part1() {
  visited = cloneDeep(contraption);
  beams = [{ coords: [0, 0], dir: "right" }];
  while (beams.length) {
    const { coords, dir } = beams.shift();
    shootBeam(coords, dir);
  }
  return countEnergized();
}

function part2() {
  const startingBeams = [
    ...contraption.flatMap((l, i) => [
      { coords: [i, 0], dir: "right" },
      { coords: [i, l.length - 1], dir: "left" },
    ]),
    ...contraption[0].flatMap((_, j) => [
      { coords: [0, j], dir: "down" },
      { coords: [contraption.length - 1, j], dir: "up" },
    ]),
  ];

  return Math.max(
    ...startingBeams.map((beam) => {
      visited = cloneDeep(contraption);
      beams = [beam];
      while (beams.length) {
        const { coords, dir } = beams.shift();
        shootBeam(coords, dir);
      }
      return countEnergized();
    }),
  );
}

console.log(part1());
console.log(part2());
