import { getLines } from "../lib/helpers.js";

const cardsPriority = {
  A: 13,
  K: 12,
  Q: 11,
  T: 10,
  9: 9,
  8: 8,
  7: 7,
  6: 6,
  5: 5,
  4: 4,
  3: 3,
  2: 2,
  J: 1,
};

const handsPriority = {
  fiveOfKind: 7,
  fourOfKind: 6,
  fullHouse: 5,
  threeOfKind: 4,
  twoPair: 3,
  onePair: 2,
  highCard: 1,
};

function cardComparator(a, b) {
  return cardsPriority[a] - cardsPriority[b];
}

function handComparator(a, b) {
  const diff = handsPriority[a.type] - handsPriority[b.type];
  if (diff === 0) {
    for (let i = 0; i < a.hand.length; i++) {
      const cardDiff = cardComparator(a.hand[i], b.hand[i]);
      if (cardDiff === 0) {
        continue;
      }
      return cardDiff;
    }
  }
  return diff;
}

function getHandType(hand) {
  const cards = {};
  for (const card of hand) {
    cards[card] = cards[card] ? cards[card] + 1 : 1;
  }
  const values = Object.values(cards);
  switch (true) {
    case values.includes(5):
      return "fiveOfKind";
    case values.includes(4):
      return "fourOfKind";
    case values.includes(3) && values.includes(2):
      return "fullHouse";
    case values.includes(3):
      return "threeOfKind";
    case values.filter((x) => x === 2).length === 2:
      return "twoPair";
    case values.includes(2):
      return "onePair";
    default:
      return "highCard";
  }
}

function updateJokerValue({ hand, type }) {
  const jokersCount = hand.split("").filter((x) => x === "J").length;
  if (jokersCount === 0) {
    return {};
  }

  switch (type) {
    case "fiveOfKind":
    case "fourOfKind":
    case "fullHouse":
      return { type: "fiveOfKind" };
    case "threeOfKind":
      return {
        type: "fourOfKind",
      };
    case "twoPair":
      return {
        type: jokersCount == 1 ? "fullHouse" : "fourOfKind",
      };
    case "onePair":
      return {
        type: "threeOfKind",
      };
    default:
      return {
        type: "onePair",
      };
  }
}

const input = getLines("input.txt").map((line) => {
  let [hand, bid] = line.split(" ");
  return { hand, bid: Number(bid), type: getHandType(hand) };
});

function part1() {
  return input
    .sort(handComparator)
    .map((card, idx) => card.bid * (idx + 1))
    .reduce((a, b) => a + b, 0);
}

function part2() {
  return input
    .map((card) => ({ ...card, ...updateJokerValue(card) }))
    .sort(handComparator)
    .map((card, idx) => card.bid * (idx + 1))
    .reduce((a, b) => a + b, 0);
}

console.log(part1());
console.log(part2());
