export type Status = 'Nominal' | 'Attention' | 'Critique' | 'Hors ligne'

export type InstitutionType = 'Institut' | 'Faculté' | 'École'

export type Institution = {
  id: string;
  name: string;
  city: string;
  type: InstitutionType;
  university: string;
  successRate: number;
  budgetExecution: number;
  dropoutRate: number;
  employabilityRate: number;
  absenteeismRate: number;
  publicationsCount: number;
  status: Status;
  initials: string;
  color: string;
  logo?: string;
  story?: string;
}

export type Severity = 'Critique' | 'Attention' | 'Nominal' | 'Info'

export type Alert = {
  institution: string;
  severity: Severity;
  message: string;
  time: string;
  kpiFamily?: string;
}

export type Achievement = {
  institution: string;
  type: 'Excellence Académique' | 'Insertion Professionnelle' | 'Bonne Gestion Budgétaire' | 'Recherche Active' | 'Hackathon / Compétition';
  description: string;
  period: string;
}

export type BudgetMonth = {
  month: string;
  academique: number;
  finance: number;
  infrastructure: number;
}

export const institutions: Institution[] = [
  {
    id: 'inst-insat-0000-0000-000000000000',
    name: 'INSAT',
    city: 'Tunis',
    type: 'École',
    university: 'Université de Carthage',
    successRate: 88,
    budgetExecution: 92,
    dropoutRate: 4.2,
    employabilityRate: 84,
    absenteeismRate: 3.1,
    publicationsCount: 42,
    status: 'Nominal',
    initials: 'IN',
    color: '#CFFAFE',
    logo: '/logos/insat.svg',
    story: 'Référence du réseau — meilleur taux d\'insertion professionnelle, recherche soutenue, finances saines.',
  },
  {
    id: 'inst-enit-00000-0000-000000000000',
    name: 'ENIT',
    city: 'Tunis',
    type: 'École',
    university: 'Université de Carthage',
    successRate: 84,
    budgetExecution: 47,
    dropoutRate: 6.0,
    employabilityRate: 78,
    absenteeismRate: 5.4,
    publicationsCount: 28,
    status: 'Attention',
    initials: 'ET',
    color: '#EFF6FF',
    logo: '/logos/enit.png',
    story: 'Excellents résultats académiques mais 47% d\'exécution budgétaire — équipement IT en dégradation.',
  },
  {
    id: 'inst-esprit-000-0000-000000000000',
    name: 'ESPRIT',
    city: 'Tunis',
    type: 'École',
    university: 'Université de Carthage',
    successRate: 64,
    budgetExecution: 71,
    dropoutRate: 11.5,
    employabilityRate: 58,
    absenteeismRate: 13.0,
    publicationsCount: 9,
    status: 'Critique',
    initials: 'ES',
    color: '#FFF7ED',
    logo: '/logos/esprit.svg',
    story: 'Crise RH — absentéisme à 13%, formation à 29%. Résultats académiques en baisse chaque semestre.',
  },
  {
    id: 'inst-isg-00000-0000-000000000000',
    name: 'ISG',
    city: 'Tunis',
    type: 'Institut',
    university: 'Université de Carthage',
    successRate: 72,
    budgetExecution: 85,
    dropoutRate: 3.5,
    employabilityRate: 81,
    absenteeismRate: 2.8,
    publicationsCount: 24,
    status: 'Nominal',
    initials: 'IS',
    color: '#F0FDFA',
    logo: '/logos/isg.png',
    story: 'Gestion équilibrée. Bonne insertion professionnelle des diplômés en gestion.',
  },
  {
    id: 'inst-ihec-0000-0000-000000000000',
    name: 'IHEC',
    city: 'Carthage',
    type: 'Institut',
    university: 'Université de Carthage',
    successRate: 0,
    budgetExecution: 0,
    dropoutRate: 0,
    employabilityRate: 0,
    absenteeismRate: 0,
    publicationsCount: 0,
    status: 'Hors ligne',
    initials: 'IH',
    color: '#F1F5F9',
    logo: '/logos/ihec.jpg',
    story: 'Aucun fichier soumis pour la période en cours — rapport en mode fallback.',
  },
]

