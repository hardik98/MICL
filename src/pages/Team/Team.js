/* eslint-disable */
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Plus, Trophy, DollarSign, Target, Edit3, Trash2 } from 'lucide-react';
import {
  useAddTeamMutation,
  useFetchTeamsQuery,
  useLazyFetchTeamsQuery,
  useCreateTeamsMutation,
} from '../../redux/api/playersApi';
import { cn } from '../../lib/utils';
import { Button } from '../../components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import './Team.css';
import TeamDetails from '../../components/moduler/teamDetails/TeamDetails';

function Team() {
  const { data, error, isLoading, isFetching } = useFetchTeamsQuery();
  const [trigger, { data: teamList }] = useLazyFetchTeamsQuery();
  const [createTeams] = useCreateTeamsMutation();

  const [teams, setTeams] = useState([]);

  // Handle initial data load and updates from the server
  useEffect(() => {
    if (data) {
      setTeams(data);
    }
  }, [data, isFetching]);

  // Listen for storage events from other tabs
  useEffect(() => {
    const handleStorageChange = (event) => {
      if (event.key === 'playerSoldUpdate') {
        // When a player is sold in another tab, refresh the teams data
        trigger();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    // Cleanup event listener on component unmount
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [trigger]);

  // Handle the team list update after triggering a refetch
  useEffect(() => {
    if (teamList?.length) {
      setTeams(teamList);
    }
  }, [teamList]);

  const handleSubmit = (event) => {
    event.preventDefault();
    const result = new FormData(event.currentTarget);
    const totalKitty = result.get('totalKitty');
    const totalPlayer = result.get('totalPlayer');
    const captains = [
      result.get('captain_1'),
      result.get('captain_2'),
      result.get('captain_3'),
      result.get('captain_4'),
      result.get('captain_5'),
    ];

    const teamDetails = captains.map((captain, index) => ({
      id: index + 1,
      name: captain,
      totalKitty: Number(totalKitty),
      availableKitty: Number(totalKitty),
      totalPlayer: Number(totalPlayer),
      players: [],
    }));

    teamDetails.forEach(async (team) => {
      await createTeams(team);
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cricket-stadium via-cricket-pitch to-cricket-stadium flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-12 h-12 border-4 border-cricket-gold border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cricket-stadium via-cricket-pitch to-cricket-stadium flex items-center justify-center">
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-6 text-center">
          <p className="text-red-400">Error: {error.message}</p>
        </div>
      </div>
    );
  }

  const gridClass =
    teams.length === 5 ? 'team-grid-5' : teams.length > 5 ? 'team-grid-more-than-5' : '';

  return (
    <div className="min-h-screen bg-gradient-to-br from-cricket-stadium via-cricket-pitch to-cricket-stadium p-4">
      <div className="w-full mx-auto max-h-screen overflow-y-auto">
        {teams.length ? (
          /* Teams Grid */
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-5 gap-4 pb-8"
          >
            {teams.map((team, index) => (
              <motion.div
                key={team.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                className="transform transition-all duration-300"
              >
                <TeamDetails teamInfo={team} />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          /* Team Creation Form */
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="bg-white/10 backdrop-blur-sm border-white/30 max-w-4xl mx-auto">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-white text-center justify-center">
                  <Trophy className="h-6 w-6 text-cricket-gold" />
                  <span>Setup Cricket Teams</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-8">
                  {/* Team Configuration */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="flex items-center space-x-2 text-white font-medium">
                        <DollarSign className="h-4 w-4 text-cricket-gold" />
                        <span>Total Kitty Per Team</span>
                      </label>
                      <Input
                        name="totalKitty"
                        type="number"
                        placeholder="Enter budget amount..."
                        required
                        autoFocus
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="flex items-center space-x-2 text-white font-medium">
                        <Users className="h-4 w-4 text-cricket-gold" />
                        <span>Total Players Per Team</span>
                      </label>
                      <Input
                        name="totalPlayer"
                        type="number"
                        placeholder="Enter player count..."
                        required
                      />
                    </div>
                  </div>

                  {/* Team Captains */}
                  <div className="space-y-4">
                    <h3 className="text-white text-xl font-semibold flex items-center space-x-2">
                      <Target className="h-5 w-5 text-cricket-gold" />
                      <span>Team Captains</span>
                    </h3>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {[1, 2, 3, 4, 5].map((num) => (
                        <div key={num} className="space-y-2">
                          <label className="text-white/80 text-sm font-medium">Captain {num}</label>
                          <Input
                            name={`captain_${num}`}
                            placeholder={`Enter captain ${num} name...`}
                            required
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-center pt-6">
                    <Button
                      type="submit"
                      className="flex items-center space-x-2 bg-cricket-lightgreen hover:bg-cricket-lightgreen/80 px-8 py-3 text-lg"
                    >
                      <Plus className="h-5 w-5" />
                      <span>Create Teams</span>
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
}

export default Team;
