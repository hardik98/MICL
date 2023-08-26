import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';

export default function TeamDetails({ teamInfo }) {
  return (
    <Card sx={{ width: '90%' }}>
      <CardMedia sx={{ height: 200 }} image="/assets/Viral_Patel.png" title="green iguana" />
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {teamInfo.name}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Total Balance: {teamInfo.totalKitty}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Available Balance: {teamInfo.availableKitty}
        </Typography>
      </CardContent>
    </Card>
  );
}