export const budgetData: BudgetMonth[] = [
  { month: 'Nov', academique: 28, finance: 18, infrastructure: 12 },
  { month: 'Déc', academique: 32, finance: 20, infrastructure: 10 },
  { month: 'Jan', academique: 30, finance: 22, infrastructure: 14 },
  { month: 'Fév', academique: 45, finance: 25, infrastructure: 18 },
  { month: 'Mar', academique: 42, finance: 20, infrastructure: 15 },
  { month: 'Avr', academique: 38, finance: 22, infrastructure: 12 },
]

export const alerts: Alert[] = [
  {
    institution: "SUP'COM",
    severity: 'Critique',
    message: "Taux d'abandon à 28% — passé de 19% à 28% sur 3 semestres consécutifs (seuil critique : 20%).",
    time: 'Il y a 12 min',
    kpiFamily: 'academic',
  },
  {
    institution: 'ISTIC',
    severity: 'Critique',
    message: "Absentéisme du personnel à 13% — au-dessus du seuil critique de 8% (cible RH).",
    time: 'Il y a 1h',
    kpiFamily: 'hr',
  },
  {
    institution: 'ISSTE',
    severity: 'Attention',
    message: "Exécution budgétaire à 47% — sous le seuil de 50%. Risque de sous-utilisation et dégradation IT.",
    time: 'Il y a 3h',
    kpiFamily: 'finance',
  },
  {
    institution: 'IHEC',
    severity: 'Info',
    message: "Aucune donnée soumise pour la période en cours — rappel automatique envoyé à la présidence.",
    time: "Aujourd'hui",
    kpiFamily: 'ingestion',
  },
]

export const achievements: Achievement[] = [
  {
    institution: 'ENSTAB',
    type: 'Excellence Académique',
    description: 'Maintient un taux de réussite > 85% sur 2 périodes consécutives (88% ce mois).',
    period: 'Avril 2026',
  },
  {
    institution: 'ENSTAB',
    type: 'Insertion Professionnelle',
    description: 'Atteint 84% d\'insertion professionnelle — meilleur taux du réseau.',
    period: 'Avril 2026',
  },
  {
    institution: 'ISSTE',
    type: 'Recherche Active',
    description: '+22% de publications scientifiques par rapport à la période précédente.',
    period: 'Avril 2026',
  },
]

// 8 KPI families (per UCAR Pulse spec)
export const kpiFamilies: { key: string; label: string; color: string }[] = [
  { key: 'academic', label: 'Académique', color: 'bg-cyan-500' },
  { key: 'finance', label: 'Finance', color: 'bg-blue-500' },
  { key: 'employment', label: 'Insertion Pro', color: 'bg-emerald-500' },
  { key: 'hr', label: 'Ressources Humaines', color: 'bg-amber-500' },
  { key: 'research', label: 'Recherche', color: 'bg-violet-500' },
  { key: 'infrastructure', label: 'Infrastructures', color: 'bg-orange-500' },
  { key: 'esg', label: 'ESG', color: 'bg-teal-500' },
  { key: 'partnerships', label: 'Partenariats', color: 'bg-pink-500' },
]

// Maps each staff domain key to the KPI fields they can see + display labels
// Used to filter dashboard cards per staff function
export const DOMAIN_KPI_MAP: Record<string, { field: string; label: string; icon: string }[]> = {
  academic: [
    { field: 'successRate', label: 'Taux de Réussite', icon: 'Award' },
    { field: 'dropoutRate', label: "Taux d'Abandon", icon: 'AlertTriangle' },
  ],
  employment: [
    { field: 'employabilityRate', label: 'Taux d\'Employabilité', icon: 'TrendingUp' },
  ],
  finance: [
    { field: 'budgetExecution', label: 'Exécution Budgétaire', icon: 'Wallet' },
  ],
  esg: [],
  hr: [
    { field: 'absenteeismRate', label: 'Taux d\'Absentéisme', icon: 'Activity' },
  ],
  research: [
    { field: 'publicationsCount', label: 'Publications', icon: 'BookOpen' },
  ],
  infrastructure: [],
  partnerships: [],
}

