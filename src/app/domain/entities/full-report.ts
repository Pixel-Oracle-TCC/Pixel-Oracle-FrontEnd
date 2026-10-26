/**
 * Contrato v3 de POST /api/report.
 * Espelho de PixelOracle-API/api/src/domain/entities/FullReport.ts.
 * Nenhum campo identifica autores de reviews: só texto, votos, horas e idioma.
 */

export interface ExampleGame {
  game_id: number;
  titulo: string;
  mencoes: number;
  prevalencia_no_jogo: number;
}

export interface Quote {
  review_id: number;
  jogo: string;
  trecho: string;
  recomendada: boolean;
  votos_uteis: number;
  horas_jogadas: number;
}

export interface HighlightMetrics {
  reviews_com_tema: number;
  total_reviews: number;
  prevalencia: number;
  wilson_low: number;
  wilson_high: number;
  jogos_distintos: number;
  total_jogos: number;
  votos_uteis: number;
  pct_recomendadas_com_tema: number;
  p_value_ajustado: number;
  log_odds: number;
  significativo: boolean;
}

export interface Highlight {
  id: string;
  escopo: 'similares' | 'genero';
  genero?: string | null;
  tema: {
    theme_id: number;
    rotulo: string;
    categoria: string;
    polaridade: 'positivo' | 'negativo';
  };
  frase: string;
  jogos_exemplo: ExampleGame[];
  metricas: HighlightMetrics;
  citacoes: Quote[];
  contexto: { pct_menos_2h?: number; pct_early_access?: number };
}

export interface DecisiveFactor {
  genero: string;
  escopo: 'genero' | 'global';
  feature: string;
  rotulo: string;
  tipo: 'tema' | 'contexto';
  importancia: number;
  importancia_std: number;
  direcao: 'aumenta' | 'reduz';
  taxa_recomendacao_com: number;
  taxa_recomendacao_sem: number | null;
  suporte: number;
  modelo: { f1_macro: number; roc_auc: number; n_amostras: number };
}

export interface Alert {
  tipo: 'dados_insuficientes' | 'primeiras_horas' | 'early_access' | 'nicho_exigente';
  mensagem: string;
  evidencia: Record<string, unknown>;
}

export interface ReferenceReview {
  review_id: number;
  recomendada: boolean;
  texto: string;
  votos_uteis: number;
  votes_funny: number;
  weighted_vote_score: number | null;
  horas_jogadas: number;
  idioma: string | null;
  early_access: boolean;
  resposta_desenvolvedor: string | null;
}

export interface ReferenceReviewsByGame {
  jogo: { id: number; titulo: string; steam_appid: number | null };
  positivas: ReferenceReview[];
  negativas: ReferenceReview[];
}

export interface SimilarGame {
  id: number;
  steam_appid: number | null;
  titulo: string;
  descricao: string;
  preco_brl: number | null;
  release_year: number | null;
  review_score_desc: string | null;
  total_reviews_steam: number | null;
  pct_positivas: number | null;
  similaridade: number;
}

export interface EvidenceDashboard {
  destaques: { elogios: Highlight[]; reclamacoes: Highlight[] };
  fatores_decisivos: DecisiveFactor[];
  alertas: Alert[];
  reviews_referencia: ReferenceReviewsByGame[];
  jogos_similares: SimilarGame[];
}

export interface NarratedHighlight {
  id: string;
  frase: string;
  fonte: 'gemini' | 'modelo';
}

export interface DashboardNarrative {
  resumo: string;
  destaques: NarratedHighlight[];
  fonte: 'gemini' | 'fallback';
  validacao: { frases_substituidas: number; motivos: string[] };
}

export interface Cobertura {
  reviews_analisadas_similares: number;
  reviews_analisadas_genero: number;
  temas_disponiveis: number;
}

export interface FullReport {
  status: string;
  modo: 'pre-lancamento';
  jogo: { titulo: string; descricao: string; genres: string[] };
  dashboard: EvidenceDashboard;
  narrativa: DashboardNarrative;
  cobertura: Cobertura;
  evidencias?: Record<string, string>;
}

export interface ApiHealth {
  status: string;
  [key: string]: unknown;
}
