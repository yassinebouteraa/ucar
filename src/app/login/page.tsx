'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Shield, GraduationCap, UserCircle2, Mail, Lock, ArrowRight, Info } from 'lucide-react'

type Role = 'Institution' | 'UCAR' | 'Président'

export default function LoginPage() {
  const [role, setRole] = useState<Role>('Institution')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const router = useRouter()

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    // Simulated login
    router.push('/dashboard')
  }

  return (
    <div className="min-h-screen bg-[#F0FAFA] flex flex-col items-center justify-center p-6">
      <div className="mb-8 flex flex-col items-center">
        <div className="bg-cyan-500 w-16 h-16 rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-xl shadow-cyan-500/20 mb-4">
          UC
        </div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">UCAR Pulse</h1>
        <p className="text-slate-400 text-sm font-bold uppercase tracking-widest mt-1">Operating System · Enseignement Supérieur</p>
      </div>

      <div className="w-full max-w-md bg-white rounded-3xl border border-slate-100 shadow-2xl shadow-cyan-500/5 overflow-hidden">
        <div className="p-10">
          <h2 className="text-xl font-black text-slate-800 mb-8 text-center">Accéder à la plateforme</h2>

          {/* Role Tabs — calqués sur la structure des universités tunisiennes */}
          <div className="flex bg-slate-50 p-1 rounded-2xl mb-4 shadow-inner">
            {(['Institution', 'UCAR', 'Président'] as Role[]).map((r) => (
              <button
                key={r}
                onClick={() => setRole(r)}
                className={`flex-1 flex flex-col items-center py-4 rounded-xl transition-all ${
                  role === r
                    ? 'bg-white text-cyan-600 shadow-md scale-[1.02]'
                    : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                {r === 'Institution' ? <GraduationCap size={20} className="mb-1" /> : r === 'UCAR' ? <Shield size={20} className="mb-1" /> : <UserCircle2 size={20} className="mb-1" />}
                <span className="text-[10px] font-black uppercase tracking-widest">{r === 'Institution' ? 'Staff Institution' : r === 'UCAR' ? 'Admin UCAR' : 'Président'}</span>
              </button>
            ))}
          </div>

          {/* Role hint based on selection */}
          <div className="mb-8 px-4 py-3 bg-cyan-50/60 border border-cyan-100 rounded-xl flex items-start gap-2">
            <Info size={12} className="text-cyan-600 mt-0.5 flex-shrink-0" />
            <p className="text-[10px] text-cyan-800 font-bold leading-relaxed">
              {role === 'Institution'
                ? 'Trésorier, Chef Personnel, Scolarité ou Recherche — accès limité aux KPIs de votre institution. Compte en attente d\'approbation par votre Président.'
                : role === 'UCAR'
                  ? 'Présidente, Vice-Président délégué ou Secrétaire Général — vue consolidée sur les 30+ établissements.'
                  : 'Président d\'institution — approuve les accès du personnel et consulte tous les KPIs de son établissement.'}
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Email professionnel</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-cyan-500 transition-colors" size={18} />
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nom@ucar.tn"
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-12 pr-4 text-sm focus:outline-none focus:border-cyan-500 focus:bg-white transition-all shadow-sm"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Mot de passe</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-cyan-500 transition-colors" size={18} />
                <input 
                  type="password" 
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-12 pr-4 text-sm focus:outline-none focus:border-cyan-500 focus:bg-white transition-all shadow-sm"
                />
              </div>
            </div>

            <div className="flex items-center justify-between py-2">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input type="checkbox" className="w-4 h-4 rounded border-slate-200 text-cyan-500 focus:ring-cyan-500" />
                <span className="text-xs text-slate-500 font-medium group-hover:text-slate-700 transition-colors">Se souvenir de moi</span>
              </label>
              <button type="button" className="text-xs text-cyan-600 font-bold hover:text-cyan-700 transition-colors">Mot de passe oublié ?</button>
            </div>

            <button 
              type="submit"
              className="w-full py-4 bg-cyan-500 text-white rounded-2xl text-sm font-black uppercase tracking-widest hover:bg-cyan-600 shadow-xl shadow-cyan-500/20 transition-all flex items-center justify-center gap-2 group active:scale-[0.98]"
            >
              Se connecter
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </form>
        </div>
        
        <div className="bg-slate-50 p-6 text-center border-t border-slate-100">
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-relaxed">
            Accès sécurisé réservé au personnel administratif de l'Université de Carthage.
          </p>
        </div>
      </div>

      <p className="mt-12 text-[10px] text-slate-400 font-black uppercase tracking-widest">UCAR Pulse · HACK4UCAR 2025 · ACM ENSTAB</p>
    </div>
  )
}
