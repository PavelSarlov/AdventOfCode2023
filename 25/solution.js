import { mincut } from "@graph-algorithm/minimum-cut";
import { getLines } from "../lib/helpers.js";
import JsGraphs from "js-graph-algorithms";

const edges = getLines("input.txt").flatMap((line) => {
  const [comp, connected] = line.split(": ");
  const connections = connected.split(" ");
  return connections.map((conn) => [comp, conn]);
});
const V = new Map([...new Set(edges.flat())].map((e, i) => [e, i]));
const E = edges.map(([v1, v2]) => [V.get(v1), V.get(v2)].sort());
const G = new JsGraphs.Graph(V.size);

const minCut = [...mincut(E)].map((x) => x.sort());
E.forEach(([v1, v2]) => {
  if (minCut.find(([v3, v4]) => v1 === v3 && v2 === v4)) {
    return;
  }
  G.addEdge(v1, v2);
});

const cc = new JsGraphs.ConnectedComponents(G);
console.log(cc.id.filter(x => x === 0).length * cc.id.filter(x => x === 1).length);
