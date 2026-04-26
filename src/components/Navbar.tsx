'use client'

import { Search, Bell, Settings, LogOut, User, ChevronDown } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useState, useRef, useEffect } from 'react'

export default function Navbar() {
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

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
        </div>

        {/* Account dropdown */}
        <div className="relative pl-6 border-l border-slate-700" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen(v => !v)}
            className="flex items-center gap-3 group"
          >
            <div className="text-right hidden sm:block">
              <p className="text-xs font-medium text-white group-hover:text-cyan-400 transition-colors">rectorat@ucar.tn</p>
            </div>
            <div className="w-8 h-8 rounded-full bg-cyan-500 flex items-center justify-center text-white text-xs font-bold ring-2 ring-cyan-500/20">
              PU
            </div>
            <ChevronDown size={14} className={`text-slate-400 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          <AnimatePresence>
            {dropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: -8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 top-full mt-3 w-52 bg-[#1E293B] border border-slate-700 rounded-xl shadow-xl shadow-slate-900/40 overflow-hidden z-50"
              >
                {/* Account info */}
                <div className="px-4 py-3 border-b border-slate-700">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Connecté en tant que</p>
                  <p className="text-xs font-semibold text-white truncate">rectorat@ucar.tn</p>
                </div>

                {/* Menu items */}
                <div className="py-1">
                  <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-300 hover:bg-slate-700/50 hover:text-white transition-colors">
                    <User size={15} className="text-slate-400" />
                    <span className="font-medium">Mon profil</span>
                  </button>
                  <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-300 hover:bg-slate-700/50 hover:text-white transition-colors">
                    <Settings size={15} className="text-slate-400" />
                    <span className="font-medium">Paramètres</span>
                  </button>
                </div>

                <div className="border-t border-slate-700 py-1">
                  <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors">
                    <LogOut size={15} />
                    <span className="font-medium">Se déconnecter</span>
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
