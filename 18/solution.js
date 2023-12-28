import { getLines, getPolygonArea } from "../lib/helpers.js";

const dirCoords = {
  U: [-1, 0],
  D: [1, 0],
  L: [0, -1],
  R: [0, 1],
};

const hexDir = {
  0: "R",
  1: "D",
  2: "L",
  3: "U",
};

const input = getLines("input.txt").map((line) => {
  const [dir, count, color] = line.split(" ");
  return {
    dir: dirCoords[dir],
    count: Number(count),
    color: color.replace(/[#()]/g, ""),
  };
});

function getLagoonArea(instructions) {
  const vertices = [[0, 0]];

  instructions.forEach(({ dir, count }) =>
    vertices.push(
      dir.map((x, i) => x * count + vertices[vertices.length - 1][i]),
    ),
  );

  const circumference = instructions.reduce(
    (prev, { count }) => prev + count,
    0,
  );

  return getPolygonArea(vertices) + circumference / 2 + 1;
}

function part1() {
  return getLagoonArea(input);
}

function part2() {
  return getLagoonArea(
    input.map(({ color }) => {
      const hex = color.replace("#", "");
      return {
        count: Number.parseInt(hex.slice(0, 5), 16),
        dir: dirCoords[hexDir[Number.parseInt(hex[5], 10)]],
      };
    }),
  );
}

console.log(part1());
console.log(part2());
