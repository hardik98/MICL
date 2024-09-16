const reservedKitty = [
  {
    totalPlayer: 1,
    baseKitty: 5000,
    category: 'AP',
  },
  {
    totalPlayer: 3,
    baseKitty: 4000,
    category: 'A',
  },
  {
    totalPlayer: 4,
    baseKitty: 3000,
    category: 'B',
  },
  {
    totalPlayer: 4,
    baseKitty: 2000,
    category: 'C',
  },
  {
    totalPlayer: 4,
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

function getReservedKitty(selectedTeam) {
  const categoryPlayers = (category) =>
    selectedTeam?.players.filter((player) => player.Category === category).length;

  const categoryAPlusplayers = categoryPlayers('AP');
  const categoryAplayers = categoryPlayers('A');
  const categoryBplayers = categoryPlayers('B');
  const categoryCplayers = categoryPlayers('C');
  const categoryDplayers = categoryPlayers('D');

  let totalReservedKitty = 0;
  reservedKitty.forEach((item) => {
    totalReservedKitty += item.baseKitty * item.totalPlayer;
  });

  //  Note: Need to refactor this
  totalReservedKitty -= categoryAPlusplayers * reservedKitty[0].baseKitty;
  totalReservedKitty -= categoryAplayers * reservedKitty[1].baseKitty;
  totalReservedKitty -= categoryBplayers * reservedKitty[2].baseKitty;
  totalReservedKitty -= categoryCplayers * reservedKitty[3].baseKitty;
  totalReservedKitty -= categoryDplayers * reservedKitty[4].baseKitty;

  return totalReservedKitty;
}

export default reservedKitty;
export { getRandomUniquePlayerId, getReservedKitty };
