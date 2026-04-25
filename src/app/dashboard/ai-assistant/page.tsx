'use client'

import DashboardLayout from '@/components/DashboardLayout'
import { Bot, Send, User, Sparkles, MessageSquare, Zap, BarChart3, FileText, ChevronRight } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'

const suggestions = [
  "Pourquoi le taux d'abandon à l'INSAT augmente chaque semestre ?",
  "Quelle institution a le meilleur taux d'insertion professionnelle ?",
  "Quel est le taux d'exécution budgétaire de l'ENIT ce trimestre ?",
  "Quelles institutions n'ont pas soumis leurs données ce mois-ci ?",
]

type Message = {
  role: 'user' | 'ai'
  text: string
  time: string
  verdict?: 'pass' | 'revise' | 'abstain'
  citations?: { source: string; period: string }[]
  data?: { type: string; value: number; label: string }
}

const initialMessages: Message[] = [
  {
    role: 'user',
    text: "Pourquoi le taux d'abandon à l'INSAT augmente chaque semestre ?",
    time: '10:30',
  },
  {
    role: 'ai',
    text: "Le taux d'abandon à l'INSAT est passé de **19% à 28%** sur 3 semestres consécutifs — au-dessus du seuil critique de 20%. La chute de l'assiduité (taux d'attendance < 75%) corrèle avec la dégradation. Recommandation : convocation du conseil pédagogique.",
    time: '10:30',
    verdict: 'pass',
    citations: [
      { source: 'kpi_snapshots — INSAT', period: 'S1 2024 → S2 2025' },
      { source: 'Rapport scolarité INSAT (PDF scanné)', period: 'Mars 2026' },
    ],
    data: {
      type: 'chart',
      value: 28.0,
      label: 'Taux d\'abandon — INSAT',
    },
  },
]

