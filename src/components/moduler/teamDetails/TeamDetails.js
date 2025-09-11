/* eslint-disable */
import React, { useState, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Users, Trophy, DollarSign, Star, Eye, Target, Crown, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '../../ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '../../ui/dialog';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import './TeamDetails.css';
import { cn, getReservedKitty, reservedKitty } from '../../../lib/utils';

const teamDetailsStyles = {
  card: {
    marginTop: '16px',
    width: '100%',
    minHeight: '500px',
  },
  teamInfoContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '8px',
  },
  teamName: {
    fontSize: '28px',
    color: 'black',
    fontWeight: 'bold',
  },
  numberOfPlayers: {
    fontSize: '16px',
    color: 'green',
    marginLeft: '8px',
    fontWeight: 'bold',
  },
  soldPrice: {
    fontSize: '16px',
    color: 'black',
    fontWeight: 'bold',
  },
  balance: {
    fontSize: '28px',
    color: '#497ee8',
    fontWeight: 'bold',
  },
  reservedKitty: {
    fontSize: '20px',

    color: '497ee8',
    fontWeight: 'bold',
  },
  reservedKittyExceed: {
    fontSize: '20px',
    color: 'red',
    fontWeight: 'bold',
  },
  tableContainer: {
    border: '1px solid #ccc',
  },
  tableRow: {
    position: 'relative',
  },
  playerRow: {
    display: 'flex',
    alignItems: 'center',
  },
  playerName: {
    marginLeft: '4px',
    fontSize: '20px',
  },
  playerImage: {
    width: '50px',
    height: '50px',
  },
  soldPriceCell: {
    textAlign: 'right',
    fontSize: '20px',
    padding: '8px 16px',
  },
  categoryStyle: {
    position: 'absolute',
    top: '4px',
    right: '128px',
    fontSize: '14px',
    color: 'white',
    backgroundColor: 'green',
    borderRadius: '4px',
    padding: '2px 6px',
  },
};

const categoryStyles = {
  AP: {
    backgroundColor: '#0c6d74',
    color: '#fff',
  },
  A: {
    backgroundColor: '#0c6d74',
    color: '#fff',
  },
  B: {
    backgroundColor: '#1199a2',
    color: '#fff',
  },
  C: {
    backgroundColor: '#2fdee9',
  },
  D: {
    backgroundColor: '#5de5ee',
  },
  E: {
    backgroundColor: '#baf4f8',
  },
};

const categoryPriorityOrder = ['Elite', 'Plate', 'Silver', 'Bronze'];

const categoryColors = {
  Elite: 'bg-yellow-500 border-yellow-600 text-black',
  Plate: 'bg-sky-500 border-sky-600 text-white',
  Silver: 'bg-gray-400 border-gray-500 text-black',
  Bronze: 'bg-amber-700 border-amber-800 text-white',
};