// ═══════════════════════════════════════════════════════════════════════════════
// INSTITUTIONAL PROCESSES — covers ALL university processes per UCAR documentation
// ═══════════════════════════════════════════════════════════════════════════════

export type ProcessStatus = 'good' | 'warning' | 'critical'

export type ProcessKpi = {
  label: string
  value: string
  trend?: string // e.g. "+2.1%"
  trendUp?: boolean
  status: ProcessStatus
}

export type InstitutionalProcess = {
  key: string
  label: string
  icon: string // Lucide icon name reference
  color: string // Tailwind class
  kpis: ProcessKpi[]
}

export type ProcessCategory = {
  category: string
  processes: InstitutionalProcess[]
}

// Per-institution process data keyed by institution name
// Each institution has unique, realistic KPI values derived from their profile
const _instProcessData: Record<string, ProcessCategory[]> = {
  'ENSTAB': _buildProcesses(3200, 88, 92, 4.2, 91, 22, 82, 78, 12, 6),
  'ISSTE': _buildProcesses(2100, 84, 61, 7.1, 85, 14, 74, 65, 8, 3),
  'ISTIC': _buildProcesses(1850, 64, 47, 13.2, 72, 8, 58, 52, 5, 1),
  "SUP'COM": _buildProcesses(2800, 52, 38, 28.1, 68, 4, 45, 41, 3, 0),
  'IHEC': _buildProcesses(2530, 72, 55, 0, 78, 11, 66, 60, 7, 2),
}

function _s(v: number): ProcessStatus { return v >= 75 ? 'good' : v >= 50 ? 'warning' : 'critical' }

