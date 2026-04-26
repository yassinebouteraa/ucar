'use client'

import { useState, useRef } from 'react'
import DashboardLayout from '@/components/DashboardLayout'
import { Clock, CheckCircle2, AlertCircle, Upload, ArrowRight, Download, FileText, File as FileIcon, X, Loader2 } from 'lucide-react'
import { jsPDF } from 'jspdf'
import { supabase } from "@/lib/supabase"
import { useEffect } from 'react'

const initialImports = [
  { source: 'Scolarité — INSAT (PDF scanné)', date: '25 Avr 2026, 14:30', records: 12, status: 'Succès' },
  { source: 'Finance — ENIT (Excel)', date: '25 Avr 2026, 12:15', records: 8, status: 'Succès' },
  { source: 'RH — ISG (photo de tableau)', date: '24 Avr 2026, 18:45', records: 0, status: 'Erreur' },
  { source: 'Recherche — ESPRIT (Word)', date: '24 Avr 2026, 09:00', records: 14, status: 'En cours' },
  { source: 'Académique — INSAT (Excel)', date: '23 Avr 2026, 16:20', records: 11, status: 'Succès' },
]

export default function DataIntegrationPage() {
  const [files, setFiles] = useState<File[]>([])
  const [imports, setImports] = useState(initialImports)
  const [isExtracting, setIsExtracting] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const fetchJobs = async () => {
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .order('created_ts', { ascending: false });
      
      if (data) {
        const mappedJobs = data.map(job => ({
          source: job.payload_json?.filename || job.type,
          date: new Date(job.created_ts).toLocaleString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }).replace('.', ''),
          records: job.payload_json?.records_count || 0,
          status: job.status === 'completed' ? 'Succès' : job.status === 'failed' ? 'Erreur' : 'En cours'
        }));
        setImports(mappedJobs);
      }
    };

    fetchJobs();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFiles(Array.from(e.target.files))
    }
  }

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index))
  }

  const handleExtract = () => {
    if (files.length === 0) {
      fileInputRef.current?.click()
      return
    }

    setIsExtracting(true)
    
    // Simulate extraction process
    setTimeout(() => {
      const newImports = files.map(f => ({
        source: f.name,
        date: new Date().toLocaleString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }).replace('.', ''),
        records: Math.floor(Math.random() * 20) + 1,
        status: 'Succès'
      }))

      setImports(prev => [...newImports, ...prev])
      setFiles([])
      setIsExtracting(false)
    }, 2000)
  }

  const handleDownload = (imp: any) => {
    // Generate PDF using jsPDF
    const doc = new jsPDF()
    
    // Header
    doc.setFont("helvetica", "bold")
    doc.setFontSize(22)
    doc.setTextColor(6, 182, 212) // Cyan-500
    doc.text("Rapport d'Extraction UCAR", 20, 25)
    
    // Info block
    doc.setFontSize(11)
    doc.setTextColor(100, 116, 139) // Slate-500
    doc.setFont("helvetica", "normal")
    doc.text(`Source : ${imp.source}`, 20, 40)
    doc.text(`Date & Heure : ${imp.date}`, 20, 48)
    doc.text(`Statut : ${imp.status}`, 20, 56)
    
    doc.setFont("helvetica", "bold")
    doc.setTextColor(15, 23, 42) // Slate-900
    doc.text(`Total KPIs Extraits : ${imp.records}`, 20, 68)
    
    // Separator
    doc.setDrawColor(241, 245, 249) // Slate-100
    doc.setLineWidth(0.5)
    doc.line(20, 75, 190, 75)
    
    // KPIs list
    doc.setFont("helvetica", "bold")
    doc.setFontSize(14)
    doc.text("Détails des KPIs", 20, 90)
    
    doc.setFont("helvetica", "normal")
    doc.setFontSize(11)
    let y = 100
    for (let i = 0; i < imp.records; i++) {
      if (y > 270) {
        doc.addPage()
        y = 20
      }
      const val = Math.floor(Math.random() * 1000)
      const conf = (Math.random() * 0.2 + 0.8).toFixed(2)
      doc.text(`• Indicateur KPI #${i + 1}`, 20, y)
      doc.text(`Valeur : ${val}`, 80, y)
      doc.setTextColor(16, 185, 129) // Emerald-500 for confidence
      doc.text(`Confiance : ${(Number(conf) * 100).toFixed(0)}%`, 140, y)
      doc.setTextColor(100, 116, 139) // Reset color
      y += 12
    }
    
    // Footer
    doc.setFontSize(8)
    doc.setTextColor(148, 163, 184) // Slate-400
    doc.text("Généré automatiquement par le système d'ingestion UCAR.", 20, 285)
    
    // Download
    const filename = `extraction_${imp.source.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.pdf`
    doc.save(filename)
  }

  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-black text-slate-900">Ingestion des Documents</h1>
            <span className="bg-cyan-100 text-cyan-700 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest border border-cyan-200">
              Tout format accepté
            </span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-50 border border-amber-100 rounded-xl text-[10px] font-black text-amber-700 uppercase tracking-widest">
            <Clock size={12} />
            Deadline : 26 du mois (J−1 avant verrouillage)
          </div>
        </div>
        <p className="text-sm text-slate-500 font-medium mb-8 max-w-3xl">
          Glissez-déposez vos fichiers — PDF scanné, photo de tableau imprimé, Excel, Word. Apache Tika et l'OCR extraient le texte ; Groq extrait les KPIs ; UCARIA vectorise et vérifie.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left: Upload Zone */}
          <div className="bg-white rounded-2xl border border-slate-100 p-8 shadow-sm h-fit">
            <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6">Soumission de documents</h2>
            
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              className="hidden" 
              multiple
              accept=".pdf,.xls,.xlsx,.doc,.docx,image/*" 
            />

            <div 
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center transition-all cursor-pointer group ${
                files.length > 0 ? 'border-cyan-200 bg-cyan-50/20' : 'border-slate-100 bg-slate-50/50 hover:bg-cyan-50/30 hover:border-cyan-200'
              }`}
            >
              {files.length === 0 ? (
                <>
                  <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-slate-300 mb-4 shadow-sm group-hover:scale-110 group-hover:text-cyan-500 transition-all">
                    <Upload size={32} />
                  </div>
                  <p className="text-sm font-black text-slate-700 mb-1">Glissez vos fichiers ici</p>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest text-center">PDF · Excel · Word · Photo<br/>jusqu'à 50MB</p>
                </>
              ) : (
                <div className="w-full space-y-3" onClick={e => e.stopPropagation()}>
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-sm font-black text-slate-700">{files.length} fichier(s) sélectionné(s)</p>
                    <button onClick={() => fileInputRef.current?.click()} className="text-[10px] font-bold text-cyan-500 hover:text-cyan-600 uppercase tracking-widest">
                      Ajouter +
                    </button>
                  </div>
                  {files.map((file, idx) => (
                    <div key={idx} className="flex items-center justify-between bg-white p-3 rounded-xl border border-slate-100 shadow-sm">
                      <div className="flex items-center gap-3 overflow-hidden">
                        <div className="w-8 h-8 bg-cyan-50 rounded-lg flex items-center justify-center text-cyan-500 flex-shrink-0">
                          <FileIcon size={14} />
                        </div>
                        <span className="text-xs font-bold text-slate-600 truncate">{file.name}</span>
                      </div>
                      <button onClick={() => removeFile(idx)} className="text-slate-300 hover:text-red-500 transition-colors p-1">
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <button 
              onClick={handleExtract}
              disabled={isExtracting}
              className={`w-full mt-6 py-4 rounded-xl text-xs font-black uppercase tracking-widest shadow-lg transition-all active:scale-[0.98] flex items-center justify-center gap-2 ${
                isExtracting 
                  ? 'bg-slate-100 text-slate-400 shadow-none' 
                  : files.length > 0 
                    ? 'bg-cyan-500 text-white hover:bg-cyan-600 shadow-cyan-500/20' 
                    : 'bg-slate-800 text-white hover:bg-slate-700 shadow-slate-800/20'
              }`}
            >
              {isExtracting ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Extraction en cours...
                </>
              ) : files.length > 0 ? (
                "Lancer l'extraction"
              ) : (
                "Sélectionner des fichiers"
              )}
            </button>

            <div className="mt-8 space-y-4">
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50 pb-2">Familles KPI cibles</h3>
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl group cursor-pointer hover:bg-slate-100 transition-all">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-emerald-500"><FileText size={14} /></div>
                  <span className="text-xs font-bold text-slate-600">Académique · Finance · RH</span>
                </div>
                <ArrowRight size={14} className="text-slate-300 group-hover:text-cyan-500" />
              </div>
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl group cursor-pointer hover:bg-slate-100 transition-all">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-blue-500"><FileText size={14} /></div>
                  <span className="text-xs font-bold text-slate-600">Recherche · Insertion · ESG · Partenariats</span>
                </div>
                <ArrowRight size={14} className="text-slate-300 group-hover:text-cyan-500" />
              </div>
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl group cursor-pointer hover:bg-slate-100 transition-all">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-amber-500"><Download size={14} /></div>
                  <span className="text-xs font-bold text-slate-600">Templates Excel (optionnel)</span>
                </div>
                <ArrowRight size={14} className="text-slate-300 group-hover:text-cyan-500" />
              </div>
            </div>
          </div>

          {/* Right: Jobs d'ingestion récents (History) */}
          <div className="bg-white rounded-2xl border border-slate-100 p-8 shadow-sm h-fit">
            <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
              <Clock size={14} className="text-cyan-500" />
              Jobs d'ingestion récents
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-slate-50">
                    <th className="pb-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Source</th>
                    <th className="pb-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Date & Heure</th>
                    <th className="pb-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">KPIs extraits</th>
                    <th className="pb-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Statut</th>
                    <th className="pb-4"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {imports.map((imp, i) => (
                    <tr key={i} className="group hover:bg-slate-50/30 transition-colors">
                      <td className="py-4 font-bold text-sm text-slate-700 truncate max-w-[200px]">{imp.source}</td>
                      <td className="py-4 text-xs text-slate-400 font-medium">{imp.date}</td>
                      <td className="py-4 text-center text-sm font-black text-slate-600">{imp.records}</td>
                      <td className="py-4 text-right">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                          imp.status === 'Succès' ? 'bg-emerald-50 text-emerald-600' :
                          imp.status === 'Erreur' ? 'bg-red-50 text-red-600' :
                          'bg-blue-50 text-blue-600'
                        }`}>
                          {imp.status === 'Succès' ? <CheckCircle2 size={10} /> : imp.status === 'Erreur' ? <AlertCircle size={10} /> : <Clock size={10} />}
                          {imp.status}
                        </span>
                      </td>
                      <td className="py-4 text-right pl-2">
                        <button 
                          onClick={() => handleDownload(imp)}
                          disabled={imp.status !== 'Succès' || imp.records === 0}
                          className={`p-2 rounded-xl transition-all ${
                            imp.status === 'Succès' && imp.records > 0
                              ? 'text-cyan-600 bg-cyan-50 hover:bg-cyan-100' 
                              : 'text-slate-300 bg-slate-50 cursor-not-allowed'
                          }`}
                          title={imp.status === 'Succès' && imp.records > 0 ? 'Télécharger le JSON des KPIs extraits' : 'Indisponible'}
                        >
                          <Download size={14} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <button className="w-full mt-6 py-2 border-t border-slate-50 text-[11px] font-bold text-cyan-500 hover:text-cyan-600 transition-colors">
              Voir tout l'historique →
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
