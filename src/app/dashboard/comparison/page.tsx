'use client'

import DashboardLayout from '@/components/DashboardLayout'
import {
  institutions as mockInstitutions,
  Institution,
  InstitutionType,
  PERIODS,
  kpiHistory as mockKpiHistory,
  institutionAccent,
} from '@/lib/data'
import { supabase } from '@/lib/supabase'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts'
import {
  Scale,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
  Filter,
  Trophy,
  AlertTriangle,
  Users,
  Check,
  Sparkles,
  Download,
  X,
  Plus,
  RotateCcw,
  Sliders,
} from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'

type KpiKey =
  | 'successRate'
  | 'budgetExecution'
  | 'dropoutRate'
  | 'employabilityRate'
  | 'absenteeismRate'
  | 'publicationsCount'

type KpiSpec = {
  key: KpiKey
  label: string
  family: string
  unit: '%' | 'count'
  // higher value = better performance?
  higherIsBetter: boolean
}

const KPIS: KpiSpec[] = [
  { key: 'successRate', label: 'Taux de réussite', family: 'Académique', unit: '%', higherIsBetter: true },
  { key: 'dropoutRate', label: "Taux d'abandon", family: 'Académique', unit: '%', higherIsBetter: false },
  { key: 'budgetExecution', label: 'Exécution budgétaire', family: 'Finance', unit: '%', higherIsBetter: true },
  { key: 'employabilityRate', label: 'Insertion professionnelle', family: 'Insertion Pro', unit: '%', higherIsBetter: true },
  { key: 'absenteeismRate', label: 'Absentéisme du personnel', family: 'RH', unit: '%', higherIsBetter: false },
  { key: 'publicationsCount', label: 'Publications scientifiques', family: 'Recherche', unit: 'count', higherIsBetter: true },
]

const TYPES: ('Tous' | InstitutionType)[] = ['Tous', 'École', 'Faculté', 'Institut']

