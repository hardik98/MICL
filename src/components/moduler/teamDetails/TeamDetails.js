/* eslint-disable */
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Trophy, DollarSign, Star, Eye, Target, Crown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn, getReservedKitty } from '../../../lib/utils';
import { Button } from '../../ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '../../ui/card';
import './TeamDetails.css';

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

const categoryPriorityOrder = ['AP', 'A', 'B', 'C', 'D', 'E'];

export default function TeamDetails({ teamInfo }) {
  const formattedAvailableKitty = teamInfo.availableKitty.toLocaleString('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
  });

  const groupedPlayers = {};

  teamInfo.players.forEach((player) => {
    if (!groupedPlayers[player.Category]) {
      groupedPlayers[player.Category] = [];
    }
    groupedPlayers[player.Category].push(player);
  });

  const sortedCategories = categoryPriorityOrder.filter((category) => groupedPlayers[category]);

  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="bg-white/10 backdrop-blur-sm border-white/30 hover:border-cricket-gold/50 transition-all duration-300 w-full h-[450px] flex flex-col">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Crown className="h-5 w-5 text-cricket-gold" />
              <span className="text-white font-bold">{teamInfo.name}</span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate(`/team/${teamInfo.id}`)}
              className="flex items-center space-x-1"
            >
              <Eye className="h-3 w-3" />
              <span>View</span>
            </Button>
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
                <p className="text-cricket-lightgreen font-semibold text-sm">{teamInfo.players.length}</p>
              </div>
              <div>
                <p className="text-white/70 text-xs">Remaining</p>
                <p className="text-orange-400 font-semibold text-sm">{teamInfo.totalPlayer - teamInfo.players.length}</p>
              </div>
            </div>
          </div>

          {/* Players by Category */}
          {teamInfo.players.length > 0 && (
            <div className="flex-1 flex flex-col min-h-0">
              <h4 className="text-white font-medium flex items-center space-x-2 mb-3">
                <Users className="h-4 w-4 text-cricket-gold" />
                <span>Squad</span>
              </h4>
              
              <div className="flex-1 overflow-y-auto space-y-2 pr-2 max-h-[280px]">
                {Object.entries(groupedPlayers).map(([category, players]) => (
                  <div key={category} className="space-y-2">
                    <div className="bg-cricket-gold/20 border border-cricket-gold/40 rounded-lg px-3 py-2 sticky top-0 z-10">
                      <span className="text-cricket-gold font-semibold text-sm">Category {category} ({players.length})</span>
                    </div>
                    <div className="space-y-1">
                      {players.map((player) => (
                        <motion.div
                          key={player.id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="flex items-center justify-between bg-white/5 border border-white/20 rounded-lg p-2 hover:bg-white/10 transition-colors"
                        >
                          <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 rounded-full overflow-hidden border border-cricket-gold/50">
                              <img 
                                src={`${process.env.PUBLIC_URL}/assets/${encodeURIComponent(player.photo)}`} 
                                alt={player.name}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  e.target.style.display = 'none';
                                  e.target.nextSibling.style.display = 'flex';
                                }}
                              />
                              <div className="w-full h-full bg-gradient-to-br from-cricket-green to-cricket-lightgreen flex items-center justify-center" style={{display: 'none'}}>
                                <Users className="h-4 w-4 text-white" />
                              </div>
                            </div>
                            <span className="text-white text-sm font-medium">{player.name}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <DollarSign className="h-3 w-3 text-cricket-gold" />
                            <span className="text-cricket-gold text-sm font-semibold">{player.soldPrice}K</span>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
