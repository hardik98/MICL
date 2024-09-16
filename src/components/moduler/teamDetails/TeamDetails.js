/* eslint-disable */
import {
  Avatar,
  Box,
  Card,
  CardContent,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Typography,
} from '@mui/material';
import React from 'react';
import { getReservedKitty } from '../../../utils';

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

  return (
    <Card sx={teamDetailsStyles.card}>
      <CardContent>
        <div sx={teamDetailsStyles.teamInfoContainer}>
          <Typography sx={teamDetailsStyles.teamName}>
            {`${teamInfo.name} (${teamInfo.players.length})`}
          </Typography>
        </div>
        <Typography sx={teamDetailsStyles.balance}>
          Available Kitty: {formattedAvailableKitty}
        </Typography>
        <Typography
          sx={
            teamInfo.availableKitty <= getReservedKitty(teamInfo)
              ? teamDetailsStyles.reservedKittyExceed
              : teamDetailsStyles.reservedKitty
          }
        >
          Reserved Kitty:
          {getReservedKitty(teamInfo).toLocaleString('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 0,
          })}
        </Typography>
        <hr className="hrStyle" />
        <TableContainer component={Paper} sx={teamDetailsStyles.tableContainer}>
          <Table>
            <TableBody>
              {sortedCategories.map((category) => (
                <React.Fragment key={category}>
                  <TableRow
                    sx={{ ...teamDetailsStyles.tableRow, ...(categoryStyles[category] || {}) }}
                  >
                    <TableCell colSpan={2}>
                      <Typography
                        variant="body2"
                        className="test"
                        sx={{
                          ...teamDetailsStyles.categoryStyle,
                          backgroundColor: categoryStyles[category]?.backgroundColor || 'inherit',
                          color: categoryStyles[category]?.color || 'inherit',
                          fontWeight: 'bold',
                          textAlign: 'left',
                        }}
                      >
                        Category {category === 'AP' ? 'A+' : category} (
                        {groupedPlayers[category].length})
                      </Typography>
                    </TableCell>
                  </TableRow>
                  {groupedPlayers[category].map((player, playerIndex) => (
                    <TableRow key={playerIndex}>
                      <TableCell>
                        <Box sx={teamDetailsStyles.playerRow}>
                          <Avatar
                            src={`/assets/${player.photo}`}
                            alt={player.name}
                            sx={teamDetailsStyles.playerImage}
                          />
                          <Typography
                            variant="body2"
                            sx={{ ...teamDetailsStyles.playerName, fontWeight: 'bold' }}
                          >
                            {player.name}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell sx={{ ...teamDetailsStyles.soldPriceCell, textAlign: 'right' }}>
                        {player.soldPrice}k
                      </TableCell>
                    </TableRow>
                  ))}
                </React.Fragment>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  );
}