function _buildProcesses(
  students: number, successR: number, budgetExec: number, absentRate: number,
  reinscription: number, publications: number, pedagSat: number, occupation: number,
  partnerships: number, patents: number
): ProcessCategory[] {
  const newEnroll = Math.round(students * 0.26)
  const redoub = Math.round((100 - successR) * 0.12 * 10) / 10
  const staffEns = Math.round(students / 8)
  const staffAdm = Math.round(students / 18)
  const costPerStudent = Math.round(3200 + (100 - budgetExec) * 28)
  const formations = Math.round(staffEns * 0.35)
  const certif = Math.round(formations * 0.27)
  const projetsRecherche = Math.round(publications * 0.5)
  const financement = (publications * 0.013).toFixed(1)
  const clubs = Math.round(students / 100)
  const events = Math.round(clubs * 0.85)
  const refs = Math.round(students * 0.19)
  const ecarts = Math.round((100 - budgetExec) * 0.3)
  const recyclage = Math.round(30 + budgetExec * 0.12)
  const carbone = Math.round(80 + students * 0.02)
  return [
    {
      category: 'Enseignement & Formation', processes: [
        {
          key: 'enrollment', label: 'Inscription', icon: 'UserPlus', color: 'text-cyan-600', kpis: [
            { label: 'Étudiants inscrits', value: students.toLocaleString('fr'), trend: '+' + (Math.round(newEnroll / students * 100 * 10) / 10) + '%', trendUp: true, status: 'good' as ProcessStatus },
            { label: 'Taux de réinscription', value: reinscription + '%', status: _s(reinscription) },
            { label: 'Nouvelles inscriptions', value: newEnroll.toLocaleString('fr'), status: 'good' as ProcessStatus },
          ]
        },
        {
          key: 'exams', label: 'Examens', icon: 'ClipboardCheck', color: 'text-blue-600', kpis: [
            { label: 'Sessions planifiées', value: `${Math.round(successR * 0.55)}/52`, status: _s(successR) },
            { label: 'Taux de réussite global', value: successR + '%', trend: successR > 70 ? '+2.4%' : '-1.8%', trendUp: successR > 70, status: _s(successR) },
            { label: 'Taux de redoublement', value: redoub + '%', status: redoub < 8 ? 'good' as ProcessStatus : 'warning' as ProcessStatus },
          ]
        },
        {
          key: 'pedagogy', label: 'Pédagogie', icon: 'BookOpen', color: 'text-indigo-600', kpis: [
            { label: 'Programmes révisés', value: `${Math.round(pedagSat * 0.24)}/24`, status: _s(pedagSat) },
            { label: 'Satisfaction pédagogique', value: pedagSat + '%', trend: pedagSat > 65 ? '+3%' : '-2%', trendUp: pedagSat > 65, status: _s(pedagSat) },
            { label: 'Progression semestrielle', value: Math.round(pedagSat * 1.05) + '%', status: _s(pedagSat) },
          ]
        },
      ]
    },
    {
      category: 'Stratégie & Vie Étudiante', processes: [
        {
          key: 'strategy', label: 'Stratégie', icon: 'Target', color: 'text-violet-600', kpis: [
            { label: 'Objectifs atteints', value: Math.round(budgetExec * 0.95) + '%', status: _s(Math.round(budgetExec * 0.95)) },
            { label: "Plans d'action en cours", value: String(Math.round(partnerships * 1.1)), status: 'good' as ProcessStatus },
            { label: "Taux d'exécution", value: Math.round(budgetExec * 1.05) + '%', trend: '+5%', trendUp: true, status: _s(budgetExec) },
          ]
        },
        {
          key: 'partnerships', label: 'Partenariats', icon: 'Handshake', color: 'text-pink-600', kpis: [
            { label: 'Accords actifs', value: String(partnerships), trend: '+' + Math.round(partnerships * 0.15), trendUp: true, status: 'good' as ProcessStatus },
            { label: 'Mobilité entrante/sortante', value: String(Math.round(partnerships * 14)), status: 'good' as ProcessStatus },
            { label: 'Projets internationaux', value: String(Math.round(partnerships * 0.9)), status: 'good' as ProcessStatus },
          ]
        },
        {
          key: 'studentLife', label: 'Vie Étudiante', icon: 'Heart', color: 'text-rose-600', kpis: [
            { label: 'Clubs & associations', value: String(clubs), status: 'good' as ProcessStatus },
            { label: 'Événements / semestre', value: String(events), trend: '+' + Math.round(events * 0.2), trendUp: true, status: 'good' as ProcessStatus },
            { label: 'Satisfaction campus', value: Math.round(pedagSat * 0.9) + '%', status: _s(Math.round(pedagSat * 0.9)) },
          ]
        },
      ]
    },
    {
      category: 'Finance & Ressources Humaines', processes: [
        {
          key: 'finance', label: 'Finance', icon: 'Wallet', color: 'text-emerald-600', kpis: [
            { label: 'Budget alloué vs consommé', value: budgetExec + '%', status: _s(budgetExec) },
            { label: 'Coût par étudiant', value: costPerStudent.toLocaleString('fr') + ' TND', status: _s(budgetExec) },
            { label: 'Dépenses par département', value: budgetExec > 60 ? 'Réparties' : 'Concentrées', status: _s(budgetExec) },
          ]
        },
        {
          key: 'hr', label: 'Ressources Humaines', icon: 'Users', color: 'text-amber-600', kpis: [
            { label: 'Effectif enseignant/admin', value: `${staffEns} / ${staffAdm}`, status: 'good' as ProcessStatus },
            { label: "Taux d'absentéisme", value: absentRate + '%', trend: (absentRate < 8 ? '-0.3%' : '+1.2%'), trendUp: false, status: absentRate < 8 ? 'good' as ProcessStatus : absentRate < 12 ? 'warning' as ProcessStatus : 'critical' as ProcessStatus },
            { label: 'Stabilité des équipes', value: Math.round(100 - absentRate * 1.1) + '%', status: _s(Math.round(100 - absentRate * 1.1)) },
          ]
        },
        {
          key: 'training', label: 'Formation', icon: 'GraduationCap', color: 'text-cyan-700', kpis: [
            { label: 'Formations suivies', value: String(formations), trend: '+' + Math.round(formations * 0.15), trendUp: true, status: 'good' as ProcessStatus },
            { label: 'Charge enseignante moy.', value: Math.round(14 + absentRate * 0.3) + 'h/sem', status: _s(80) },
            { label: 'Certifications obtenues', value: String(certif), status: 'good' as ProcessStatus },
          ]
        },
      ]
    },
    {
      category: 'Recherche & Infrastructure', processes: [
        {
          key: 'research', label: 'Recherche', icon: 'Microscope', color: 'text-violet-600', kpis: [
            { label: 'Publications', value: String(publications), trend: '+' + Math.round(publications * 0.2), trendUp: true, status: _s(publications > 10 ? 80 : 50) },
            { label: 'Projets actifs', value: String(projetsRecherche), status: 'good' as ProcessStatus },
            { label: 'Financement obtenu', value: financement + 'M TND', status: 'good' as ProcessStatus },
            { label: 'Brevets déposés', value: String(patents), status: patents > 0 ? 'good' as ProcessStatus : 'warning' as ProcessStatus },
          ]
        },
        {
          key: 'infrastructure', label: 'Infrastructure', icon: 'Building', color: 'text-orange-600', kpis: [
            { label: "Taux d'occupation salles", value: occupation + '%', status: _s(occupation) },
            { label: 'État équipement IT', value: Math.round(occupation * 0.82) + '%', trend: occupation > 70 ? '+2%' : '-4%', trendUp: occupation > 70, status: _s(Math.round(occupation * 0.82)) },
            { label: 'Travaux en cours', value: String(Math.round((100 - occupation) / 15)), status: occupation > 70 ? 'good' as ProcessStatus : 'warning' as ProcessStatus },
          ]
        },
        {
          key: 'equipment', label: 'Équipement', icon: 'Monitor', color: 'text-slate-600', kpis: [
            { label: 'Disponibilité matériel', value: Math.round(occupation * 1.05) + '%', status: _s(Math.round(occupation * 1.05)) },
            { label: 'Équipements critiques', value: Math.round((100 - occupation) / 5) + ' à remplacer', status: occupation > 70 ? 'warning' as ProcessStatus : 'critical' as ProcessStatus },
            { label: 'Budget maintenance', value: Math.round(budgetExec * 0.6) + '% utilisé', status: _s(budgetExec) },
          ]
        },
      ]
    },
    {
      category: 'Logistique & Développement Durable', processes: [
        {
          key: 'inventory', label: 'Inventaire', icon: 'Package', color: 'text-amber-700', kpis: [
            { label: 'Références suivies', value: refs.toLocaleString('fr'), status: 'good' as ProcessStatus },
            { label: 'Dernière mise à jour', value: budgetExec > 60 ? 'Il y a 5j' : 'Il y a 21j', status: budgetExec > 60 ? 'good' as ProcessStatus : 'warning' as ProcessStatus },
            { label: 'Écarts détectés', value: String(ecarts), status: ecarts < 10 ? 'good' as ProcessStatus : 'warning' as ProcessStatus },
          ]
        },
        {
          key: 'esg', label: 'ESG / RSE', icon: 'Leaf', color: 'text-teal-600', kpis: [
            { label: 'Consommation énergie', value: (budgetExec > 60 ? '-8%' : '+3%') + ' vs N-1', trend: budgetExec > 60 ? '-8%' : '+3%', trendUp: false, status: budgetExec > 60 ? 'good' as ProcessStatus : 'warning' as ProcessStatus },
            { label: 'Empreinte carbone', value: carbone + ' tCO₂e', status: 'warning' as ProcessStatus },
            { label: 'Taux de recyclage', value: recyclage + '%', trend: '+6%', trendUp: true, status: _s(recyclage) },
            { label: 'Accessibilité campus', value: Math.round(occupation * 0.78) + '%', status: _s(Math.round(occupation * 0.78)) },
          ]
        },
        {
          key: 'logistics', label: 'Logistique', icon: 'Truck', color: 'text-gray-600', kpis: [
            { label: 'Transport planifié', value: Math.round(budgetExec * 1.3) + '%', status: _s(Math.round(budgetExec * 1.3)) },
            { label: 'Restauration satisfaction', value: Math.round(pedagSat * 0.87) + '%', status: _s(Math.round(pedagSat * 0.87)) },
            { label: 'Mobilité durable', value: Math.round(recyclage * 0.7) + '%', trend: '+5%', trendUp: true, status: 'warning' as ProcessStatus },
          ]
        },
      ]
    },
  ]
}

