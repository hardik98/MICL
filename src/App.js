import React, { useState } from 'react';
import { BrowserRouter, Link, Route, Routes, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Users, Trophy, Target } from 'lucide-react';
import { cn } from './lib/utils';
import './App.css';
import Home from './pages/Home/Home';
import Team from './pages/Team/Team';

function Root() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const handleMenuItemClick = (path) => {
    navigate('/', { state: { path } });
    setDropdownOpen(false);
  };

  const playerMenuItems = [
    { label: 'Pending', path: 'Pending', icon: Target },
    { label: 'Sold', path: 'Sold', icon: Trophy },
    { label: 'Unsold', path: 'Unsold', icon: Users },
  ];

  return (
    <div className="min-h-screen bg-stadium-gradient">
      {/* Stadium Lights Effect */}
      <div className="stadium-lights" />

      {/* Modern Cricket-Themed Header */}
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="relative bg-gradient-to-r from-cricket-stadium via-cricket-pitch to-cricket-stadium border-b border-cricket-gold/30 shadow-2xl"
      >
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Left Logo */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center space-x-4"
              onClick={() => {
                navigate('/');
              }}
            >
              <img
                src={`${process.env.PUBLIC_URL}/assets/logo.png`}
                alt="Logo"
                className="h-12 w-auto filter brightness-150"
              />
            </motion.div>

            {/* Navigation */}
            <nav className="flex items-center space-x-8">
              {/* Players Dropdown */}
              <div className="relative">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center space-x-2 text-white font-semibold text-lg hover:text-cricket-gold transition-colors duration-300"
                >
                  <Target className="h-5 w-5" />
                  <span>Players</span>
                  <ChevronDown
                    className={cn(
                      'h-4 w-4 transition-transform duration-300',
                      dropdownOpen && 'rotate-180',
                    )}
                  />
                </motion.button>

                <AnimatePresence>
                  {dropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute top-full left-0 mt-2 w-48 bg-cricket-stadium/95 backdrop-blur-md border border-white/20 rounded-xl shadow-xl z-50"
                    >
                      {playerMenuItems.map((item) => {
                        const IconComponent = item.icon;
                        return (
                          <motion.button
                            key={item.path}
                            whileHover={{ backgroundColor: 'rgba(34, 197, 94, 0.2)' }}
                            onClick={() => handleMenuItemClick(item.path)}
                            className="w-full flex items-center space-x-3 px-4 py-3 text-white hover:text-cricket-lightgreen transition-colors duration-200 first:rounded-t-xl last:rounded-b-xl"
                          >
                            <IconComponent className="h-4 w-4" />
                            <span>{item.label}</span>
                          </motion.button>
                        );
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Teams Link */}
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  to="/team"
                  className="flex items-center space-x-2 text-white font-semibold text-lg hover:text-cricket-gold transition-colors duration-300"
                >
                  <Users className="h-5 w-5" />
                  <span>Teams</span>
                </Link>
              </motion.div>
            </nav>

            {/* Right Logo */}
            <motion.div whileHover={{ scale: 1.05 }} className="flex items-center">
              <img
                src={`${process.env.PUBLIC_URL}/assets/HICL_logo.png`}
                alt="HICL Logo"
                className="h-16 w-auto"
              />
            </motion.div>
          </div>
        </div>
      </motion.header>

      {/* Main Content with Page Transitions */}
      <main className="relative">
        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/HICL" element={<Home />} />
            <Route path="/team" element={<Team />} />
            {/* <Route path="/team/:teamId" element={<TeamDetailPage />} /> */}
          </Routes>
        </AnimatePresence>
      </main>
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
