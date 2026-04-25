'use client'

import DashboardLayout from '@/components/DashboardLayout'
import { institutions, budgetData, alerts, achievements } from '@/lib/data'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import {
  MoreVertical,
  GripVertical,
  FileSearch,
  ShieldCheck,
  Trophy,
  Sparkles,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ArrowRight,
  Info,
} from 'lucide-react'

export default function Dashboard() {
  return (
    <DashboardLayout>
      <div className="p-6">
        {/* Top Header */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold text-slate-900">Vue UCAR — Console centrale</h1>
            <span className="bg-cyan-100 text-cyan-700 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">Avril 2026</span>
          </div>
          <div className="flex items-center gap-3">
            <button className="px-4 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-50 transition-colors">
              Réinitialiser la vue
            </button>
            <button className="px-4 py-1.5 bg-cyan-500 text-white rounded-lg text-xs font-bold hover:bg-cyan-600 transition-colors shadow-sm shadow-cyan-500/20">
              + Rapport urgent
            </button>
          </div>
        </div>

        {/* Status Bar */}
        <div className="bg-cyan-50/50 border border-cyan-100 rounded-lg px-4 py-2 flex items-center gap-2 text-[11px] text-cyan-700 font-medium mb-6">
          <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
          <span>Pipeline EchoGarden actif — {institutions.length} établissements démo / 30+ rattachés à UCAR — Dernière ingestion : il y a 2 min</span>
        </div>

        {/* Row 1 Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {/* Établissements récents */}
          <div className="bg-white rounded-xl border border-slate-100 p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <GripVertical size={16} className="text-slate-300" />
                <h3 className="text-sm font-bold text-slate-800">Établissements récents</h3>
              </div>
              <button className="text-slate-400 hover:text-slate-600 transition-colors">
                <MoreVertical size={16} />
              </button>
            </div>
            <div className="space-y-1">
              {institutions.slice(0, 6).map((inst, i, arr) => (
                <div key={inst.id} className={`flex items-center justify-between p-2 rounded-lg transition-colors group cursor-pointer ${i === arr.length - 1 ? '' : 'border-b border-slate-50'}`}>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-bold overflow-hidden" style={{ 
                      backgroundColor: inst.color, 
                      color: inst.status === 'Nominal' ? '#0891B2' : 
                             inst.status === 'Attention' ? '#C2410C' : 
                             inst.status === 'Hors ligne' ? '#EF4444' : '#BE123C' 
                    }}>
                      {inst.logo ? (
                        <img src={inst.logo} alt={inst.name} className="w-full h-full object-contain p-1" />
                      ) : (
                        inst.initials
                      )}
                    </div>
                    <span className="text-xs font-semibold text-cyan-700 group-hover:text-cyan-500">{inst.name}</span>
                  </div>
                  <ArrowRight size={14} className="text-slate-300 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
                </div>
              ))}
            </div>
            <button className="mt-4 text-[11px] font-bold text-cyan-500 hover:text-cyan-600 flex items-center gap-1">
              Voir tous les établissements <ArrowRight size={12} />
            </button>
          </div>

          {/* Santé globale */}
          <div className="bg-white rounded-xl border border-slate-100 p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <GripVertical size={16} className="text-slate-300" />
                <h3 className="text-sm font-bold text-slate-800">Santé globale du réseau</h3>
              </div>
              <button className="text-slate-400 hover:text-slate-600 transition-colors">
                <MoreVertical size={16} />
              </button>
            </div>
            <div className="flex flex-col items-center mb-6">
              <span className="text-5xl font-black text-cyan-500">81%</span>
              <span className="text-[11px] text-slate-500 font-medium mt-1 uppercase tracking-tight">Score de performance global</span>
            </div>
            <div className="space-y-3">
              {[
                { label: 'Institutions en alerte critique', val: institutions.filter(i => i.status === 'Critique').length, color: 'text-red-500' },
                { label: 'KPIs sous seuil (8 familles)', val: 11, color: 'text-amber-500' },
                { label: 'Sans soumission ce mois', val: institutions.filter(i => i.status === 'Hors ligne').length, color: 'text-cyan-500' }
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0">
                  <span className="text-[11px] text-cyan-800/80 font-medium">{item.label}</span>
                  <span className={`text-sm font-bold ${item.color}`}>{item.val}</span>
                </div>
              ))}
            </div>
            <button className="mt-4 text-[11px] font-bold text-cyan-500 hover:text-cyan-600 flex items-center gap-1">
              Aller au centre d'alertes <ArrowRight size={12} />
            </button>
          </div>

          {/* Capacités UCAR Pulse */}
          <div className="bg-white rounded-xl border border-slate-100 p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <GripVertical size={16} className="text-slate-300" />
                <h3 className="text-sm font-bold text-slate-800">Capacités UCAR Pulse</h3>
              </div>
              <button className="text-slate-400 hover:text-slate-600 transition-colors">
                <MoreVertical size={16} />
              </button>
            </div>
            <div className="space-y-3">
              {[
                { icon: FileSearch, title: 'Ingestion tout format', sub: 'PDF scanné, photo, Excel, Word — Tika + OCR', color: 'bg-cyan-50' },
                { icon: ShieldCheck, title: 'Verdict pass / revise / abstain', sub: 'Pipeline EchoGarden Weaver+Verifier — citations', color: 'bg-blue-50' },
                { icon: Trophy, title: 'Système de réalisations', sub: 'Excellence académique, insertion pro, recherche', color: 'bg-emerald-50' },
                { icon: Sparkles, title: 'Rapport mensuel automatique', sub: 'Narratif français, PDF en ~30 secondes', color: 'bg-orange-50' }
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer group">
                  <div className={`w-10 h-10 rounded-xl ${item.color} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}>
                    <item.icon size={18} className="text-slate-600" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-cyan-800">{item.title}</h4>
                    <p className="text-[10px] text-slate-400">{item.sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Row 2 Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Budget Chart */}
          <div className="lg:col-span-2 bg-white rounded-xl border border-slate-100 p-5 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <GripVertical size={16} className="text-slate-300" />
                <h3 className="text-sm font-bold text-slate-800">Budget & consommation</h3>
              </div>
              <button className="text-slate-400 hover:text-slate-600 transition-colors">
                <MoreVertical size={16} />
              </button>
            </div>
            
            <div className="grid grid-cols-3 gap-8 mb-8">
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Budget total alloué</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-black text-cyan-500">184 500 DT</span>
                </div>
                <span className="inline-flex items-center gap-1 text-[9px] font-bold text-cyan-600 bg-cyan-50 px-2 py-0.5 rounded-full mt-1">
                  <TrendingUp size={10} /> ↑ 8% vs mois précédent
                </span>
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Budget consommé</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-black text-cyan-600">126 340 DT</span>
                </div>
                <span className="inline-flex items-center gap-1 text-[9px] font-bold text-cyan-600 bg-cyan-50 px-2 py-0.5 rounded-full mt-1">
                  68% d'exécution
                </span>
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Prévu fin de mois</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-black text-amber-500">201 000 DT</span>
                </div>
                <span className="inline-flex items-center gap-1 text-[9px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full mt-1">
                  <AlertTriangle size={10} /> ↑ Dépassement possible
                </span>
              </div>
            </div>

            <div className="w-full">
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={budgetData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="month" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 600 }}
                    dy={10}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 600 }}
                  />
                  <Tooltip 
                    cursor={{ fill: '#f8fafc' }}
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', fontSize: '11px' }}
                  />
                  <Bar dataKey="academique" stackId="a" fill="#06B6D4" radius={[0, 0, 0, 0]} barSize={32} />
                  <Bar dataKey="finance" stackId="a" fill="#0891B2" radius={[0, 0, 0, 0]} barSize={32} />
                  <Bar dataKey="infrastructure" stackId="a" fill="#67E8F9" radius={[4, 4, 0, 0]} barSize={32} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            
            <div className="flex items-center gap-4 mt-4">
              {[
                { label: 'Académique', color: 'bg-cyan-500' },
                { label: 'Finance', color: 'bg-cyan-700' },
                { label: 'Infrastructure', color: 'bg-cyan-300' }
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-sm ${item.color}`}></span>
                  <span className="text-[10px] font-semibold text-slate-500">{item.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Alertes & Réalisations */}
          <div className="bg-white rounded-xl border border-slate-100 p-5 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <GripVertical size={16} className="text-slate-300" />
                <h3 className="text-sm font-bold text-slate-800">Alertes & Réalisations</h3>
              </div>
              <button className="text-slate-400 hover:text-slate-600 transition-colors">
                <MoreVertical size={16} />
              </button>
            </div>
            <div className="space-y-1">
              {[
                { label: 'Alertes critiques', val: alerts.filter(a => a.severity === 'Critique').length, color: 'text-red-500' },
                { label: 'Avertissements', val: alerts.filter(a => a.severity === 'Attention').length, color: 'text-amber-500' },
                { label: 'Réalisations', val: achievements.length, color: 'text-emerald-500' },
                { label: 'Sans soumission', val: alerts.filter(a => a.severity === 'Info').length, color: 'text-cyan-500' },
                { label: 'Rapports mensuels générés', val: 12, color: 'text-slate-700' }
              ].map((item, i, arr) => (
                <div key={i} className={`flex items-center justify-between px-3 py-3 rounded-lg ${i === arr.length - 1 ? 'bg-slate-50/50' : 'border-b border-slate-50'}`}>
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-tight">{item.label}</span>
                  <span className={`text-sm font-black ${item.color}`}>{item.val}</span>
                </div>
              ))}
            </div>
            <button className="w-full mt-6 py-2.5 bg-cyan-500 text-white rounded-lg text-xs font-bold hover:bg-cyan-600 transition-colors shadow-sm shadow-cyan-500/10">
              Voir le détail consolidé
            </button>
          </div>
        </div>

        {/* Réalisations du mois */}
        <div className="bg-white rounded-xl border border-slate-100 p-5 shadow-sm mb-6">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <GripVertical size={16} className="text-slate-300" />
              <h3 className="text-sm font-bold text-slate-800">Réalisations du mois</h3>
              <span className="bg-emerald-500 text-white text-[8px] font-black px-1.5 py-0.5 rounded uppercase tracking-widest">Bonnes nouvelles</span>
            </div>
            <button className="text-slate-400 hover:text-slate-600 transition-colors">
              <MoreVertical size={16} />
            </button>
          </div>
          {achievements.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {achievements.map((ach, i) => (
                <div key={i} className="p-4 rounded-xl bg-emerald-50/40 border border-emerald-100 flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white text-emerald-500 flex items-center justify-center flex-shrink-0 shadow-sm">
                    <Trophy size={18} />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-black text-slate-800 uppercase tracking-tight">{ach.institution}</span>
                      <span className="text-[8px] font-black px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-700 uppercase tracking-widest">{ach.type}</span>
                    </div>
                    <p className="text-[11px] text-slate-600 font-medium leading-snug">{ach.description}</p>
                    <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-1.5">{ach.period}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl">
              <Info size={16} className="text-slate-400" />
              <p className="text-[11px] text-slate-500 font-medium">Aucune réalisation enregistrée pour cette période.</p>
            </div>
          )}
        </div>

        {/* Row 3 Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Institutions Table */}
          <div className="lg:col-span-2 bg-white rounded-xl border border-slate-100 p-5 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <GripVertical size={16} className="text-slate-300" />
                <h3 className="text-sm font-bold text-slate-800">Vue des établissements</h3>
              </div>
              <div className="flex items-center gap-2">
                <button className="px-3 py-1 bg-slate-50 text-[10px] font-bold text-slate-500 rounded-lg hover:bg-slate-100">Filtrer</button>
                <button className="text-slate-400 hover:text-slate-600 transition-colors">
                  <MoreVertical size={16} />
                </button>
              </div>
            </div>
            
            <div className="overflow-x-auto -mx-5 px-5">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-[10px] font-black text-slate-400 uppercase tracking-wider border-b border-slate-100">
                    <th className="pb-3 pr-4">Établissement</th>
                    <th className="pb-3 pr-4">Ville</th>
                    <th className="pb-3 pr-4">Taux Réussite</th>
                    <th className="pb-3 pr-4">Budget Exécuté</th>
                    <th className="pb-3 pr-4">Taux Abandon</th>
                    <th className="pb-3 pr-4">Statut</th>
                    <th className="pb-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {institutions.slice(0, 5).map((inst) => (
                    <tr key={inst.id} className="group hover:bg-slate-50/50 transition-colors">
                      <td className="py-3.5 pr-4">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-md overflow-hidden bg-slate-50 flex-shrink-0">
                            {inst.logo ? (
                              <img src={inst.logo} alt="" className="w-full h-full object-contain p-0.5" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-[8px] font-black" style={{ backgroundColor: inst.color }}>{inst.initials}</div>
                            )}
                          </div>
                          <span className="text-xs font-bold text-slate-700">{inst.name}</span>
                        </div>
                      </td>
                      <td className="py-3.5 pr-4">
                        <span className="text-[11px] text-slate-400 font-medium">{inst.city}</span>
                      </td>
                      <td className="py-3.5 pr-4">
                        <span className={`text-[11px] font-black ${inst.successRate >= 85 ? 'text-emerald-500' : inst.successRate >= 60 ? 'text-amber-500' : 'text-red-500'}`}>
                          {inst.successRate}%
                        </span>
                      </td>
                      <td className="py-3.5 pr-4">
                        <span className={`text-[11px] font-bold ${inst.budgetExecution >= 50 ? 'text-slate-600' : 'text-amber-600'}`}>{inst.budgetExecution}%</span>
                      </td>
                      <td className="py-3.5 pr-4">
                        <span className={`text-[11px] font-bold ${inst.dropoutRate <= 10 ? 'text-emerald-500' : inst.dropoutRate < 20 ? 'text-amber-500' : 'text-red-500'}`}>
                          {inst.dropoutRate}%
                        </span>
                      </td>
                      <td className="py-3.5 pr-4">
                        <span className={`inline-block px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                          inst.status === 'Nominal' ? 'bg-emerald-50 text-emerald-600' : 
                          inst.status === 'Attention' ? 'bg-amber-50 text-amber-600' : 
                          inst.status === 'Hors ligne' ? 'bg-red-100 text-red-600' :
                          'bg-red-50 text-red-600'
                        }`}>
                          {inst.status}
                        </span>
                      </td>
                      <td className="py-3.5 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {inst.status === 'Critique' && (
                            <button className="px-2 py-1 bg-red-500 text-white text-[10px] font-bold rounded-md hover:bg-red-600 transition-colors shadow-sm shadow-red-500/10">Alerter</button>
                          )}
                          <button className="px-2 py-1 bg-cyan-500 text-white text-[10px] font-bold rounded-md hover:bg-cyan-600 transition-colors shadow-sm shadow-cyan-500/10">Détails</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <button className="w-full mt-4 py-2 border-t border-slate-50 text-[11px] font-bold text-cyan-500 hover:text-cyan-600 transition-colors">
              Voir tout →
            </button>
          </div>

          {/* AI Alerts Feed */}
          <div className="bg-white rounded-xl border border-slate-100 p-5 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <GripVertical size={16} className="text-slate-300" />
                <h3 className="text-sm font-bold text-slate-800">Alertes IA</h3>
                <span className="bg-cyan-500 text-white text-[8px] font-black px-1.5 py-0.5 rounded uppercase tracking-widest">IA</span>
              </div>
              <button className="text-slate-400 hover:text-slate-600 transition-colors">
                <MoreVertical size={16} />
              </button>
            </div>
            <div className="space-y-3">
              {alerts.map((alert, i) => (
                <div key={i} className={`p-3 rounded-xl border-l-4 ${
                  alert.severity === 'Critique' ? 'bg-red-50/30 border-red-500' :
                  alert.severity === 'Attention' ? 'bg-amber-50/30 border-amber-500' :
                  alert.severity === 'Info' ? 'bg-blue-50/30 border-blue-500' :
                  'bg-emerald-50/30 border-emerald-500'
                }`}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] font-black text-slate-800 uppercase tracking-tight">{alert.institution}</span>
                    <span className={`text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest ${
                      alert.severity === 'Critique' ? 'bg-red-100 text-red-700' :
                      alert.severity === 'Attention' ? 'bg-amber-100 text-amber-700' :
                      alert.severity === 'Info' ? 'bg-blue-100 text-blue-700' :
                      'bg-emerald-100 text-emerald-700'
                    }`}>
                      {alert.severity}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-relaxed font-medium">{alert.message}</p>
                  <div className="flex items-center gap-1.5 mt-2 text-[9px] text-slate-400 font-bold">
                    <Clock size={10} />
                    {alert.time}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
