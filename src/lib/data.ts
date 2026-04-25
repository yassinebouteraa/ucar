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
    id: '1',
    name: 'ESPRIT',
    city: 'Ariana',
    type: 'École',
    university: 'Université de Carthage',
    successRate: 88,
    budgetExecution: 92,
    dropoutRate: 4.2,
    employabilityRate: 84,
    absenteeismRate: 3.1,
    publicationsCount: 42,
    status: 'Nominal',
    initials: 'ES',
    color: '#CFFAFE',
    story: 'Référence du réseau — meilleur taux d\'insertion professionnelle, recherche soutenue, finances saines.',
  },
  {
    id: '2',
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
    initials: 'EN',
    color: '#EFF6FF',
    story: 'Excellents résultats académiques mais 47% d\'exécution budgétaire — équipement IT en dégradation.',
  },
  {
    id: '3',
    name: 'ISG',
    city: 'Tunis',
    type: 'Institut',
    university: 'Université de Carthage',
    successRate: 64,
    budgetExecution: 71,
    dropoutRate: 11.5,
    employabilityRate: 58,
    absenteeismRate: 13.0,
    publicationsCount: 9,
    status: 'Critique',
    initials: 'IG',
    color: '#FFF7ED',
    story: 'Crise RH — absentéisme à 13%, formation à 29%. Résultats académiques en baisse chaque semestre.',
  },
  {
    id: '4',
    name: 'INSAT',
    city: 'Tunis',
    type: 'Institut',
    university: 'Université de Carthage',
    successRate: 62,
    budgetExecution: 68,
    dropoutRate: 28.0,
    employabilityRate: 67,
    absenteeismRate: 6.8,
    publicationsCount: 16,
    status: 'Critique',
    initials: 'IN',
    color: '#FEE2E2',
    story: 'Crise abandon — taux passé de 19% à 28% en 3 semestres. Assiduité en chute.',
  },
  {
    id: '5',
    name: 'FSB Bizerte',
    city: 'Bizerte',
    type: 'Faculté',
    university: 'Université de Carthage',
    successRate: 0,
    budgetExecution: 0,
    dropoutRate: 0,
    employabilityRate: 0,
    absenteeismRate: 0,
    publicationsCount: 0,
    status: 'Hors ligne',
    initials: 'FS',
    color: '#F1F5F9',
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
    institution: 'INSAT',
    severity: 'Critique',
    message: "Taux d'abandon à 28% — passé de 19% à 28% sur 3 semestres consécutifs (seuil critique : 20%).",
    time: 'Il y a 12 min',
    kpiFamily: 'academic',
  },
  {
    institution: 'ISG',
    severity: 'Critique',
    message: "Absentéisme du personnel à 13% — au-dessus du seuil critique de 8% (cible RH).",
    time: 'Il y a 1h',
    kpiFamily: 'hr',
  },
  {
    institution: 'ENIT',
    severity: 'Attention',
    message: "Exécution budgétaire à 47% — sous le seuil de 50%. Risque de sous-utilisation et dégradation IT.",
    time: 'Il y a 3h',
    kpiFamily: 'finance',
  },
  {
    institution: 'FSB Bizerte',
    severity: 'Info',
    message: "Aucune donnée soumise pour la période en cours — rappel automatique envoyé à la présidence.",
    time: "Aujourd'hui",
    kpiFamily: 'ingestion',
  },
]

