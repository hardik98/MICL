/* eslint-disable */
import React, { useState } from 'react';
import './PlayerDetails.css';
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Modal,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import {
  useAddSoldPlayerMutation,
  useFetchTeamsQuery,
  useSoldPlayerMutation,
} from '../../../redux/api/playersApi';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

function PlayerDetails({ selectedPlayer }) {
  const existingSelectedTeam = selectedPlayer?.soldTo;
  const existingSoldPrice = Number(selectedPlayer?.soldPrice);
  const [open, setOpen] = React.useState(false);
  const { data: teams } = useFetchTeamsQuery();
  const [soldTo, setSoldTo] = useState(Number(selectedPlayer?.soldTo) || '');
  const [soldPrice, setSoldPrice] = useState(Number(selectedPlayer?.soldPrice) || 0);
  const [soldPlayer] = useSoldPlayerMutation();
  const [addSoldPlayer] = useAddSoldPlayerMutation();
  const currentSelectedTeam = teams?.find((team) => Number(team?.id) === soldTo);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  React.useEffect(() => {
    setSoldPrice(Number(selectedPlayer?.soldPrice || 0));
    setSoldTo(Number(selectedPlayer?.soldTo) || '');
  }, [selectedPlayer]);

  const handlePlayerSold = async () => {
    const updatedSelectedPlayer = {
      ...selectedPlayer,
      isSold: true,
      soldPrice: Number(soldPrice),
      soldTo,
    };
    await soldPlayer({
      id: selectedPlayer.id,
      updatedPlayer: updatedSelectedPlayer,
    });

    if (selectedPlayer?.isSold) {
      const existingSoldPlayerTeam = teams.find(
        (team) => Number(team.id) === Number(existingSelectedTeam),
      );

      const updatedPlayers = existingSoldPlayerTeam.players.filter(
        (item) => Number(item?.id) !== Number(selectedPlayer?.id),
      );

      const updatedTeam = {
        ...existingSoldPlayerTeam,
        players: updatedPlayers,
        availableKitty: existingSoldPlayerTeam.availableKitty + existingSoldPrice * 1000,
      };

      await addSoldPlayer({
        id: Number(existingSelectedTeam),
        updatedTeam,
      });
    }

    handleClose();
    const selectedTeam = teams.find((team) => Number(team.id) === Number(soldTo));

    const updatedTeam = {
      ...selectedTeam,
      players: [...selectedTeam.players, updatedSelectedPlayer],
      availableKitty: selectedTeam.availableKitty - soldPrice * 1000,
    };

    await addSoldPlayer({
      id: Number(soldTo),
      updatedTeam,
    });

    localStorage.setItem('sharedData', JSON.stringify({ message: 'Updated Data' }));
  };

  return (
    <div className="player-details">
      {!selectedPlayer ? (
        <div className="player-details-placeholder">Select player to view the player profile</div>
      ) : (
        <>
          <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={style}>
              {teams?.length > 0 ? (
                <>
                  <Typography id="modal-modal-title" variant="h6" component="h2">
                    Player: {selectedPlayer?.name}
                  </Typography>
                  <Typography id="modal-modal-description" sx={{ mt: 2, mb: 2 }}>
                    Sold Price(in thousands):
                  </Typography>
                  <TextField
                    id="soldPrice"
                    label="Sold Price"
                    type="number"
                    value={soldPrice}
                    onChange={(e) => {
                      setSoldPrice(e.target.value);
                    }}
                  />

                  <Typography id="modal-modal-description" sx={{ mt: 2, mb: 2 }}>
                    Sold To:
                  </Typography>
                  <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">Sold to</InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={soldTo}
                      label="Sold To"
                      onChange={(e) => {
                        setSoldTo(e.target.value);
                      }}
                    >
                      {teams.map((item) => (
                        <MenuItem key={item?.id} value={item.id}>
                          {item?.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <Button
                    disabled={currentSelectedTeam?.availableKitty < soldPrice * 1000}
                    sx={{
                      marginTop: '20px',
                      display: 'flex',
                      float: 'right',
                      background: 'aliceblue',
                    }}
                    variant="outlined"
                    onClick={handlePlayerSold}
                  >
                    <Typography>Confirm</Typography>
                  </Button>
                  {currentSelectedTeam?.availableKitty < soldPrice * 1000 && (
                    <p style={{ color: 'red' }}> Not Enough Kitty </p>
                  )}
                </>
              ) : (
                <Typography id="modal-modal-title" variant="h6" component="h2">
                  Unable to sold this player as Team Is not created yet. Please Create Team first.
                </Typography>
              )}
            </Box>
          </Modal>

          {!selectedPlayer.isSold ? (
            <Button
              type="button"
              variant="outlined"
              onClick={handleOpen}
              sx={{
                position: 'absolute',
                bottom: 0,
                right: '250px',
                minWidth: '90px',
                color: 'white',
                background: 'green',
                textTransform: 'none',
              }}
            >
              <Typography> Mark as Sold </Typography>
            </Button>
          ) : (
            <Button
              type="button"
              variant="contained"
              onClick={handleOpen}
              sx={{
                position: 'absolute',
                bottom: 0,
                right: '270px',
                minWidth: '90px',
                color: 'white',
                background: 'green',
              }}
            >
              <Typography> Edit </Typography>
            </Button>
          )}

          {/* Circle with text at top right corner */}
          {/* <div className="player-circle">
            <div className="circle-label">Base Points</div>
            <svg width="60" height="60">
              <circle cx="30" cy="30" r="30" fill="#00004C" />
              <text
                x="50%"
                y="50%"
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize="18"
                fontWeight="bold"
                fill="#fff"
              >
                {selectedPlayer.basePoints}
              </text>
            </svg>
          </div> */}

          {/* Player details */}
          <div className="player-details-content">
            {selectedPlayer.isSold && (
              <div className="sold_image_container">
                <img className="sold" height="400px" alt="sold" src="/assets/Sold.png" />
              </div>
            )}
            <div className="player-photo">
              {selectedPlayer.photo ? (
                <img src={`/assets/${selectedPlayer.photo}`} alt={selectedPlayer.name} />
              ) : (
                <img
                  src="https://static.vecteezy.com/system/resources/previews/000/439/863/non_2x/vector-users-icon.jpg"
                  alt="Dummy User"
                />
              )}
            </div>
            <div className="player-info">
              <div className="player-stats">
                <p>
                  <span >
                    <h2 className="player-name">{selectedPlayer.name}</h2>
                  </span>
                </p>
                <p>
                  <span className="element-shape">
                    <span className="batting-details-label">Batting :</span>{' '}
                    <span className="batting-details-value">{selectedPlayer.battingStyle}</span>
                  </span>
                </p>
                <p>
                  <span className="element-shape">
                    <span className="batting-details-label">Bowling :</span>{' '}
                    <span className="batting-details-value">{selectedPlayer.bowlingStyle}</span>
                  </span>
                </p>
                <p>
                  <span className="element-shape">
                    <span className="batting-details-label">Runs:</span>{' '}
                    <span className="batting-details-value">{selectedPlayer.runs}</span>
                  </span>
                </p>
                <p>
                  <span className="element-shape">
                    <span className="batting-details-label">Average:</span>{' '}
                    <span className="batting-details-value ">{selectedPlayer.average}</span>
                  </span>
                </p>
                <p>
                  <span className="element-shape">
                    <span className="batting-details-label">Wickets:</span>{' '}
                    <span className="batting-details-value">{selectedPlayer.wickets}</span>
                  </span>
                </p>
                <p>
                  <span className="element-shape">
                    <span className="batting-details-label">Economy:</span>{' '}
                    <span className="batting-details-value">{selectedPlayer.economy}</span>
                  </span>
                </p>
                <div className="element-shape2-container">
                  <div className="element-shape2-box">
                    <p>
                      <span className="batting-details-label2">Base Price</span>{' '}
                      <span className="batting-details-value2">{selectedPlayer.basePrice}K</span>
                    </p>
                  </div>
                  <div className="element-shape2-box">
                    <p>
                      <span className="batting-details-label2">Category</span>{' '}
                      <span className="batting-details-value2">{selectedPlayer.Category}</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default PlayerDetails;
