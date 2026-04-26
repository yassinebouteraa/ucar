'use client'

import DashboardLayout from '@/components/DashboardLayout'
import {
  institutions as mockInstitutions,
  achievements,
  Institution,
} from '@/lib/data'
import { supabase } from '@/lib/supabase'
import { Search, MapPin, Eye, AlertCircle, Trophy, Scale } from 'lucide-react'
import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function InstitutionsPage() {
  const [filter, setFilter] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [dbInstitutions, setDbInstitutions] = useState<Institution[]>([])

  useEffect(() => {
    const loadInstitutions = async () => {
      try {
        const [
          { data: institutions },
          { data: snapshots }
        ] = await Promise.all([
          supabase.from('institutions').select('*'),
          supabase.from('kpi_snapshots').select('*').order('created_at', { ascending: false })
        ]);

        if (institutions) {
          const merged = institutions.map(inst => {
            const latest = snapshots?.find(s => s.institution_id === inst.id);
            const kpiData = latest?.data || {};
            return {
              ...inst,
              successRate: kpiData.success_rate || 0,
              budgetExecution: kpiData.budget_execution || 0,
              dropoutRate: kpiData.dropout_rate || 0,
              employabilityRate: kpiData.employability_rate || 0,
              absenteeismRate: kpiData.absenteeism_rate || 0,
              publicationsCount: kpiData.publications_count || 0,
              initials: inst.name.substring(0, 2).toUpperCase(),
              status: kpiData.status || 'Nominal',
              color: '#F1F5F9'
            };
          });
          setDbInstitutions(merged);
        }
      } catch (err) {
        console.error("Error loading institutions:", err);
      } finally {
        setLoading(false);
      }
    };
    loadInstitutions();
  }, []);

  const institutionsToDisplay = dbInstitutions.length > 0 ? dbInstitutions : mockInstitutions

  const filteredInstitutions = institutionsToDisplay.filter(inst => {
    const matchesFilter = filter === 'All' || inst.status === filter
    const matchesSearch = 
      inst.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inst.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inst.type.toLowerCase().includes(searchQuery.toLowerCase())
    
    return matchesFilter && matchesSearch
  })

  if (loading) {
    return (
      <DashboardLayout>
        <div className="p-6 flex items-center justify-center min-h-[60vh]">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-sm font-black text-slate-400 uppercase tracking-widest">Initialisation du réseau...</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="p-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-black text-slate-900">Établissements</h1>
            <span className="bg-cyan-100 text-cyan-700 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest border border-cyan-200">
              {institutionsToDisplay.length} démo · 30+ rattachés
            </span>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="relative group flex-1 md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-hover:text-cyan-500 transition-colors" size={16} />
              <input 
                type="text" 
                placeholder="Rechercher..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-xl py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-cyan-500 transition-all shadow-sm"
              />
            </div>
            <div className="flex bg-white border border-slate-200 rounded-xl p-1 shadow-sm">
              {['All', 'Nominal', 'Attention', 'Critique', 'Hors ligne'].map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-3 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${
                    filter === f 
                      ? 'bg-cyan-500 text-white shadow-sm' 
                      : 'text-slate-400 hover:text-slate-600'
                  }`}
                >
                  {f === 'All' ? 'Tous' : f === 'Hors ligne' ? 'Offline' : f}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Grid */}
        {filteredInstitutions.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredInstitutions.map((inst) => {
              const instAchievements = achievements.filter(a => a.institution === inst.name)
              return (
              <div key={inst.id} className={`bg-white rounded-2xl border p-6 shadow-sm hover:shadow-md transition-all group relative overflow-hidden ${
                inst.status === 'Hors ligne' ? 'border-red-200 bg-slate-50/50' : 'border-slate-100 hover:border-cyan-100'
              }`}>
                {/* No Data Red Line/Overlay */}
                {inst.status === 'Hors ligne' && (
                  <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] flex flex-col items-center justify-center z-10 p-6 text-center">
                    <div className="w-full h-1 bg-red-500 absolute top-0 left-0" />
                    <AlertCircle size={32} className="text-red-500 mb-2 animate-bounce" />
                    <h4 className="text-sm font-black text-red-600 uppercase tracking-widest mb-1">Aucune Soumission</h4>
                    <p className="text-[10px] text-slate-500 font-bold max-w-[220px]">Aucun fichier reçu ce mois — rapport en mode fallback (données de la période précédente).</p>
                  </div>
                )}

                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center text-sm font-black shadow-inner overflow-hidden" style={{ backgroundColor: inst.color, color: inst.status === 'Nominal' ? '#0891B2' : inst.status === 'Attention' ? '#C2410C' : '#BE123C' }}>
                      {inst.logo ? (
                        <img src={inst.logo} alt={inst.name} className="w-full h-full object-contain p-1" />
                      ) : (
                        inst.initials
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-black text-slate-800 text-base">{inst.name}</h3>
                        <span className="text-[8px] font-black uppercase tracking-widest bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded border border-slate-200">{inst.type}</span>
                      </div>
                      <div className="flex flex-col gap-0.5">
                        <div className="flex items-center gap-1 text-[10px] text-slate-400 font-bold uppercase tracking-tight">
                          <MapPin size={10} />
                          {inst.city}
                        </div>
                        <div className="text-[9px] text-cyan-600 font-bold italic">{inst.university}</div>
                      </div>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                    inst.status === 'Nominal' ? 'bg-emerald-50 text-emerald-600' : 
                    inst.status === 'Attention' ? 'bg-amber-50 text-amber-600' : 
                    inst.status === 'Hors ligne' ? 'bg-red-100 text-red-600' :
                    'bg-red-50 text-red-600'
                  }`}>
                    {inst.status}
                  </span>
                </div>

                <div className="space-y-5">
                  {/* Taux Réussite */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Taux de réussite</span>
                      <span className="text-xs font-black text-slate-700">{inst.successRate}%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-50 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-cyan-500 rounded-full transition-all duration-1000" 
                        style={{ width: `${inst.successRate}%` }}
                      />
                    </div>
                  </div>

                  {/* Budget */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Budget exécuté</span>
                      <span className="text-xs font-black text-slate-700">{inst.budgetExecution}%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-50 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-slate-400 rounded-full transition-all duration-1000" 
                        style={{ width: `${inst.budgetExecution}%` }}
                      />
                    </div>
                  </div>

                  {/* Taux Abandon */}
                  <div className="flex items-center justify-between pt-2">
                    <div className="flex flex-col">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Taux d'abandon</span>
                      <span className={`text-sm font-black ${inst.dropoutRate > 10 ? 'text-red-500' : 'text-slate-700'}`}>{inst.dropoutRate}%</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {inst.status !== 'Hors ligne' && (
                        <Link
                          href={`/dashboard/comparison?institution=${encodeURIComponent(inst.name)}`}
                          className="flex items-center gap-1.5 px-3 py-2 bg-slate-50 text-slate-600 rounded-xl text-[11px] font-black uppercase tracking-widest hover:bg-slate-900 hover:text-white transition-all border border-slate-200"
                          title="Comparer cet établissement au réseau"
                        >
                          <Scale size={12} />
                          Comparer
                        </Link>
                      )}
                      <button className="flex items-center gap-2 px-4 py-2 bg-cyan-50 text-cyan-600 rounded-xl text-[11px] font-black uppercase tracking-widest hover:bg-cyan-500 hover:text-white transition-all group-hover:shadow-lg group-hover:shadow-cyan-500/10">
                        <Eye size={14} />
                        Voir détails
                      </button>
                    </div>
                  </div>
                </div>

                {/* Achievements badges */}
                {instAchievements.length > 0 && (
                  <div className="mt-5 pt-5 border-t border-slate-100 space-y-2">
                    {instAchievements.map((ach, idx) => (
                      <div key={idx} className="flex items-center gap-2 p-2 bg-emerald-50/50 rounded-xl border border-emerald-100">
                        <Trophy size={14} className="text-emerald-500 flex-shrink-0" />
                        <span className="text-[10px] font-black text-emerald-700 uppercase tracking-tight">{ach.type}</span>
                      </div>
                    ))}
                  </div>
                )}

                {inst.status === 'Critique' && (
                  <div className="mt-6 p-3 bg-red-50 rounded-xl flex items-center gap-3 border border-red-100">
                    <AlertCircle size={16} className="text-red-500 flex-shrink-0" />
                    <p className="text-[10px] text-red-700 font-bold leading-tight">
                      {inst.dropoutRate >= 20
                        ? `Action urgente : taux d'abandon à ${inst.dropoutRate}% — au-dessus du seuil critique de 20%.`
                        : inst.absenteeismRate >= 8
                          ? `Action urgente : absentéisme à ${inst.absenteeismRate}% — au-dessus du seuil critique de 8%.`
                          : `Action urgente requise — KPI sous le seuil critique.`}
                    </p>
                  </div>
                )}
              </div>
              )
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-slate-100 shadow-sm">
            <Search size={48} className="text-slate-200 mb-4" />
            <h3 className="text-lg font-black text-slate-800 uppercase tracking-widest mb-2">Aucun résultat</h3>
            <p className="text-sm text-slate-500 font-bold">Aucun établissement ne correspond à votre recherche "{searchQuery}"</p>
            <button 
              onClick={() => {setSearchQuery(''); setFilter('All');}}
              className="mt-6 px-6 py-2 bg-cyan-500 text-white rounded-xl text-[11px] font-black uppercase tracking-widest shadow-lg shadow-cyan-500/20 hover:scale-105 transition-all"
            >
              Réinitialiser les filtres
            </button>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
