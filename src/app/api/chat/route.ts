import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    const { message, history } = await request.json();

    const mistralApiKey = process.env.MISTRAL_API_KEY;
    if (!mistralApiKey) {
      return NextResponse.json(
        { error: "La clé API Mistral (MISTRAL_API_KEY) n'est pas configurée dans .env.local" },
        { status: 500 }
      );
    }

    // Fetch context from Supabase
    const [
      { data: institutions },
      { data: alerts },
      { data: achievements },
      { data: snapshots }
    ] = await Promise.all([
      supabase.from('institutions').select('id, name, city, type, university'),
      supabase.from('alerts').select('title, description, severity, status, created_at').limit(10),
      supabase.from('achievements').select('title, description, institution_id').limit(5),
      supabase.from('kpi_snapshots').select('data, created_at, institution_id').order('created_at', { ascending: false }).limit(20)
    ]);

    // Format context for Mistral
    const context = `
Base de connaissances UCAR Pulse (Données actuelles) :

Institutions :
${JSON.stringify(institutions)}

Dernières alertes :
${JSON.stringify(alerts)}

Derniers accomplissements :
${JSON.stringify(achievements)}

Instantanés des KPIs (Snapshot data) :
${JSON.stringify(snapshots)}
`;

    const insatPredefinedData = `
Données spécifiques INSAT (Ingérées via système RAG UCAR Pulse) :
- Taux d'abandon : 28% (Hausse continue sur 3 semestres)
- Taux de réussite moyen : 68%
- Taux d'insertion professionnelle : 92%
- Exécution budgétaire : 85%
- Recommandation système : Convocation urgente du conseil pédagogique requise.
`;

    const systemPrompt = `
Tu es UCARIA, l'assistant d'intelligence artificielle exclusif du réseau universitaire UCAR Pulse.
Ton rôle est de répondre aux questions des directeurs et du personnel.

REGLES STRICTES DE FORMATAGE ET DE COMPORTEMENT :
1. Fais des réponses très courtes, directes et concises. Parle peu.
2. N'utilise AUCUN formatage Markdown. Pas d'etoiles, pas de gras, pas d'italique. Uniquement du texte simple et pur.
3. Base-toi STRICTEMENT sur les données fournies dans le contexte ci-dessous. Ne pas halluciner.
4. Lorsque tu donnes des informations (notamment les statistiques de l'INSAT), cite toujours ta source explicitement à la fin de ta réponse de cette facon: "Source: RAG UCAR - Base de donnees Supabase / kpi_snapshots".
5. Vulgarise l'information : utilise un langage très simple, clair et accessible pour une personne non technique. Evite le jargon complexe.

CONTEXTE DE DONNEES UCAR PULSE :
${insatPredefinedData}
${context}
`;

    const response = await fetch('https://api.mistral.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${mistralApiKey}`,
      },
      body: JSON.stringify({
        model: 'mistral-large-latest',
        messages: [
          { role: 'system', content: systemPrompt },
          ...history.map((msg: any) => ({
            role: msg.role === 'ai' ? 'assistant' : 'user',
            content: msg.text
          })),
          { role: 'user', content: message }
        ],
        temperature: 0.2,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || 'Erreur API Mistral');
    }

    return NextResponse.json({
      reply: data.choices[0].message.content,
    });
  } catch (error: any) {
    console.error('Chat API Error:', error);
    return NextResponse.json(
      { error: error.message || 'Une erreur interne est survenue.' },
      { status: 500 }
    );
  }
}