export default function ComparisonPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const highlighted = searchParams.get('institution') || ''

  const [mode, setMode] = useState<'single' | 'custom'>('single')
  const [kpiKey, setKpiKey] = useState<KpiKey>('successRate')
  const [typeFilter, setTypeFilter] = useState<'Tous' | InstitutionType>('Tous')
  const [cityFilter, setCityFilter] = useState<string>('Toutes')
  const [loading, setLoading] = useState(true)
  const [institutions, setInstitutions] = useState<Institution[]>(mockInstitutions)
  const [kpiHistory, setKpiHistory] = useState<any>(mockKpiHistory)

  // Multi-establishment comparator state (max 3)
  const [selectedInstitutions, setSelectedInstitutions] = useState<string[]>([])

  useEffect(() => {
    const loadData = async () => {
      try {
        const [
          { data: dbInstitutions },
          { data: dbSnapshots }
        ] = await Promise.all([
          supabase.from('institutions').select('*'),
          supabase.from('kpi_snapshots').select('*').order('created_at', { ascending: false })
        ]);

        if (dbInstitutions) {
          const merged = dbInstitutions.map(inst => {
            const latest = dbSnapshots?.find(s => s.institution_id === inst.id);
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
          setInstitutions(merged);
        }
      } catch (err) {
        console.error("Error loading comparison data:", err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // Seed the custom selection once
  useEffect(() => {
    if (loading || selectedInstitutions.length > 0 || institutions.length === 0) return
    const onlineInst = institutions.filter(i => i.status !== 'Hors ligne')
    const seed = highlighted && onlineInst.find(o => o.name === highlighted)
      ? [highlighted, ...onlineInst.filter(o => o.name !== highlighted).slice(0, 1).map(o => o.name)]
      : onlineInst.slice(0, Math.min(2, onlineInst.length)).map(o => o.name)
    setSelectedInstitutions(seed)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, institutions])

  const kpi = KPIS.find(k => k.key === kpiKey)!

  // Available cities derived from data
  const cities = useMemo(() => {
    const set = new Set<string>()
    institutions.forEach(i => { if (i.status !== 'Hors ligne') set.add(i.city) })
    return ['Toutes', ...Array.from(set).sort()]
  }, [institutions])

  // Eligible (online) institutions before filters — used to compute the network average
  const online = useMemo(() => institutions.filter(i => i.status !== 'Hors ligne'), [institutions])

  // After filters
  const filtered = useMemo(() => {
    return online.filter(i =>
      (typeFilter === 'Tous' || i.type === typeFilter) &&
      (cityFilter === 'Toutes' || i.city === cityFilter)
    )
  }, [online, typeFilter, cityFilter])

  const networkAvg = useMemo(() => avg(online.map(i => i[kpiKey] as number)), [online, kpiKey])
  const typeAvg = useMemo(() => {
    if (typeFilter === 'Tous') return networkAvg
    const peers = online.filter(i => i.type === typeFilter)
    return avg(peers.map(i => i[kpiKey] as number))
  }, [online, typeFilter, kpiKey, networkAvg])

  // Sort: best to worst given the KPI's polarity
  const ranked = useMemo(() => {
    const sorted = [...filtered].sort((a, b) => {
      const av = a[kpiKey] as number
      const bv = b[kpiKey] as number
      return kpi.higherIsBetter ? bv - av : av - bv
    })
    return sorted
  }, [filtered, kpiKey, kpi.higherIsBetter])

  const top = ranked[0]
  const bottom = ranked[ranked.length - 1]

  const formatVal = (v: number) => kpi.unit === '%' ? `${v.toFixed(1)}%` : `${Math.round(v)}`

  if (loading) {
    return (
      <DashboardLayout>
        <div className="p-6 flex items-center justify-center min-h-[60vh]">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-sm font-black text-slate-400 uppercase tracking-widest">Chargement du benchmark...</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="p-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500 flex items-center justify-center text-white shadow-lg shadow-cyan-500/20">
              <Scale size={20} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 leading-tight">Benchmark inter-établissements</h1>
              <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest">Réservé à la vue UCAR · classement par KPI</p>
            </div>
          </div>
          {highlighted && (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-cyan-50 border border-cyan-100 rounded-xl text-[10px] font-black text-cyan-700 uppercase tracking-widest">
              Établissement comparé : {highlighted}
              <button
                onClick={() => router.replace('/dashboard/comparison')}
                className="ml-1 text-cyan-500 hover:text-cyan-700"
              >
                ✕
              </button>
            </div>
          )}
        </div>

        {/* Mode tabs */}
        <div className="inline-flex bg-white border border-slate-100 rounded-xl p-1 mb-6 shadow-sm">
          <button
            onClick={() => setMode('single')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-[11px] font-black uppercase tracking-widest transition-all ${
              mode === 'single' ? 'bg-cyan-500 text-white shadow-sm' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <Filter size={12} />
            Par indicateur
          </button>
          <button
            onClick={() => setMode('custom')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-[11px] font-black uppercase tracking-widest transition-all ${
              mode === 'custom' ? 'bg-cyan-500 text-white shadow-sm' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <Users size={12} />
            Multi-établissements
          </button>
        </div>

      {mode === 'single' && (
        <>
        {/* Filter bar */}
        <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Filter size={14} className="text-slate-400" />
            <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Critères de comparaison</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* KPI selector */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Indicateur</label>
              <select
                value={kpiKey}
                onChange={e => setKpiKey(e.target.value as KpiKey)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-sm appearance-none focus:outline-none focus:border-cyan-500 transition-all font-bold text-slate-700"
              >
                {KPIS.map(k => (
                  <option key={k.key} value={k.key}>
                    {k.family} — {k.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Type filter */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Type d'établissement</label>
              <div className="flex bg-slate-50 border border-slate-200 rounded-xl p-1">
                {TYPES.map(t => (
                  <button
                    key={t}
                    onClick={() => setTypeFilter(t)}
                    className={`flex-1 px-3 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${
                      typeFilter === t
                        ? 'bg-white text-cyan-600 shadow-sm'
                        : 'text-slate-400 hover:text-slate-600'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* City filter */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Gouvernorat / Ville</label>
              <select
                value={cityFilter}
                onChange={e => setCityFilter(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-sm appearance-none focus:outline-none focus:border-cyan-500 transition-all font-bold text-slate-700"
              >
                {cities.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>

          <p className="text-[10px] text-slate-400 font-medium mt-4 italic">
            La moyenne réseau est calculée sur l'ensemble des {online.length} établissements en ligne. La moyenne par type
            n'inclut que les établissements du même type. Les établissements <span className="font-black">Hors ligne</span> sont exclus du benchmark.
          </p>
        </div>

        {/* Stat cards: Network avg, Type avg, Top, Bottom */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <StatCard
            label="Moyenne réseau"
            value={formatVal(networkAvg)}
            sub={`${online.length} établissements`}
            tone="cyan"
          />
          <StatCard
            label={typeFilter === 'Tous' ? 'Moyenne (tous types)' : `Moyenne ${typeFilter}`}
            value={formatVal(typeAvg)}
            sub={typeFilter === 'Tous' ? 'Identique au réseau' : `Pairs : ${online.filter(i => i.type === typeFilter).length}`}
            tone="slate"
          />
          {top && (
            <StatCard
              label="Meilleur performer"
              value={formatVal(top[kpiKey] as number)}
              sub={top.name}
              tone="emerald"
              icon={<Trophy size={14} />}
            />
          )}
          {bottom && bottom !== top && (
            <StatCard
              label="Sous le seuil"
              value={formatVal(bottom[kpiKey] as number)}
              sub={bottom.name}
              tone="red"
              icon={<AlertTriangle size={14} />}
            />
          )}
        </div>

        {/* Trend chart */}
        <TrendChart
          insts={ranked}
          kpiKey={kpiKey}
          kpiLabel={kpi.label}
          kpiUnit={kpi.unit}
          kpiHistory={kpiHistory}
          highlighted={highlighted}
          subtitle={`Tendance sur 10 mois · ${ranked.length} établissement${ranked.length > 1 ? 's' : ''} · moyenne réseau ${formatVal(networkAvg)}`}
          referenceLines={[
            { y: networkAvg, label: 'Moyenne réseau', color: '#94a3b8' },
            ...(typeFilter !== 'Tous' ? [{ y: typeAvg, label: `Moyenne ${typeFilter}`, color: '#f59e0b' }] : []),
          ]}
          formatVal={formatVal}
        />

        {/* Ranking table */}
        <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-black text-slate-800">Classement détaillé</h3>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
              Δ = écart vs moyenne réseau
            </span>
          </div>

          {ranked.length === 0 ? (
            <p className="text-sm text-slate-500 font-medium py-8 text-center">Aucun établissement ne correspond aux filtres.</p>
          ) : (
            <div className="overflow-x-auto -mx-2">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
                    <th className="pb-3 px-2">Rang</th>
                    <th className="pb-3 px-2">Établissement</th>
                    <th className="pb-3 px-2">Type</th>
                    <th className="pb-3 px-2">Ville</th>
                    <th className="pb-3 px-2 text-right">{kpi.label}</th>
                    <th className="pb-3 px-2 text-right">Δ Réseau</th>
                    <th className="pb-3 px-2 text-right">Benchmark</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {ranked.map((inst, idx) => {
                    const value = inst[kpiKey] as number
                    const delta = round(value - networkAvg)
                    const above = isAboveStandard(value, networkAvg, kpi.higherIsBetter)
                    const isHighlighted = inst.name === highlighted
                    return (
                      <tr key={inst.id} className={`text-sm hover:bg-slate-50/50 transition-colors ${isHighlighted ? 'bg-cyan-50/40' : ''}`}>
                        <td className="py-3 px-2">
                          <span className={`inline-flex items-center justify-center w-7 h-7 rounded-lg text-[11px] font-black ${
                            idx === 0 ? 'bg-emerald-100 text-emerald-700' :
                            idx === ranked.length - 1 ? 'bg-red-100 text-red-700' :
                            'bg-slate-100 text-slate-600'
                          }`}>
                            {idx + 1}
                          </span>
                        </td>
                        <td className="py-3 px-2">
                          <div className="flex items-center gap-2">
                            {inst.logo ? (
                              <img src={inst.logo} alt={inst.name} className="w-7 h-7 rounded-lg object-contain bg-white border border-slate-100 p-0.5" />
                            ) : (
                              <div className="w-7 h-7 rounded-lg flex items-center justify-center text-[10px] font-black" style={{ backgroundColor: inst.color }}>
                                {inst.initials}
                              </div>
                            )}
                            <span className="text-xs font-black text-slate-800">{inst.name}</span>
                          </div>
                        </td>
                        <td className="py-3 px-2 text-[11px] font-bold text-slate-500">{inst.type}</td>
                        <td className="py-3 px-2 text-[11px] text-slate-400 font-medium">{inst.city}</td>
                        <td className="py-3 px-2 text-right text-sm font-black text-slate-700">{formatVal(value)}</td>
                        <td className="py-3 px-2 text-right">
                          <span className={`inline-flex items-center gap-1 text-[11px] font-black ${above ? 'text-emerald-600' : 'text-red-500'}`}>
                            {kpi.unit === '%' ? `${delta > 0 ? '+' : ''}${delta.toFixed(1)} pt` : `${delta > 0 ? '+' : ''}${Math.round(delta)}`}
                            {above ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                          </span>
                        </td>
                        <td className="py-3 px-2 text-right">
                          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                            above ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'
                          }`}>
                            {above ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                            {above ? 'Au-dessus' : 'En dessous'}
                          </span>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
        </>
      )}

      {mode === 'custom' && (
        <CustomComparison
          highlighted={highlighted}
          online={online}
          selected={selectedInstitutions}
          setSelected={setSelectedInstitutions}
          kpiHistory={kpiHistory}
        />
      )}
      </div>
    </DashboardLayout>
  )
}

/* ───── Custom comparison view ───── */

function CustomComparison({
  highlighted,
  online,
  selected,
  setSelected,
  kpiHistory,
}: {
  highlighted: string
  online: Institution[]
  selected: string[]
  setSelected: (s: string[]) => void
  kpiHistory: any
}) {
  const toggleInstitution = (name: string) => {
    if (selected.includes(name)) {
      setSelected(selected.filter(n => n !== name))
    } else {
      if (selected.length < 3) {
        setSelected([...selected, name])
      }
    }
  }

  // Pool of institutions = the ones currently selected
  const pool = useMemo(
    () => selected.map(n => online.find(o => o.name === n)).filter((o): o is Institution => Boolean(o)),
    [selected, online]
  )

  const [chartKpi, setChartKpi] = useState<KpiKey>('successRate')

  return (
    <div className="space-y-6">
      {/* Section 1: Pick institutions */}
      <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-sm font-black text-slate-800">1. Choisir les établissements</h2>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">
              {selected.length} sélectionné{selected.length > 1 ? 's' : ''} (max 3) · {online.length} disponibles
            </p>
          </div>
          {selected.length > 0 && (
            <button
              onClick={() => setSelected([])}
              className="flex items-center gap-1 text-[10px] font-black text-slate-400 hover:text-red-500 uppercase tracking-widest"
            >
              <X size={12} />
              Tout désélectionner
            </button>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          {online.map(inst => {
            const isSelected = selected.includes(inst.name)
            return (
              <button
                key={inst.id}
                onClick={() => toggleInstitution(inst.name)}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all border ${
                  isSelected
                    ? 'bg-cyan-500 text-white border-cyan-500 shadow-sm'
                    : selected.length >= 3
                      ? 'bg-slate-50 text-slate-300 border-slate-100 cursor-not-allowed'
                      : 'bg-white text-slate-600 border-slate-200 hover:border-cyan-300 hover:bg-cyan-50/50'
                }`}
                disabled={!isSelected && selected.length >= 3}
              >
                <span
                  className="w-5 h-5 rounded-md flex items-center justify-center text-[9px] font-black"
                  style={{ backgroundColor: isSelected ? 'rgba(255,255,255,0.2)' : inst.color, color: isSelected ? 'white' : '#0891B2' }}
                >
                  {inst.initials}
                </span>
                {inst.name}
                <span className="text-[9px] font-bold opacity-70">{inst.type}</span>
                {isSelected ? <X size={10} /> : <Plus size={10} />}
              </button>
            )
          })}
        </div>
      </div>

      {/* Comparisons */}
      {pool.length > 0 ? (
        <>
          {/* Section 2: Comparative Table */}
          <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm overflow-hidden">
            <h2 className="text-sm font-black text-slate-800 mb-4">2. Tableau comparatif des KPIs</h2>
            <div className="overflow-x-auto -mx-5 px-5">
              <table className="w-full text-left border-collapse min-w-[600px]">
                <thead>
                  <tr className="border-b border-slate-100">
                    <th className="py-4 px-3 text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-50 rounded-tl-xl w-1/3">Indicateur</th>
                    {pool.map((inst, i) => (
                      <th key={inst.id} className={`py-4 px-3 bg-slate-50 ${i === pool.length - 1 ? 'rounded-tr-xl' : ''}`}>
                        <div className="flex items-center gap-3">
                          {inst.logo ? (
                            <img src={inst.logo} alt={inst.name} className="w-8 h-8 rounded-lg object-contain bg-white border border-slate-100 shadow-sm p-0.5" />
                          ) : (
                            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-black text-white shadow-sm" style={{ backgroundColor: inst.color }}>
                              {inst.initials}
                            </div>
                          )}
                          <div>
                            <p className="text-xs font-black text-slate-800">{inst.name}</p>
                            <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">{inst.type}</p>
                          </div>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {KPIS.map(spec => (
                    <tr key={spec.key} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-4 px-3">
                        <p className="text-sm font-black text-slate-700">{spec.label}</p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{spec.family}</p>
                      </td>
                      {pool.map(inst => {
                        const val = inst[spec.key] as number
                        const displayVal = spec.unit === '%' ? `${val.toFixed(1)}%` : Math.round(val).toString()
                        
                        // Compare to others in the pool to highlight best
                        const poolVals = pool.map(p => p[spec.key] as number)
                        const isBest = spec.higherIsBetter 
                          ? val === Math.max(...poolVals) && val > Math.min(...poolVals)
                          : val === Math.min(...poolVals) && val < Math.max(...poolVals)

                        return (
                          <td key={inst.id} className="py-4 px-3">
                            <span className={`text-base font-black ${isBest ? 'text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg' : 'text-slate-600'}`}>
                              {displayVal}
                            </span>
                            {isBest && <span className="ml-2 inline-flex text-emerald-500"><Trophy size={12} /></span>}
                          </td>
                        )
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Section 3: Trend Chart */}
          <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-6">
              <div>
                <h2 className="text-sm font-black text-slate-800">3. Tendance comparée sur 10 mois</h2>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">
                  Évolution temporelle pour les établissements sélectionnés
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Indicateur</span>
                <select
                  value={chartKpi}
                  onChange={e => setChartKpi(e.target.value as KpiKey)}
                  className="bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs font-bold text-slate-700 appearance-none focus:outline-none focus:border-cyan-500"
                >
                  {KPIS.map(k => (
                    <option key={k.key} value={k.key}>{k.family} — {k.label}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="pt-2 border-t border-slate-50">
              <TrendChart
                insts={pool}
                kpiKey={chartKpi}
                kpiLabel={KPIS.find(s => s.key === chartKpi)!.label}
                kpiUnit={KPIS.find(s => s.key === chartKpi)!.unit}
                kpiHistory={kpiHistory}
                highlighted={highlighted}
                formatVal={(v: number) => KPIS.find(s => s.key === chartKpi)!.unit === '%' ? `${v.toFixed(1)}%` : `${Math.round(v)}`}
                bare
              />
            </div>
          </div>
        </>
      ) : (
        <div className="py-16 flex flex-col items-center justify-center text-slate-400 bg-slate-50/50 rounded-2xl border-2 border-dashed border-slate-200">
          <Users size={48} className="mb-4 text-slate-300" />
          <p className="text-base font-black text-slate-700 mb-1">Aucun établissement sélectionné</p>
          <p className="text-xs font-medium text-slate-500 text-center max-w-sm">
            Sélectionnez entre 1 et 3 établissements ci-dessus pour comparer directement leurs indicateurs de performance.
          </p>
        </div>
      )}
    </div>
  )
}

/* ───── helpers ───── */

function avg(nums: number[]) {
  if (nums.length === 0) return 0
  return nums.reduce((s, n) => s + n, 0) / nums.length
}

function round(n: number) {
  return Math.round(n * 10) / 10
}

function isAboveStandard(value: number, average: number, higherIsBetter: boolean) {
  if (higherIsBetter) return value >= average
  return value <= average
}

function StatCard({
  label,
  value,
  sub,
  tone,
  icon,
}: {
  label: string
  value: string
  sub: string
  tone: 'cyan' | 'slate' | 'emerald' | 'red'
  icon?: React.ReactNode
}) {
  const tones: Record<string, string> = {
    cyan: 'bg-cyan-50 text-cyan-700 border-cyan-100',
    slate: 'bg-slate-50 text-slate-700 border-slate-100',
    emerald: 'bg-emerald-50 text-emerald-700 border-emerald-100',
    red: 'bg-red-50 text-red-700 border-red-100',
  }
  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</span>
        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${tones[tone]}`}>
          {icon}
          {tone === 'emerald' ? 'Top' : tone === 'red' ? 'Bas' : ''}
        </span>
      </div>
      <p className="text-2xl font-black text-slate-800 leading-none">{value}</p>
      <p className="text-[11px] text-slate-500 font-medium mt-1">{sub}</p>
    </div>
  )
}

/* ───── Trend chart (multi-line, soft fills) ───── */

type RefLine = { y: number; label: string; color: string }

function TrendChart({
  insts,
  kpiKey,
  kpiLabel,
  kpiUnit,
  kpiHistory,
  highlighted,
  formatVal,
  subtitle,
  referenceLines = [],
  bare = false,
}: {
  insts: Institution[]
  kpiKey: KpiKey
  kpiLabel: string
  kpiUnit: '%' | 'count'
  kpiHistory: any
  highlighted?: string
  formatVal: (v: number) => string
  subtitle?: string
  referenceLines?: RefLine[]
  bare?: boolean
}) {
  const data = useMemo(() => {
    return PERIODS.map(period => {
      const row: Record<string, string | number> = { period: shortPeriod(period) }
      insts.forEach(inst => {
        const point = kpiHistory[inst.id]?.find((p: any) => p.period === period)
        if (point) row[inst.name] = point[kpiKey]
      })
      return row
    })
  }, [insts, kpiKey, kpiHistory])

  const empty = insts.length === 0

  const chart = (
    <div className="w-full">
      {empty ? (
        <div className="h-[260px] flex flex-col items-center justify-center text-slate-400">
          <Scale size={32} className="mb-3 opacity-40" />
          <p className="text-sm font-bold">Aucun établissement à afficher.</p>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={340}>
          <AreaChart data={data} margin={{ top: 24, right: 28, left: 4, bottom: 4 }}>
            <defs>
              {insts.map(inst => {
                const color = institutionAccent(inst.id)
                return (
                  <linearGradient key={inst.id} id={`grad-${inst.id}-${kpiKey}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={color} stopOpacity={0.32} />
                    <stop offset="100%" stopColor={color} stopOpacity={0} />
                  </linearGradient>
                )
              })}
            </defs>
            <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="#e2e8f0" />
            <XAxis
              dataKey="period"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: '#64748b', fontWeight: 600 }}
              padding={{ left: 12, right: 12 }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 600 }}
              tickFormatter={(v) => kpiUnit === '%' ? `${v}%` : `${v}`}
              width={42}
            />
            {referenceLines.map((ref, idx) => (
              <ReferenceLine
                key={idx}
                y={ref.y}
                stroke={ref.color}
                strokeDasharray="4 4"
                strokeWidth={1}
                label={{ value: ref.label, position: 'right', fontSize: 9, fill: ref.color, fontWeight: 700 }}
              />
            ))}
            <Tooltip
              cursor={{ stroke: '#cbd5e1', strokeWidth: 1 }}
              content={<TrendTooltip insts={insts} formatVal={formatVal} kpiLabel={kpiLabel} />}
            />
            {insts.map(inst => {
              const color = institutionAccent(inst.id)
              const isDimmed = highlighted ? highlighted !== inst.name : false
              return (
                <Area
                  key={inst.id}
                  type="monotone"
                  dataKey={inst.name}
                  stroke={color}
                  strokeWidth={isDimmed ? 1.5 : 2.5}
                  fill={`url(#grad-${inst.id}-${kpiKey})`}
                  fillOpacity={isDimmed ? 0.25 : 1}
                  strokeOpacity={isDimmed ? 0.45 : 1}
                  activeDot={{ r: 5, strokeWidth: 2, stroke: '#fff', fill: color }}
                  dot={false}
                  isAnimationActive={false}
                  connectNulls
                />
              )
            })}
          </AreaChart>
        </ResponsiveContainer>
      )}
    </div>
  )

  const legend = !empty && (
    <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 px-5 pb-4 pt-1">
      {insts.map(inst => {
        const color = institutionAccent(inst.id)
        const isDimmed = highlighted ? highlighted !== inst.name : false
        return (
          <div
            key={inst.id}
            className={`flex items-center gap-2 text-[11px] font-bold ${isDimmed ? 'text-slate-400' : 'text-slate-600'}`}
          >
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color, opacity: isDimmed ? 0.4 : 1 }} />
            {inst.name}
          </div>
        )
      })}
    </div>
  )

  if (bare) {
    return <>{chart}{legend}</>
  }

  return (
    <div className="rounded-2xl border border-slate-100 shadow-sm overflow-hidden bg-gradient-to-br from-white via-white to-cyan-50/40 mb-6">
      <div className="p-5 pb-2">
        <h3 className="text-sm font-black text-slate-800">{kpiLabel}</h3>
        {subtitle && <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">{subtitle}</p>}
      </div>
      <div className="px-2">
        {chart}
      </div>
      {legend}
    </div>
  )
}

function shortPeriod(p: string) {
  const parts = p.split('/')
  const months: Record<string, string> = {
    '01': 'Jan', '02': 'Fév', '03': 'Mar', '04': 'Avr', '05': 'Mai', '06': 'Juin',
    '07': 'Juil', '08': 'Août', '09': 'Sep', '10': 'Oct', '11': 'Nov', '12': 'Déc'
  }
  return months[parts[1]] || parts[1]
}

type TooltipPayloadEntry = { dataKey: string; value: number; payload: Record<string, string | number> }
type TrendTooltipProps = {
  active?: boolean
  payload?: TooltipPayloadEntry[]
  label?: string
  insts: Institution[]
  formatVal: (v: number) => string
  kpiLabel: string
}

function TrendTooltip({ active, payload, label, insts, formatVal }: TrendTooltipProps) {
  if (!active || !payload || !payload.length) return null
  return (
    <div className="bg-white/95 backdrop-blur-sm border border-slate-100 p-3 rounded-xl shadow-xl">
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 pb-1 border-b border-slate-50">
        {label}
      </p>
      <div className="space-y-1.5">
        {payload.map((entry, idx) => {
          const inst = insts.find(i => i.name === entry.dataKey)
          const color = inst ? institutionAccent(inst.id) : '#000'
          return (
            <div key={idx} className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: color }} />
                <span className="text-[11px] font-bold text-slate-600">{entry.dataKey}</span>
              </div>
              <span className="text-[11px] font-black text-slate-900">{formatVal(entry.value)}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
