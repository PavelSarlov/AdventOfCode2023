import fs from "fs";

export function getLines(path) {
  return fs.readFileSync(path).toString().split("\n").slice(0, -1);
}

export function transpose(pattern) {
  let transposed = [];
  for (let i = 0; i < pattern.length; i++) {
    for (let j = 0; j < pattern[i].length; j++) {
      transposed[j] = transposed[j] || "";
      transposed[j] += pattern[i][j];
    }
  }
  return transposed;
}
