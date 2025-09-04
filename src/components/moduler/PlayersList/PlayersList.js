/* eslint-disable  */
import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Filter, Search, Trophy, DollarSign, Target, Users, Flame } from 'lucide-react';
import { useFetchPlayersQuery, useLazyFetchPlayersQuery } from '../../../redux/api/playersApi';
import { getRandomUniquePlayerId, resetPickedIds } from '../../../lib/utils';
import { cn } from '../../../lib/utils';
import DrawerMenu from '../drawer/DrawerMenu';
import PlayerDetails from '../playerDetails/PlayerDetails';

const drawerWidthOpen = 268;
const drawerWidthClosed = 30;

function PlayersList({ path }) {
  const { data, error, isLoading, isFetching } = useFetchPlayersQuery();
  const [trigger, { data: playerList }] = useLazyFetchPlayersQuery();

  const [players, setPlayers] = useState([]);
  const [selectedPlayerId, setSelectedPlayerId] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchInput, setSearchInput] = useState('');

  const filteredPlayers = useCallback(
    (playerData, value, category) => {
      let filtered = playerData;
      // setSelectedPlayerId(null);
      switch (path) {
        case 'Pending':
          filtered = filtered.filter((player) => !player.isSold && !player.isUnsold);
          break;
        case 'Sold':
          filtered = filtered.filter((player) => player.isSold);
          break;
        case 'Unsold':
          filtered = filtered.filter((player) => player.isUnsold);
          break;
        default:
          filtered = filtered.filter((player) => !player.isSold && !player.isUnsold);
          break;
      }

      // Apply filtering based on search input
      if (value) {
        filtered = filtered.filter((player) =>
          player.name.toLowerCase().includes(value.toLowerCase()),
        );
      }

      // Apply filtering based on category
      if (category !== 'All') {
        filtered = filtered.filter((player) => player.Category === category);
      }
      setPlayers(filtered);
    },
    [path, selectedCategory],
  );

  useEffect(() => {
    if (data) {
      filteredPlayers(data, searchInput, selectedCategory);
    }
  }, [data, isFetching, path]);

  useEffect(() => {
    resetPickedIds();
  }, [path]);

  window.addEventListener('storage', (event) => {
    if (event.key === 'sharedData') {
      trigger();
      localStorage.removeItem('sharedData');
    }
  });

  useEffect(() => {
    if (playerList?.length) {
      setPlayers(playerList);
    }
  }, [playerList]);

  const handleNextPlayer = () => {
    setSelectedPlayerId(players.length <= 1 ? null : getRandomUniquePlayerId(players));
  };

  const handleChange = (id, isSelected) => {
    setSelectedPlayerId(isSelected ? id : null);
  };

  const handleCategoryChange = (event) => {
    const category = event.target.value;
    setSelectedCategory(category);
    filteredPlayers(data, searchInput, category);
  };

  const handleInputChange = (value) => {
    setSearchInput(value);
    filteredPlayers(data, value, selectedCategory);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className="flex min-h-screen">
      <DrawerMenu
        players={players}
        selectedPlayerId={selectedPlayerId}
        handleChange={handleChange}
        handleInputChange={handleInputChange}
        setDrawerOpen={setDrawerOpen}
        path={path}
      />
      <div
        className={cn(
          'flex-1 transition-all duration-300 ease-in-out',
          drawerOpen ? 'ml-64' : 'ml-8',
        )}
      >
        {/* Modern Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-6"
          style={{ display: 'flex', justifyContent: 'flex-end', gap: '1.5rem', marginLeft: '1rem' }}
        >
          <div className="flex items-center space-x-3 mb-4 ">
            <Filter className="h-5 w-5 text-cricket-gold" />
            <span className="text-white font-semibold text-lg">Filter by Category</span>
          </div>
          {/* <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-cricket-gold/50">
            <img
              src={`/assets/${data[0].photo}`}
              alt={data[0].name}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
            <div
              className="w-full h-full bg-gradient-to-br from-cricket-green to-cricket-lightgreen flex items-center justify-center"
              style={{ display: 'none' }}
            >
              <Users className="h-8 w-8 text-white" />
            </div>
          </div> */}
          <div className="relative w-full max-w-xs">
            <select
              value={selectedCategory}
              onChange={handleCategoryChange}
              className="w-full bg-white/10 border border-white/30 rounded-xl px-4 py-3 text-white backdrop-blur-sm focus:border-cricket-lightgreen focus:ring-2 focus:ring-cricket-lightgreen/50 focus:outline-none transition-all duration-300 appearance-none cursor-pointer"
            >
              <option value="All" className="bg-cricket-stadium text-white">
                All Categories
              </option>
              <option value="AP" className="bg-cricket-stadium text-white">
                Category A+
              </option>
              <option value="A" className="bg-cricket-stadium text-white">
                Category A
              </option>
              <option value="B" className="bg-cricket-stadium text-white">
                Category B
              </option>
              <option value="C" className="bg-cricket-stadium text-white">
                Category C
              </option>
              <option value="D" className="bg-cricket-stadium text-white">
                Category D
              </option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <Filter className="h-4 w-4 text-white/70" />
            </div>
          </div>
        </motion.div>

        <PlayerDetails
          selectedPlayer={data?.find((player) => player.id === selectedPlayerId)}
          handleNextPlayer={handleNextPlayer}
        />
      </div>
    </div>
  );
}

export default PlayersList;