/** Returns process data scoped to a single institution */
export function getProcessCategories(institutionName?: string): ProcessCategory[] {
  if (institutionName && _instProcessData[institutionName]) {
    return _instProcessData[institutionName]
  }
  // Network-wide aggregate (for Directeur)
  return _buildProcesses(12480, 74, 56, 5.8, 87, 95, 78, 76, 47, 4)
}

// Keep backward-compat export for any other consumer
export const processCategories = getProcessCategories()

// ═══════════════════════════════════════════════════════════════════════════════
// PREDICTIVE ANALYTICS — anticipated trends and risks
// ═══════════════════════════════════════════════════════════════════════════════

export type Prediction = {
  institution: string
  domain: string
  risk: 'high' | 'medium' | 'low'
  prediction: string
  horizon: string
  confidence: number // 0-100
}

export const predictions: Prediction[] = [
  {
    institution: "SUP'COM",
    domain: 'Académique',
    risk: 'high',
    prediction: "Le taux d'abandon pourrait atteindre 32% d'ici la fin du semestre si aucune intervention n'est mise en place.",
    horizon: '3 mois',
    confidence: 87,
  },
  {
    institution: 'ISTIC',
    domain: 'RH',
    risk: 'high',
    prediction: "L'absentéisme risque de dépasser 15% au prochain trimestre — impact direct sur la charge pédagogique.",
    horizon: '2 mois',
    confidence: 82,
  },
  {
    institution: 'ISSTE',
    domain: 'Finance',
    risk: 'medium',
    prediction: "L'exécution budgétaire pourrait rester sous 50% en fin d'exercice — risque de gel de crédits.",
    horizon: '6 mois',
    confidence: 74,
  },
  {
    institution: 'ENSTAB',
    domain: 'Recherche',
    risk: 'low',
    prediction: "Projection de 50+ publications d'ici fin d'année — dépassement de l'objectif annuel de 15%.",
    horizon: '8 mois',
    confidence: 91,
  },
]

