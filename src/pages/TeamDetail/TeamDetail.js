import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Crown, DollarSign, Target, Users, Trophy, Star } from 'lucide-react';
import { useFetchTeamsQuery } from '../../redux/api/playersApi';
import { getReservedKitty } from '../../lib/utils';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';

function TeamDetail() {
  const { teamId } = useParams();
  const navigate = useNavigate();
  const { data: teams, isLoading, error } = useFetchTeamsQuery();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cricket-stadium via-cricket-pitch to-cricket-stadium flex items-center justify-center">
        <div className="text-white text-xl">Loading team details...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cricket-stadium via-cricket-pitch to-cricket-stadium flex items-center justify-center">
        <div className="text-red-400 text-xl">Error loading team details</div>
      </div>
    );
  }

  const team = teams?.find(t => t.id === parseInt(teamId));

  if (!team) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cricket-stadium via-cricket-pitch to-cricket-stadium flex items-center justify-center">
        <div className="text-white text-xl">Team not found</div>
      </div>
    );
  }

  // Group players by category
  const groupedPlayers = team.players.reduce((acc, player) => {
    const category = player.Category;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(player);
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-gradient-to-br from-cricket-stadium via-cricket-pitch to-cricket-stadium p-6 relative overflow-hidden">
      {/* Animated Cricket Stadium Background */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Stadium Lights */}
        <motion.div
          animate={{ 
            opacity: [0.2, 0.6, 0.2],
            scale: [1, 1.1, 1]
          }}
          transition={{ 
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-20 left-20 w-16 h-16 bg-cricket-gold/15 rounded-full blur-xl"
        />
        <motion.div
          animate={{ 
            opacity: [0.3, 0.7, 0.3],
            scale: [1, 1.2, 1]
          }}
          transition={{ 
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1.5
          }}
          className="absolute top-32 right-32 w-12 h-12 bg-cricket-lightgreen/15 rounded-full blur-xl"
        />
        
        {/* Floating Cricket Elements */}
        <motion.div
          animate={{ 
            y: [-8, 8, -8],
            rotate: [0, 3, 0]
          }}
          transition={{ 
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-1/3 right-1/5 text-cricket-gold/8 text-4xl"
        >
          🏏
        </motion.div>
        <motion.div
          animate={{ 
            y: [8, -8, 8],
            rotate: [0, -2, 0]
          }}
          transition={{ 
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
          className="absolute bottom-1/4 left-1/6 text-cricket-lightgreen/8 text-3xl"
        >
          🏆
        </motion.div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              onClick={() => navigate('/teams')}
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Teams</span>
            </Button>
            <div className="flex items-center space-x-3">
              <Crown className="h-8 w-8 text-cricket-gold" />
              <h1 className="text-4xl font-bold text-white">{team.name}</h1>
            </div>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Team Overview */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-1"
          >
            <Card className="bg-white/10 backdrop-blur-sm border-white/30 h-fit">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Trophy className="h-6 w-6 text-cricket-gold" />
                  <span className="text-white">Team Overview</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Budget Info */}
                <div className="space-y-4">
                  <h3 className="text-white font-semibold flex items-center space-x-2">
                    <DollarSign className="h-5 w-5 text-cricket-gold" />
                    <span>Budget Details</span>
                  </h3>
                  <div className="space-y-3">
                    <div className="bg-cricket-gold/10 border border-cricket-gold/30 rounded-lg p-4">
                      <p className="text-cricket-gold text-sm font-medium">Total Kitty</p>
                      <p className="text-white text-2xl font-bold">₹{team.totalKitty}</p>
                    </div>
                    <div className="bg-cricket-lightgreen/10 border border-cricket-lightgreen/30 rounded-lg p-4">
                      <p className="text-cricket-lightgreen text-sm font-medium">Available Kitty</p>
                      <p className="text-white text-2xl font-bold">₹{team.availableKitty}</p>
                    </div>
                    <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-4">
                      <p className="text-orange-400 text-sm font-medium">Reserved Kitty</p>
                      <p className="text-white text-2xl font-bold">₹{getReservedKitty(team)}</p>
                    </div>
                  </div>
                </div>

                {/* Player Stats */}
                <div className="space-y-4">
                  <h3 className="text-white font-semibold flex items-center space-x-2">
                    <Users className="h-5 w-5 text-cricket-gold" />
                    <span>Squad Statistics</span>
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-white/5 border border-white/20 rounded-lg p-3 text-center">
                      <p className="text-white/70 text-sm">Total Slots</p>
                      <p className="text-white text-xl font-bold">{team.totalPlayer}</p>
                    </div>
                    <div className="bg-white/5 border border-white/20 rounded-lg p-3 text-center">
                      <p className="text-white/70 text-sm">Players Bought</p>
                      <p className="text-cricket-lightgreen text-xl font-bold">{team.players.length}</p>
                    </div>
                    <div className="bg-white/5 border border-white/20 rounded-lg p-3 text-center">
                      <p className="text-white/70 text-sm">Remaining Slots</p>
                      <p className="text-orange-400 text-xl font-bold">{team.totalPlayer - team.players.length}</p>
                    </div>
                    <div className="bg-white/5 border border-white/20 rounded-lg p-3 text-center">
                      <p className="text-white/70 text-sm">Avg. Price</p>
                      <p className="text-white text-xl font-bold">
                        ₹{team.players.length > 0 ? Math.round(team.players.reduce((sum, p) => sum + parseInt(p.soldPrice), 0) / team.players.length) : 0}K
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Players List */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-2"
          >
            <Card className="bg-white/10 backdrop-blur-sm border-white/30">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="h-6 w-6 text-cricket-gold" />
                  <span className="text-white">Squad Players ({team.players.length})</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {team.players.length === 0 ? (
                  <div className="text-center py-12">
                    <Users className="h-16 w-16 text-white/30 mx-auto mb-4" />
                    <p className="text-white/70 text-lg">No players bought yet</p>
                  </div>
                ) : (
                  <div className="space-y-6 max-h-[600px] overflow-y-auto pr-2">
                    {Object.entries(groupedPlayers).map(([category, players]) => (
                      <div key={category} className="space-y-3">
                        <div className="bg-cricket-gold/20 border border-cricket-gold/40 rounded-lg px-4 py-3 sticky top-0 z-10">
                          <h3 className="text-cricket-gold font-bold text-lg">
                            Category {category} ({players.length} players)
                          </h3>
                        </div>
                        <div className="grid gap-3">
                          {players.map((player, index) => (
                            <motion.div
                              key={player.id}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: index * 0.1 }}
                              className="bg-white/5 border border-white/20 rounded-lg p-4 hover:bg-white/10 transition-colors"
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-4">
                                  <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-cricket-gold/50">
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
                                      <Users className="h-6 w-6 text-white" />
                                    </div>
                                  </div>
                                  <div>
                                    <h4 className="text-white font-semibold text-lg">{player.name}</h4>
                                    <p className="text-white/70 text-sm">{player.battingStyle} • {player.bowlingStyle}</p>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <div className="flex items-center space-x-2 mb-1">
                                    <DollarSign className="h-4 w-4 text-cricket-gold" />
                                    <span className="text-cricket-gold font-bold text-lg">₹{player.soldPrice}K</span>
                                  </div>
                                  <div className="text-white/70 text-sm">
                                    Base: ₹{player.basePrice !== 'NA' ? `${player.basePrice}K` : 'NA'}
                                  </div>
                                </div>
                              </div>
                              <div className="mt-3 grid grid-cols-4 gap-3 text-center">
                                <div className="bg-white/5 rounded p-2">
                                  <p className="text-white/70 text-xs">Runs</p>
                                  <p className="text-white font-semibold">{player.runs}</p>
                                </div>
                                <div className="bg-white/5 rounded p-2">
                                  <p className="text-white/70 text-xs">Average</p>
                                  <p className="text-white font-semibold">{player.average}</p>
                                </div>
                                <div className="bg-white/5 rounded p-2">
                                  <p className="text-white/70 text-xs">Wickets</p>
                                  <p className="text-white font-semibold">{player.wickets}</p>
                                </div>
                                <div className="bg-white/5 rounded p-2">
                                  <p className="text-white/70 text-xs">Economy</p>
                                  <p className="text-white font-semibold">{player.economy}</p>
                                </div>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default TeamDetail;
