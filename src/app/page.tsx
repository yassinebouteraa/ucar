import Link from 'next/link'
import { ArrowRight, BarChart3, Shield, Zap, Globe, Cpu, Users, ChevronRight, Play } from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#F0FAFA] text-slate-900 overflow-x-hidden">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-8 py-6 max-w-7xl mx-auto relative z-10">
        <div className="flex items-center gap-3">
          <div className="bg-cyan-500 w-10 h-10 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-cyan-500/20">
            UC
          </div>
          <span className="font-black text-xl tracking-tight">UCAR <span className="text-cyan-500">Pulse</span></span>
        </div>
        <div className="hidden md:flex items-center gap-10">
          {['Plateforme', 'Institutions', 'IA EchoGarden', 'Rapports'].map((item) => (
            <Link key={item} href="#" className="text-sm font-bold text-slate-500 hover:text-cyan-500 transition-colors uppercase tracking-widest">{item}</Link>
          ))}
        </div>
        <Link 
          href="/login" 
          className="bg-white border border-slate-200 px-6 py-2.5 rounded-xl text-sm font-black uppercase tracking-widest hover:bg-slate-50 transition-all shadow-sm active:scale-95"
        >
          Connexion
        </Link>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-20 pb-32 px-8 overflow-hidden">
        {/* Background Decorative Elements */}
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-cyan-200/20 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-100/30 rounded-full blur-[100px] translate-y-1/3 -translate-x-1/4"></div>

        <div className="max-w-7xl mx-auto relative">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div className="space-y-8 max-w-2xl animate-in fade-in slide-in-from-left-8 duration-1000">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-100 rounded-full shadow-sm">
                <span className="flex h-2 w-2 rounded-full bg-cyan-500"></span>
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">HACK4UCAR 2025 · ACM ENSTAB</span>
              </div>
              <h1 className="text-7xl font-black text-slate-900 leading-[1.1] tracking-tight">
                Le système d'exploitation de l'<span className="text-cyan-500">enseignement supérieur</span> tunisien.
              </h1>
              <p className="text-xl text-slate-500 font-medium leading-relaxed">
                Pas un dashboard. Pas un chatbot. UCAR Pulse remplace les chaînes Excel et les emails par une plateforme multi-tenant : ingestion tout format, IA sans hallucination, rapports en français en 30 secondes.
              </p>
              <div className="flex flex-wrap gap-4 pt-4">
                <Link
                  href="/login"
                  className="bg-cyan-500 text-white px-8 py-4 rounded-2xl text-base font-black uppercase tracking-widest hover:bg-cyan-600 shadow-2xl shadow-cyan-500/30 transition-all flex items-center gap-3 group active:scale-[0.98]"
                >
                  Accéder à la plateforme
                  <ArrowRight className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <button className="bg-white border border-slate-200 text-slate-700 px-8 py-4 rounded-2xl text-base font-black uppercase tracking-widest hover:bg-slate-50 transition-all flex items-center gap-3 active:scale-[0.98]">
                  <Play size={18} className="fill-slate-700" />
                  Regarder la démo
                </button>
              </div>
              <div className="flex items-center gap-6 pt-8 border-t border-slate-100">
                <div className="flex -space-x-3">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="w-10 h-10 rounded-full bg-slate-200 border-2 border-white flex items-center justify-center font-bold text-[10px] shadow-sm">
                      U{i}
                    </div>
                  ))}
                </div>
                <p className="text-sm font-bold text-slate-400">Conçu pour les <span className="text-slate-900 font-black">30+ établissements</span> de l'Université de Carthage</p>
              </div>
            </div>

            <div className="relative animate-in fade-in slide-in-from-right-12 duration-1000 delay-200">
              {/* Dashboard Mockup Component */}
              <div className="relative z-10 bg-white rounded-[32px] border border-slate-100 shadow-2xl shadow-cyan-500/10 p-4 transform rotate-2 hover:rotate-0 transition-transform duration-700">
                <div className="bg-[#0F172A] rounded-[24px] h-[400px] overflow-hidden flex flex-col">
                   <div className="p-4 border-b border-slate-800 flex items-center justify-between">
                     <div className="flex gap-2">
                       <div className="w-2 h-2 rounded-full bg-red-400"></div>
                       <div className="w-2 h-2 rounded-full bg-amber-400"></div>
                       <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
                     </div>
                     <div className="w-32 h-2 bg-slate-800 rounded-full"></div>
                     <div className="w-6 h-6 rounded-full bg-cyan-500"></div>
                   </div>
                   <div className="flex-1 p-6">
                     <div className="grid grid-cols-2 gap-4 mb-6">
                       <div className="h-24 bg-slate-800/50 rounded-2xl p-4">
                         <div className="w-12 h-2 bg-cyan-500 rounded-full mb-3"></div>
                         <div className="w-20 h-4 bg-white/20 rounded-full"></div>
                       </div>
                       <div className="h-24 bg-slate-800/50 rounded-2xl p-4">
                         <div className="w-12 h-2 bg-emerald-500 rounded-full mb-3"></div>
                         <div className="w-20 h-4 bg-white/20 rounded-full"></div>
                       </div>
                     </div>
                     <div className="h-32 bg-slate-800/50 rounded-2xl p-4 flex flex-col justify-end">
                       <div className="flex items-end gap-1 h-full">
                         {[40, 70, 45, 90, 65, 80].map((h, i) => (
                           <div key={i} className="flex-1 bg-cyan-500/40 rounded-t-sm" style={{ height: `${h}%` }}></div>
                         ))}
                       </div>
                     </div>
                   </div>
                </div>
              </div>

              {/* Floating KPI Cards */}
              <div className="absolute -top-10 -left-10 z-20 bg-white p-6 rounded-3xl shadow-xl border border-slate-100 animate-bounce duration-[3000ms]">
                <div className="flex items-center gap-4">
                  <div className="bg-emerald-100 p-3 rounded-2xl text-emerald-600"><BarChart3 size={24} /></div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Insertion Pro ESPRIT</p>
                    <p className="text-xl font-black text-slate-800">84%</p>
                  </div>
                </div>
              </div>

              <div className="absolute -bottom-10 -right-10 z-20 bg-white p-6 rounded-3xl shadow-xl border border-slate-100 animate-pulse duration-[4000ms]">
                <div className="flex items-center gap-4">
                  <div className="bg-cyan-100 p-3 rounded-2xl text-cyan-600"><Zap size={24} /></div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Rapport IA en français</p>
                    <p className="text-xl font-black text-slate-800">~30 sec</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-32 px-8 max-w-7xl mx-auto">
        <div className="text-center mb-20 space-y-4">
          <h2 className="text-[10px] font-black text-cyan-500 uppercase tracking-widest">Ce qui nous distingue</h2>
          <h3 className="text-4xl font-black text-slate-900 tracking-tight">De la pile de PDF à la décision stratégique</h3>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              icon: Globe,
              title: 'Ingestion tout format',
              desc: 'PDF scanné, photo de tableau imprimé, Excel, Word — Apache Tika + OCR extraient les KPIs automatiquement.',
              color: 'text-blue-500', bg: 'bg-blue-50'
            },
            {
              icon: Cpu,
              title: 'IA sans hallucination',
              desc: 'Pipeline EchoGarden Weaver+Verifier — chaque réponse renvoie citations et un verdict pass / revise / abstain.',
              color: 'text-cyan-500', bg: 'bg-cyan-50'
            },
            {
              icon: Shield,
              title: 'Rôles à la tunisienne',
              desc: 'Président, Trésorier, Chef Personnel, Scolarité, Recherche — accès calqué sur la gouvernance réelle des universités.',
              color: 'text-emerald-500', bg: 'bg-emerald-50'
            }
          ].map((feature, i) => (
            <div key={i} className="bg-white p-10 rounded-[40px] border border-slate-100 shadow-sm hover:shadow-xl hover:border-cyan-100 transition-all group">
              <div className={`w-16 h-16 rounded-2xl ${feature.bg} ${feature.color} flex items-center justify-center mb-8 group-hover:scale-110 transition-transform`}>
                <feature.icon size={32} />
              </div>
              <h4 className="text-xl font-black text-slate-900 mb-4">{feature.title}</h4>
              <p className="text-slate-500 font-medium leading-relaxed mb-6">{feature.desc}</p>
              <button className="flex items-center gap-2 text-xs font-black text-cyan-500 uppercase tracking-widest hover:gap-3 transition-all">
                En savoir plus <ChevronRight size={14} />
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-100 pt-20 pb-10 px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-10">
          <div className="flex items-center gap-3">
            <div className="bg-slate-900 w-8 h-8 rounded-lg flex items-center justify-center text-white font-black text-sm">
              UC
            </div>
            <span className="font-black text-lg tracking-tight">UCAR <span className="text-cyan-500">Pulse</span></span>
          </div>
          <div className="flex gap-8">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">HACK4UCAR 2025 · Université de Carthage · ACM ENSTAB</span>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest cursor-pointer hover:text-slate-900 transition-colors">Mentions Légales</span>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest cursor-pointer hover:text-slate-900 transition-colors">Support</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