/* ───── KPI history (10 monthly snapshots) ───── */

export const PERIODS = [
  '2025/07', '2025/08', '2025/09', '2025/10', '2025/11',
  '2025/12', '2026/01', '2026/02', '2026/03', '2026/04',
]

export type HistoryKpi =
  | 'successRate'
  | 'dropoutRate'
  | 'budgetExecution'
  | 'employabilityRate'
  | 'absenteeismRate'
  | 'publicationsCount'

export type KpiHistoryPoint = { period: string } & Record<HistoryKpi, number>

// Stable, soft pastel-but-saturated stroke colors used by the comparison line charts.
// Index-aligned with `institutions[]` declaration order.
export const ACCENT_PALETTE = [
  '#06B6D4', // ENSTAB — cyan
  '#8B5CF6', // ISSTE   — violet
  '#F59E0B', // ISTIC    — amber
  '#F97316', // SUP'COM  — orange
  '#94A3B8', // IHEC    — slate
]

export function institutionAccent(id: string): string {
  const idx = institutions.findIndex(i => i.id === id)
  return ACCENT_PALETTE[idx % ACCENT_PALETTE.length] || '#06B6D4'
}

// Tiny seeded PRNG so charts don't shuffle between renders/SSR.
function seededRandom(seed: number) {
  let s = seed
  return () => {
    s = (s * 9301 + 49297) % 233280
    return s / 233280
  }
}

function genRamp(start: number, end: number, n: number, seed: number, jitter: number): number[] {
  const rnd = seededRandom(seed)
  return Array.from({ length: n }, (_, i) => {
    const t = i / (n - 1)
    const v = start + (end - start) * t + (rnd() - 0.5) * 2 * jitter
    return Math.max(0, Math.round(v * 10) / 10)
  })
}

// Story-aware (start, jitter) per institution × KPI. End values come from the snapshot.
// Stories are aligned with the PDF demo: SUP'COM abandon ↑, ISSTE budget ↓, ENSTAB excellence ↑, ISTIC RH ↓.
type StoryConfig = Partial<Record<HistoryKpi, { start: number; jitter: number }>>

