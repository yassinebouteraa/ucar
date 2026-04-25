import { Search, Bell, Settings } from 'lucide-react'

export default function Navbar() {
  return (
    <header className="h-16 bg-[#0F172A] flex items-center px-6 fixed top-0 left-0 right-0 z-50">
      <div className="flex items-center gap-3">
        <div className="bg-cyan-500 rounded-lg w-8 h-8 flex items-center justify-center text-white font-bold text-sm">
          UC
        </div>
        <span className="text-white font-semibold text-sm">UCAR Pulse</span>
      </div>

      <div className="flex-1 max-w-xl mx-12">
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-hover:text-cyan-400 transition-colors" size={16} />
          <input 
            type="text" 
            placeholder="Rechercher un établissement..."
            className="w-full bg-[#1E293B] border border-slate-700 rounded-lg py-2 pl-10 pr-4 text-sm text-slate-200 focus:outline-none focus:border-cyan-500 transition-all"
          />
        </div>
      </div>

      <div className="flex items-center gap-6 ml-auto">
        <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-[#1E293B] border border-slate-700 rounded-md text-[11px] text-slate-400">
          <span>Tunis</span>
        </div>
        
        <div className="flex items-center gap-4">
          <button className="text-slate-400 hover:text-white transition-colors relative">
            <Bell size={18} />
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-[#0F172A]"></span>
          </button>
          <button className="text-slate-400 hover:text-white transition-colors">
            <Settings size={18} />
          </button>
        </div>

        <div className="flex items-center gap-3 pl-6 border-l border-slate-700">
          <div className="text-right hidden sm:block">
            <p className="text-xs font-medium text-white">rectorat@ucar.tn</p>
          </div>
          <div className="w-8 h-8 rounded-full bg-cyan-500 flex items-center justify-center text-white text-xs font-bold ring-2 ring-cyan-500/20">
            PU
          </div>
        </div>
      </div>
    </header>
  )
}
