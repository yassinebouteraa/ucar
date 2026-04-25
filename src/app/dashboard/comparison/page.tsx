'use client'

import DashboardLayout from '@/components/DashboardLayout'
import {
  institutions,
  Institution,
  InstitutionType,
  PERIODS,
  kpiHistory,
  institutionAccent,
} from '@/lib/data'
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

  // Multi-establishment comparator state (max 3)
  const [selectedInstitutions, setSelectedInstitutions] = useState<string[]>([])
  const [customKpi, setCustomKpi] = useState<KpiKey>('dropoutRate')

  // Seed the custom selection once
  useEffect(() => {
    if (selectedInstitutions.length > 0 || institutions.length === 0) return
    const onlineInst = institutions.filter(i => i.status !== 'Hors ligne')
    const seed = highlighted && onlineInst.find(o => o.name === highlighted)
      ? [highlighted, ...onlineInst.filter(o => o.name !== highlighted).slice(0, 1).map(o => o.name)]
      : onlineInst.slice(0, Math.min(2, onlineInst.length)).map(o => o.name)
    setSelectedInstitutions(seed)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const kpi = KPIS.find(k => k.key === kpiKey)!

  // Available cities derived from data
  const cities = useMemo(() => {
    const set = new Set<string>()
    institutions.forEach(i => { if (i.status !== 'Hors ligne') set.add(i.city) })
    return ['Toutes', ...Array.from(set).sort()]
  }, [])

  // Eligible (online) institutions before filters — used to compute the network average
  const online = useMemo(() => institutions.filter(i => i.status !== 'Hors ligne'), [])

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
                            <div className="w-7 h-7 rounded-lg flex items-center justify-center text-[10px] font-black" style={{ backgroundColor: inst.color }}>
                              {inst.initials}
                            </div>
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
          chartKpi={customKpi}
          setChartKpi={setCustomKpi}
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
  weights,
  setWeights,
}: {
  highlighted: string
  online: Institution[]
  selected: string[]
  setSelected: (s: string[]) => void
  weights: Record<KpiKey, number>
  setWeights: (w: Record<KpiKey, number>) => void
}) {
  const toggleInstitution = (name: string) => {
    setSelected(selected.includes(name) ? selected.filter(n => n !== name) : [...selected, name])
  }

  const setWeight = (k: KpiKey, v: number) => {
    setWeights({ ...weights, [k]: Math.max(0, Math.min(100, v)) })
  }

  const resetWeights = () => {
    setWeights({
      successRate: 30,
      employabilityRate: 25,
      dropoutRate: 20,
      budgetExecution: 15,
      absenteeismRate: 10,
      publicationsCount: 0,
    })
  }

  const equalizeWeights = () => {
    const active = (Object.keys(weights) as KpiKey[]).filter(k => weights[k] > 0)
    const count = active.length || 1
    const share = Math.round(100 / count)
    const next = { ...weights }
    ;(Object.keys(weights) as KpiKey[]).forEach(k => {
      next[k] = active.includes(k) ? share : 0
    })
    setWeights(next)
  }

  const totalWeight = Object.values(weights).reduce((s, v) => s + v, 0)

  // Pool of institutions = the ones currently selected
  const pool = useMemo(
    () => selected.map(n => online.find(o => o.name === n)).filter((o): o is Institution => Boolean(o)),
    [selected, online]
  )

  // Compute composite score
  const composite = useMemo(() => {
    if (pool.length === 0 || totalWeight === 0) return []

    const activeKpis = (Object.keys(weights) as KpiKey[]).filter(k => weights[k] > 0)

    // Min/max per KPI across the pool for normalization
    const ranges: Record<string, { min: number; max: number }> = {}
    activeKpis.forEach(k => {
      const vals = pool.map(p => p[k] as number)
      ranges[k] = { min: Math.min(...vals), max: Math.max(...vals) }
    })

    return pool
      .map(inst => {
        const breakdown: { kpi: KpiKey; raw: number; normalized: number; weighted: number }[] = []
        let total = 0
        activeKpis.forEach(k => {
          const spec = KPIS.find(s => s.key === k)!
          const raw = inst[k] as number
          const { min, max } = ranges[k]
          let normalized: number
          if (max === min) {
            normalized = 50
          } else if (spec.higherIsBetter) {
            normalized = ((raw - min) / (max - min)) * 100
          } else {
            normalized = ((max - raw) / (max - min)) * 100
          }
          const weighted = normalized * (weights[k] / totalWeight)
          total += weighted
          breakdown.push({ kpi: k, raw, normalized, weighted })
        })
        return { institution: inst, score: round(total), breakdown }
      })
      .sort((a, b) => b.score - a.score)
  }, [pool, weights, totalWeight])

  const activeKpisOrdered = (Object.keys(weights) as KpiKey[]).filter(k => weights[k] > 0)
  const KPI_COLORS: Record<KpiKey, string> = {
    successRate: '#06B6D4',
    dropoutRate: '#F87171',
    budgetExecution: '#3B82F6',
    employabilityRate: '#10B981',
    absenteeismRate: '#F59E0B',
    publicationsCount: '#8B5CF6',
  }

  return (
    <div className="space-y-6">
      {/* Section: Pick institutions */}
      <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-sm font-black text-slate-800">1. Choisir les établissements</h2>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">
              {selected.length} sélectionné{selected.length > 1 ? 's' : ''} · {online.length} disponibles
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
                    : 'bg-white text-slate-600 border-slate-200 hover:border-cyan-300 hover:bg-cyan-50/50'
                }`}
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

      {/* Section: Pick KPIs and weights */}
      <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-sm font-black text-slate-800">2. Indicateurs et pondération</h2>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">
              Activez les KPIs à inclure et ajustez leur poids
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={equalizeWeights}
              className="flex items-center gap-1 px-3 py-1.5 bg-slate-50 text-slate-600 border border-slate-200 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-slate-100"
            >
              Équilibrer
            </button>
            <button
              onClick={resetWeights}
              className="flex items-center gap-1 px-3 py-1.5 bg-slate-50 text-slate-600 border border-slate-200 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-slate-100"
            >
              <RotateCcw size={10} />
              Réinitialiser
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {KPIS.map(spec => {
            const w = weights[spec.key]
            const active = w > 0
            const sharePct = totalWeight > 0 ? Math.round((w / totalWeight) * 100) : 0
            return (
              <div
                key={spec.key}
                className={`p-4 rounded-xl border transition-all ${
                  active ? 'bg-cyan-50/30 border-cyan-100' : 'bg-slate-50 border-slate-100'
                }`}
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex items-start gap-2 flex-1 min-w-0">
                    <button
                      onClick={() => setWeight(spec.key, active ? 0 : 20)}
                      className={`mt-0.5 w-4 h-4 rounded border-2 flex-shrink-0 flex items-center justify-center transition-colors ${
                        active ? 'bg-cyan-500 border-cyan-500' : 'border-slate-300 bg-white hover:border-cyan-400'
                      }`}
                    >
                      {active && <span className="w-1.5 h-1.5 bg-white rounded-sm" />}
                    </button>
                    <div className="min-w-0">
                      <p className="text-[11px] font-black text-slate-800 leading-snug">{spec.label}</p>
                      <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">
                        {spec.family} · {spec.higherIsBetter ? 'plus haut = mieux' : 'plus bas = mieux'}
                      </p>
                    </div>
                  </div>
                  <span className={`text-[11px] font-black flex-shrink-0 ${active ? 'text-cyan-600' : 'text-slate-300'}`}>
                    {active ? `${sharePct}%` : '—'}
                  </span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={100}
                  step={5}
                  value={w}
                  disabled={!active}
                  onChange={e => setWeight(spec.key, Number(e.target.value))}
                  className="w-full accent-cyan-500 disabled:opacity-30"
                />
                <p className="text-[9px] text-slate-400 font-bold mt-1">Poids brut : {w}</p>
              </div>
            )
          })}
        </div>

        <div className="mt-4 p-3 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-between">
          <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Somme des poids</span>
          <span className={`text-sm font-black ${totalWeight > 0 ? 'text-cyan-600' : 'text-slate-400'}`}>
            {totalWeight}
            <span className="text-[10px] text-slate-400 ml-1">→ normalisée à 100% pour le calcul</span>
          </span>
        </div>
      </div>

      {/* Section: Composite score */}
      <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-sm font-black text-slate-800">3. Score composite</h2>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">
              KPIs normalisés 0-100 sur la sélection · pondérés selon vos curseurs
            </p>
          </div>
        </div>

        {composite.length === 0 ? (
          <div className="py-10 flex flex-col items-center justify-center text-slate-400">
            <Sliders size={32} className="mb-3 opacity-40" />
            <p className="text-sm font-bold text-center">
              {selected.length === 0
                ? 'Sélectionnez au moins un établissement.'
                : totalWeight === 0
                  ? 'Activez au moins un KPI avec un poids.'
                  : 'Ajustez vos critères.'}
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {composite.map((c, idx) => {
              const isHighlighted = c.institution.name === highlighted
              const widthPct = Math.max(2, Math.min(100, c.score))
              return (
                <div
                  key={c.institution.id}
                  className={`p-4 rounded-xl border transition-all ${
                    isHighlighted ? 'bg-cyan-50/40 border-cyan-200' : 'bg-white border-slate-100'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <span className={`inline-flex items-center justify-center w-7 h-7 rounded-lg text-[11px] font-black ${
                        idx === 0 ? 'bg-emerald-100 text-emerald-700' :
                        idx === composite.length - 1 ? 'bg-red-100 text-red-700' :
                        'bg-slate-100 text-slate-600'
                      }`}>{idx + 1}</span>
                      <div className="w-7 h-7 rounded-lg flex items-center justify-center text-[10px] font-black" style={{ backgroundColor: c.institution.color }}>
                        {c.institution.initials}
                      </div>
                      <div>
                        <p className="text-sm font-black text-slate-800">{c.institution.name}</p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{c.institution.type} · {c.institution.city}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-black text-cyan-600 leading-none">{c.score.toFixed(1)}</p>
                      <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">/ 100</p>
                    </div>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden mb-3">
                    <div
                      className="h-full bg-gradient-to-r from-cyan-400 to-cyan-600 rounded-full transition-all duration-500"
                      style={{ width: `${widthPct}%` }}
                    />
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {c.breakdown.map(b => {
                      const spec = KPIS.find(s => s.key === b.kpi)!
                      return (
                        <span key={b.kpi} className="inline-flex items-center gap-1 px-2 py-1 bg-slate-50 border border-slate-100 rounded-lg text-[9px] font-bold text-slate-600">
                          <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: KPI_COLORS[b.kpi] }} />
                          {spec.label}
                          <span className="text-slate-400">·</span>
                          <span className="font-black text-slate-700">{b.normalized.toFixed(0)}</span>
                          <span className="text-slate-400">×</span>
                          <span className="font-black text-cyan-600">{Math.round((weights[b.kpi] / totalWeight) * 100)}%</span>
                        </span>
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Section: Grouped chart */}
      {composite.length > 0 && activeKpisOrdered.length > 0 && (
        <CustomTrendSection
          pool={pool}
          activeKpis={activeKpisOrdered}
          highlighted={highlighted}
        />
      )}
    </div>
  )
}

function CustomTrendSection({
  pool,
  activeKpis,
  highlighted,
}: {
  pool: Institution[]
  activeKpis: KpiKey[]
  highlighted: string
}) {
  const [chartKpi, setChartKpi] = useState<KpiKey>(activeKpis[0] || 'successRate')

  // If the user disables the currently-selected KPI, jump to the first active one.
  useEffect(() => {
    if (!activeKpis.includes(chartKpi) && activeKpis[0]) {
      setChartKpi(activeKpis[0])
    }
  }, [activeKpis, chartKpi])

  const spec = KPIS.find(s => s.key === chartKpi)!
  const fmt = (v: number) => spec.unit === '%' ? `${v.toFixed(1)}%` : `${Math.round(v)}`

  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
        <div>
          <h2 className="text-sm font-black text-slate-800">4. Tendance comparée sur 10 mois</h2>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">
            Évolution de l'indicateur choisi pour chaque établissement sélectionné
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Indicateur</span>
          <select
            value={chartKpi}
            onChange={e => setChartKpi(e.target.value as KpiKey)}
            className="bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs font-bold text-slate-700 appearance-none focus:outline-none focus:border-cyan-500"
          >
            {activeKpis.map(k => {
              const s = KPIS.find(spec => spec.key === k)!
              return <option key={k} value={k}>{s.family} — {s.label}</option>
            })}
          </select>
        </div>
      </div>
      <TrendChart
        insts={pool}
        kpiKey={chartKpi}
        kpiLabel={spec.label}
        kpiUnit={spec.unit}
        highlighted={highlighted}
        formatVal={fmt}
        bare
      />
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
        const point = kpiHistory[inst.id]?.find(p => p.period === period)
        if (point) row[inst.name] = point[kpiKey]
      })
      return row
    })
  }, [insts, kpiKey])

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
  if (!active || !payload || payload.length === 0) return null
  // Sort by descending value for readability
  const rows = [...payload].sort((a, b) => Number(b.value) - Number(a.value))
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-xl p-3 min-w-[200px]">
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">{label}</p>
      <div className="space-y-1.5">
        {rows.map((entry, idx) => {
          const inst = insts.find(i => i.name === entry.dataKey)
          if (!inst) return null
          const color = institutionAccent(inst.id)
          return (
            <div key={idx} className="flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />
              <span className="text-[11px] font-bold text-slate-600 flex-1">{entry.dataKey}</span>
              <span className="text-[12px] font-black text-slate-900">{formatVal(Number(entry.value))}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function shortPeriod(period: string): string {
  // '2025/04' → '04', but keep full form for first/last so the year is visible
  const [year, month] = period.split('/')
  if (period === PERIODS[0] || period === PERIODS[PERIODS.length - 1]) {
    return `${year}/${month}`
  }
  return month
}
