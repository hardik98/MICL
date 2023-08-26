import React, { useEffect, useState } from 'react';
import { Button, Box, TextField, Typography, Grid } from '@mui/material';
import { useCreateTeamsMutation, useFetchTeamsQuery } from '../../redux/api/playersApi';
import './Team.css';
import TeamDetails from '../../components/moduler/teamDetails/TeamDetails';

function Team() {
  const { data, error, isLoading, isFetching } = useFetchTeamsQuery();
  const [createTeams] = useCreateTeamsMutation();

  const [teams, setTeams] = useState([]);

  console.log('data', data);

  useEffect(() => {
    if (data) {
      setTeams(data);
    }
  }, [data, isFetching]);

  const handleSubmit = (event) => {
    event.preventDefault();
    const result = new FormData(event.currentTarget);
    const totalKitty = result.get('totalKitty');
    const totalPlayer = result.get('totalPlayer');
    const captions = [
      result.get('caption_1'),
      result.get('caption_2'),
      result.get('caption_3'),
      result.get('caption_4'),
    ];

    const teamDetails = captions.map((caption, index) => ({
      id: index,
      name: caption,
      totalKitty: Number(totalKitty),
      availableKitty: Number(totalKitty),
      totalPlayer: Number(totalPlayer),
      players: [],
    }));

    console.log('team_details', teamDetails);

    createTeams({ data: teamDetails });
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className="Team" style={{ maxHeight: 'calc(100vh - 120px)', overflow: 'scroll' }}>
      {teams?.data?.length > 0 ? (
        <Grid container rowSpacing={2} sx={{ padding: '24px', height: '100vh' }}>
          {teams?.data?.map((team, index) => (
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
              <Typography variant="h5">Please Enter Team Captions Name</Typography>

              <div className="center_align">
                <Typography className="player_name" variant="body">
                  Caption 1 :
                </Typography>
                <TextField
                  autoComplete="given-name"
                  name="caption_1"
                  required
                  id="caption_1"
                  label="Caption 1"
                  type="text"
                />
              </div>

              <div className="center_align">
                <Typography className="player_name" variant="body">
                  Caption 2 :
                </Typography>
                <TextField
                  autoComplete="given-name"
                  name="caption_2"
                  required
                  id="caption_2"
                  label="Caption 2"
                  type="text"
                />
              </div>

              <div className="center_align">
                <Typography className="player_name" variant="body">
                  Caption 3 :
                </Typography>
                <TextField
                  autoComplete="given-name"
                  name="caption_3"
                  required
                  id="caption_3"
                  label="Caption 3"
                  type="text"
                />
              </div>

              <div className="center_align">
                <Typography className="player_name" variant="body">
                  Caption 4 :
                </Typography>
                <TextField
                  autoComplete="given-name"
                  name="caption_4"
                  required
                  id="caption_4"
                  label="Caption 4"
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
