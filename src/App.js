import React from 'react';
import Box from '@mui/material/Box';
import { BrowserRouter, Route, Routes, Link } from 'react-router-dom';
import './App.css';
import { Toolbar, AppBar, Typography } from '@mui/material';
import Home from './pages/Home/Home';
import Team from './pages/Team/Team';

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Box sx={{ flexGrow: 1 }}>
          <AppBar position="static" sx={{ background: '#333' }}>
            <Toolbar>
              <div className="logo logo-left">
                <img src={`${process.env.PUBLIC_URL}/assets/logo.png`} alt="Logo" />
              </div>
              <nav>
                <ul>
                  <li>
                    <Link to="/">Home</Link>
                  </li>
                  <li>
                    <Link to="/team">Teams</Link>
                  </li>
                </ul>
              </nav>
              <div className="header-text">
                <Typography variant="h4">Welcome to the MICL Auction</Typography>
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
          <Route path="/team" element={<Team />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
