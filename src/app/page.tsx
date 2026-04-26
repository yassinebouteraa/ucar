"use client"

import Link from 'next/link'
import { Shield, Globe, Cpu, Users, LayoutDashboard, FileText } from 'lucide-react'
import { motion } from 'framer-motion'

export default function LandingPage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { type: "spring", stiffness: 50, damping: 20 }
    }
  };

  const scaleIn = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { type: "spring", stiffness: 40, damping: 20, duration: 1 }
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFCFC] text-slate-900 overflow-x-hidden font-sans">
      {/* Navigation */}
      <motion.nav 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="flex items-center justify-between px-8 py-6 max-w-7xl mx-auto relative z-20"
      >
        <div className="flex items-center gap-3">
          <div className="bg-cyan-500 w-10 h-10 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-cyan-500/20">
            UC
          </div>
          <span className="font-black text-xl tracking-tight">UCAR Pulse</span>
        </div>
        
        <div className="hidden md:flex items-center gap-8">
          {['Accueil', 'Fonctionnalités', 'KPIs', 'Rapports', 'Administration'].map((item) => (
            <Link key={item} href="#" className="text-sm font-semibold text-slate-600 hover:text-cyan-500 transition-colors">
              {item}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-6">
          <Link 
            href="/login" 
            className="hidden md:block text-sm font-semibold text-slate-600 hover:text-cyan-500 transition-colors"
          >
            Se connecter
          </Link>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link 
              href="/login?register=true" 
              className="bg-cyan-500 text-white px-6 py-2.5 rounded-full text-sm font-bold hover:bg-cyan-600 transition-all shadow-md shadow-cyan-500/20"
            >
              S'inscrire
            </Link>
          </motion.div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section className="relative pt-12 pb-24 px-8 max-w-7xl mx-auto">
        {/* Soft top-left gradient background matching the reference vibe */}
        <motion.div 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 2 }}
          className="absolute top-0 left-0 w-[600px] h-[600px] bg-cyan-100/40 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2 -z-10"
        ></motion.div>
        <motion.div 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 2, delay: 0.5 }}
          className="absolute top-40 left-20 w-[400px] h-[400px] bg-amber-50/50 rounded-full blur-[80px] -z-10"
        ></motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Side: Text Content */}
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-8 relative z-10"
          >
            <motion.h1 
              variants={itemVariants}
              className="text-5xl lg:text-7xl font-extrabold text-slate-900 leading-[1.1] tracking-tight"
            >
              Allez au-delà des limites de la gestion universitaire.
            </motion.h1>
            <motion.p 
              variants={itemVariants}
              className="text-lg text-slate-600 font-medium leading-relaxed max-w-lg"
            >
              Centralisez, analysez et pilotez les indicateurs clés de performance de l'Université de Carthage avec une plateforme de nouvelle génération.
            </motion.p>
            
            <motion.div variants={itemVariants} className="flex items-center gap-8 pt-2">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  href="/login?register=true"
                  className="bg-cyan-600 text-white px-8 py-4 rounded-full text-base font-bold hover:bg-cyan-700 shadow-xl shadow-cyan-600/20 transition-colors"
                >
                  Commencer
                </Link>
              </motion.div>
              <Link 
                href="#" 
                className="text-slate-700 font-bold underline decoration-2 underline-offset-4 decoration-slate-300 hover:decoration-cyan-500 transition-all"
              >
                Devenir administrateur
              </Link>
            </motion.div>
          </motion.div>

          {/* Right Side: Image and Shapes */}
          <div className="relative flex justify-center items-center h-[600px] lg:h-[700px] w-full">
            {/* The main circular background behind the person */}
            <motion.div 
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 30, duration: 1.5 }}
              className="absolute w-[450px] h-[450px] rounded-full bg-cyan-500 right-0 lg:right-10 top-1/2 -translate-y-1/2 z-0"
            ></motion.div>
            
            {/* Secondary shapes */}
            <motion.div 
              initial={{ scale: 0, rotate: -45 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", delay: 0.3, duration: 1.5 }}
              className="absolute w-32 h-32 rounded-full bg-amber-400 top-20 right-0 z-0"
            ></motion.div>
            <motion.div 
              initial={{ scale: 0, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              transition={{ type: "spring", delay: 0.5, duration: 1.5 }}
              className="absolute w-24 h-24 rounded-full bg-blue-600 bottom-24 right-12 z-20"
            ></motion.div>
            
            {/* Sparkle/Star accent */}
            <motion.div 
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1, rotate: 180 }}
              transition={{ delay: 1, duration: 1.5 }}
              className="absolute top-1/3 left-12 text-cyan-500 z-10"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 3v18M3 12h18"/>
              </svg>
            </motion.div>

            {/* Main Portrait Image */}
            <motion.img 
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 40, damping: 20, delay: 0.2 }}
              src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=800" 
              alt="Professional Manager" 
              className="relative z-10 w-[380px] h-[550px] object-cover rounded-full border-[12px] border-[#FAFCFC] shadow-2xl"
            />

            {/* Floating Badge */}
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0, y: [0, -15, 0] }}
              transition={{ 
                opacity: { delay: 0.8, duration: 0.5 },
                x: { type: "spring", delay: 0.8 },
                y: { repeat: Infinity, duration: 4, ease: "easeInOut", delay: 1 } 
              }}
              className="absolute bottom-32 -left-4 lg:left-0 bg-white px-6 py-4 rounded-2xl shadow-xl z-30 flex flex-col gap-2"
            >
              <span className="text-sm font-bold text-slate-800">Institutions Connectées</span>
              <div className="flex -space-x-3 mt-1">
                <img src="https://i.pravatar.cc/100?img=1" className="w-10 h-10 rounded-full border-2 border-white object-cover" alt="User 1" />
                <img src="https://i.pravatar.cc/100?img=2" className="w-10 h-10 rounded-full border-2 border-white object-cover" alt="User 2" />
                <img src="https://i.pravatar.cc/100?img=3" className="w-10 h-10 rounded-full border-2 border-white object-cover" alt="User 3" />
                <div className="w-10 h-10 rounded-full border-2 border-white bg-cyan-500 flex items-center justify-center text-white text-[11px] font-bold">+30</div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features / Categories Section */}
      <section className="py-24 px-8 max-w-7xl mx-auto">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
          className="text-center mb-16 space-y-3"
        >
          <motion.h2 variants={itemVariants} className="text-sm font-bold text-cyan-600 uppercase tracking-widest">
            FONCTIONNALITÉS PRINCIPALES
          </motion.h2>
          <motion.h3 variants={itemVariants} className="text-4xl font-extrabold text-slate-900 tracking-tight">
            Nos modules phares
          </motion.h3>
        </motion.div>

        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={containerVariants}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {[
            {
              icon: Globe,
              title: 'Ingestion tout format',
              desc: 'Gère vos PDF scannés, Excel, et tableaux.',
              color: 'text-indigo-600', bg: 'bg-indigo-600'
            },
            {
              icon: Cpu,
              title: 'IA Sans Hallucination',
              desc: 'Pipeline vérifié et citations des sources.',
              color: 'text-indigo-600', bg: 'bg-indigo-600'
            },
            {
              icon: Shield,
              title: 'Rôles & Gouvernance',
              desc: 'Accès sécurisé selon votre institution.',
              color: 'text-indigo-600', bg: 'bg-indigo-600'
            },
            {
              icon: LayoutDashboard,
              title: 'Tableaux de bord',
              desc: 'Visualisation en temps réel des KPIs.',
              color: 'text-indigo-600', bg: 'bg-indigo-600'
            },
            {
              icon: FileText,
              title: 'Rapports automatisés',
              desc: 'Génération en français en 30 secondes.',
              color: 'text-indigo-600', bg: 'bg-indigo-600'
            },
            {
              icon: Users,
              title: 'Gestion des ressources',
              desc: 'Suivi RH, finances et scolarité simplifié.',
              color: 'text-indigo-600', bg: 'bg-indigo-600'
            }
          ].map((feature, i) => (
            <motion.div 
              variants={scaleIn}
              whileHover={{ y: -5, scale: 1.02 }}
              key={i} 
              className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-cyan-500/10 transition-all flex items-center gap-5 cursor-pointer group"
            >
              <div className={`w-14 h-14 rounded-2xl ${feature.bg} text-white flex items-center justify-center shrink-0 group-hover:rotate-6 transition-transform`}>
                <feature.icon size={24} />
              </div>
              <div>
                <h4 className="text-base font-bold text-slate-900">{feature.title}</h4>
                <p className="text-sm text-slate-500 mt-1 leading-snug">{feature.desc}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-100 pt-16 pb-8 px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="bg-slate-900 w-8 h-8 rounded-lg flex items-center justify-center text-white font-black text-sm">
              UC
            </div>
            <span className="font-black text-lg tracking-tight">UCAR Pulse</span>
          </div>
          <div className="flex gap-8">
            <span className="text-xs font-bold text-slate-400">HACK4UCAR 2025 · Université de Carthage</span>
            <Link href="#" className="text-xs font-bold text-slate-400 hover:text-slate-900 transition-colors">Mentions Légales</Link>
            <Link href="#" className="text-xs font-bold text-slate-400 hover:text-slate-900 transition-colors">Support</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