const STORIES: Record<string, StoryConfig> = {
  ENSTAB: {
    successRate: { start: 83, jitter: 0.6 },
    dropoutRate: { start: 5.4, jitter: 0.4 },
    budgetExecution: { start: 88, jitter: 1.2 },
    employabilityRate: { start: 79, jitter: 0.7 },
    absenteeismRate: { start: 3.6, jitter: 0.3 },
    publicationsCount: { start: 30, jitter: 1.6 },
  },
  ISSTE: {
    successRate: { start: 82, jitter: 0.8 },
    dropoutRate: { start: 5.2, jitter: 0.4 },
    budgetExecution: { start: 60, jitter: 1.5 }, // declining → 47
    employabilityRate: { start: 76, jitter: 0.7 },
    absenteeismRate: { start: 4.8, jitter: 0.4 },
    publicationsCount: { start: 20, jitter: 1.4 }, // recherche active
  },
  ISTIC: {
    successRate: { start: 70, jitter: 0.9 }, // declining → 64
    dropoutRate: { start: 8.6, jitter: 0.5 },
    budgetExecution: { start: 75, jitter: 1.3 },
    employabilityRate: { start: 62, jitter: 0.8 },
    absenteeismRate: { start: 7, jitter: 0.5 }, // crisis → 13
    publicationsCount: { start: 10, jitter: 0.8 },
  },
  "SUP'COM": {
    successRate: { start: 72, jitter: 0.9 }, // declining → 62
    dropoutRate: { start: 19, jitter: 0.6 }, // 3-semester crisis → 28
    budgetExecution: { start: 71, jitter: 1.2 },
    employabilityRate: { start: 70, jitter: 0.7 },
    absenteeismRate: { start: 5.9, jitter: 0.4 },
    publicationsCount: { start: 12, jitter: 1.0 },
  },
}

function buildHistory(): Record<string, KpiHistoryPoint[]> {
  const out: Record<string, KpiHistoryPoint[]> = {}
  institutions.forEach((inst, idx) => {
    if (inst.status === 'Hors ligne') {
      out[inst.id] = []
      return
    }
    const cfg = STORIES[inst.name] || {}
    const seedBase = (idx + 1) * 1000

    const series: Record<HistoryKpi, number[]> = {
      successRate: genRamp(cfg.successRate?.start ?? inst.successRate, inst.successRate, PERIODS.length, seedBase + 1, cfg.successRate?.jitter ?? 1.0),
      dropoutRate: genRamp(cfg.dropoutRate?.start ?? inst.dropoutRate, inst.dropoutRate, PERIODS.length, seedBase + 2, cfg.dropoutRate?.jitter ?? 0.4),
      budgetExecution: genRamp(cfg.budgetExecution?.start ?? inst.budgetExecution, inst.budgetExecution, PERIODS.length, seedBase + 3, cfg.budgetExecution?.jitter ?? 1.2),
      employabilityRate: genRamp(cfg.employabilityRate?.start ?? inst.employabilityRate, inst.employabilityRate, PERIODS.length, seedBase + 4, cfg.employabilityRate?.jitter ?? 0.8),
      absenteeismRate: genRamp(cfg.absenteeismRate?.start ?? inst.absenteeismRate, inst.absenteeismRate, PERIODS.length, seedBase + 5, cfg.absenteeismRate?.jitter ?? 0.4),
      publicationsCount: genRamp(cfg.publicationsCount?.start ?? inst.publicationsCount, inst.publicationsCount, PERIODS.length, seedBase + 6, cfg.publicationsCount?.jitter ?? 1.4),
    }

    out[inst.id] = PERIODS.map((period, i) => ({
      period,
      successRate: series.successRate[i],
      dropoutRate: series.dropoutRate[i],
      budgetExecution: series.budgetExecution[i],
      employabilityRate: series.employabilityRate[i],
      absenteeismRate: series.absenteeismRate[i],
      publicationsCount: Math.round(series.publicationsCount[i]),
    }))
  })
  return out
}

export const kpiHistory: Record<string, KpiHistoryPoint[]> = buildHistory()
