import fs from "fs";

export function getLines(path) {
  return fs.readFileSync(path).toString().split("\n").slice(0, -1);
}
