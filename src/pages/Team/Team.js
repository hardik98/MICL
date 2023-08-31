import React, { useEffect, useState } from 'react';
import { Button, Box, TextField, Typography, Grid } from '@mui/material';
import {
  useCreateTeamsMutation,
  useFetchTeamsQuery,
  useLazyFetchTeamsQuery,
} from '../../redux/api/playersApi';
import './Team.css';
import TeamDetails from '../../components/moduler/teamDetails/TeamDetails';

function Team() {
  const { data, error, isLoading, isFetching } = useFetchTeamsQuery();
  const [trigger, { data: teamList }] = useLazyFetchTeamsQuery();
  const [createTeams] = useCreateTeamsMutation();

  const [teams, setTeams] = useState([]);

  useEffect(() => {
    if (data) {
      setTeams(data);
    }
  }, [data, isFetching]);

  window.addEventListener('storage', (event) => {
    if (event.key === 'sharedData') {
      trigger();
      localStorage.removeItem('sharedData');
    }
  });

  useEffect(() => {
    console.log('team list ', teamList);
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
    ];

    const teamDetails = captains.map((captain, index) => ({
      id: index + 1,
      name: captain,
      totalKitty: Number(totalKitty),
      availableKitty: Number(totalKitty),
      totalPlayer: Number(totalPlayer),
      players: [],
    }));

    console.log('teamDetails', teamDetails);

    teamDetails.forEach(async (team) => {
      await createTeams(team);
    });
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  console.log('teams', teams);
  return (
    <div className="Team" style={{ maxHeight: 'calc(100vh - 120px)', overflow: 'scroll' }}>
      {data?.length > 1 ? (
        <Grid container rowSpacing={2} sx={{ padding: '24px', height: '100vh' }}>
          {teams?.map((team, index) => (
            // eslint-disable-next-line react/no-array-index-key
            <Grid item xs={6} key={index} sx={{ display: 'flex', justifyContent: 'center' }}>
              <TeamDetails teamInfo={team} />
            </Grid>
          ))}
        </Grid>
      ) : (
        <div>
          <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3, padding: '40px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-around', width: '100vw' }}>
              <div style={{ padding: '10px' }}>
                <Typography style={{ marginBottom: '20px' }}>
                  Please Enter Total Kitty For Each Team
                </Typography>
                <TextField
                  autoComplete="given-name"
                  name="totalKitty"
                  required
                  id="totalKitty"
                  label="Total Kitty"
                  autoFocus
                  type="number"
                />
              </div>
              <div style={{ padding: '10px' }}>
                <Typography style={{ marginBottom: '20px' }}>
                  Please Enter Total Number of Players For Each Team
                </Typography>
                <TextField
                  autoComplete="given-name"
                  name="totalPlayer"
                  required
                  id="totalPlayer"
                  label="Toatl Player"
                  type="number"
                />
              </div>
            </div>
            <div>
              <Typography variant="h5">Please Enter Team Captains Name</Typography>

              <div className="center_align">
                <Typography className="player_name" variant="body">
                  Captain 1 :
                </Typography>
                <TextField
                  autoComplete="given-name"
                  name="captain_1"
                  required
                  id="captain_1"
                  label="Captain 1"
                  type="text"
                />
              </div>

              <div className="center_align">
                <Typography className="player_name" variant="body">
                  Captain 2 :
                </Typography>
                <TextField
                  autoComplete="given-name"
                  name="captain_2"
                  required
                  id="captain_2"
                  label="Captain 2"
                  type="text"
                />
              </div>

              <div className="center_align">
                <Typography className="player_name" variant="body">
                  Captain 3 :
                </Typography>
                <TextField
                  autoComplete="given-name"
                  name="captain_3"
                  required
                  id="captain_3"
                  label="Captain 3"
                  type="text"
                />
              </div>

              <div className="center_align">
                <Typography className="player_name" variant="body">
                  Captain 4 :
                </Typography>
                <TextField
                  autoComplete="given-name"
                  name="captain_4"
                  required
                  id="captain_4"
                  label="Captain 4"
                  type="text"
                />
              </div>
            </div>
            <div>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2, width: '300px' }}
              >
                Submit
              </Button>
            </div>
          </Box>
        </div>
      )}
    </div>
  );
}

export default Team;
