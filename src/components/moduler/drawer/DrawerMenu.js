import { ChevronLeft, ChevronRight } from '@mui/icons-material';
import {
  Checkbox,
  Divider,
  Drawer,
  FormControlLabel,
  IconButton,
  TextField,
  Typography,
  useTheme,
} from '@mui/material';
import React, { memo, useMemo, useState } from 'react';

const drawerWidthOpen = 350;
const drawerWidthClosed = 34;

// eslint-disable-next-line arrow-body-style
const DrawerMenu = memo(
  ({
    players,
    selectedPlayerId,
    handleChange,
    handleInputChange,
    setDrawerOpen,
    path = 'Pending',
  }) => {
    const theme = useTheme();
    const [open, setOpen] = useState(false);

    const searchPlaceholder = useMemo(() => `Search ${path} Player`, [path]);

    const handleDrawerOpen = () => {
      setOpen(true);
      setDrawerOpen(true);
    };

    const handleDrawerClose = () => {
      setOpen(false);
      setDrawerOpen(false);
    };

    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'baseline',
          width: '10vw',
          maxHeight: '76vh',
          overflow: 'scroll',
        }}
      >
        <Drawer
          sx={{
            width: open ? drawerWidthOpen : drawerWidthClosed,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              width: open ? drawerWidthOpen : drawerWidthClosed,
              boxSizing: 'border-box',
              marginTop: '87px',
              transition: theme.transitions.create('width', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen,
              }),
              overflow: 'visible',
              zIndex: 1,
              backgroundColor: '#333',
            },
          }}
          variant="persistent"
          anchor="left"
          open
        >
          <IconButton
            onClick={open ? handleDrawerClose : handleDrawerOpen}
            style={{
              position: 'absolute',
              top: '13%',
              right: open ? '-20px' : '-20px',
              transform: `translateY(-50%) rotate(${open ? '180deg' : '0deg'})`,
              transition: 'transform 0.3s ease',
              backgroundColor: '#fff',
              borderRadius: '50%',
              boxShadow: '0 2px 10px rgba(0, 0, 0, 0.2)',
              zIndex: 1300,
            }}
          >
            {theme.direction === 'ltr' ? <ChevronRight /> : <ChevronLeft />}
          </IconButton>
          <div style={{ visibility: open ? 'visible' : 'hidden', width: '100%' }}>
            <Divider />
            <TextField
              id="outlined-basic"
              label={searchPlaceholder}
              variant="outlined"
              onChange={(e) => {
                handleInputChange(e.target.value.trim());
              }}
              style={{ margin: 20, width: '80%' }}
              sx={{
                '& .MuiInputBase-root': {
                  color: '#fff', // Text color
                },
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: '#fff',
                  },
                  '&:hover fieldset': {
                    borderColor: '#fff',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#fff',
                  },
                },
                '& .MuiInputLabel-root': {
                  color: '#fff',
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: '#fff',
                },
              }}
            />

            <div
              style={{
                maxHeight: 'calc(100vh - 200px)',
                overflowY: 'auto',
              }}
            >
              {players.map((player) => (
                <div key={player.id}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={selectedPlayerId === player.id}
                        onChange={(e, isChecked) => handleChange(player.id, isChecked)}
                        inputProps={{ 'aria-label': 'controlled' }}
                        sx={{ color: '#fff' }}
                      />
                    }
                    label={
                      <Typography variant="h5" style={{ textAlign: 'left', color: '#fff' }}>
                        {player.name}
                      </Typography>
                    }
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'flex-start',
                      width: '100%',
                      marginLeft: '16px',
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        </Drawer>
      </div>
    );
  },
);

DrawerMenu.displayName = 'DrawerMenu';
export default DrawerMenu;
