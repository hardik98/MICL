import { AppBar, Menu, MenuItem, Toolbar, Typography } from '@mui/material';
import Box from '@mui/material/Box';
import React, { useState } from 'react';
import { BrowserRouter, Link, Route, Routes, useNavigate } from 'react-router-dom';
import './App.css';
import Home from './pages/Home/Home';
import Team from './pages/Team/Team';

function Root() {
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();

  const handleMouseEnterButton = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMouseLeaveButton = () => {
    setTimeout(() => {
      if (!anchorEl) {
        setAnchorEl(null);
      }
    }, 200);
  };

  const handleMouseEnterMenu = () => {
    clearTimeout();
  };

  const handleMouseLeaveMenu = () => {
    setAnchorEl(null);
  };

  const handleMenuItemClick = (path) => {
    navigate('/', { state: { path } });
    setAnchorEl(null);
  };

  return (
    <div className="App">
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static" sx={{ background: '#333' }}>
          <Toolbar>
            <div className="logo logo-left">
              <img src={`${process.env.PUBLIC_URL}/assets/logo.png`} alt="Logo" />
            </div>
            <div>
              <button
                type="button"
                className={anchorEl ? 'activeBtnPlayers' : 'btnPlayers'}
                onMouseEnter={handleMouseEnterButton}
                onMouseLeave={handleMouseLeaveButton}
                aria-haspopup="true"
                aria-controls="hover-menu"
              >
                Players
              </button>
              <Menu
                id="hover-menu"
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMouseLeaveMenu}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'left',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'left',
                }}
                MenuListProps={{
                  onMouseEnter: handleMouseEnterMenu,
                  onMouseLeave: handleMouseLeaveMenu,
                }}
              >
                <MenuItem onClick={() => handleMenuItemClick('Pending')}>Pending</MenuItem>
                <MenuItem onClick={() => handleMenuItemClick('Sold')}>Sold</MenuItem>
                <MenuItem onClick={() => handleMenuItemClick('Unsold')}>UnSold</MenuItem>
              </Menu>
            </div>
            <nav>
              <ul>
                <li>
                  <Link to="/team">Teams</Link>
                </li>
              </ul>
            </nav>
            <div className="header-text">
              <Typography variant="h4">Welcome to the HICL Auction</Typography>
            </div>
            <div className="logo logo-right">
              <img src={`${process.env.PUBLIC_URL}/assets/MCL_logo.png`} alt="Second Logo" />
            </div>
          </Toolbar>
        </AppBar>
      </Box>
      {/* Implement All Routes Here */}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/HICL" element={<Home />} />
        <Route path="/team" element={<Team />} />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Root />
    </BrowserRouter>
  );
}

export default App;
