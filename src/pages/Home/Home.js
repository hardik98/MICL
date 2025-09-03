import React from 'react';
import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import PlayersList from '../../components/moduler/PlayersList/PlayersList';

function Home() {
  const location = useLocation();
  const { path } = location.state || {};

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-br from-cricket-stadium/80 to-cricket-pitch/60 p-6 relative"
    >
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="w-full h-full bg-gradient-to-br from-white/5 via-transparent to-cricket-gold/5"></div>
      </div>
      
      <div className="relative z-10">
        <PlayersList path={path} />
      </div>
    </motion.div>
  );
}

export default Home;
