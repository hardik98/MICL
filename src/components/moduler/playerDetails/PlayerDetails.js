/* eslint-disable */
import React, { useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, DollarSign, Users, Trophy, AlertTriangle, X } from 'lucide-react';
import confetti from 'canvas-confetti';
import {
  useAddSoldPlayerMutation,
  useFetchTeamsQuery,
  useSoldPlayerMutation,
  useUnsoldPlayerMutation,
} from '../../../redux/api/playersApi';
import { getReservedKitty, cn, reservedKitty } from '../../../lib/utils';
import { Button } from '../../ui/button';
import { Dialog, DialogHeader, DialogTitle, DialogContent } from '../../ui/modal';
import { Input } from '../../ui/input';
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

  const currentSelectedTeam = useMemo(
    () => teams?.find((team) => Number(team?.id) === Number(soldTo)),
    [teams, soldTo],
  );

  console.log('teams', teams);
  console.log('sold To', soldTo);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleSkip = () => setNextModal(true);
  const handleNextModalClose = () => setNextModal(false);

  React.useEffect(() => {
    setSoldPrice(Number(selectedPlayer?.soldPrice || 0));
    setSoldTo(Number(selectedPlayer?.soldTo) || '');
  }, [selectedPlayer]);

  const handlePlayerUnsold = async () => {
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

  const triggerCelebration = () => {
    // Enhanced confetti celebration
    const duration = 2 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 80, zIndex: 1000 };

    function randomInRange(min, max) {
      return Math.random() * (max - min) + min;
    }

    // Initial big burst
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#facc15', '#22c55e', '#3b82f6', '#f43f5e'],
    });

    const interval = setInterval(function () {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);

      // Multiple confetti bursts from different positions
      confetti(
        Object.assign({}, defaults, {
          particleCount,
          origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
          colors: ['#facc15', '#22c55e', '#3b82f6'],
        }),
      );
      confetti(
        Object.assign({}, defaults, {
          particleCount,
          origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
          colors: ['#f43f5e', '#facc15', '#22c55e'],
        }),
      );

      // Random center burst
      if (Math.random() > 0.8) {
        confetti({
          particleCount: 30,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: ['#facc15', '#ff6b6b'],
        });
        confetti({
          particleCount: 30,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: ['#22c55e', '#3b82f6'],
        });
      }
    }, 200);
  };

  const handlePlayerSold = async () => {
    const updatedSelectedPlayer = {
      ...selectedPlayer,
      isSold: true,
      isUnsold: false,
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

    // Trigger celebration animation
    triggerCelebration();

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

    // Notify other tabs about the player sale
    localStorage.setItem('playerSoldUpdate', JSON.stringify({
      playerId: selectedPlayer.id,
      teamId: soldTo,
      timestamp: Date.now()
    }));
    window.dispatchEvent(new Event('storage'));

    localStorage.setItem('sharedData', JSON.stringify({ message: 'Updated Data' }));
  };

  const categoryPlayers = useCallback(
    (category) => {
      return currentSelectedTeam?.players.filter((player) => player.Category === category).length;
    },
    [currentSelectedTeam],
  );

  const getTotalPlayerForCategory = (category) => {
    const item = reservedKitty.find((item) => item.category === category);
    return item ? item.totalPlayer : 0; // Returns 0 if no match is found
  };

  const soldModal = useCallback(() => {
    const notEnoughKitty =
      currentSelectedTeam?.availableKitty -
        getReservedKitty(currentSelectedTeam) +
        (!existingSelectedTeam ? selectedPlayer?.basePrice * 1000 : 0) +
        (selectedPlayer?.soldPrice || 0) * 1000 <
      soldPrice * 1000;

    console.log('soldPrice', soldPrice);
    console.log('currentSelectedTeam?.availableKitty', currentSelectedTeam);
    console.log('one ', categoryPlayers(selectedPlayer));
    console.log('two ', getTotalPlayerForCategory(selectedPlayer?.Category));

    const maxPlayersExceeded =
      soldPrice > 0 &&
      !!currentSelectedTeam &&
      categoryPlayers(selectedPlayer?.Category) >=
        getTotalPlayerForCategory(selectedPlayer?.Category);

    const isDisabled =
      soldPrice === 0 ||
      soldTo === '' ||
      currentSelectedTeam?.availableKitty -
        getReservedKitty(currentSelectedTeam) +
        (!existingSelectedTeam ? selectedPlayer?.basePrice * 1000 : 0) +
        (selectedPlayer?.soldPrice || 0) * 1000 <
        soldPrice * 1000 ||
      !(
        categoryPlayers(selectedPlayer?.Category) <
        getTotalPlayerForCategory(selectedPlayer?.Category)
      );

    // console.log('one ', categoryPlayers(selectedPlayer?.Category));
    // console.log('two ', getTotalPlayerForCategory(selectedPlayer?.Category));
    console.log('maxPlayersExceeded', maxPlayersExceeded);
    return (
      <Dialog open={open} onClose={handleClose}>
        {/* <div className="bg-gray-500 p-6 rounded-lg"> */}
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            {/* <Trophy className="h-6 w-6 text-cricket-gold" /> */}
            {/* <span className="text-white">Sell Player: {selectedPlayer?.name}</span> */}
          </DialogTitle>
        </DialogHeader>

        <DialogContent className="p-8">
          {teams?.length > 0 ? (
            <div className="space-y-8">
              {/* Sold Price Input */}
              <div className="space-y-3">
                <label className="flex items-center space-x-2 text-white font-medium text-lg">
                  <DollarSign className="h-5 w-5 text-cricket-gold" />
                  <span>Sold Price (in thousands)</span>
                </label>
                <Input
                  type="number"
                  value={soldPrice}
                  onChange={(e) => setSoldPrice(e.target.value)}
                  placeholder="Enter price..."
                  className="w-full h-12 text-lg px-4"
                />
              </div>

              {/* Team Selection */}
              <div className="space-y-3">
                <label className="flex items-center space-x-2 text-white font-medium text-lg">
                  <Users className="h-5 w-5 text-cricket-gold" />
                  <span>Sold To Team</span>
                </label>
                <select
                  value={soldTo}
                  onChange={(e) => {
                    console.log('e.target.value', e);
                    setSoldTo(e.target.value);
                  }}
                  className="w-full h-12 bg-white/10 border border-white/30 rounded-xl px-4 py-3 text-white text-lg backdrop-blur-sm focus:border-cricket-lightgreen focus:ring-2 focus:ring-cricket-lightgreen/50 focus:outline-none transition-all duration-300 appearance-none"
                >
                  <option value="" className="bg-cricket-stadium text-white">
                    Select Team
                  </option>
                  {teams.map((team) => (
                    <option
                      key={team?.id}
                      value={team.id}
                      className="bg-cricket-stadium text-white"
                    >
                      {team?.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Error Messages */}
              {notEnoughKitty && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center space-x-2 text-red-400 bg-red-500/10 border border-red-500/30 rounded-lg p-3"
                >
                  <AlertTriangle className="h-4 w-4" />
                  <span>Not enough kitty available</span>
                </motion.div>
              )}

              {maxPlayersExceeded && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center space-x-2 text-red-400 bg-red-500/10 border border-red-500/30 rounded-lg p-3"
                >
                  <AlertTriangle className="h-4 w-4" />
                  <span>Maximum players exceeded in this category</span>
                </motion.div>
              )}

              {/* Action Button */}
              <div className="flex justify-end pt-6 gap-2">
                <Button
                  disabled={isDisabled}
                  onClick={handlePlayerSold}
                  className="flex items-center space-x-2 px-8 py-3 text-lg"
                >
                  <CheckCircle className="h-5 w-5" />
                  <span>Confirm Sale</span>
                </Button>
                <Button
                  onClick={handleClose}
                  className="flex items-center space-x-2 bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300"
                >
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <AlertTriangle className="h-12 w-12 text-red-400 mx-auto mb-4" />
              <p className="text-white text-lg">
                Unable to sell this player as teams are not created yet. Please create teams first.
              </p>
            </div>
          )}
        </DialogContent>
        {/* </div> */}
      </Dialog>
    );
  }, [open, selectedPlayer, soldPrice, soldTo, teams, currentSelectedTeam]);

  const unsoldModal = useCallback(() => {
    return (
      <Dialog open={nextModal} onClose={handleNextModalClose}>
        {/* <div className="bg-red-500 p-6 rounded-lg"> */}
        <DialogHeader>
          {/* <DialogTitle className="flex items-center space-x-2"> */}
          {/* <X className="h-6 w-6 text-red-400" /> */}
          {/* <span className="text-white">Mark Player Unsold: {selectedPlayer?.name}</span> */}
          {/* </DialogTitle> */}
        </DialogHeader>

        <DialogContent>
          <div className="space-y-6">
            <div className="text-center py-4">
              <div className="bg-red-500/10 border border-red-500/30 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="h-8 w-8 text-red-400" />
              </div>
              <p className="text-white text-lg">
                Are you sure you want to mark this player as unsold?
              </p>
              <p className="text-white/70 text-sm mt-2">
                This action will remove the player from their current team if assigned.
              </p>
            </div>

            <div className="flex justify-end space-x-4 pt-4">
              <Button
                onClick={handleNextModalClose}
                className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300"
              >
                Cancel
              </Button>
              <Button
                onClick={handlePlayerUnsold}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105"
              >
                <X className="mr-2 h-5 w-5" />
                Confirm Unsold
              </Button>
            </div>
          </div>
        </DialogContent>
        {/* </div> */}
      </Dialog>
    );
  }, [nextModal, selectedPlayer]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-cricket-stadium via-cricket-pitch to-cricket-stadium p-6 relative overflow-hidden">
      {/* Animated Cricket Stadium Background */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Stadium Lights */}
        <motion.div
          animate={{
            opacity: [0.2, 0.6, 0.2],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute top-20 left-20 w-16 h-16 bg-cricket-gold/15 rounded-full blur-xl"
        />
        <motion.div
          animate={{
            opacity: [0.3, 0.7, 0.3],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 1.5,
          }}
          className="absolute top-32 right-32 w-12 h-12 bg-cricket-lightgreen/15 rounded-full blur-xl"
        />

        {/* Floating Cricket Elements */}
        <motion.div
          animate={{
            y: [-8, 8, -8],
            rotate: [0, 3, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute top-1/3 right-1/5 text-cricket-gold/8 text-4xl"
        >
          🏏
        </motion.div>
        <motion.div
          animate={{
            y: [8, -8, 8],
            rotate: [0, -2, 0],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 2,
          }}
          className="absolute bottom-1/4 left-1/6 text-cricket-lightgreen/8 text-3xl"
        >
          🏆
        </motion.div>
      </div>
      {!selectedPlayer ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center h-96 text-center space-y-6"
        >
          <div className="bg-white/10 backdrop-blur-sm border border-white/30 rounded-2xl p-8 shadow-xl">
            <Trophy className="h-16 w-16 text-cricket-gold mx-auto mb-4" />
            <h3 className="text-white text-xl font-semibold mb-4">
              Select a player to view their profile
            </h3>
            <Button onClick={handleNextPlayer} className="flex items-center space-x-2">
              <span>Start Auction</span>
            </Button>
          </div>
        </motion.div>
      ) : (
        <>
          {soldModal()}
          {unsoldModal()}

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="max-w-6xl mx-auto bg-white/5 backdrop-blur-md border border-white/20 rounded-3xl shadow-2xl overflow-hidden relative z-10 max-h-[85vh] overflow-y-auto"
          >
            <AnimatePresence>
              {selectedPlayer.isSold && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.5, rotate: -10 }}
                  animate={{ opacity: 1, scale: 1, rotate: 0 }}
                  exit={{ opacity: 0, scale: 0.5 }}
                  className="absolute top-4 right-4 z-20"
                >
                  <div className="bg-cricket-gold/90 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border-4 border-white">
                    <motion.div
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 2 }}
                    >
                      <img className="h-32 w-auto" alt="sold" src="/assets/Sold.png" />
                    </motion.div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Main Player Card */}
            <div className="bg-gradient-to-br from-white/10 via-white/5 to-white/10 backdrop-blur-lg border border-white/20 rounded-3xl shadow-2xl overflow-hidden">
              <div className="grid lg:grid-cols-3 gap-0">
                {/* Player Photo Section */}
                <div className="relative bg-gradient-to-br from-cricket-lightgreen/15 to-cricket-darkgreen/15 p-6 flex flex-col items-center justify-center">
                  <motion.div whileHover={{ scale: 1.05 }} className="relative">
                    <div className="w-28 h-28 rounded-full overflow-hidden border-3 border-cricket-gold/60 mx-auto shadow-lg">
                      <img
                        src={`${process.env.PUBLIC_URL}/assets/player_photos/${selectedPlayer.photo}`}
                        alt={selectedPlayer.name}
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
                        <Users className="h-16 w-16 text-white" />
                      </div>
                    </div>
                    {selectedPlayer.isSold && (
                      <div className="absolute -top-2 -right-2 bg-cricket-gold rounded-full p-2">
                        <Trophy className="h-6 w-6 text-cricket-stadium" />
                      </div>
                    )}
                  </motion.div>
                </div>

                {/* Player Info Section */}
                <div className="lg:col-span-2 p-6 space-y-4">
                  <div className="text-center lg:text-left">
                    <h2 className="text-2xl font-bold text-white mb-2">{selectedPlayer.name}</h2>
                    <div className="inline-flex items-center bg-cricket-gold/20 border border-cricket-gold/50 rounded-full px-3 py-1">
                      <span className="text-cricket-gold font-semibold text-sm">
                        Category {selectedPlayer.Category}
                      </span>
                    </div>
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-3 gap-3">
                    <div className="bg-white/8 border border-white/25 rounded-lg p-3 hover:bg-white/12 transition-colors">
                      <p className="text-white/70 text-xs font-medium">Batting Style</p>
                      <p className="text-white font-semibold text-sm">
                        {selectedPlayer.battingStyle}
                      </p>
                    </div>
                    <div className="bg-white/8 border border-white/25 rounded-lg p-3 hover:bg-white/12 transition-colors">
                      <p className="text-white/70 text-xs font-medium">Bowling Style</p>
                      <p className="text-white font-semibold text-sm">
                        {selectedPlayer.bowlingStyle}
                      </p>
                    </div>
                    <div className="bg-white/8 border border-white/25 rounded-lg p-3 hover:bg-white/12 transition-colors">
                      <p className="text-white/70 text-xs font-medium">Runs</p>
                      <p className="text-white font-semibold text-sm">{selectedPlayer.runs}</p>
                    </div>
                    <div className="bg-white/8 border border-white/25 rounded-lg p-3 hover:bg-white/12 transition-colors">
                      <p className="text-white/70 text-xs font-medium">Average</p>
                      <p className="text-white font-semibold text-sm">{selectedPlayer.average}</p>
                    </div>
                    <div className="bg-white/8 border border-white/25 rounded-lg p-3 hover:bg-white/12 transition-colors">
                      <p className="text-white/70 text-xs font-medium">Wickets</p>
                      <p className="text-white font-semibold text-sm">{selectedPlayer.wickets}</p>
                    </div>
                    <div className="bg-white/8 border border-white/25 rounded-lg p-3 hover:bg-white/12 transition-colors">
                      <p className="text-white/70 text-xs font-medium">Economy</p>
                      <p className="text-white font-semibold text-sm">{selectedPlayer.economy}</p>
                    </div>
                  </div>

                  {/* Price Info */}
                  <div className="flex space-x-3">
                    <div className="flex-1 bg-cricket-gold/15 border border-cricket-gold/40 rounded-lg p-3">
                      <p className="text-cricket-gold text-xs font-medium">Base Price</p>
                      <p className="text-white text-lg font-bold">
                        {selectedPlayer.basePrice !== 'NA' ? `₹${selectedPlayer.basePrice}K` : 'NA'}
                      </p>
                    </div>
                    {selectedPlayer.isSold && (
                      <div className="flex-1 bg-cricket-lightgreen/15 border border-cricket-lightgreen/40 rounded-lg p-3">
                        <p className="text-cricket-lightgreen text-xs font-medium">Sold Price</p>
                        <p className="text-white text-lg font-bold">₹{selectedPlayer.soldPrice}K</p>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-3 pt-2">
                    {!selectedPlayer.isSold ? (
                      <Button
                        onClick={handleOpen}
                        className="flex-1 bg-cricket-lightgreen hover:bg-cricket-lightgreen/80 flex items-center justify-center space-x-2"
                      >
                        <Trophy className="h-4 w-4" />
                        <span>Mark as Sold</span>
                      </Button>
                    ) : (
                      <Button
                        onClick={handleOpen}
                        className="flex-1 bg-cricket-lightgreen hover:bg-cricket-lightgreen/80 flex items-center justify-center space-x-2"
                      >
                        <Trophy className="h-4 w-4" />
                        <span>Edit Sale</span>
                      </Button>
                    )}

                    <Button
                      variant="outline"
                      onClick={selectedPlayer.isSold ? handleNextPlayer : handleSkip}
                      className="flex-1 flex items-center justify-center space-x-2"
                    >
                      {selectedPlayer.isSold ? (
                        <>
                          <span>Next Player</span>
                        </>
                      ) : (
                        <>
                          <X className="h-4 w-4" />
                          <span>Mark Unsold</span>
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </div>
  );
}

export default PlayerDetails;