export const achievements: Achievement[] = [
  {
    institution: 'ESPRIT',
    type: 'Excellence Académique',
    description: 'Maintient un taux de réussite > 85% sur 2 périodes consécutives (88% ce mois).',
    period: 'Avril 2026',
  },
  {
    institution: 'ESPRIT',
    type: 'Insertion Professionnelle',
    description: 'Atteint 84% d\'insertion professionnelle — meilleur taux du réseau.',
    period: 'Avril 2026',
  },
  {
    institution: 'ENIT',
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
  '#06B6D4', // ESPRIT — cyan
  '#8B5CF6', // ENIT   — violet
  '#F59E0B', // ISG    — amber
  '#F97316', // INSAT  — orange
  '#94A3B8', // FSB    — slate
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
// Stories are aligned with the PDF demo: INSAT abandon ↑, ENIT budget ↓, ESPRIT excellence ↑, ISG RH ↓.
type StoryConfig = Partial<Record<HistoryKpi, { start: number; jitter: number }>>

const STORIES: Record<string, StoryConfig> = {
  ESPRIT: {
    successRate:       { start: 83,  jitter: 0.6 },
    dropoutRate:       { start: 5.4, jitter: 0.4 },
    budgetExecution:   { start: 88,  jitter: 1.2 },
    employabilityRate: { start: 79,  jitter: 0.7 },
    absenteeismRate:   { start: 3.6, jitter: 0.3 },
    publicationsCount: { start: 30,  jitter: 1.6 },
  },
  ENIT: {
    successRate:       { start: 82,  jitter: 0.8 },
    dropoutRate:       { start: 5.2, jitter: 0.4 },
    budgetExecution:   { start: 60,  jitter: 1.5 }, // declining → 47
    employabilityRate: { start: 76,  jitter: 0.7 },
    absenteeismRate:   { start: 4.8, jitter: 0.4 },
    publicationsCount: { start: 20,  jitter: 1.4 }, // recherche active
  },
  ISG: {
    successRate:       { start: 70,  jitter: 0.9 }, // declining → 64
    dropoutRate:       { start: 8.6, jitter: 0.5 },
    budgetExecution:   { start: 75,  jitter: 1.3 },
    employabilityRate: { start: 62,  jitter: 0.8 },
    absenteeismRate:   { start: 7,   jitter: 0.5 }, // crisis → 13
    publicationsCount: { start: 10,  jitter: 0.8 },
  },
  INSAT: {
    successRate:       { start: 72,  jitter: 0.9 }, // declining → 62
    dropoutRate:       { start: 19,  jitter: 0.6 }, // 3-semester crisis → 28
    budgetExecution:   { start: 71,  jitter: 1.2 },
    employabilityRate: { start: 70,  jitter: 0.7 },
    absenteeismRate:   { start: 5.9, jitter: 0.4 },
    publicationsCount: { start: 12,  jitter: 1.0 },
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
      successRate:       genRamp(cfg.successRate?.start       ?? inst.successRate,       inst.successRate,       PERIODS.length, seedBase + 1, cfg.successRate?.jitter       ?? 1.0),
      dropoutRate:       genRamp(cfg.dropoutRate?.start       ?? inst.dropoutRate,       inst.dropoutRate,       PERIODS.length, seedBase + 2, cfg.dropoutRate?.jitter       ?? 0.4),
      budgetExecution:   genRamp(cfg.budgetExecution?.start   ?? inst.budgetExecution,   inst.budgetExecution,   PERIODS.length, seedBase + 3, cfg.budgetExecution?.jitter   ?? 1.2),
      employabilityRate: genRamp(cfg.employabilityRate?.start ?? inst.employabilityRate, inst.employabilityRate, PERIODS.length, seedBase + 4, cfg.employabilityRate?.jitter ?? 0.8),
      absenteeismRate:   genRamp(cfg.absenteeismRate?.start   ?? inst.absenteeismRate,   inst.absenteeismRate,   PERIODS.length, seedBase + 5, cfg.absenteeismRate?.jitter   ?? 0.4),
      publicationsCount: genRamp(cfg.publicationsCount?.start ?? inst.publicationsCount, inst.publicationsCount, PERIODS.length, seedBase + 6, cfg.publicationsCount?.jitter ?? 1.4),
    }

    out[inst.id] = PERIODS.map((period, i) => ({
      period,
      successRate:       series.successRate[i],
      dropoutRate:       series.dropoutRate[i],
      budgetExecution:   series.budgetExecution[i],
      employabilityRate: series.employabilityRate[i],
      absenteeismRate:   series.absenteeismRate[i],
      publicationsCount: Math.round(series.publicationsCount[i]),
    }))
  })
  return out
}

export const kpiHistory: Record<string, KpiHistoryPoint[]> = buildHistory()
