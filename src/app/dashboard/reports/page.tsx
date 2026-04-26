'use client'

import DashboardLayout from '@/components/DashboardLayout'
import { institutions } from '@/lib/data'
import { 
  FileDown, 
  Calendar, 
  Filter, 
  Building2, 
  ChevronDown, 
  CheckCircle2, 
  Download, 
  Printer, 
  Share2, 
  Clock, 
  FileText,
  MoreVertical,
  ArrowRight,
  BarChart3
} from 'lucide-react'
import { useState } from 'react'

const reportHistory = [
  { id: '1', title: 'Rapport Mensuel Mars 2026', date: '29 Mar 2026', size: '1.4 MB', type: 'Mensuel' },
  { id: '2', title: 'Rapport Urgent — SUP\'COM', date: '15 Mar 2026', size: '0.9 MB', type: 'Urgent' },
  { id: '3', title: 'Consolidé UCAR — Février', date: '29 Fév 2026', size: '2.1 MB', type: 'Consolidé' },
  { id: '4', title: 'Rapport Mensuel Janvier 2026', date: '29 Jan 2026', size: '1.2 MB', type: 'Mensuel' },
]

export default function ReportsPage() {
  const [isGenerating, setIsGenerating] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const [selectedPeriod, setSelectedPeriod] = useState('Ce mois (Avril 2026)')
  const [selectedInstitution, setSelectedInstitution] = useState('Université de Carthage (Global)')
  const [urgentRequestStatus, setUrgentRequestStatus] = useState<'none' | 'pending' | 'success'>('none')
  const [userRole, setUserRole] = useState<'admin' | 'institute'>('admin') // Par défaut admin pour le dev

  // TODO: Remplacer ceci par le fetch réel de Supabase lors de l'intégration
  /*
  useEffect(() => {
    async function fetchUserRole() {
      const supabase = createClientComponentClient()
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.user) {
        // La table "users" de Supabase contient le rôle selon le schéma
        const { data: profile } = await supabase.from('users').select('role').eq('id', session.user.id).single()
        // Si le rôle est "Présidente de l'Université (UCAR)" ou équivalent central
        setUserRole(profile?.role === 'UCAR_ADMIN' ? 'admin' : 'institute')
      }
    }
    fetchUserRole()
  }, [])
  */

  const isFutureDate = selectedPeriod === 'Prévisions Trimestre Prochain'
  const selectedInst = institutions.find(i => i.name === selectedInstitution)
  const isOffline = selectedInst?.status === 'Hors ligne'

  const handleGenerate = () => {
    if (isFutureDate) {
      setUrgentRequestStatus('pending')
      setTimeout(() => {
        setUrgentRequestStatus('success')
        setIsGenerating(false)
      }, 1500)
      return
    }

    setIsGenerating(true)
    setUrgentRequestStatus('none')
    setTimeout(() => {
      setIsGenerating(false)
      setShowPreview(true)
    }, 1500)
  }

  return (
    <DashboardLayout>
      <div className="p-6">
        {/* Urgent Request Toast */}
        {urgentRequestStatus === 'success' && (
          <div className="fixed top-8 right-8 z-50 animate-in fade-in slide-in-from-right-8 duration-500">
            <div className="bg-slate-900 border border-slate-800 text-white p-6 rounded-2xl shadow-2xl flex items-start gap-4 max-w-sm">
              <div className="bg-amber-500/20 text-amber-500 p-2 rounded-lg">
                <Clock size={20} />
              </div>
              <div>
                <h4 className="text-sm font-black uppercase tracking-widest mb-1">Rapport Urgent — En cours</h4>
                <p className="text-xs text-slate-400 font-medium leading-relaxed">
                  Groq génère le narratif français à partir des derniers KPIs disponibles + section anomalies. PDF prêt en <span className="text-white font-bold">~30 secondes</span>.
                </p>
                <button 
                  onClick={() => setUrgentRequestStatus('none')}
                  className="mt-4 text-[10px] font-black text-cyan-500 uppercase tracking-widest hover:text-cyan-400"
                >
                  D'accord, compris
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-black text-slate-900">Rapports</h1>
            <span className="bg-cyan-100 text-cyan-700 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest border border-cyan-200">
              Mensuel · Urgent · Consolidé
            </span>
          </div>
          <div className="flex gap-3 items-center flex-wrap">
            <button className="hidden md:flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-[11px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all shadow-sm">
              <Clock size={14} />
              Historique
            </button>
            <button className="hidden md:flex items-center gap-2 px-4 py-2 bg-cyan-500 text-white rounded-xl text-[11px] font-black uppercase tracking-widest hover:bg-cyan-600 transition-all shadow-lg shadow-cyan-500/20">
              <FileDown size={14} />
              Exporter
            </button>
          </div>
        </div>

        {/* Monthly Flow Strip */}
        <div className="bg-white border border-slate-100 rounded-2xl p-5 mb-8 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Calendar size={14} className="text-cyan-500" />
            <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Cycle mensuel UCAR Pulse</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { day: 'Jour 1 → 25', label: 'Soumission des fichiers', sub: 'PDF, Excel, scans, photos' },
              { day: 'Jour 26', label: 'Deadline d\'ingestion', sub: 'Verrouillage des soumissions' },
              { day: 'Jour 27 → 28', label: 'Traitement IA', sub: 'Extraction KPIs · génération' },
              { day: 'Jour 29', label: 'Rapport disponible', sub: 'PDF mensuel téléchargeable' },
            ].map((step, i) => (
              <div key={i} className="p-3 bg-slate-50 border border-slate-100 rounded-xl">
                <p className="text-[9px] font-black text-cyan-600 uppercase tracking-widest mb-1">{step.day}</p>
                <p className="text-[11px] font-black text-slate-800 mb-0.5">{step.label}</p>
                <p className="text-[10px] text-slate-400 font-medium">{step.sub}</p>
              </div>
            ))}
          </div>
          <p className="text-[10px] text-slate-400 font-medium mt-3 italic">
            En l'absence de soumission : rapport en mode <span className="font-black text-amber-600">fallback</span> avec les données de la période précédente, et alerte automatique à UCAR.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Generation Config (Main) */}
          <div className="lg:col-span-2 space-y-8">
            {userRole === 'admin' ? (
              <div className="bg-white rounded-2xl border border-slate-100 p-8 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest">Configuration du rapport Universitaire</h2>
                {isFutureDate ? (
                  <div className="flex items-center gap-2 text-[10px] font-black text-amber-500 uppercase tracking-widest bg-amber-50 px-2 py-1 rounded">
                    <Clock size={10} />
                    Période future
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-[10px] font-black text-emerald-500 uppercase tracking-widest bg-emerald-50 px-2 py-1 rounded">
                    <CheckCircle2 size={10} />
                    Données consolidées
                  </div>
                )}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Entité de contrôle</label>
                  <div className="relative">
                    <select 
                      value={selectedInstitution}
                      onChange={(e) => setSelectedInstitution(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3.5 px-4 text-sm appearance-none focus:outline-none focus:border-cyan-500 transition-all font-bold text-slate-700"
                    >
                      <option>Université de Carthage (Global)</option>
                      {institutions.map(inst => (
                        <option key={inst.id} value={inst.name} disabled={inst.status === 'Hors ligne'}>
                          {inst.name}{inst.status === 'Hors ligne' ? ' — Hors ligne' : ''}
                        </option>
                      ))}
                    </select>
                    <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    <p className="text-[9px] text-slate-400 font-medium mt-1.5 ml-1 italic">
                      {selectedInstitution === 'Université de Carthage (Global)'
                        ? 'Note : Rapport consolidé sur les 30+ établissements rattachés à UCAR.'
                        : `Note : Rapport ciblé exclusivement sur ${selectedInstitution} (KPIs des 8 familles).`}
                    </p>
                  </div>

                  {/* Offline Warning */}
                  {isOffline && (
                    <div className="mt-3 p-3 bg-red-50 border border-red-100 rounded-xl flex items-start gap-3">
                      <div className="text-red-500 mt-0.5"><FileText size={14} /></div>
                      <p className="text-[10px] text-red-700 font-bold leading-relaxed">
                        Cet établissement est <span className="uppercase tracking-widest">hors ligne</span> — aucune donnée n'est disponible. Impossible de générer un rapport.
                      </p>
                    </div>
                  )}
                </div>
                
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Période d'analyse</label>
                  <div className="relative">
                    <select
                      value={selectedPeriod}
                      onChange={(e) => setSelectedPeriod(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3.5 px-4 text-sm appearance-none focus:outline-none focus:border-cyan-500 transition-all font-bold text-slate-700"
                    >
                      <option>Ce mois (Avril 2026)</option>
                      <option>Dernier trimestre (T1 2026)</option>
                      <option>Année universitaire 2025-2026</option>
                      <option>Prévisions Trimestre Prochain</option>
                    </select>
                    <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  </div>
                </div>

                <div className="space-y-2 md:col-span-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Familles KPI incluses (8 familles UCAR Pulse)</label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {['Académique', 'Finance', 'Insertion Pro', 'Ressources Humaines', 'Recherche', 'Infrastructures', 'ESG', 'Partenariats'].map((mod) => (
                      <div key={mod} className="flex items-center gap-2 p-3 bg-slate-50 border border-slate-100 rounded-xl cursor-pointer hover:bg-cyan-50/50 transition-colors group">
                        <div className="w-4 h-4 rounded border-2 border-slate-200 group-hover:border-cyan-500 flex items-center justify-center bg-white">
                          <div className="w-2 h-2 bg-cyan-500 rounded-sm scale-100"></div>
                        </div>
                        <span className="text-[10px] font-bold text-slate-600">{mod}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <button 
                onClick={handleGenerate}
                disabled={isGenerating || urgentRequestStatus === 'pending' || isOffline}
                className={`w-full py-4 rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center justify-center gap-3 ${
                  isOffline
                    ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                    : isGenerating || urgentRequestStatus === 'pending'
                      ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
                      : isFutureDate
                        ? 'bg-amber-500 text-white hover:bg-amber-600 shadow-lg shadow-amber-500/20 active:scale-[0.99]'
                        : 'bg-cyan-500 text-white hover:bg-cyan-600 shadow-lg shadow-cyan-500/20 active:scale-[0.99]'
                }`}
              >
                {isOffline ? (
                  <>
                    <FileText size={16} />
                    Données indisponibles — Hors ligne
                  </>
                ) : isGenerating || urgentRequestStatus === 'pending' ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    {isFutureDate ? 'Transmission de la requête...' : 'Consolidation des données en cours...'}
                  </>
                ) : isFutureDate ? (
                  <>
                    <Clock size={16} />
                    Demander un rapport urgent (PDF en ~30s)
                  </>
                ) : (
                  <>
                    <FileText size={16} />
                    Générer le rapport {selectedInstitution === 'Université de Carthage (Global)' ? 'consolidé UCAR' : selectedInstitution}
                  </>
                )}
              </button>
            </div>
            ) : (
              <div className="bg-slate-50 rounded-2xl border border-slate-200 p-8 flex flex-col items-center justify-center text-center h-full min-h-[300px]">
                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-cyan-500 shadow-sm mb-4 border border-slate-100">
                  <Calendar size={24} />
                </div>
                <h3 className="text-lg font-black text-slate-800 mb-2">Génération Automatique</h3>
                <p className="text-sm font-medium text-slate-500 max-w-md">
                  En tant que membre d'établissement, vos rapports sont générés automatiquement par notre système IA à la fin de chaque cycle (le 29 du mois). L'accès aux rapports urgents est réservé à l'administration centrale.
                </p>
                <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-600 rounded-xl border border-emerald-100 text-[10px] font-black uppercase tracking-widest">
                  <CheckCircle2 size={14} />
                  Prochain rapport prévu : 29 Avril 2026
                </div>
              </div>
            )}
          </div>

          {/* Sidebar: Historique */}
          <div className="bg-white rounded-2xl border border-slate-100 p-8 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest">Historique récents</h2>
              <button className="text-slate-300 hover:text-slate-500"><MoreVertical size={16} /></button>
            </div>
            <div className="space-y-4">
              {reportHistory.map((report) => (
                <div key={report.id} className="group p-4 bg-slate-50 border border-slate-100 rounded-2xl hover:border-cyan-200 hover:bg-cyan-50/30 transition-all cursor-pointer">
                  <div className="flex items-start justify-between mb-2">
                    <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-cyan-500 shadow-sm">
                      <FileDown size={16} />
                    </div>
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{report.size}</span>
                  </div>
                  <h3 className="text-xs font-black text-slate-800 mb-1 group-hover:text-cyan-700 transition-colors">{report.title}</h3>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-slate-400 font-bold">{report.date}</span>
                    <span className="inline-flex items-center gap-1 text-[9px] font-black text-cyan-600 bg-cyan-100 px-2 py-0.5 rounded uppercase tracking-widest">
                      {report.type}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full mt-6 py-3 border border-dashed border-slate-200 rounded-xl text-[10px] font-black text-slate-400 uppercase tracking-widest hover:border-cyan-200 hover:text-cyan-500 transition-all flex items-center justify-center gap-2">
              Voir tous les rapports <ArrowRight size={12} />
            </button>
          </div>
        </div>

        {/* Preview Area */}
        {showPreview ? (
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-hidden max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-700 mb-12">
            {/* Report Header */}
            <div className="bg-[#0F172A] p-12 text-white flex justify-between items-center relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-6">
                  <img src="/web-logo.jpg" alt="Logo UCAR" className="w-12 h-12 object-contain rounded-2xl shadow-xl shadow-cyan-500/20" />
                  <div>
                    <span className="text-xl font-black tracking-tight block">UNIVERSITÉ DE CARTHAGE</span>
                    <span className="text-cyan-500 text-[10px] font-black uppercase tracking-[0.2em]">Pôle Gouvernance & Audit</span>
                  </div>
                </div>
                <h3 className="text-4xl font-black mb-2">Rapport Mensuel Consolidé</h3>
                <p className="text-slate-400 text-sm font-medium">UCAR Pulse — 30+ établissements rattachés · Avril 2026 · narratif rédigé par Groq (Llama 3.3 70B)</p>
              </div>
              <div className="text-right relative z-10">
                <div className="bg-white/5 border border-white/10 p-4 rounded-2xl backdrop-blur-sm">
                  <p className="text-[10px] font-black text-cyan-500 uppercase tracking-widest mb-1">Authentification</p>
                  <p className="text-sm font-bold tracking-widest mb-4">#PULSE-2026-04-CONSO</p>
                  <div className="flex gap-2 justify-end">
                    <button className="p-2.5 bg-white/10 rounded-xl hover:bg-white/20 transition-colors text-white"><Printer size={16} /></button>
                    <button className="p-2.5 bg-cyan-500 rounded-xl hover:bg-cyan-600 transition-colors text-white shadow-lg shadow-cyan-500/20"><Download size={16} /></button>
                  </div>
                </div>
              </div>
            </div>

            {/* Report Content */}
            <div className="p-12">
              {/* Executive Summary */}
              <div className="grid grid-cols-4 gap-6 mb-12">
                {[
                  { label: 'Indice de Réussite Réseau', val: '76.4%', trend: '+2.1%', color: 'text-emerald-500', icon: GraduationCap },
                  { label: 'Exécution Budgétaire', val: '68.2%', trend: '-4.5%', color: 'text-amber-500', icon: BarChart3 },
                  { label: 'Taux de Rétention', val: '92.1%', trend: '+0.8%', color: 'text-emerald-500', icon: CheckCircle2 },
                  { label: 'Saturation Infrastructures', val: '84.5%', trend: 'Stable', color: 'text-cyan-500', icon: Building2 }
                ].map((stat, i) => (
                  <div key={i} className="p-6 rounded-[2rem] bg-slate-50 border border-slate-100 flex flex-col justify-between h-40">
                    <div className="flex items-center justify-between">
                      <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-slate-400 shadow-sm">
                        <stat.icon size={20} />
                      </div>
                      <span className={`text-[10px] font-black ${stat.color} bg-white px-2 py-1 rounded-full shadow-sm`}>{stat.trend}</span>
                    </div>
                    <div>
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
                      <span className="text-3xl font-black text-slate-800">{stat.val}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Data Table */}
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-black text-slate-900 uppercase tracking-widest flex items-center gap-3">
                    <div className="w-1.5 h-6 bg-cyan-500 rounded-full"></div>
                    Détails par Établissement
                  </h4>
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    Mise à jour : 25 Avril 2026
                  </div>
                </div>

                <div className="overflow-hidden border border-slate-100 rounded-[2rem] shadow-sm">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-100">
                        <th className="p-6 text-[10px] font-black text-slate-500 uppercase tracking-widest">Établissement</th>
                        <th className="p-6 text-[10px] font-black text-slate-500 uppercase tracking-widest text-center">Taux Réussite</th>
                        <th className="p-6 text-[10px] font-black text-slate-500 uppercase tracking-widest text-center">Exéc. Budget</th>
                        <th className="p-6 text-[10px] font-black text-slate-500 uppercase tracking-widest text-center">Indice RH</th>
                        <th className="p-6 text-[10px] font-black text-slate-500 uppercase tracking-widest text-right">Statut Final</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {institutions.map((inst) => (
                        <tr key={inst.id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="p-6">
                            <div className="flex items-center gap-4">
                              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-[11px] font-black shadow-sm" style={{ backgroundColor: inst.color }}>{inst.initials}</div>
                              <div>
                                <span className="text-sm font-black text-slate-700 block">{inst.name}</span>
                                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{inst.city}</span>
                              </div>
                            </div>
                          </td>
                          <td className="p-6 text-center text-sm font-black text-slate-600">{inst.successRate}%</td>
                          <td className="p-6 text-center text-sm font-black text-slate-600">{inst.budgetExecution}%</td>
                          <td className="p-6 text-center text-sm font-black text-slate-600">{(inst.successRate - 10).toFixed(1)}%</td>
                          <td className="p-6 text-right">
                            <span className={`inline-block px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest ${
                              inst.status === 'Nominal' ? 'bg-emerald-50 text-emerald-600' : 
                              inst.status === 'Attention' ? 'bg-amber-50 text-amber-600' : 
                              'bg-red-50 text-red-600'
                            }`}>
                              {inst.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Footer Audit */}
              <div className="mt-16 flex justify-between items-center p-8 bg-slate-50 rounded-[2rem] border border-slate-100">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-emerald-500 shadow-sm">
                    <CheckCircle2 size={24} />
                  </div>
                  <div>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Certification Pipeline</span>
                    <span className="text-xs font-bold text-slate-700 uppercase">Verdict UCARIA : pass · citations vérifiées</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Signature du Recteur</p>
                  <div className="h-8 w-32 bg-slate-200/50 rounded-lg animate-pulse mb-1"></div>
                  <p className="text-[9px] text-slate-400 italic">Généré le 25/04/2026 à 18:35</p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-32 bg-slate-50/50 rounded-[3rem] border-2 border-dashed border-slate-200 mb-12">
            <div className="w-24 h-24 bg-white rounded-[2.5rem] flex items-center justify-center text-slate-200 mb-6 shadow-xl shadow-slate-200/20 border border-slate-100 animate-bounce duration-[4000ms]">
              <FileText size={40} />
            </div>
            <h3 className="text-lg font-black text-slate-900 mb-2">Aucun rapport actif</h3>
            <p className="text-slate-400 font-medium text-sm text-center max-w-xs">
              Veuillez configurer les paramètres ci-dessus pour générer une synthèse globale de l'Université.
            </p>
            <button 
              onClick={handleGenerate}
              className="mt-8 px-6 py-3 bg-white border border-slate-200 rounded-2xl text-[10px] font-black text-cyan-500 uppercase tracking-widest hover:bg-cyan-500 hover:text-white hover:border-cyan-500 transition-all shadow-sm"
            >
              Générer maintenant
            </button>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}

function GraduationCap(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-graduation-cap"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>
  )
}
