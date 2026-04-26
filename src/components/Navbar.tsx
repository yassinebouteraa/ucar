'use client'

import { Search, Bell, Settings, LogOut, User, ChevronDown } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useState, useRef, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

interface PendingUser {
  id: string
  full_name: string
  role: string
  institution_id: string | null
  email: string
}

export default function Navbar() {
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const [pendingUsers, setPendingUsers] = useState<PendingUser[]>([])
  const [currentUserRole, setCurrentUserRole] = useState('')
  const [currentUserEmail, setCurrentUserEmail] = useState('')

  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const notificationsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false)
      }
      if (notificationsRef.current && !notificationsRef.current.contains(e.target as Node)) {
        setNotificationsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)

    const role = localStorage.getItem('userRole') || ''
    setCurrentUserRole(role)

    // Fetch current user's email from Supabase session
    supabase.auth.getUser().then(({ data }) => {
      if (data.user?.email) setCurrentUserEmail(data.user.email)
    })

    // Fetch pending approval requests based on role
    const inst = localStorage.getItem('userInstitution') || ''
    if (role === 'Directeur UCAR' || role === 'Président UCAR' || role === 'Directeur Institut') {
      let query = supabase.from('users').select('id, full_name, role, institution_id, email').eq('status', 'pending');
      if (role === 'Directeur Institut' && inst) {
        query = query.eq('institution_id', inst);
      }
      query.then(({ data, error }) => {
        let users = data || []
        // Add mock request for demo
        users.push({
          id: 'demo-mock-id',
          full_name: 'Trésorier',
          role: 'staff',
          institution_id: inst || 'inst-insat-0000-0001',
          email: 'tresorier@uca.tn'
        })
        setPendingUsers(users)
        if (error) console.warn('[Navbar] Could not fetch pending users:', error.message)
      })
    }

    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const isUcarPresident = currentUserRole === 'Directeur UCAR' || currentUserRole === 'Président UCAR';
  const isDirecteurInst = currentUserRole === 'Directeur Institut';
  const isStaff = currentUserRole === 'Staff Institut' || currentUserRole === 'Personnel administratif' || currentUserRole === 'Staff';

  const handleApprove = async (userId: string) => {
    await supabase.from('users').update({ status: 'active' }).eq('id', userId)
    setPendingUsers(prev => prev.filter(u => u.id !== userId))
  }

  const handleDeny = async (userId: string) => {
    await supabase.from('users').update({ status: 'rejected' }).eq('id', userId)
    setPendingUsers(prev => prev.filter(u => u.id !== userId))
  }

  const getRoleLabel = (internalRole: string) => {
    if (internalRole === 'inst_president') return 'Directeur Institut'
    if (internalRole === 'staff') return 'Staff Institut'
    return internalRole
  }

  const displayEmail = currentUserEmail || 'rectorat@ucar.tn'
  const avatarLetters = displayEmail.slice(0, 2).toUpperCase()

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 100, damping: 20 }}
      className="h-16 bg-[#0F172A] flex items-center px-6 fixed top-0 left-0 right-0 z-50 shadow-md shadow-slate-900/20"
    >
      <div className="flex items-center gap-3">
        <motion.img
          whileHover={{ rotate: 10, scale: 1.05 }}
          src="/web-logo.jpg"
          alt="Logo UCAR"
          className="rounded-lg w-8 h-8 object-contain shadow-md shadow-cyan-500/20"
        />
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

        <div className="flex items-center gap-4 relative" ref={notificationsRef}>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setNotificationsOpen(v => !v)}
            className="text-slate-400 hover:text-white transition-colors relative"
          >
            <Bell size={18} />
            <motion.span
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-[#0F172A]"
            ></motion.span>
          </motion.button>

          <AnimatePresence>
            {notificationsOpen && (
              <motion.div
                initial={{ opacity: 0, y: -8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 top-full mt-4 w-80 bg-[#1E293B] border border-slate-700 rounded-xl shadow-xl shadow-slate-900/40 overflow-hidden z-50"
              >
                <div className="px-4 py-3 border-b border-slate-700 flex justify-between items-center bg-[#0F172A]/50">
                  <h3 className="text-xs font-bold text-white uppercase tracking-widest">Notifications</h3>
                  <span className="bg-red-500 text-white text-[9px] font-black px-2 py-0.5 rounded-full">
                    {(isStaff ? 1 : 3) + pendingUsers.length} NOUVELLES
                  </span>
                </div>

                <div className="max-h-[360px] overflow-y-auto">
                  {/* Pending approval requests — only visible to Presidents/Directors */}
                  {pendingUsers.map(user => (
                    <div key={user.id} className="px-4 py-3 border-b border-slate-700/50 bg-indigo-500/10 hover:bg-indigo-500/20 transition-colors cursor-pointer group">
                      <div className="flex gap-3">
                        <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400 shrink-0 mt-1">
                          <User size={14} />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-indigo-300 mb-1">
                            Nouvelle demande d'accès ({getRoleLabel(user.role)})
                          </p>
                          <p className="text-[11px] text-slate-300 group-hover:text-white leading-tight mb-2">
                            <span className="font-semibold text-white">{user.full_name}</span> demande l'accès en tant que{' '}
                            <span className="font-semibold text-white">{getRoleLabel(user.role)}</span>
                            {user.institution_id && (
                              <> pour l'établissement <span className="font-semibold text-white">{user.institution_id}</span></>
                            )}.
                          </p>
                          <div className="flex gap-2">
                            <button
                              className="px-3 py-1.5 bg-indigo-500 text-white text-[10px] font-bold rounded shadow-sm hover:bg-indigo-400 transition-colors"
                              onClick={(e) => { e.stopPropagation(); handleApprove(user.id) }}
                            >
                              Autoriser
                            </button>
                            <button
                              className="px-3 py-1.5 bg-slate-700 text-white text-[10px] font-bold rounded shadow-sm hover:bg-slate-600 transition-colors"
                              onClick={(e) => { e.stopPropagation(); handleDeny(user.id) }}
                            >
                              Refuser
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Notifications based on Role */}
                  {!isStaff && (
                    <>
                      <div className="px-4 py-3 border-b border-slate-700/50 hover:bg-slate-700/30 transition-colors cursor-pointer group">
                        <div className="flex gap-3">
                          <div className="w-8 h-8 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-500 shrink-0">
                            <Bell size={14} />
                          </div>
                          <div>
                            <p className="text-xs font-medium text-slate-200 group-hover:text-white mb-1">
                              {isDirecteurInst ? "Votre rapport d'établissement a été généré avec succès." : "Rapport de SUP'COM généré avec succès."}
                            </p>
                            <p className="text-[10px] text-slate-400">Il y a 10 minutes</p>
                          </div>
                        </div>
                      </div>

                      <div className="px-4 py-3 border-b border-slate-700/50 hover:bg-slate-700/30 transition-colors cursor-pointer group">
                        <div className="flex gap-3">
                          <div className="w-8 h-8 rounded-full bg-red-500/10 flex items-center justify-center text-red-500 shrink-0">
                            <Bell size={14} />
                          </div>
                          <div>
                            <p className="text-xs font-medium text-slate-200 group-hover:text-white mb-1">
                              {isDirecteurInst ? "Alerte : Baisse de performance détectée sur le taux de réussite." : "Alerte : IHEC Carthage — Chute du taux de rétention de 5% ce trimestre."}
                            </p>
                            <p className="text-[10px] text-slate-400">Il y a 2 heures</p>
                          </div>
                        </div>
                      </div>

                      <div className="px-4 py-3 hover:bg-slate-700/30 transition-colors cursor-pointer group opacity-60">
                        <div className="flex gap-3">
                          <div className="w-8 h-8 rounded-full bg-cyan-500/10 flex items-center justify-center text-cyan-500 shrink-0">
                            <Bell size={14} />
                          </div>
                          <div>
                            <p className="text-xs font-medium text-slate-200 group-hover:text-white mb-1">
                              {isDirecteurInst ? "Nouveau fichier de données ingesté avec succès." : "Nouveau fichier ingesté par ISSTE."}
                            </p>
                            <p className="text-[10px] text-slate-400">Hier</p>
                          </div>
                        </div>
                      </div>
                    </>
                  )}

                  {isStaff && (
                    <div className="px-4 py-3 hover:bg-slate-700/30 transition-colors cursor-pointer group">
                      <div className="flex gap-3">
                        <div className="w-8 h-8 rounded-full bg-cyan-500/10 flex items-center justify-center text-cyan-500 shrink-0">
                          <Bell size={14} />
                        </div>
                        <div>
                          <p className="text-xs font-medium text-slate-200 group-hover:text-white mb-1">
                            Votre accès a été confirmé. N'oubliez pas de mettre à jour les KPIs de votre domaine.
                          </p>
                          <p className="text-[10px] text-slate-400">Ce matin</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="border-t border-slate-700 p-2 bg-[#0F172A]/50">
                  <button className="w-full py-2 text-[10px] font-bold text-cyan-400 hover:text-cyan-300 uppercase tracking-widest transition-colors">
                    Marquer tout comme lu
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Account dropdown */}
        <div className="relative pl-6 border-l border-slate-700" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen(v => !v)}
            className="flex items-center gap-3 group"
          >
            <div className="text-right hidden sm:block">
              <p className="text-xs font-medium text-white group-hover:text-cyan-400 transition-colors">{displayEmail}</p>
            </div>
            <div className="w-8 h-8 rounded-full bg-cyan-500 flex items-center justify-center text-white text-xs font-bold ring-2 ring-cyan-500/20">
              {avatarLetters}
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
                  <p className="text-xs font-semibold text-white truncate">{displayEmail}</p>
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
                  <button
                    onClick={async () => {
                      await supabase.auth.signOut()
                      localStorage.removeItem('userRole')
                      localStorage.removeItem('userInstitution')
                      localStorage.removeItem('userFunction')
                      window.location.href = '/login'
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors"
                  >
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
