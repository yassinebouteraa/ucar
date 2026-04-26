'use client'

import DashboardLayout from '@/components/DashboardLayout'
import { institutions, alerts, achievements, kpiHistory, PERIODS } from '@/lib/data'
import { useState, useEffect } from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts'
import {
  TrendingUp,
  Activity,
  Award,
  AlertTriangle,
  CheckCircle2,
  Target,
  BarChart2,
  Wallet,
  BrainCircuit,
  ArrowRight,
  Clock,
  BookOpen,
  FileText
} from 'lucide-react'
import Link from 'next/link'

export default function Dashboard() {
  const [userRole, setUserRole] = useState('UCAR');
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setUserRole(localStorage.getItem('userRole') || 'UCAR');
    setIsClient(true);
  }, []);

  if (!isClient) return null; // Avoid hydration mismatch

  // Filter data based on role
  // TODO: When backend is integrated, this should dynamically filter by the staff member's actual establishment
  const displayInstitutions = userRole === 'UCAR' 
    ? institutions 
    : [institutions.find(i => i.initials === 'ENSTAB') || institutions[0]];

  const isGlobal = userRole === 'UCAR';

  // Global Aggregations
  const globalSuccessRate = (displayInstitutions.reduce((acc, curr) => acc + curr.successRate, 0) / displayInstitutions.length).toFixed(1)
  const globalBudgetExecution = (displayInstitutions.reduce((acc, curr) => acc + curr.budgetExecution, 0) / displayInstitutions.length).toFixed(1)
  const globalDropoutRate = (displayInstitutions.reduce((acc, curr) => acc + curr.dropoutRate, 0) / displayInstitutions.length).toFixed(1)
  const totalPublications = displayInstitutions.reduce((acc, curr) => acc + curr.publicationsCount, 0)

  // Trend Data Calculation (All 5 Universities over the last 6 months / 1 Semester)
  const ONE_SEMESTER_PERIODS = PERIODS.slice(-6)
  const startIndex = PERIODS.length - 6
  const networkTrendData = ONE_SEMESTER_PERIODS.map((period, index) => {
    const dataIndex = startIndex + index
    const point: any = { period: period.split('/')[1] } // Show only the month number
    displayInstitutions.forEach(inst => {
      if (inst.status !== 'Hors ligne' && kpiHistory[inst.id]) {
        point[inst.name] = kpiHistory[inst.id][dataIndex].successRate
      }
    })
    return point
  })

  // Rankings
  const topPerformers = [...displayInstitutions].sort((a, b) => b.successRate - a.successRate).slice(0, 2)

  return (
    <DashboardLayout>
      <div className="p-6 max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              {isGlobal ? "Centre de Commandement UCAR" : `Tableau de Bord - ${displayInstitutions[0].name}`}
            </h1>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">
              {isGlobal ? "Vue consolidée du réseau universitaire" : "Vue détaillée de l'établissement"}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link 
              href="/dashboard/reports"
              className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-slate-800 transition-all shadow-sm"
            >
              <FileText size={14} />
              Rapport Mensuel
            </Link>
          </div>
        </div>

        {/* 1. Global KPIs Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-slate-600">Taux de Réussite Moyen</h3>
              <div className="p-2 bg-emerald-50 rounded-lg">
                <Award size={18} className="text-emerald-600" />
              </div>
            </div>
            <div>
              <div className="text-3xl font-bold text-slate-900 mb-1">{globalSuccessRate}%</div>
              <p className="text-sm text-emerald-600 flex items-center gap-1 font-medium">
                <TrendingUp size={14} /> <span>+2.4%</span> <span className="text-slate-500 font-normal">vs an dernier</span>
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-slate-600">Exécution Budgétaire</h3>
              <div className="p-2 bg-blue-50 rounded-lg">
                <Wallet size={18} className="text-blue-600" />
              </div>
            </div>
            <div>
              <div className="text-3xl font-bold text-slate-900 mb-1">{globalBudgetExecution}%</div>
              <p className="text-sm text-slate-500 flex items-center gap-1 font-normal">
                <Activity size={14} className="text-slate-400" /> <span>Moyenne réseau en phase</span>
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-slate-600">Taux d'Abandon Moyen</h3>
              <div className="p-2 bg-amber-50 rounded-lg">
                <AlertTriangle size={18} className="text-amber-600" />
              </div>
            </div>
            <div>
              <div className="text-3xl font-bold text-slate-900 mb-1">{globalDropoutRate}%</div>
              <p className="text-sm text-amber-600 flex items-center gap-1 font-medium">
                <TrendingUp size={14} /> <span>+0.5%</span> <span className="text-slate-500 font-normal">(Attention requise)</span>
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-slate-600">Publications Totales</h3>
              <div className="p-2 bg-indigo-50 rounded-lg">
                <BookOpen size={18} className="text-indigo-600" />
              </div>
            </div>
            <div>
              <div className="text-3xl font-bold text-slate-900 mb-1">{totalPublications}</div>
              <p className="text-sm text-indigo-600 flex items-center gap-1 font-medium">
                <Target size={14} /> <span>Objectif annuel dépassé</span>
              </p>
            </div>
          </div>

        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 2. Interactive Network Health */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-sm font-black text-slate-800">
                  {isGlobal ? "État du Réseau (5 Établissements Pilotes)" : "État de l'Établissement"}
                </h2>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Cliquez pour accéder au comparateur</p>
              </div>
              <Link href="/dashboard/comparison" className="px-3 py-1.5 bg-cyan-50 text-cyan-700 hover:bg-cyan-100 rounded-lg text-xs font-black uppercase tracking-widest transition-colors flex items-center gap-2">
                <BarChart2 size={14} /> Analyser
              </Link>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {displayInstitutions.map(inst => (
                <Link key={inst.id} href="/dashboard/comparison" className="block group">
                  <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300">
                    <div className="flex items-center justify-between mb-4">
                      {inst.logo ? (
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-white shadow-sm border border-slate-100 overflow-hidden">
                          <img src={inst.logo} alt={`Logo ${inst.name}`} className="w-full h-full object-contain p-1" />
                        </div>
                      ) : (
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xs font-bold text-slate-700 shadow-sm border border-slate-200" style={{ backgroundColor: inst.color }}>
                          {inst.initials}
                        </div>
                      )}
                      <span className={`px-2.5 py-1 rounded-md text-[10px] font-semibold uppercase tracking-wider flex items-center gap-1.5 ${
                        inst.status === 'Nominal' ? 'bg-emerald-50 text-emerald-600 border border-emerald-200/50' :
                        inst.status === 'Attention' ? 'bg-amber-50 text-amber-600 border border-amber-200/50' :
                        'bg-red-50 text-red-600 border border-red-200/50'
                      }`}>
                        {inst.status === 'Nominal' ? <CheckCircle2 size={12} /> : <AlertTriangle size={12} />}
                        {inst.status}
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-slate-800 group-hover:text-cyan-600 transition-colors">{inst.name}</h3>
                    <p className="text-[11px] font-medium text-slate-500 mt-0.5 mb-4 truncate">{inst.type} · {inst.city}</p>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-slate-500 font-medium">Réussite</span>
                        <span className="text-slate-700 font-bold">{inst.successRate}%</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                        <div className={`h-full rounded-full transition-all duration-500 ${
                          inst.status === 'Nominal' ? 'bg-emerald-500' :
                          inst.status === 'Attention' ? 'bg-amber-500' :
                          'bg-red-500'
                        }`} style={{ width: `${inst.successRate}%` }}></div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* 3. AI Insights (The Actionable Feed) */}
          <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 shadow-lg shadow-slate-900/20 text-white flex flex-col">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <BrainCircuit size={18} className="text-cyan-400" />
                <h2 className="text-sm font-black text-white">Intelligence UCAR Pulse</h2>
              </div>
              <span className="bg-cyan-500/20 text-cyan-300 text-[9px] font-black px-2 py-1 rounded-lg uppercase tracking-widest border border-cyan-500/30">
                Temps Réel
              </span>
            </div>

            <div className="flex-1 space-y-4">
              {alerts.slice(0, 4).map((alert, i) => (
                <div key={i} className="group p-3 rounded-xl bg-slate-800/50 hover:bg-slate-800 border border-slate-700/50 hover:border-cyan-500/30 transition-all cursor-default">
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-[9px] font-black px-2 py-0.5 rounded-md uppercase tracking-widest ${
                      alert.severity === 'Critique' ? 'bg-red-500/20 text-red-300 border border-red-500/30' :
                      alert.severity === 'Attention' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                      'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    }`}>
                      {alert.institution}
                    </span>
                    <span className="flex items-center gap-1 text-[9px] text-slate-400 font-bold">
                      <Clock size={10} /> {alert.time}
                    </span>
                  </div>
                  <p className="text-xs font-medium text-slate-300 leading-relaxed">
                    {alert.message}
                  </p>
                  <Link href="/dashboard/ai-assistant" className="mt-3 inline-flex items-center gap-1 text-[10px] font-black text-cyan-400 hover:text-cyan-300 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                    Diagnostiquer avec l'IA <ArrowRight size={10} />
                  </Link>
                </div>
              ))}
            </div>

            <Link href="/dashboard/ai-assistant" className="mt-6 w-full py-3 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-xs font-black uppercase tracking-widest transition-all text-center flex items-center justify-center gap-2 shadow-lg shadow-cyan-900/50">
              <BrainCircuit size={14} /> Ouvrir l'Assistant IA
            </Link>
          </div>
        </div>

        {/* 4. Network Trend Chart */}
        <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-sm font-black text-slate-800">
                {isGlobal ? "Comparatif de Réussite (Semestre Actuel)" : "Évolution de la Réussite (Semestre Actuel)"}
              </h2>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Évolution sur 6 mois</p>
            </div>
            <span className="bg-cyan-50 text-cyan-600 text-[10px] font-black px-2 py-1 rounded-lg uppercase tracking-widest border border-cyan-100 flex items-center gap-1">
              <TrendingUp size={12} /> {isGlobal ? "Réseau UCAR" : displayInstitutions[0].initials}
            </span>
          </div>
          <div className="w-full h-[280px] min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={networkTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="period" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 600 }}
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 600 }}
                  domain={['dataMin - 5', 'dataMax + 5']}
                />
                <Tooltip 
                  cursor={{ stroke: '#94a3b8', strokeWidth: 1, strokeDasharray: '4 4' }}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', fontSize: '11px', fontWeight: 'bold' }}
                  formatter={(value, name) => [`${Number(value)}%`, String(name)]}
                  labelFormatter={(label) => `Mois: ${label}`}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '11px', fontWeight: 600, paddingTop: '20px' }} />
                {displayInstitutions.filter(i => i.status !== 'Hors ligne').map((inst, index) => {
                  const FRESH_COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EC4899', '#8B5CF6'];
                  return (
                    <Line 
                      key={inst.id}
                      type="monotone" 
                      dataKey={inst.name} 
                      name={inst.name}
                      stroke={FRESH_COLORS[index % FRESH_COLORS.length]} 
                      strokeWidth={3} 
                      dot={false}
                      activeDot={{ r: 5, fill: FRESH_COLORS[index % FRESH_COLORS.length], stroke: '#fff', strokeWidth: 2 }} 
                    />
                  )
                })}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 5. Performance Leaderboard & Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
            <h2 className="text-sm font-black text-slate-800 mb-1">Palmarès des Performances</h2>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Établissements remarquables ce mois-ci</p>
            
            <div className="space-y-3">
              {topPerformers.map((inst, idx) => (
                <div key={inst.id} className="flex items-center gap-4 p-3 rounded-xl bg-emerald-50/30 border border-emerald-100">
                  <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 font-black text-xs shadow-sm">
                    #{idx + 1}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-black text-slate-800">{inst.name}</h3>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">{inst.type}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-black text-emerald-600">{inst.successRate}%</div>
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Réussite</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm flex flex-col justify-center">
            <h2 className="text-sm font-black text-slate-800 mb-1">Actions Rapides</h2>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Outils d'aide à la décision</p>
            
            <div className="grid grid-cols-2 gap-3">
              <Link href="/dashboard/comparison" className="p-4 rounded-xl border border-slate-200 hover:border-cyan-300 hover:bg-cyan-50/50 transition-all group">
                <BarChart2 size={24} className="text-cyan-600 mb-3 group-hover:scale-110 transition-transform" />
                <h3 className="text-xs font-black text-slate-800">Comparateur</h3>
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">Analyser les écarts</p>
              </Link>
              
              <Link href="/dashboard/reports" className="p-4 rounded-xl border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/50 transition-all group">
                <FileText size={24} className="text-indigo-600 mb-3 group-hover:scale-110 transition-transform" />
                <h3 className="text-xs font-black text-slate-800">Rapports</h3>
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">Synthèse mensuelle</p>
              </Link>
            </div>
          </div>
        </div>

      </div>
    </DashboardLayout>
  )
}
