/* eslint-disable  */
import { MenuItem, Select } from '@mui/material';
import React, { useCallback, useEffect, useState } from 'react';
import { useFetchPlayersQuery, useLazyFetchPlayersQuery } from '../../../redux/api/playersApi';
import { getRandomUniquePlayerId, resetPickedIds } from '../../../utils';
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
    setSelectedPlayerId(players.length === 1 ? null : getRandomUniquePlayerId(players));
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
    <div style={{ display: 'flex', minHeight: '450px' }}>
      <DrawerMenu
        players={players}
        selectedPlayerId={selectedPlayerId}
        handleChange={handleChange}
        handleInputChange={handleInputChange}
        setDrawerOpen={setDrawerOpen}
        path={path}
      />
      <div
        style={{
          flexGrow: 1,
          transition: 'margin-left 0.3s',
          marginLeft: drawerOpen ? `${drawerWidthOpen}px` : `${drawerWidthClosed}px`,
        }}
      >
        <Select
          label="Select Category"
          variant="outlined"
          fullWidth
          value={selectedCategory}
          onChange={handleCategoryChange}
          MenuProps={{
            PaperProps: {
              sx: {
                bgcolor: '#333', // Background color for the entire dropdown menu
                '& .MuiList-root': {
                  padding: 0,
                },
              },
            },
          }}
          sx={{
            width: '45%',
            backgroundColor: '#333', // Background color
            color: '#fff', // Text color
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                borderColor: '#fff',
              },
              '&:hover fieldset': {
                borderColor: '#fff',
              },
              '&.Mui-focused fieldset': {
                borderColor: '#fff',
              },
              '&.Mui-focused:hover fieldset': {
                borderColor: '#fff',
              },
            },
            '& .MuiSelect-root': {
              color: '#fff',
            },
            '& .MuiSelect-icon': {
              color: '#fff',
            },
          }}
        >
          <MenuItem
            value="All"
            sx={{
              backgroundColor: '#333',
              color: '#fff',
              '&.Mui-selected': {
                backgroundColor: '#4d4d4d',
                color: '#fff',
                '&:hover': {
                  backgroundColor: '#4d4d4d',
                },
              },
              '&:hover': {
                backgroundColor: '#4d4d4d',
              },
            }}
          >
            All
          </MenuItem>
          <MenuItem
            value="AP"
            sx={{
              backgroundColor: '#333',
              color: '#fff',
              '&.Mui-selected': {
                backgroundColor: '#4d4d4d',
                color: '#fff',
                '&:hover': {
                  backgroundColor: '#4d4d4d',
                },
              },
              '&:hover': {
                backgroundColor: '#4d4d4d',
              },
            }}
          >
            Category A+
          </MenuItem>
          <MenuItem
            value="A"
            sx={{
              backgroundColor: '#333',
              color: '#fff',
              '&.Mui-selected': {
                backgroundColor: '#4d4d4d',
                color: '#fff',
                '&:hover': {
                  backgroundColor: '#4d4d4d',
                },
              },
              '&:hover': {
                backgroundColor: '#4d4d4d',
              },
            }}
          >
            Category A
          </MenuItem>
          <MenuItem
            value="B"
            sx={{
              backgroundColor: '#333',
              color: '#fff',
              '&.Mui-selected': {
                backgroundColor: '#4d4d4d',
                color: '#fff',
                '&:hover': {
                  backgroundColor: '#4d4d4d',
                },
              },
              '&:hover': {
                backgroundColor: '#4d4d4d',
              },
            }}
          >
            Category B
          </MenuItem>
          <MenuItem
            value="C"
            sx={{
              backgroundColor: '#333',
              color: '#fff',
              '&.Mui-selected': {
                backgroundColor: '#4d4d4d',
                color: '#fff',
                '&:hover': {
                  backgroundColor: '#4d4d4d',
                },
              },
              '&:hover': {
                backgroundColor: '#4d4d4d',
              },
            }}
          >
            Category C
          </MenuItem>
          <MenuItem
            value="D"
            sx={{
              backgroundColor: '#333',
              color: '#fff',
              '&.Mui-selected': {
                backgroundColor: '#4d4d4d',
                color: '#fff',
                '&:hover': {
                  backgroundColor: '#4d4d4d',
                },
              },
              '&:hover': {
                backgroundColor: '#4d4d4d',
              },
            }}
          >
            Category D
          </MenuItem>
        </Select>
        <PlayerDetails
          selectedPlayer={data.find((player) => player.id === selectedPlayerId)}
          handleNextPlayer={handleNextPlayer}
        />
      </div>
    </div>
  );
}

export default PlayersList;