export default function TeamDetails({ teamInfo, teams = [], onPlayerSold }) {
  const [isSellDialogOpen, setIsSellDialogOpen] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [soldPrice, setSoldPrice] = useState(0);
  const [soldTo, setSoldTo] = useState('');

  const formattedAvailableKitty = teamInfo.availableKitty.toLocaleString('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
  });

  const currentSelectedTeam = useMemo(
    () => teams?.find((team) => team?.id.toString() === soldTo),
    [teams, soldTo],
  );

  const handleSellClick = (player) => {
    setSelectedPlayer(player);
    setSoldPrice(player.basePrice);
    setSoldTo('');
    setIsSellDialogOpen(true);
  };

  const handleSellConfirm = () => {
    if (!selectedPlayer || !soldTo) return;

    const existingSelectedTeam = selectedPlayer?.soldTo;
    const existingSoldPrice = Number(selectedPlayer?.soldPrice || 0);

    // Create updated player object
    const updatedPlayer = {
      ...selectedPlayer,
      isSold: true,
      isUnsold: false,
      soldPrice: Number(soldPrice),
      soldTo: soldTo,
    };

    // Calculate new available kitty for the team
    let newAvailableKitty = currentSelectedTeam.availableKitty - soldPrice * 1000;

    // If player was previously in this team, add back their old price
    const currentPlayerInTeam = currentSelectedTeam.players.find((p) => p.id === selectedPlayer.id);
    if (currentPlayerInTeam) {
      newAvailableKitty += (currentPlayerInTeam.soldPrice || 0) * 1000;
    }

    // Create updated team object
    const updatedTeam = {
      ...currentSelectedTeam,
      availableKitty: newAvailableKitty,
      players: [
        ...currentSelectedTeam.players.filter((p) => p.id !== selectedPlayer.id),
        updatedPlayer,
      ],
    };

    // Call the onPlayerSold callback with both updated player and team
    onPlayerSold({
      player: updatedPlayer,
      team: updatedTeam,
      previousTeamId: existingSelectedTeam,
      previousPrice: existingSoldPrice,
    });

    // Notify other tabs about the update
    localStorage.setItem(
      'playerSoldUpdate',
      JSON.stringify({
        playerId: selectedPlayer.id,
        teamId: soldTo,
        timestamp: Date.now(),
      }),
    );
    window.dispatchEvent(new Event('storage'));

    // Close the dialog
    setIsSellDialogOpen(false);
    setSelectedPlayer(null);
    setSoldPrice(0);
    setSoldTo('');
  };

  const categoryPlayers = useCallback(
    (category) => {
      return (
        currentSelectedTeam?.players?.filter((player) => player.Category === category).length || 0
      );
    },
    [currentSelectedTeam],
  );

  const getTotalPlayerForCategory = (category) => {
    const item = reservedKitty.find((item) => item.category === category);
    return item ? item.totalPlayer : 0;
  };

  const isSellDisabled = useMemo(() => {
    if (!selectedPlayer || !currentSelectedTeam) return true;
    if (soldPrice === 0 || soldTo === '') return true;

    const existingSelectedTeam = selectedPlayer?.soldTo;
    const currentPlayerInTeam = currentSelectedTeam.players.find((p) => p.id === selectedPlayer.id);

    // Check category limits - exact same logic as working modal
    const currentCategoryCount = categoryPlayers(selectedPlayer.Category);
    const maxCategoryCount = getTotalPlayerForCategory(selectedPlayer.Category);

    // Check if adding would exceed category limit
    const categoryLimitExceeded = !(
      currentCategoryCount < maxCategoryCount ||
      (currentPlayerInTeam && currentCategoryCount <= maxCategoryCount)
    );

    if (categoryLimitExceeded) {
      console.log('Category limit exceeded:', { currentCategoryCount, maxCategoryCount });
      return true;
    }

    // Check kitty - exact same calculation as working modal
    const reservedKittyForTeam = getReservedKitty(currentSelectedTeam);
    const hasEnoughKitty =
      currentSelectedTeam.availableKitty -
        reservedKittyForTeam +
        (!existingSelectedTeam ? selectedPlayer.basePrice * 1000 : 0) +
        (selectedPlayer.soldPrice || 0) * 1000 >=
      soldPrice * 1000;

    if (!hasEnoughKitty) {
      console.log('Not enough kitty:', {
        available: currentSelectedTeam.availableKitty,
        reserved: reservedKittyForTeam,
        required: soldPrice * 1000,
      });
      return true;
    }

    return false;
  }, [selectedPlayer, currentSelectedTeam, soldPrice, soldTo, categoryPlayers]);

  const groupedPlayers = {};

  teamInfo.players.forEach((player) => {
    if (!groupedPlayers[player.Category]) {
      groupedPlayers[player.Category] = [];
    }
    groupedPlayers[player.Category].push(player);
  });

  const sortedCategories = categoryPriorityOrder.filter((category) => groupedPlayers[category]);

  const navigate = useNavigate();

  console.log(
    'categoryPlayers(selectedPlayer?.Category)',
    categoryPlayers(selectedPlayer?.Category),
  );
  console.log('Get total', getTotalPlayerForCategory(selectedPlayer?.Category));
  return (
    <div>
      <Card className="bg-white/10 backdrop-blur-sm border-white/30 hover:border-cricket-gold/50 w-full h-[450px] flex flex-col">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Crown className="h-5 w-5 text-cricket-gold" />
              <span className="text-white font-bold">{teamInfo.name}</span>
            </div>
            {/* <Button
              variant="outline"
              size="sm"
              onClick={() => navigate(`/team/${teamInfo.id}`)}
              className="flex items-center space-x-1"
            >
              <Eye className="h-3 w-3" />
              <span>View</span>
            </Button> */}
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-3 flex-1 overflow-hidden flex flex-col">
          {/* Compact Budget Info */}
          <div className="bg-white/5 border border-white/20 rounded-lg p-2">
            <div className="grid grid-cols-3 gap-2 text-center">
              <div>
                <p className="text-cricket-gold text-xs font-medium">Total</p>
                <p className="text-white font-bold text-sm">₹{teamInfo.totalKitty}</p>
              </div>
              <div>
                <p className="text-cricket-lightgreen text-xs font-medium">Available</p>
                <p className="text-white font-bold text-sm">₹{teamInfo.availableKitty}</p>
              </div>
              <div>
                <p className="text-orange-400 text-xs font-medium">Reserved</p>
                <p className="text-white font-bold text-sm">₹{getReservedKitty(teamInfo)}</p>
              </div>
            </div>
          </div>

          {/* Player Stats */}
          <div className="bg-white/5 border border-white/20 rounded-lg p-2">
            <div className="grid grid-cols-3 gap-2 text-center">
              <div>
                <p className="text-white/70 text-xs">Total</p>
                <p className="text-white font-semibold text-sm">{teamInfo.totalPlayer}</p>
              </div>
              <div>
                <p className="text-white/70 text-xs">Bought</p>
                <p className="text-cricket-lightgreen font-semibold text-sm">
                  {teamInfo.players.length}
                </p>
              </div>
              <div>
                <p className="text-white/70 text-xs">Remaining</p>
                <p className="text-orange-400 font-semibold text-sm">
                  {teamInfo.totalPlayer - teamInfo.players.length}
                </p>
              </div>
            </div>
          </div>

          {/* Players by Category */}
          {teamInfo.players.length > 0 && (
            <div className="flex-1 flex flex-col min-h-0">
              <div
                className="flex-1 overflow-y-auto space-y-2 pr-2 max-h-[280px]"
                style={{ minHeight: 1200 }}
              >
                {categoryPriorityOrder
                  .filter((category) => groupedPlayers[category])
                  .map((category) => (
                    <div key={category} className="space-y-2">
                      <div
                        className={`rounded-lg px-3 py-1 sticky top-0 z-10 ${
                          categoryColors[category] || 'bg-gray-700 border-gray-500 text-white'
                        }`}
                      >
                        {' '}
                        Category {category} ({groupedPlayers[category].length})
                      </div>
                      <div className="space-y-1">
                        {groupedPlayers[category].map((player) => (
                          <div
                            key={player.id}
                            className="flex items-center justify-between bg-white/5 border border-white/20 rounded-lg p-2 hover:bg-white/10"
                          >
                            <div className="flex items-center space-x-2">
                              <div className="w-8 h-8 rounded-full overflow-hidden border border-cricket-gold/50">
                                <img
                                  src={`/assets/${player.photo}`}
                                  alt={player.name}
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
                                  <Users className="h-4 w-4 text-white" />
                                </div>
                              </div>
                              <span className="text-white text-sm font-medium">{player.name}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <span className="text-cricket-gold text-sm font-semibold">
                                {player.soldPrice}K
                              </span>
                              {!player.soldTo && (
                                <Button
                                  disabled={isSellDisabled}
                                  onClick={() => handleSellClick(player)}
                                  className="ml-2 p-1 h-6 w-6"
                                ></Button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={isSellDialogOpen} onOpenChange={setIsSellDialogOpen}>
        <DialogContent className="sm:max-w-[425px] bg-cricket-dark border-cricket-gold/30">
          <DialogHeader>
            <div className="flex justify-between items-center">
              <DialogTitle className="text-white">Sell Player: {selectedPlayer?.name}</DialogTitle>
              <button
                onClick={() => {
                  setIsSellDialogOpen(false);
                  setSoldPrice(selectedPlayer?.basePrice || 0);
                  setSoldTo('');
                }}
                className="text-gray-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <DialogDescription className="text-gray-300">
              Transfer player to another team
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="price" className="text-white">
                Price (in thousands)
              </Label>
              <Input
                id="price"
                type="number"
                value={soldPrice}
                onChange={(e) =>
                  setSoldPrice(Math.max(selectedPlayer?.basePrice, parseInt(e.target.value) || 0))
                }
                className="bg-cricket-darker border-cricket-gold/30 text-white"
                min={selectedPlayer?.basePrice}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="team" className="text-white">
                Sell To Team
              </Label>
              <Select value={soldTo} onValueChange={setSoldTo}>
                <SelectTrigger className="bg-cricket-darker border-cricket-gold/30 text-white">
                  <SelectValue placeholder="Select a team" />
                </SelectTrigger>
                <SelectContent className="bg-cricket-darker border-cricket-gold/30">
                  {teams
                    .filter((team) => team.id !== teamInfo.id)
                    .map((team) => (
                      <SelectItem key={team.id} value={team.id}>
                        {team.name} (₹{team.availableKitty.toLocaleString()})
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>

              {currentSelectedTeam && (
                <div className="mt-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Available:</span>
                    <span className="text-white">
                      ₹{currentSelectedTeam.availableKitty.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Reserved Kitty:</span>
                    <span className="text-white">
                      ₹{getReservedKitty(currentSelectedTeam).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Available After Reserve:</span>
                    <span className="text-white">
                      ₹
                      {(
                        currentSelectedTeam.availableKitty - getReservedKitty(currentSelectedTeam)
                      ).toLocaleString()}
                    </span>
                  </div>
                </div>
              )}

              {currentSelectedTeam && (
                <div className="mt-2">
                  {currentSelectedTeam.availableKitty - getReservedKitty(currentSelectedTeam) <
                    soldPrice * 1000 && (
                    <p className="text-red-500 text-sm">Not enough kitty available after reserve</p>
                  )}

                  {selectedPlayer &&
                    categoryPlayers(selectedPlayer.Category) >=
                      getTotalPlayerForCategory(selectedPlayer.Category) && (
                      <p className="text-red-500 text-sm">
                        Max players reached for category {selectedPlayer.Category}
                      </p>
                    )}
                </div>
              )}
            </div>
          </div>

          <DialogFooter className="gap-2">
            <div className="w-full space-y-2">
              <div className="flex justify-between w-full gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsSellDialogOpen(false);
                    setSoldPrice(selectedPlayer?.basePrice || 0);
                    setSoldTo('');
                  }}
                  className="flex-1 bg-cricket-darker hover:bg-cricket-dark border-cricket-gold/30 text-white"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  onClick={handleSellConfirm}
                  disabled={isSellDisabled}
                  className="flex-1 bg-cricket-gold hover:bg-cricket-gold/90 text-cricket-dark font-medium disabled:opacity-50 disabled:pointer-events-none"
                >
                  Confirm Sale
                </Button>
              </div>

              {currentSelectedTeam && (
                <div className="space-y-1">
                  {currentSelectedTeam.availableKitty - getReservedKitty(currentSelectedTeam) <
                    soldPrice * 1000 && (
                    <p className="text-red-500 text-sm text-center">
                      Not enough kitty available after reserve
                    </p>
                  )}

                  {selectedPlayer &&
                    categoryPlayers(selectedPlayer.Category) >=
                      getTotalPlayerForCategory(selectedPlayer.Category) && (
                      <p className="text-red-500 text-sm text-center">
                        Max players reached for category {selectedPlayer.Category}
                      </p>
                    )}
                </div>
              )}
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
