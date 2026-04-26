'use client'

import { useState } from 'react'
import { Search, Bell, Settings, User, LogOut } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export default function Navbar() {
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  return (
    <motion.header 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 100, damping: 20 }}
      className="h-16 bg-[#0F172A] flex items-center px-6 fixed top-0 left-0 right-0 z-50 shadow-md shadow-slate-900/20"
    >
      <div className="flex items-center gap-3">
        <motion.div 
          whileHover={{ rotate: 10, scale: 1.05 }}
          className="bg-cyan-500 rounded-lg w-8 h-8 flex items-center justify-center text-white font-bold text-sm shadow-md shadow-cyan-500/20"
        >
          UC
        </motion.div>
        <span className="text-white font-semibold text-sm tracking-wide">UCAR Pulse</span>
      </div>

      <div className="flex-1 max-w-xl mx-12">
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-hover:text-cyan-400 transition-colors" size={16} />
          <motion.input 
            whileFocus={{ scale: 1.01 }}
            type="text" 
            placeholder="Rechercher un établissement..."
            className="w-full bg-[#1E293B] border border-slate-700 rounded-lg py-2 pl-10 pr-4 text-sm text-slate-200 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
          />
        </div>
      </div>

      <div className="flex items-center gap-6 ml-auto">
        <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-[#1E293B] border border-slate-700 rounded-md text-[11px] text-slate-400 font-medium">
          <span>Tunis</span>
        </div>
        
        <div className="flex items-center gap-4">
          <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className="text-slate-400 hover:text-white transition-colors relative">
            <Bell size={18} />
            <motion.span 
              animate={{ scale: [1, 1.2, 1] }} 
              transition={{ repeat: Infinity, duration: 2 }}
              className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-[#0F172A]"
            ></motion.span>
          </motion.button>
          <motion.button whileHover={{ scale: 1.1, rotate: 90 }} whileTap={{ scale: 0.9 }} className="text-slate-400 hover:text-white transition-colors">
            <Settings size={18} />
          </motion.button>
        </div>

        <div className="relative flex items-center gap-3 pl-6 border-l border-slate-700">
          <div className="text-right hidden sm:block">
            <p className="text-xs font-medium text-white">rectorat@ucar.tn</p>
          </div>
          <motion.button 
            whileHover={{ scale: 1.05 }}
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="w-8 h-8 rounded-full bg-cyan-500 flex items-center justify-center text-white text-xs font-bold ring-2 ring-cyan-500/20 cursor-pointer focus:outline-none"
          >
            PU
          </motion.button>

          <AnimatePresence>
            {isProfileOpen && (
              <motion.div 
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="absolute top-12 right-0 w-56 bg-[#1E293B] border border-slate-700 rounded-lg shadow-xl overflow-hidden"
              >
                <div className="p-4 border-b border-slate-700 bg-[#0F172A]/50">
                  <p className="text-sm font-semibold text-white">Admin UCAR</p>
                  <p className="text-xs text-slate-400 mt-1">rectorat@ucar.tn</p>
                </div>
                <div className="py-2">
                  <button className="w-full px-4 py-2 text-left text-sm text-slate-300 hover:bg-slate-700 hover:text-white flex items-center gap-3 transition-colors">
                    <User size={16} /> Mon Profil
                  </button>
                  <button className="w-full px-4 py-2 text-left text-sm text-slate-300 hover:bg-slate-700 hover:text-white flex items-center gap-3 transition-colors">
                    <Settings size={16} /> Paramètres
                  </button>
                </div>
                <div className="py-2 border-t border-slate-700">
                  <button 
                    onClick={() => window.location.href = '/login'}
                    className="w-full px-4 py-2 text-left text-sm text-red-400 hover:bg-slate-700 hover:text-red-300 flex items-center gap-3 transition-colors"
                  >
                    <LogOut size={16} /> Déconnexion
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.header>
  )
}
