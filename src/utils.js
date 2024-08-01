const reservedKitty = [
  {
    totalPlayer: 3,
    baseKitty: 4000,
    category: 'A',
  },
  {
    totalPlayer: 2,
    baseKitty: 3000,
    category: 'B',
  },
  {
    totalPlayer: 5,
    baseKitty: 2000,
    category: 'C',
  },
  {
    totalPlayer: 3,
    baseKitty: 1000,
    category: 'D',
  },
];

const pickedIds = new Set();

function getRandomUniquePlayerId(players) {
  if (pickedIds.size === players.length) {
    pickedIds.clear();
    // throw new Error('All IDs have been picked');
  }

  let randomId;
  do {
    const randomIndex = Math.floor(Math.random() * players.length);
    randomId = players[randomIndex].id;
  } while (pickedIds.has(randomId));

  pickedIds.add(randomId);
  return randomId;
}

export default reservedKitty;
export { getRandomUniquePlayerId };
