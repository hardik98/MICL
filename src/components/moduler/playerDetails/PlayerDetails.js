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
  const [open, setOpen] = React.useState(false);
  const { data: teams } = useFetchTeamsQuery();
  const [soldTo, setSoldTo] = useState('');
  const [soldPrice, setSoldPrice] = useState(0);
  const [soldPlayer] = useSoldPlayerMutation();
  const [addSoldPlayer] = useAddSoldPlayerMutation();

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handlePlayerSold = async () => {
    const updatedSelectedPlayer = { ...selectedPlayer, isSold: true };
    await soldPlayer({
      id: selectedPlayer.id,
      updatedPlayer: updatedSelectedPlayer,
    });
    handleClose();

    const selectedTeam = teams.find((team) => Number(team.id) === Number(soldTo));
    const updatedTeam = {
      ...selectedTeam,
      players: [...selectedTeam.players, updatedSelectedPlayer],
      availableKitty: selectedTeam.availableKitty - soldPrice * 1000,
      soldPrice,
    };

    await addSoldPlayer({
      id: Number(soldTo),
      updatedTeam,
    });
    localStorage.setItem('sharedData', JSON.stringify({ message: 'Updated Data' }));

    setSoldTo('');
    setSoldPrice(0);
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
                    sx={{
                      marginTop: '20px',
                      display: 'flex',
                      float: 'right',
                      background: 'blue',
                      color: 'white',
                    }}
                    variant="outlined"
                    onClick={handlePlayerSold}
                  >
                    <Typography>Confirm</Typography>
                  </Button>
                </>
              ) : (
                <Typography id="modal-modal-title" variant="h6" component="h2">
                  Unable to sold this player as Team Is not created yet. Please Create Team first.
                </Typography>
              )}
            </Box>
          </Modal>

          {!selectedPlayer.isSold && (
            <Button
              type="button"
              variant="outlined"
              onClick={handleOpen}
              sx={{
                position: 'absolute',
                bottom: 0,
                right: '40px',
                minWidth: '90px',
                color: 'white',
                background: 'green',
              }}
            >
              <Typography> Sold </Typography>
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
              {selectedPlayer.photo && <img src={selectedPlayer.photo} alt={selectedPlayer.name} />}
            </div>
            <div className="player-info">
              <h2>{selectedPlayer.name}</h2>
              <div className="player-stats">
                <p>
                  <span className="element-shape">
                    <span className="batting-style-label">Batting Style:</span>{' '}
                    <span className="batting-style-value">{selectedPlayer.battingStyle}</span>
                  </span>
                </p>
                <p>
                  <span className="element-shape">
                    <span className="bowling-style-label">Bowling Style:</span>{' '}
                    <span className="bowling-style-value">{selectedPlayer.bowlingStyle}</span>
                  </span>
                </p>
                <p>
                  <span className="element-shape">
                    <span className="runs-label">Runs:</span>{' '}
                    <span className="runs-value">{selectedPlayer.runs}</span>
                  </span>
                </p>
                <p>
                  <span className="element-shape">
                    <span className="average-label">Average:</span>{' '}
                    <span className="average-value">{selectedPlayer.average}</span>
                  </span>
                </p>
                <p>
                  <span className="element-shape">
                    <span className="wickets-label">Wickets:</span>{' '}
                    <span className="wickets-value">{selectedPlayer.wickets}</span>
                  </span>
                </p>
                <p>
                  <span className="element-shape">
                    <span className="economy-label">Economy:</span>{' '}
                    <span className="economy-value">{selectedPlayer.economy}</span>
                  </span>
                </p>
                <p>
                  <span className="element-shape">
                    <span className="prev-teams-label">Base Price:</span>{' '}
                    <span className="prev-teams-value">{selectedPlayer.basePrice}K</span>
                  </span>
                </p>
                <p>
                  <span className="element-shape">
                    <span className="prev-teams-label">Category:</span>{' '}
                    <span className="prev-teams-value">{selectedPlayer.Category}</span>
                  </span>
                </p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default PlayerDetails;
