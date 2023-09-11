/* eslint-disable */
import React from 'react';
import {
  Grid,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Paper,
  Card,
  CardContent,
  Typography,
  Avatar,
} from '@mui/material';

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
    color: 'blue',
    fontWeight: 'bold',
  },
  tableContainer: {
    border: '1px solid #ccc',
    
  },
  tableRow:{
    position: 'relative',
  },
  playerRow: {
    display: 'flex',
    alignItems: 'center',
  },
  playerName: {
    marginLeft: '4px',
    fontSize:'20px'
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
    right: '15px',
    fontSize: '12px',
    color: 'white',
    backgroundColor: 'green',
    borderRadius: '4px',
    padding: '2px 6px',
  },
};

export default function TeamDetails({ teamInfo }) {
  const formattedAvailableKitty = teamInfo.availableKitty.toLocaleString('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
  });

  return (
    <Card sx={teamDetailsStyles.card}>
      <CardContent>
        <div sx={teamDetailsStyles.teamInfoContainer}>
          <Typography sx={teamDetailsStyles.teamName}>
            {`${teamInfo.name} (${teamInfo.players.length} Players)`}
          </Typography>
        </div>
        <Typography sx={teamDetailsStyles.balance}>
          Available Kitty: {formattedAvailableKitty}
        </Typography>
        <hr className="hrStyle" />
        <TableContainer component={Paper} sx={teamDetailsStyles.tableContainer}>
          <Table>
            <TableBody>
              {teamInfo.players.map((player, index) => (
                <TableRow key={index} sx={teamDetailsStyles.tableRow}>
                  <TableCell>
                    <Typography
                      variant="body2"
                      className='test'
                      sx={teamDetailsStyles.categoryStyle}
                    >
                      {player.Category}
                    </Typography>
                    <Box sx={teamDetailsStyles.playerRow}>
                      <Avatar
                        src={player.photo}
                        alt={player.name}
                        sx={teamDetailsStyles.playerImage}
                      />
                      <Typography variant="body2" sx={teamDetailsStyles.playerName}>
                        {player.name}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell sx={teamDetailsStyles.soldPriceCell}>{player.soldPrice}k</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  );
}
