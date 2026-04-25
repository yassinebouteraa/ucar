'use client'

import DashboardLayout from '@/components/DashboardLayout'
import { Database, Link2, Clock, CheckCircle2, AlertCircle, Upload, ArrowRight, Download, Server, Wifi, FileText } from 'lucide-react'

const sources = [
  { name: 'Pipeline EchoGarden', status: 'Connecté', color: 'text-emerald-500', bg: 'bg-emerald-50', icon: Database },
  { name: 'Apache Tika + OCR', status: 'Connecté', color: 'text-emerald-500', bg: 'bg-emerald-50', icon: Server },
  { name: 'Groq — Llama 3.3 70B', status: 'Connecté', color: 'text-emerald-500', bg: 'bg-emerald-50', icon: Wifi },
  { name: 'Qdrant Vector Store', status: 'En attente', color: 'text-amber-500', bg: 'bg-amber-50', icon: Link2 },
]

const imports = [
  { source: 'Scolarité — INSAT (PDF scanné)', date: '25 Avr 2026, 14:30', records: 12, status: 'Succès' },
  { source: 'Finance — ENIT (Excel)', date: '25 Avr 2026, 12:15', records: 8, status: 'Succès' },
  { source: 'RH — ISG (photo de tableau)', date: '24 Avr 2026, 18:45', records: 0, status: 'Erreur' },
  { source: 'Recherche — ESPRIT (Word)', date: '24 Avr 2026, 09:00', records: 14, status: 'En cours' },
  { source: 'Académique — INSAT (Excel)', date: '23 Avr 2026, 16:20', records: 11, status: 'Succès' },
]

export default function DataIntegrationPage() {
  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-black text-slate-900">Ingestion des Documents</h1>
            <span className="bg-cyan-100 text-cyan-700 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest border border-cyan-200">
              Tout format accepté
            </span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-50 border border-amber-100 rounded-xl text-[10px] font-black text-amber-700 uppercase tracking-widest">
            <Clock size={12} />
            Deadline : 26 du mois (J−1 avant verrouillage)
          </div>
        </div>
        <p className="text-sm text-slate-500 font-medium mb-8 max-w-3xl">
          Glissez-déposez vos fichiers — PDF scanné, photo de tableau imprimé, Excel, Word. Apache Tika et l'OCR extraient le texte ; Groq extrait les KPIs ; EchoGarden vectorise et vérifie.
        </p>

        {/* Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {sources.map((s, i) => (
            <div key={i} className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-10 h-10 rounded-xl ${s.bg} flex items-center justify-center ${s.color}`}>
                  <s.icon size={20} />
                </div>
                <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                  s.status === 'Connecté' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                }`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${s.status === 'Connecté' ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
                  {s.status}
                </div>
              </div>
              <h3 className="text-sm font-black text-slate-800 mb-1">{s.name}</h3>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Dernier check : il y a 5m</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Imports */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 p-8 shadow-sm">
            <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
              <Clock size={14} className="text-cyan-500" />
              Jobs d'ingestion récents
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-slate-50">
                    <th className="pb-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Source</th>
                    <th className="pb-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Date & Heure</th>
                    <th className="pb-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">KPIs extraits</th>
                    <th className="pb-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Statut</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {imports.map((imp, i) => (
                    <tr key={i} className="group">
                      <td className="py-4 font-bold text-sm text-slate-700">{imp.source}</td>
                      <td className="py-4 text-xs text-slate-400 font-medium">{imp.date}</td>
                      <td className="py-4 text-center text-sm font-black text-slate-600">{imp.records}</td>
                      <td className="py-4 text-right">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                          imp.status === 'Succès' ? 'bg-emerald-50 text-emerald-600' :
                          imp.status === 'Erreur' ? 'bg-red-50 text-red-600' :
                          'bg-blue-50 text-blue-600'
                        }`}>
                          {imp.status === 'Succès' ? <CheckCircle2 size={10} /> : imp.status === 'Erreur' ? <AlertCircle size={10} /> : <Clock size={10} />}
                          {imp.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <button className="w-full mt-6 py-2 border-t border-slate-50 text-[11px] font-bold text-cyan-500 hover:text-cyan-600 transition-colors">
              Voir tout l'historique →
            </button>
          </div>

          {/* Upload Zone */}
          <div className="bg-white rounded-2xl border border-slate-100 p-8 shadow-sm">
            <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6">Soumission de documents</h2>
            <div className="border-2 border-dashed border-slate-100 rounded-2xl p-8 flex flex-col items-center justify-center bg-slate-50/50 hover:bg-cyan-50/30 hover:border-cyan-200 transition-all cursor-pointer group">
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-slate-300 mb-4 shadow-sm group-hover:scale-110 group-hover:text-cyan-500 transition-all">
                <Upload size={32} />
              </div>
              <p className="text-sm font-black text-slate-700 mb-1">Glissez vos fichiers ici</p>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">PDF · Excel · Word · Photo — jusqu'à 50MB</p>
            </div>
            <button className="w-full mt-6 py-4 bg-cyan-500 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-cyan-600 shadow-lg shadow-cyan-500/20 transition-all active:scale-[0.98]">
              Lancer l'extraction
            </button>
            <div className="mt-8 space-y-4">
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50 pb-2">Familles KPI cibles</h3>
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl group cursor-pointer hover:bg-slate-100 transition-all">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-emerald-500"><FileText size={14} /></div>
                  <span className="text-xs font-bold text-slate-600">Académique · Finance · RH</span>
                </div>
                <ArrowRight size={14} className="text-slate-300 group-hover:text-cyan-500" />
              </div>
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl group cursor-pointer hover:bg-slate-100 transition-all">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-blue-500"><FileText size={14} /></div>
                  <span className="text-xs font-bold text-slate-600">Recherche · Insertion · ESG · Partenariats</span>
                </div>
                <ArrowRight size={14} className="text-slate-300 group-hover:text-cyan-500" />
              </div>
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl group cursor-pointer hover:bg-slate-100 transition-all">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-amber-500"><Download size={14} /></div>
                  <span className="text-xs font-bold text-slate-600">Templates Excel (optionnel)</span>
                </div>
                <ArrowRight size={14} className="text-slate-300 group-hover:text-cyan-500" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
