'use client'

import DashboardLayout from '@/components/DashboardLayout'
import { institutions as mockInstitutions, alerts as mockAlerts, achievements as mockAchievements, kpiHistory, PERIODS, DOMAIN_KPI_MAP, kpiFamilies, getProcessCategories, predictions } from '@/lib/data'
import { supabase } from "@/lib/supabase"
import { useState, useEffect, useMemo } from 'react'
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
  FileText,
  Shield,
  Check,
  X,
  Download
} from 'lucide-react'
import Link from 'next/link'

// Map domain field names to icon components
const ICON_MAP: Record<string, any> = {
  Award, AlertTriangle, Wallet, Activity, BookOpen, TrendingUp, Target
}

export default function Dashboard() {
  const [userRole, setUserRole] = useState('Directeur');
  const [userInstitution, setUserInstitution] = useState('');
  const [userFunction, setUserFunction] = useState('');
  const [isClient, setIsClient] = useState(false);

  const [institutions, setInstitutions] = useState<any[]>(mockInstitutions);
  const [alerts, setAlerts] = useState<any[]>(mockAlerts);
  const [achievements, setAchievements] = useState<any[]>(mockAchievements);
  const [loading, setLoading] = useState(true);
  const [pendingStaff, setPendingStaff] = useState<any[]>([]);

  const handleApprove = async (id: string) => {
    try {
      await supabase.from('users').update({ status: 'active' }).eq('id', id);
      setPendingStaff(prev => prev.filter(u => u.id !== id));
    } catch (e) {
      console.error(e);
    }
  };

  const handleReject = async (id: string) => {
    try {
      await supabase.from('users').update({ status: 'rejected' }).eq('id', id);
      setPendingStaff(prev => prev.filter(u => u.id !== id));
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    const role = localStorage.getItem('userRole') || 'Directeur UCAR';
    const inst = localStorage.getItem('userInstitution') || '';

    const loadData = async () => {
      try {
        // Fetch real data from Supabase
        const [
          { data: dbInstitutions },
          { data: dbAlerts },
          { data: dbAchievements },
          { data: dbSnapshots }
        ] = await Promise.all([
          supabase.from('institutions').select('*'),
          supabase.from('alerts').select('*').order('created_at', { ascending: false }).limit(10),
          supabase.from('achievements').select('*').order('created_at', { ascending: false }).limit(5),
          supabase.from('kpi_snapshots').select('*').order('created_at', { ascending: false })
        ]);

        let staffData: any[] = [];
        if (role === 'Directeur Institut') {
          let query = supabase.from('users').select('*').eq('status', 'pending').eq('role', 'staff');
          if (inst) {
            query = query.eq('institution_id', inst);
          }
          const { data: staff } = await query;
          if (staff) staffData = staff;

          // Add mock request for demo
          staffData.push({
            id: 'demo-mock-id',
            full_name: 'Trésorier',
            email: 'tresorier@uca.tn',
            role: 'staff',
            institution_id: inst || 'inst-insat-0000-0001',
            job_title: 'finance'
          });
        }
        setPendingStaff(staffData);

        if (dbInstitutions) {
          // Merge KPI data from snapshots into institutions
          const mergedInstitutions = dbInstitutions.map(inst => {
            const latestSnapshot = dbSnapshots?.find(s => s.institution_id === inst.id);
            const kpiData = latestSnapshot?.data || {};

            return {
              ...inst,
              successRate: kpiData.success_rate || 0,
              budgetExecution: kpiData.budget_execution || 0,
              dropoutRate: kpiData.dropout_rate || 0,
              employabilityRate: kpiData.employability_rate || 0,
              absenteeismRate: kpiData.absenteeism_rate || 0,
              publicationsCount: kpiData.publications_count || 0,
              initials: inst.name.substring(0, 2).toUpperCase(), // Fallback initials
              status: kpiData.status || 'Nominal',
              color: '#F1F5F9' // Default color
            };
          });
          setInstitutions(mergedInstitutions);
        }
        if (dbAlerts) setAlerts(dbAlerts);
        if (dbAchievements) setAchievements(dbAchievements);
      } catch (error) {
        console.error("Error loading dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    setUserRole(role);
    setUserInstitution(inst);
    setUserFunction(localStorage.getItem('userFunction') || '');

    loadData();
    setIsClient(true);
  }, []);

  const isGlobal = userRole === 'Président UCAR' || userRole === 'Directeur UCAR' || userRole === 'Directeur';
  const isUcarPresident = userRole === 'Président UCAR' || userRole === 'Directeur UCAR';
  const isStaff = userRole === 'Personnel administratif' || userRole === 'Staff Institut' || userRole === 'Staff';
  const staffDomainKpis = isStaff ? (DOMAIN_KPI_MAP[userFunction] || []) : [];
  const staffDomainLabel = isStaff
    ? (kpiFamilies.find(f => f.key === userFunction)?.label || userFunction)
    : '';

  const displayInstitutions = isGlobal
    ? institutions
    : [institutions.find(i => i.initials === userInstitution || i.name === userInstitution) || institutions[0]];

  // Get institution-specific process data
  const displayProcesses = useMemo(() => isGlobal
    ? getProcessCategories() // network-wide aggregate
    : getProcessCategories(displayInstitutions[0].name), [isGlobal, displayInstitutions]);

  if (!isClient) return null;

  // Aggregations
  const globalSuccessRate = (displayInstitutions.reduce((acc, curr) => acc + curr.successRate, 0) / displayInstitutions.length).toFixed(1)
  const globalBudgetExecution = (displayInstitutions.reduce((acc, curr) => acc + curr.budgetExecution, 0) / displayInstitutions.length).toFixed(1)
  const globalDropoutRate = (displayInstitutions.reduce((acc, curr) => acc + curr.dropoutRate, 0) / displayInstitutions.length).toFixed(1)
  const totalPublications = displayInstitutions.reduce((acc, curr) => acc + curr.publicationsCount, 0)

  // All possible KPI cards (for Directeur & Dir. Université)
  const allKpiCards = [
    { field: 'successRate', label: 'Taux de Réussite Moyen', value: `${globalSuccessRate}%`, iconComp: Award, iconBg: 'bg-emerald-50', iconColor: 'text-emerald-600', trend: '+2.4%', trendColor: 'text-emerald-600', trendIcon: TrendingUp, trendLabel: 'vs an dernier' },
    { field: 'budgetExecution', label: 'Exécution Budgétaire', value: `${globalBudgetExecution}%`, iconComp: Wallet, iconBg: 'bg-blue-50', iconColor: 'text-blue-600', trend: null, trendColor: 'text-slate-500', trendIcon: Activity, trendLabel: 'Moyenne réseau en phase' },
    { field: 'dropoutRate', label: "Taux d'Abandon Moyen", value: `${globalDropoutRate}%`, iconComp: AlertTriangle, iconBg: 'bg-amber-50', iconColor: 'text-amber-600', trend: '+0.5%', trendColor: 'text-amber-600', trendIcon: TrendingUp, trendLabel: '(Attention requise)' },
    { field: 'publicationsCount', label: 'Publications Totales', value: `${totalPublications}`, iconComp: BookOpen, iconBg: 'bg-indigo-50', iconColor: 'text-indigo-600', trend: null, trendColor: 'text-indigo-600', trendIcon: Target, trendLabel: 'Objectif annuel dépassé' },
    { field: 'employabilityRate', label: "Taux d'Employabilité", value: `${(displayInstitutions.reduce((a, c) => a + c.employabilityRate, 0) / displayInstitutions.length).toFixed(1)}%`, iconComp: TrendingUp, iconBg: 'bg-emerald-50', iconColor: 'text-emerald-600', trend: null, trendColor: 'text-emerald-600', trendIcon: Target, trendLabel: 'Moyenne réseau' },
    { field: 'absenteeismRate', label: "Taux d'Absentéisme", value: `${(displayInstitutions.reduce((a, c) => a + c.absenteeismRate, 0) / displayInstitutions.length).toFixed(1)}%`, iconComp: Activity, iconBg: 'bg-red-50', iconColor: 'text-red-600', trend: null, trendColor: 'text-red-600', trendIcon: AlertTriangle, trendLabel: 'Surveillé' },
  ]

  // Filter cards: Staff sees only their domain KPIs, others see the default 4
  const visibleKpiCards = isStaff
    ? allKpiCards.filter(card => staffDomainKpis.some((dk: any) => dk.field === card.field))
    : allKpiCards.slice(0, 4) // Default 4 for Directeur / Dir. Université

  // Trend Data
  const ONE_SEMESTER_PERIODS = PERIODS.slice(-6)
  const startIndex = PERIODS.length - 6
  const networkTrendData = ONE_SEMESTER_PERIODS.map((period, index) => {
    const dataIndex = startIndex + index
    const point: any = { period: period.split('/')[1] }
    displayInstitutions.forEach(inst => {
      if (inst.status !== 'Hors ligne' && kpiHistory[inst.id]) {
        point[inst.name] = kpiHistory[inst.id][dataIndex].successRate
      }
    })
    return point
  })

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
              {isGlobal ? "Vue consolidée du réseau universitaire" : isStaff ? `Domaine : ${staffDomainLabel}` : "Vue détaillée de l'établissement"}
            </p>
          </div>
          <div className="flex items-center gap-3">
            {isStaff && (
              <span className="flex items-center gap-2 px-3 py-1.5 bg-cyan-50 text-cyan-700 border border-cyan-200 rounded-xl text-[10px] font-black uppercase tracking-widest">
                <Shield size={12} /> {staffDomainLabel}
              </span>
            )}
            {isUcarPresident && (
              <button
                onClick={() => alert("Génération du rapport d'urgence en cours...")}
                className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-700 border border-red-200 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-red-100 transition-all shadow-sm"
              >
                <Download size={14} />
                Export Urgent
              </button>
            )}
            <Link
              href="/dashboard/reports"
              className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-slate-800 transition-all shadow-sm"
            >
              <FileText size={14} />
              Rapport Mensuel
            </Link>
          </div>
        </div>

        {/* Staff domain notice */}
        {isStaff && staffDomainKpis.length === 0 && (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 flex items-start gap-3">
            <AlertTriangle size={18} className="text-amber-500 mt-0.5" />
            <div>
              <p className="text-sm font-bold text-amber-800">Aucun KPI direct pour le domaine « {staffDomainLabel} »</p>
              <p className="text-xs text-amber-600 mt-1">Ce domaine n'a pas encore de données quantifiées dans le système. Les données seront disponibles après la prochaine ingestion.</p>
            </div>
          </div>
        )}

        {/* KPI Cards — dynamically filtered */}
        <div className={`grid grid-cols-1 sm:grid-cols-2 ${visibleKpiCards.length <= 2 ? 'lg:grid-cols-2' : 'lg:grid-cols-4'} gap-4`}>
          {visibleKpiCards.map((card) => {
            const IconComp = card.iconComp
            const TrendIcon = card.trendIcon
            return (
              <div key={card.field} className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-medium text-slate-600">{card.label}</h3>
                  <div className={`p-2 ${card.iconBg} rounded-lg`}>
                    <IconComp size={18} className={card.iconColor} />
                  </div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-slate-900 mb-1">{card.value}</div>
                  <p className={`text-sm ${card.trendColor} flex items-center gap-1 font-medium`}>
                    <TrendIcon size={14} />
                    {card.trend && <span>{card.trend}</span>}
                    <span className={card.trend ? "text-slate-500 font-normal" : ""}>{card.trendLabel}</span>
                  </p>
                </div>
              </div>
            )
          })}
        </div>

        {/* Approvals Section for Presidents */}
        {pendingStaff.length > 0 && (
          <div className="bg-white rounded-2xl border border-indigo-100 p-6 shadow-sm mb-6 mt-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-indigo-50 rounded-lg">
                <Shield size={20} className="text-indigo-600" />
              </div>
              <div>
                <h2 className="text-base font-black text-slate-800">Demandes d'accès en attente</h2>
                <p className="text-xs font-medium text-slate-500">Nouveaux membres du personnel nécessitant votre approbation</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {pendingStaff.map(staff => {
                const staffInst = institutions.find(i => i.id === staff.institution_id);
                return (
                  <div key={staff.id} className="bg-slate-50 border border-slate-100 p-4 rounded-xl flex flex-col justify-between">
                    <div className="mb-4">
                      <div className="flex justify-between items-start">
                        <h4 className="text-sm font-bold text-slate-800">{staff.full_name}</h4>
                        {staffInst && <span className="text-[10px] font-black text-indigo-500 uppercase">{staffInst.initials || staffInst.name}</span>}
                      </div>
                      <p className="text-xs font-medium text-slate-500 truncate">{staff.email}</p>
                      {staff.job_title && <span className="inline-block mt-2 px-2 py-1 bg-white border border-slate-200 rounded text-[10px] font-bold text-slate-600 uppercase tracking-widest">{staff.job_title}</span>}
                    </div>
                    <div className="flex items-center gap-2 mt-auto">
                      <button onClick={() => handleApprove(staff.id)} className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white py-2 rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-1">
                        <Check size={14} /> Approuver
                      </button>
                      <button onClick={() => handleReject(staff.id)} className="flex-1 bg-white hover:bg-red-50 text-red-600 border border-red-200 py-2 rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-1">
                        <X size={14} /> Refuser
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          {/* 2. Interactive Network Health */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-sm font-black text-slate-800">
                  {isGlobal ? "État du Réseau (5 Établissements Pilotes)" : "État de l'Établissement"}
                </h2>
                {isUcarPresident && (
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Cliquez pour accéder au comparateur</p>
                )}
              </div>
              {isUcarPresident && (
                <Link href="/dashboard/comparison" className="px-3 py-1.5 bg-cyan-50 text-cyan-700 hover:bg-cyan-100 rounded-lg text-xs font-black uppercase tracking-widest transition-colors flex items-center gap-2">
                  <BarChart2 size={14} /> Analyser
                </Link>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {displayInstitutions.map(inst => {
                const CardWrapper: any = isUcarPresident ? Link : 'div';
                return (
                  <CardWrapper key={inst.id} href={isUcarPresident ? "/dashboard/comparison" : undefined} className={`block ${isUcarPresident ? 'group' : ''}`}>
                    <div className={`bg-white p-5 rounded-2xl border border-slate-200 shadow-sm ${isUcarPresident ? 'hover:shadow-md transition-all duration-300' : ''}`}>
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
                        <span className={`px-2.5 py-1 rounded-md text-[10px] font-semibold uppercase tracking-wider flex items-center gap-1.5 ${inst.status === 'Nominal' ? 'bg-emerald-50 text-emerald-600 border border-emerald-200/50' :
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
                          <div className={`h-full rounded-full transition-all duration-500 ${inst.status === 'Nominal' ? 'bg-emerald-500' :
                              inst.status === 'Attention' ? 'bg-amber-500' :
                                'bg-red-500'
                            }`} style={{ width: `${inst.successRate}%` }}></div>
                        </div>
                      </div>
                    </div>
                  </CardWrapper>
                )
              })}
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
              {alerts.filter(a => !isStaff || a.kpiFamily === userFunction).slice(0, 4).map((alert, i) => (
                <div key={i} className="group p-3 rounded-xl bg-slate-800/50 hover:bg-slate-800 border border-slate-700/50 hover:border-cyan-500/30 transition-all cursor-default">
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-[9px] font-black px-2 py-0.5 rounded-md uppercase tracking-widest ${alert.severity === 'Critique' ? 'bg-red-500/20 text-red-300 border border-red-500/30' :
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

        {/* ═══════════════════════════════════════════════════════════════════ */}
        {/* 5. ALL INSTITUTIONAL PROCESSES — Documentation requirement         */}
        {/* ═══════════════════════════════════════════════════════════════════ */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-black text-slate-900 tracking-tight">Processus Institutionnels</h2>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
                {isStaff ? `Filtrés par domaine : ${staffDomainLabel}` : 'Couverture complète de tous les processus universitaires'}
              </p>
            </div>
            <span className="bg-slate-100 text-slate-600 text-[10px] font-black px-3 py-1.5 rounded-lg uppercase tracking-widest border border-slate-200">
              15 Domaines
            </span>
          </div>

          {displayProcesses.map((cat: any) => {
            // Staff: filter processes to only show matching domain
            const visibleProcesses = isStaff
              ? cat.processes.filter((p: any) => p.key === userFunction)
              : cat.processes

            if (visibleProcesses.length === 0) return null

            return (
              <div key={cat.category} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="px-6 py-4 bg-slate-50/80 border-b border-slate-100">
                  <h3 className="text-xs font-black text-slate-700 uppercase tracking-widest">{cat.category}</h3>
                </div>
                <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {visibleProcesses.map((process: any) => (
                    <div key={process.key} className="rounded-xl border border-slate-200 p-4 hover:shadow-md hover:border-slate-300 transition-all">
                      <div className="flex items-center gap-2 mb-4">
                        <span className={`text-sm font-black ${process.color}`}>{process.label}</span>
                      </div>
                      <div className="space-y-3">
                        {process.kpis.map((kpi: any, idx: number) => (
                          <div key={idx} className="flex items-center justify-between">
                            <span className="text-xs text-slate-500 font-medium">{kpi.label}</span>
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-slate-800">{kpi.value}</span>
                              {kpi.trend && (
                                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${kpi.status === 'good' ? 'bg-emerald-50 text-emerald-600' :
                                    kpi.status === 'warning' ? 'bg-amber-50 text-amber-600' :
                                      'bg-red-50 text-red-600'
                                  }`}>
                                  {kpi.trend}
                                </span>
                              )}
                              <span className={`w-2 h-2 rounded-full ${kpi.status === 'good' ? 'bg-emerald-500' :
                                  kpi.status === 'warning' ? 'bg-amber-500' :
                                    'bg-red-500'
                                }`} />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>

        {/* ═══════════════════════════════════════════════════════════════════ */}
        {/* 6. PREDICTIVE ANALYTICS ENGINE                                     */}
        {/* ═══════════════════════════════════════════════════════════════════ */}
        {!isStaff && (
          <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl border border-slate-700 p-6 shadow-lg">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-violet-500/20 rounded-xl border border-violet-500/30">
                  <BrainCircuit size={20} className="text-violet-400" />
                </div>
                <div>
                  <h2 className="text-sm font-black text-white">Moteur Prédictif</h2>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Anticipation des tendances et risques institutionnels</p>
                </div>
              </div>
              <span className="bg-violet-500/20 text-violet-300 text-[9px] font-black px-2.5 py-1 rounded-lg uppercase tracking-widest border border-violet-500/30 flex items-center gap-1.5">
                <Activity size={10} /> IA Prédictive
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {predictions.map((pred, idx) => (
                <div key={idx} className={`rounded-xl p-4 border transition-all hover:scale-[1.01] ${pred.risk === 'high' ? 'bg-red-500/10 border-red-500/20' :
                    pred.risk === 'medium' ? 'bg-amber-500/10 border-amber-500/20' :
                      'bg-emerald-500/10 border-emerald-500/20'
                  }`}>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className={`text-[9px] font-black px-2 py-0.5 rounded-md uppercase tracking-widest ${pred.risk === 'high' ? 'bg-red-500/20 text-red-300' :
                          pred.risk === 'medium' ? 'bg-amber-500/20 text-amber-300' :
                            'bg-emerald-500/20 text-emerald-300'
                        }`}>
                        {pred.risk === 'high' ? 'Risque Élevé' : pred.risk === 'medium' ? 'Risque Moyen' : 'Tendance Positive'}
                      </span>
                      <span className="text-[9px] font-bold text-slate-400">{pred.institution}</span>
                    </div>
                    <span className="text-[9px] font-bold text-slate-500">Horizon : {pred.horizon}</span>
                  </div>
                  <p className="text-xs font-medium text-slate-300 leading-relaxed mb-3">{pred.prediction}</p>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${pred.risk === 'high' ? 'bg-red-500' : pred.risk === 'medium' ? 'bg-amber-500' : 'bg-emerald-500'
                        }`} style={{ width: `${pred.confidence}%` }} />
                    </div>
                    <span className="text-[10px] font-black text-slate-400">{pred.confidence}% confiance</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 7. Performance Leaderboard & Quick Actions */}
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
              {isUcarPresident && (
                <Link href="/dashboard/comparison" className="p-4 rounded-xl border border-slate-200 hover:border-cyan-300 hover:bg-cyan-50/50 transition-all group">
                  <BarChart2 size={24} className="text-cyan-600 mb-3 group-hover:scale-110 transition-transform" />
                  <h3 className="text-xs font-black text-slate-800">Comparateur</h3>
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">Analyser les écarts</p>
                </Link>
              )}

              <Link href="/dashboard/reports" className="p-4 rounded-xl border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/50 transition-all group">
                <FileText size={24} className="text-indigo-600 mb-3 group-hover:scale-110 transition-transform" />
                <h3 className="text-xs font-black text-slate-800">Rapports</h3>
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">Synthèse mensuelle</p>
              </Link>

              <Link href="/dashboard/ai-assistant" className="p-4 rounded-xl border border-slate-200 hover:border-violet-300 hover:bg-violet-50/50 transition-all group">
                <BrainCircuit size={24} className="text-violet-600 mb-3 group-hover:scale-110 transition-transform" />
                <h3 className="text-xs font-black text-slate-800">Assistant IA</h3>
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">Diagnostic intelligent</p>
              </Link>

              <Link href="/dashboard/data-integration" className="p-4 rounded-xl border border-slate-200 hover:border-amber-300 hover:bg-amber-50/50 transition-all group">
                <ArrowRight size={24} className="text-amber-600 mb-3 group-hover:scale-110 transition-transform" />
                <h3 className="text-xs font-black text-slate-800">Ingestion</h3>
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">Importer les données</p>
              </Link>
            </div>
          </div>
        </div>

      </div>
    </DashboardLayout>
  )
}

