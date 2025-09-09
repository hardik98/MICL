import React, { memo, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Search, Users } from 'lucide-react';
import { cn } from '../../../lib/utils';

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
    const [open, setOpen] = useState(false);

    const searchPlaceholder = useMemo(() => `Search ${path} Players`, [path]);

    const handleDrawerOpen = () => {
      setOpen(true);
      setDrawerOpen(true);
    };

    const handleDrawerClose = () => {
      setOpen(false);
      setDrawerOpen(false);
    };

    return (
      <div className="relative">
        {/* Modern Sidebar */}
        <motion.div
          initial={{ x: -300 }}
          animate={{ x: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className={cn(
            'fixed left-0 top-20 h-[calc(100vh-5rem)] bg-cricket-stadium/95 backdrop-blur-md border-r border-white/20 shadow-2xl transition-all duration-300 z-40',
            open ? 'w-80' : 'w-16',
          )}
        >
          {/* Toggle Button */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={open ? handleDrawerClose : handleDrawerOpen}
            className="absolute -right-4 top-16 bg-cricket-green hover:bg-cricket-darkgreen text-white rounded-full p-2 shadow-lg transition-all duration-300 z-50"
          >
            <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.3 }}>
              <ChevronRight className="h-5 w-5" />
            </motion.div>
          </motion.button>

          {/* Sidebar Content */}
          <div className="p-4 h-full flex flex-col">
            <AnimatePresence>
              {open && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="flex-1"
                  style={{ overflow: 'scroll' }}
                >
                  {/* Header */}
                  <div className="flex items-center space-x-3 mb-6">
                    <Users className="h-6 w-6 text-cricket-gold" />
                    <h3 className="text-xl font-bold text-white">Players</h3>
                  </div>

                  {/* Search Input */}
                  <div className="relative mb-6">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-white/70" />
                    <input
                      type="text"
                      placeholder={searchPlaceholder}
                      onChange={(e) => handleInputChange(e.target.value.trim())}
                      className="w-full bg-white/10 border border-white/30 rounded-xl pl-10 pr-4 py-3 text-white placeholder-white/70 focus:border-cricket-lightgreen focus:ring-2 focus:ring-cricket-lightgreen/50 focus:outline-none transition-all duration-300"
                    />
                  </div>

                  {/* Players List */}
                  <div className="flex-1 overflow-y-auto space-y-2 pr-2">
                    {players.map((player, index) => (
                      <motion.div
                        key={player.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className={cn(
                          'flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-all duration-300 hover:bg-white/10',
                          selectedPlayerId === player.id &&
                            'bg-cricket-green/30 border border-cricket-lightgreen',
                        )}
                        onClick={() => handleChange(player.id, selectedPlayerId !== player.id)}
                      >
                        <div
                          className={cn(
                            'w-4 h-4 rounded border-2 border-white/50 flex items-center justify-center transition-all duration-300',
                            selectedPlayerId === player.id &&
                              'bg-cricket-lightgreen border-cricket-lightgreen',
                          )}
                        >
                          {selectedPlayerId === player.id && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="w-2 h-2 bg-white rounded-full"
                            />
                          )}
                        </div>
                        <span className="text-white font-medium flex-1">{player.name}</span>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Collapsed State Icon */}
            {!open && (
              <div className="flex flex-col items-center space-y-4 mt-8">
                <Users className="h-6 w-6 text-cricket-gold" />
                <div className="text-cricket-gold text-xs font-medium transform -rotate-90 whitespace-nowrap">
                  Players
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    );
  },
);

DrawerMenu.displayName = 'DrawerMenu';
export default DrawerMenu;
