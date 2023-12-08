import { getLines } from "../lib/helpers.js";

const input = getLines("input.txt");
const instructions = input[0];
const nodes = new Map(
  input.slice(1).map((line) => {
    const [node, left, right] = line
      .replace(/[^A-Z1-9]/g, " ")
      .replace(/\s+/g, " ")
      .trim()
      .split(" ");
    return [node, { left, right }];
  }),
);

function gcd(a, b) {
  if (a == 0) return b;
  return gcd(b % a, a);
}

function lcm(a, ...b) {
  return b.length === 1 ? (a * b) / gcd(a, b) : lcm(lcm(...b), a);
}

function part1(startNode, endNode) {
  for (
    let i = 0, currentNode = startNode, step = 0;
    ;
    i = (i + 1) % instructions.length, step++
  ) {
    if (
      endNode
        ? currentNode === endNode
        : currentNode[currentNode.length - 1] === "Z"
    )
      return step;

    const paths = nodes.get(currentNode);
    currentNode = instructions[i] === "L" ? paths.left : paths.right;
  }
}

async function part2() {
  let startingNodes = [...nodes.keys()].filter(
    (node) => node[node.length - 1] === "A",
  );

  const steps = await Promise.all(startingNodes.map((node) => part1(node)));
  return lcm(...steps);
}

console.log(part1("AAA", "ZZZ"));
console.log(await part2());
