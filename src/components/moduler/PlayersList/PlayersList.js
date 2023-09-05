/* eslint-disable  */
import React, { useEffect, useState } from 'react';
import {
  Checkbox,
  FormControlLabel,
  TextField,
  Typography,
  Select,
  Grid,
  MenuItem,
} from '@mui/material';
import { useFetchPlayersQuery, useLazyFetchPlayersQuery } from '../../../redux/api/playersApi';
import PlayerDetails from '../playerDetails/PlayerDetails';

function PlayersList() {
  const { data, error, isLoading, isFetching } = useFetchPlayersQuery();
  const [trigger, { data: playerList }] = useLazyFetchPlayersQuery();

  const [players, setPlayers] = useState([]);
  const [selectedPlayerId, setSelectedPlayerId] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    if (data) {
      setPlayers(data);
    }
  }, [data, isFetching]);

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

  const handleChange = (id, isSelected) => {
    setSelectedPlayerId(isSelected ? id : null);
  };

  const handleCategoryChange = (event) => {
    const selectedCategory = event.target.value;
    setSelectedCategory(selectedCategory);
    if (selectedCategory === 'All') {
      setPlayers(data);
    } else {
      const filteredData = data.filter((player) => player.Category === selectedCategory);
      setPlayers(filteredData);
    }
  };

  const handleInputChange = (value) => {
    if (value !== '') {
      setPlayers(
        players.filter((player) => player.name.toLowerCase().includes(value.toLowerCase())),
      );
    } else {
      setPlayers(data);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} sm={6}>
          <TextField
            id="outlined-basic"
            label="Search Player"
            variant="outlined"
            onChange={(e) => {
              handleInputChange(e.target.value.trim());
            }}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Select
            label="Select Category"
            variant="outlined"
            fullWidth
            value={selectedCategory}
            onChange={handleCategoryChange}
          >
            <MenuItem value="All">All</MenuItem>
            <MenuItem value="A">Category A</MenuItem>
            <MenuItem value="B">Category B</MenuItem>
            <MenuItem value="C">Category C</MenuItem>
            <MenuItem value="D">Category D</MenuItem>
          </Select>
        </Grid>
      </Grid>
      <div style={{ display: 'flex' }}>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'baseline',
            width: '30vw',
            maxHeight: '76vh',
            overflow: 'scroll',
          }}
        >
          {players.map((player) => (
            <div key={player.id}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={selectedPlayerId === player.id}
                    onChange={(e, isChecked) => handleChange(player.id, isChecked)}
                    inputProps={{ 'aria-label': 'controlled' }}
                  />
                }
                label={<Typography variant="h5">{player.name}</Typography>}
              />
            </div>
          ))}
        </div>
        <div style={{ width: '70vw' }}>
          {/* <Profile selectedPlayer={data.find((player) => player.id === selectedPlayerId)} /> */}
          <PlayerDetails selectedPlayer={data.find((player) => player.id === selectedPlayerId)} />
        </div>
      </div>
    </div>
  );
}

export default PlayersList;
