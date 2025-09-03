/* eslint-disable  */
import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Filter, Search, Trophy, DollarSign, Target, Users } from 'lucide-react';
import { useFetchPlayersQuery, useLazyFetchPlayersQuery } from '../../../redux/api/playersApi';
import { getRandomUniquePlayerId, resetPickedIds, cn } from '../../../lib/utils';
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
          "flex-1 transition-all duration-300 ease-in-out",
          drawerOpen ? "ml-64" : "ml-8"
        )}
      >
        {/* Compact Category Filter */}
        <div className="flex items-center justify-between mb-4 p-2 bg-white/5 rounded-lg">
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-cricket-gold" />
            <span className="text-sm font-medium text-white/80">Category:</span>
          </div>
          <select
            value={selectedCategory}
            onChange={handleCategoryChange}
            className="bg-white/5 border border-white/20 rounded-lg px-3 py-1.5 text-sm text-white focus:border-cricket-lightgreen focus:ring-1 focus:ring-cricket-lightgreen/50 focus:outline-none transition-all duration-200 cursor-pointer"
          >
            <option value="All">All Players</option>
            <option value="AP">A+</option>
            <option value="A">A</option>
            <option value="B">B</option>
            <option value="C">C</option>
            <option value="D">D</option>
          </select>
        </div>

        <div className="mt 4">
          <PlayerDetails
            selectedPlayer={data?.find((player) => player.id === selectedPlayerId)}
            handleNextPlayer={handleNextPlayer}
          />
        </div>
      </div>
    </div>
  );
}

export default PlayersList;
