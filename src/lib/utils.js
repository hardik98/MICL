export const reservedKitty = [
  {
    totalPlayer: 3,
    baseKitty: 4000,
    category: 'Elite',
  },
  {
    totalPlayer: 4,
    baseKitty: 3000,
    category: 'Plate',
  },
  {
    totalPlayer: 3,
    baseKitty: 2000,
    category: 'Silver',
  },
  {
    totalPlayer: 5,
    baseKitty: 1000,
    category: 'Bronze',
  },
];
const pickedIds = new Set();

function resetPickedIds() {
  pickedIds.clear();
}

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
  const categoryElitePlayers = categoryPlayers('Elite');
  const categoryPlatePlayers = categoryPlayers('Plate');
  const categorySilverPlayers = categoryPlayers('Silver');
  const categoryBronzePlayers = categoryPlayers('Bronze');

  let totalReservedKitty = 0;
  reservedKitty.forEach((item) => {
    totalReservedKitty += item.baseKitty * item.totalPlayer;
  });

  // Subtract the kitty for players already acquired
  totalReservedKitty -= categoryElitePlayers * reservedKitty[0].baseKitty;
  totalReservedKitty -= categoryPlatePlayers * reservedKitty[1].baseKitty;
  totalReservedKitty -= categorySilverPlayers * reservedKitty[2].baseKitty;
  totalReservedKitty -= categoryBronzePlayers * reservedKitty[3].baseKitty;

  return totalReservedKitty;
}

// Utility function for conditional class names
export function cn(...inputs) {
  return inputs.filter(Boolean).join(' ');
}

export { getRandomUniquePlayerId, getReservedKitty, resetPickedIds };
