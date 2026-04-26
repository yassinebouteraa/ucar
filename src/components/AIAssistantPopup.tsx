'use client'

import { useState, useRef, useEffect } from 'react'
import { Bot, Send, User, Sparkles, X, Loader2 } from 'lucide-react'
import { supabase } from '@/lib/supabase'

const suggestions = [
  "Pourquoi le taux d'abandon à l'INSAT augmente chaque semestre ?",
  "Quelle institution a le meilleur taux d'insertion professionnelle ?",
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
    role: 'ai',
    text: "Bonjour ! Je suis UCARIA. Comment puis-je vous aider avec vos données UCAR aujourd'hui ?",
    time: '10:30',
  }
]

export default function AIAssistantPopup() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState(initialMessages)
  const [input, setInput] = useState('')
  const [userId, setUserId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) setUserId(user.id)
    }
    fetchUser()
  }, [])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    if (isOpen) {
      scrollToBottom()
    }
  }, [messages, isOpen])

  const handleSend = async () => {
    if (!input.trim() || isLoading) return
    const currentInput = input.trim()
    const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    
    const userMsg: Message = { 
      role: 'user', 
      text: currentInput, 
      time: currentTime 
    }
    
    const updatedMessages = [...messages, userMsg]
    setMessages(updatedMessages)
    setInput('')
    setIsLoading(true)

    // Persist user message to DB
    if (userId) {
      await supabase.from('conversation_turns').insert({
        user_id: userId,
        role: 'user',
        content: currentInput,
        metadata: { time: currentTime }
      })
    }

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: currentInput, history: messages })
      });

      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || 'Erreur API');
      }

      const aiTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      const aiMsg: Message = {
        role: 'ai',
        text: data.reply,
        time: aiTime,
        verdict: 'pass',
      }
      
      setMessages(prev => [...prev, aiMsg])

      // Persist AI response to DB
      if (userId) {
        await supabase.from('conversation_turns').insert({
          user_id: userId,
          role: 'ai',
          content: aiMsg.text,
          metadata: { 
            time: aiTime,
            verdict: 'pass',
          }
        })
      }
    } catch (error: any) {
      console.error(error);
      const errorMsg: Message = {
        role: 'ai',
        text: `Désolé, une erreur est survenue: ${error.message}`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }
      setMessages(prev => [...prev, errorMsg])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Chat Window */}
      {isOpen && (
        <div className="bg-white rounded-2xl shadow-2xl border border-slate-100 w-[380px] h-[550px] max-h-[80vh] flex flex-col mb-4 overflow-hidden animate-in slide-in-from-bottom-5">
          {/* Header */}
          <div className="px-4 py-3 border-b border-slate-50 flex items-center justify-between bg-cyan-500 text-white">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center backdrop-blur-sm">
                <Bot size={18} />
              </div>
              <div>
                <h2 className="text-sm font-black">UCARIA</h2>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></span>
                  <span className="text-[9px] font-bold text-cyan-100 uppercase tracking-widest">En ligne</span>
                </div>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#FAFCFD]">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`flex gap-2 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                  <div className={`w-6 h-6 rounded-lg flex-shrink-0 flex items-center justify-center mt-1 shadow-sm ${
                    msg.role === 'user' ? 'bg-slate-800 text-white' : 'bg-white text-cyan-500 border border-slate-100'
                  }`}>
                    {msg.role === 'user' ? <User size={12} /> : <Sparkles size={12} />}
                  </div>
                  <div className={`space-y-1 ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
                    <div className={`px-3 py-2.5 rounded-xl text-xs leading-relaxed shadow-sm ${
                      msg.role === 'user' 
                        ? 'bg-cyan-500 text-white rounded-tr-none' 
                        : 'bg-white text-slate-700 border border-slate-100 rounded-tl-none'
                    }`}>
                      {msg.text}

                      {msg.role === 'ai' && (msg.verdict || msg.citations?.length) && (
                        <div className="mt-3 pt-2 border-t border-slate-100/10 space-y-2">
                          {msg.verdict && (
                            <div className="flex items-center gap-1.5">
                              <span className={`text-[8px] font-black px-1.5 py-0.5 rounded uppercase tracking-widest ${
                                msg.verdict === 'pass' ? 'bg-emerald-100 text-emerald-700' :
                                'bg-slate-100 text-slate-600'
                              }`}>
                                {msg.verdict}
                              </span>
                            </div>
                          )}
                          {msg.citations && msg.citations.length > 0 && (
                            <div className="space-y-1 text-left">
                              {msg.citations.map((c, ci) => (
                                <div key={ci} className="flex items-center gap-1.5 text-[9px] text-slate-500 font-medium">
                                  <span className="w-1 h-1 rounded-full bg-cyan-500 flex-shrink-0" />
                                  <span className="font-bold text-slate-700">{c.source}</span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block">{msg.time}</span>
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Suggestions */}
          {messages.length === 1 && (
            <div className="p-3 bg-white border-t border-slate-50 space-y-2">
              {suggestions.map((s, i) => (
                <button 
                  key={i}
                  onClick={() => setInput(s)}
                  className="w-full text-left px-3 py-2 text-[10px] font-bold text-cyan-600 bg-cyan-50 hover:bg-cyan-100 rounded-lg transition-colors border border-cyan-100"
                >
                  {s}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div className="p-3 bg-white border-t border-slate-100 flex items-center gap-2">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Posez votre question..."
              disabled={isLoading}
              className="flex-1 bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3 text-xs focus:outline-none focus:border-cyan-500 focus:bg-white transition-all shadow-inner disabled:opacity-50"
            />
            <button 
              onClick={handleSend}
              disabled={isLoading || !input.trim()}
              className="w-10 h-10 bg-cyan-500 text-white rounded-xl flex items-center justify-center hover:bg-cyan-600 transition-all shadow-md active:scale-95 flex-shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
            </button>
          </div>
        </div>
      )}

      {/* FAB Button */}
      {!isOpen && (
        <button 
          onClick={() => setIsOpen(true)}
          className="w-16 h-16 bg-cyan-500 hover:bg-cyan-600 text-white rounded-full flex items-center justify-center transition-all hover:scale-[1.08] active:scale-95 group relative animate-float-cinematic"
        >
          <Bot size={28} className="group-hover:animate-pulse" />
          <span className="absolute top-0 right-0 flex h-4 w-4 transform translate-x-1/4 -translate-y-1/4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500 border-2 border-white"></span>
          </span>
        </button>
      )}
    </div>
  )
}
