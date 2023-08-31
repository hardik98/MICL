import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';

export default function TeamDetails({ teamInfo }) {
  return (
    <Card sx={{ width: '90%' }}>
      <CardContent>
        <Typography gutterBottom variant="h3" component="div">
          {teamInfo.name}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Total Balance: {teamInfo.totalKitty}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Available Balance: {teamInfo.availableKitty}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Total Player: {teamInfo.totalPlayer}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Playeres:
        </Typography>
        {teamInfo?.players.map((player) => (
          <div key={player.id}>
            <Typography variant="body2" color="text.secondary">
              {player.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Sold Price: {teamInfo?.soldPrice}k
            </Typography>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
