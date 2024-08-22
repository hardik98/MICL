/* eslint-disable */
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
import React, { useCallback, useState } from 'react';
import {
  useAddSoldPlayerMutation,
  useFetchTeamsQuery,
  useSoldPlayerMutation,
  useUnsoldPlayerMutation,
} from '../../../redux/api/playersApi';
import reservedKitty from '../../../utils';
import './PlayerDetails.css';

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

function PlayerDetails({ selectedPlayer, handleNextPlayer }) {
  const existingSelectedTeam = selectedPlayer?.soldTo;
  const existingSoldPrice = Number(selectedPlayer?.soldPrice);
  const [open, setOpen] = React.useState(false);
  const [nextModal, setNextModal] = useState(false);
  const { data: teams } = useFetchTeamsQuery();
  const [soldTo, setSoldTo] = useState(Number(selectedPlayer?.soldTo) || '');
  const [soldPrice, setSoldPrice] = useState(Number(selectedPlayer?.soldPrice) || 0);
  const [soldPlayer] = useSoldPlayerMutation();
  const [addSoldPlayer] = useAddSoldPlayerMutation();
  const [unsoldPlayer] = useUnsoldPlayerMutation();
  const currentSelectedTeam = teams?.find((team) => Number(team?.id) === soldTo);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleSkip = () => setNextModal(true);
  const handleNextModalClose = () => setNextModal(false);

  React.useEffect(() => {
    setSoldPrice(Number(selectedPlayer?.soldPrice || 0));
    setSoldTo(Number(selectedPlayer?.soldTo) || '');
  }, [selectedPlayer]);

  const handlePlayerUnSold = async () => {
    const updatedSelectedPlayer = {
      ...selectedPlayer,
      isUnsold: true,
    };

    await unsoldPlayer({
      id: selectedPlayer.id,
      updatedPlayer: updatedSelectedPlayer,
    });

    handleNextModalClose();
    handleNextPlayer();
  };

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

    const isPlayerExist = selectedTeam.players?.find(
      (player) => Number(player.id) === Number(selectedPlayer.id),
    );

    const updatedTeam = {
      ...selectedTeam,
      players: !isPlayerExist
        ? [...selectedTeam.players, updatedSelectedPlayer]
        : [
            ...selectedTeam.players?.map((player) => {
              return player.id === selectedPlayer.id ? updatedSelectedPlayer : player;
            }),
          ],
      availableKitty: !isPlayerExist
        ? selectedTeam.availableKitty - soldPrice * 1000
        : selectedTeam.availableKitty + existingSoldPrice * 1000 - soldPrice * 1000,
    };

    await addSoldPlayer({
      id: Number(soldTo),
      updatedTeam,
    });

    localStorage.setItem('sharedData', JSON.stringify({ message: 'Updated Data' }));
  };

  const getReservedKitty = () => {
    const categoryAplayers = currentSelectedTeam?.players.filter(
      (player) => player.Category === 'A',
    ).length;
    const categoryBplayers = currentSelectedTeam?.players.filter(
      (player) => player.Category === 'B',
    ).length;
    const categoryCplayers = currentSelectedTeam?.players.filter(
      (player) => player.Category === 'C',
    ).length;
    const categoryDplayers = currentSelectedTeam?.players.filter(
      (player) => player.Category === 'D',
    ).length;

    let totalReservedKitty = 0;
    reservedKitty.forEach((item) => {
      totalReservedKitty = totalReservedKitty + item.baseKitty * item.totalPlayer;
    });

    //  Note: Need to refactor this
    totalReservedKitty = totalReservedKitty - categoryAplayers * reservedKitty[0].baseKitty;
    totalReservedKitty = totalReservedKitty - categoryBplayers * reservedKitty[1].baseKitty;
    totalReservedKitty = totalReservedKitty - categoryCplayers * reservedKitty[2].baseKitty;
    totalReservedKitty = totalReservedKitty - categoryDplayers * reservedKitty[3].baseKitty;

    return totalReservedKitty;
  };

  const soldModal = useCallback(() => {
    return (
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
                  disabled={
                    soldPrice === 0 ||
                    soldTo === '' ||
                    currentSelectedTeam?.availableKitty -
                      getReservedKitty() +
                      (!existingSelectedTeam ? selectedPlayer?.basePrice * 1000 : 0) +
                      (selectedPlayer?.soldPrice || 0) * 1000 <
                      soldPrice * 1000
                  }
                  sx={{
                    marginTop: '20px',
                    display: 'flex',
                    float: 'right',
                    background: 'aliceblue',
                    fontSize: '1.28rem',
                  }}
                  variant="outlined"
                  onClick={handlePlayerSold}
                >
                  Confirm
                </Button>
                {currentSelectedTeam?.availableKitty -
                  getReservedKitty() +
                  (!existingSelectedTeam ? selectedPlayer?.basePrice * 1000 : 0) +
                  (selectedPlayer?.soldPrice || 0) * 1000 <
                  soldPrice * 1000 && <p style={{ color: 'red' }}> Not Enough Kitty </p>}
              </>
            ) : (
              <Typography id="modal-modal-title" variant="h6" component="h2">
                Unable to sold this player as Team Is not created yet. Please Create Team first.
              </Typography>
            )}
          </Box>
        </Modal>
      </>
    );
  }, [open, selectedPlayer, soldPrice, soldTo]);

  const unsoldModal = useCallback(() => {
    return (
      <>
        <Modal
          open={nextModal}
          onClose={handleNextModalClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              {selectedPlayer?.name} is unsold for now. We will bring him back later.
            </Typography>
            <Typography id="modal-modal-description" sx={{ mt: 2, mb: 2 }}>
              Are you sure?
            </Typography>
            <Button
              variant="outlined"
              onClick={handlePlayerUnSold}
              sx={{
                marginTop: '20px',
                display: 'flex',
                float: 'left',
                background: 'aliceblue',
                fontSize: '1.28rem',
              }}
            >
              Yes, Go to next player
            </Button>
            <Button
              variant="outlined"
              onClick={handleNextModalClose}
              sx={{
                marginTop: '20px',
                display: 'flex',
                float: 'right',
                background: 'aliceblue',
                fontSize: '1.28rem',
              }}
            >
              No
            </Button>
          </Box>
        </Modal>
      </>
    );
  }, [nextModal]);

  return (
    <div className="player-details">
      {!selectedPlayer ? (
        <div className="player-details-placeholder">
          Select player to view the player profile
          <Button
            sx={{
              marginTop: '20px',
              display: 'flex',
              float: 'right',
              background: 'aliceblue',
              fontSize: '1.28rem',
            }}
            variant="outlined"
            onClick={handleNextPlayer}
          >
            Start
          </Button>
        </div>
      ) : (
        <>
          {soldModal()}
          {unsoldModal()}

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
                  <span className="player-name">{selectedPlayer.name}</span>
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
                      <span className="batting-details-value2">
                        {selectedPlayer.basePrice !== 'NA' ? `${selectedPlayer.basePrice}K` : 'NA'}
                      </span>
                    </p>
                  </div>
                  <div className="element-shape2-box">
                    <p>
                      <span className="batting-details-label2">Category</span>{' '}
                      <span className="batting-details-value2">{selectedPlayer.Category}</span>
                    </p>
                  </div>
                </div>
                <div className="element-shape2-container">
                  {!selectedPlayer.isSold ? (
                    <Button
                      type="button"
                      variant="outlined"
                      onClick={handleOpen}
                      sx={{
                        bottom: '-40px',
                        minWidth: '90px',
                        color: 'white',
                        background: 'green',
                        textTransform: 'none',
                        fontSize: '1.28rem',
                        zIndex: 1,
                        flex: 1,
                        display: 'flex',
                        marginLeft: 10,
                        marginRight: 8,
                      }}
                    >
                      Mark as Sold
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      variant="contained"
                      onClick={handleOpen}
                      sx={{
                        bottom: '-40px',
                        minWidth: '90px',
                        color: 'white',
                        background: 'green',
                        fontSize: '1.28rem',
                        zIndex: 1,
                        flex: 1,
                        display: 'flex',
                        marginLeft: 10,
                        marginRight: 10,
                      }}
                    >
                      Edit
                    </Button>
                  )}

                  <Button
                    type="button"
                    variant="outlined"
                    onClick={selectedPlayer.isSold ? handleNextPlayer : handleSkip}
                    sx={{
                      bottom: '-40px',
                      minWidth: '90px',
                      color: 'black',
                      background: 'white',
                      textTransform: 'none',
                      fontSize: '1.28rem',
                      zIndex: 1,
                      flex: 1,
                      display: 'flex',
                      marginLeft: 8,
                      marginRight: 10,
                    }}
                  >
                    {selectedPlayer.isSold ? 'Next' : 'Unsold'}
                  </Button>
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
