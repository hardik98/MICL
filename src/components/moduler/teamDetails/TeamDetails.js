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
  },
  teamInfoContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '8px',
  },
  teamName: {
    fontSize: '20px',
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
    fontSize: '16px',
    color: 'red',
    fontWeight: 'bold',
  },
  tableContainer: {
    border: '1px solid #ccc',
  },
  playerRow: {
    display: 'flex',
    alignItems: 'center',
  },
  playerName: {
    marginLeft: '4px',
  },
  playerImage: {
    width: '40px',
    height: '40px',
  },
  soldPriceCell: {
    textAlign: 'right',
    fontSize: '16px',
    padding: '8px 16px',
  },
};

export default function TeamDetails({ teamInfo }) {
  return (
    <Card sx={teamDetailsStyles.card}>
      <CardContent>
        <div sx={teamDetailsStyles.teamInfoContainer}>
          <Typography sx={teamDetailsStyles.teamName}>{teamInfo.name}</Typography>
          <Typography sx={teamDetailsStyles.numberOfPlayers}>
            {teamInfo.players.length} Players
          </Typography>
        </div>
        <Typography sx={teamDetailsStyles.balance}>
          Available Balance: {teamInfo.availableKitty}
        </Typography>
        <TableContainer component={Paper} sx={teamDetailsStyles.tableContainer}>
          <Table>
            <TableBody>
              {teamInfo.players.map((player, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Box sx={teamDetailsStyles.playerRow}>
                      <Avatar
                        src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTLRfDacAnNupNBLdU9LrPZSo1aOLUB_DCajQ&usqp=CAU"
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
