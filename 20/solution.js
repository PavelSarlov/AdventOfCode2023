import { lcm } from "mathjs";
import { getLines } from "../lib/helpers.js";

function init() {
  const mods = Object.fromEntries(
    getLines("input.txt").map((line) => {
      const [name, targets] = line.split(" -> ");
      const mod = {
        name: name[0] === "b" ? name : name.slice(1),
        targets: targets.split(",").map((x) => x.trim()),
        type: name[0],
      };

      const broadcast = (pulseQueue, pulse) =>
        mod.targets.forEach((target) =>
          pulseQueue.push({ pulse, target, sender: mod.name }),
        );

      switch (name[0]) {
        case "%":
          mod.on = false;
          mod.handlePulse = (pulseQueue, pulse) => {
            if (pulse === 0) {
              pulse = mod.on ? 0 : 1;
              mod.on = !mod.on;
              broadcast(pulseQueue, pulse);
            }
          };
          break;
        case "&":
          mod.handlePulse = (pulseQueue, pulse, sender) => {
            mod.inputs[sender] = pulse;
            if (Object.values(mod.inputs).every((p) => p === 1)) {
              pulse = 0;
            } else {
              pulse = 1;
            }
            broadcast(pulseQueue, pulse);
          };
          break;
        default:
          mod.handlePulse = broadcast;
          break;
      }

      return [mod.name, mod];
    }),
  );

  Object.entries(mods).forEach(([name, mod]) => {
    if (mod.type === "&") {
      mod.inputs = Object.fromEntries(
        Object.entries(mods)
          .filter(([, m]) => m.targets.includes(name))
          .map(([name]) => [name, 0]),
      );
    }
  });

  return mods;
}
function pushButton(pulseQueue) {
  pulseQueue.push({ pulse: 0, target: "broadcaster", sender: "button" });
}

function part1() {
  const mods = init();
  let pulses = [0, 0];
  const q = [];

  for (let i = 0; i < 1000; i++) {
    pushButton(q);

    while (q.length) {
      const { sender, pulse, target } = q.shift();
      pulses[pulse]++;
      const mod = mods[target];
      mod?.handlePulse(q, pulse, sender);
    }
  }

  return pulses[0] * pulses[1];
}

function part2() {
  const mods = init();
  const [feed] = Object.entries(mods)
    .filter(([, m]) => m.targets.includes("rx"))
    .map(([name]) => name);
  // we assume only one feeds into rx
  // and it is a conjunction module
  // meaning it sends low pulse when all of its
  // inputs fed a high pulse, which happens
  // when their cycles meet (LCM)
  const cycles = Object.fromEntries(
    Object.entries(mods)
      .filter(([, m]) => m.targets.includes(feed))
      .map(([name]) => [name, null]),
  );

  const q = [];
  let buttonPresses = 0;

  while (true) {
    pushButton(q);
    buttonPresses++;

    while (q.length) {
      const { sender, pulse, target } = q.shift();

      if (feed === target && pulse === 1) {
        cycles[sender] = cycles[sender] ?? buttonPresses;

        if (Object.values(cycles).every((x) => x)) {
          return lcm(...Object.values(cycles));
        }
      }

      const mod = mods[target];
      mod?.handlePulse(q, pulse, sender);
    }
  }
}

console.log(part1());
console.log(part2());