export default function AIAssistantPage() {
  const [messages, setMessages] = useState(initialMessages)
  const [input, setInput] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = () => {
    if (!input.trim()) return
    const userMsg: Message = { role: 'user', text: input, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
    setMessages([...messages, userMsg])
    setInput('')

    // Simulate AI response
    setTimeout(() => {
      const aiMsg: Message = {
        role: 'ai',
        text: "Réponse ancrée dans les KPIs ingérés. EchoGarden a retrouvé les passages pertinents et généré une synthèse vérifiée.",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        verdict: 'pass',
        citations: [
          { source: 'kpi_snapshots', period: 'Avril 2026' },
        ],
      }
      setMessages(prev => [...prev, aiMsg])
    }, 1000)
  }

  return (
    <DashboardLayout>
      <div className="h-[calc(100vh-64px)] flex overflow-hidden">
        {/* Chat Area */}
        <div className="flex-1 flex flex-col bg-white border-r border-slate-100">
          {/* Header */}
          <div className="px-8 py-4 border-b border-slate-50 flex items-center justify-between bg-white z-10 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-500 flex items-center justify-center text-white shadow-lg shadow-cyan-500/20">
                <Bot size={20} />
              </div>
              <div>
                <h1 className="text-base font-black text-slate-800">Assistant EchoGarden</h1>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">RAG · Weaver + Verifier</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="bg-cyan-50 text-cyan-600 text-[10px] font-black px-2 py-1 rounded border border-cyan-100 uppercase tracking-widest">FR · AR · EN</span>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-8 space-y-8 bg-[#FAFCFD]">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`flex gap-4 max-w-[80%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                  <div className={`w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center shadow-sm ${
                    msg.role === 'user' ? 'bg-slate-800 text-white' : 'bg-white text-cyan-500 border border-slate-100'
                  }`}>
                    {msg.role === 'user' ? <User size={18} /> : <Sparkles size={18} />}
                  </div>
                  <div className={`space-y-2 ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
                    <div className={`px-5 py-3.5 rounded-2xl text-sm leading-relaxed shadow-sm ${
                      msg.role === 'user' 
                        ? 'bg-cyan-500 text-white rounded-tr-none' 
                        : 'bg-white text-slate-700 border border-slate-100 rounded-tl-none'
                    }`}>
                      {msg.text}
                      
                      {msg.data && (
                        <div className="mt-4 p-4 bg-slate-50 rounded-xl border border-slate-100">
                          <div className="flex items-center justify-between mb-4">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{msg.data.label}</span>
                            <span className="text-lg font-black text-red-500">{msg.data.value}%</span>
                          </div>
                          <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                            <div className="h-full bg-red-500 rounded-full" style={{ width: `${Math.min(msg.data.value, 100)}%` }}></div>
                          </div>
                        </div>
                      )}

                      {msg.role === 'ai' && (msg.verdict || msg.citations?.length) && (
                        <div className="mt-4 pt-3 border-t border-slate-100 space-y-2">
                          {msg.verdict && (
                            <div className="flex items-center gap-2">
                              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Verdict</span>
                              <span className={`text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest ${
                                msg.verdict === 'pass' ? 'bg-emerald-100 text-emerald-700' :
                                msg.verdict === 'revise' ? 'bg-amber-100 text-amber-700' :
                                'bg-slate-100 text-slate-600'
                              }`}>
                                {msg.verdict}
                              </span>
                              <span className="text-[9px] font-medium text-slate-400 italic">no hallucination</span>
                            </div>
                          )}
                          {msg.citations && msg.citations.length > 0 && (
                            <div className="space-y-1.5">
                              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Citations</span>
                              {msg.citations.map((c, ci) => (
                                <div key={ci} className="flex items-center gap-2 text-[10px] text-slate-500 font-medium">
                                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 flex-shrink-0" />
                                  <span className="font-bold text-slate-700">{c.source}</span>
                                  <span className="text-slate-400">·</span>
                                  <span className="italic">{c.period}</span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{msg.time}</span>
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-6 bg-white border-t border-slate-100">
            <div className="max-w-4xl mx-auto flex items-center gap-3">
              <div className="relative flex-1">
                <input 
                  type="text" 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Posez votre question à l'assistant..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3.5 px-5 text-sm focus:outline-none focus:border-cyan-500 focus:bg-white transition-all shadow-inner"
                />
              </div>
              <button 
                onClick={handleSend}
                className="w-12 h-12 bg-cyan-500 text-white rounded-2xl flex items-center justify-center hover:bg-cyan-600 transition-all shadow-lg shadow-cyan-500/20 active:scale-95"
              >
                <Send size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* Sidebar Suggestions */}
        <div className="w-80 bg-white p-8 overflow-y-auto">
          <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6">Suggestions</h2>
          <div className="space-y-3">
            {suggestions.map((s, i) => (
              <button 
                key={i}
                onClick={() => setInput(s)}
                className="w-full text-left p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:border-cyan-500 hover:bg-cyan-50/30 transition-all group"
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-6 h-6 rounded-lg bg-white border border-slate-100 flex items-center justify-center text-cyan-500 group-hover:bg-cyan-500 group-hover:text-white transition-colors">
                    {i === 0 ? <AlertCircle size={12} /> : i === 1 ? <BarChart3 size={12} /> : i === 2 ? <FileText size={12} /> : <Zap size={12} />}
                  </div>
                </div>
                <p className="text-[11px] font-bold text-slate-600 leading-snug group-hover:text-cyan-700">{s}</p>
              </button>
            ))}
          </div>

          <div className="mt-12 p-6 bg-gradient-to-br from-cyan-500 to-cyan-700 rounded-2xl text-white shadow-xl shadow-cyan-500/20">
            <Sparkles size={24} className="mb-4 opacity-50" />
            <h3 className="text-sm font-black mb-2 leading-tight">Pipeline EchoGarden</h3>
            <p className="text-[10px] text-cyan-100 font-medium leading-relaxed mb-4">RAG vectoriel (Qdrant) + Weaver pour la synthèse + Verifier pour le verdict pass / revise / abstain. Chaque réponse est ancrée et citée.</p>
            <button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest bg-white/10 hover:bg-white/20 px-3 py-2 rounded-lg transition-colors">
              Comment ça marche <ChevronRight size={12} />
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

function AlertCircle(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-alert-circle"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>
  )
}
