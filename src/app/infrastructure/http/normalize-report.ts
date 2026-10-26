import type {
  Alert,
  Cobertura,
  DashboardNarrative,
  DecisiveFactor,
  EvidenceDashboard,
  FullReport,
  Highlight,
  NarratedHighlight,
  Quote,
  ReferenceReview,
  ReferenceReviewsByGame,
  SimilarGame,
} from '../../domain/entities/full-report';

function asRecord(value: unknown): Record<string, unknown> {
  return value !== null && typeof value === 'object' ? (value as Record<string, unknown>) : {};
}

function asString(value: unknown, fallback = ''): string {
  return typeof value === 'string' ? value : fallback;
}

function asNumber(value: unknown, fallback = 0): number {
  return typeof value === 'number' && Number.isFinite(value) ? value : fallback;
}

function asNumberOrNull(value: unknown): number | null {
  return typeof value === 'number' && Number.isFinite(value) ? value : null;
}

function asBoolean(value: unknown): boolean {
  return value === true;
}

function asStringArray(value: unknown): string[] {
  return Array.isArray(value) ? value.filter((v): v is string => typeof v === 'string') : [];
}

function normalizeQuote(raw: unknown): Quote {
  const r = asRecord(raw);
  return {
    review_id: asNumber(r['review_id']),
    jogo: asString(r['jogo']),
    trecho: asString(r['trecho']),
    recomendada: asBoolean(r['recomendada']),
    votos_uteis: asNumber(r['votos_uteis']),
    horas_jogadas: asNumber(r['horas_jogadas']),
  };
}

function normalizeHighlight(raw: unknown, index: number): Highlight {
  const r = asRecord(raw);
  const tema = asRecord(r['tema']);
  const metricas = asRecord(r['metricas']);
  const contexto = asRecord(r['contexto']);
  const polaridade = tema['polaridade'] === 'negativo' ? 'negativo' : 'positivo';
  const escopo = r['escopo'] === 'genero' ? 'genero' : 'similares';

  return {
    id: asString(r['id'], `destaque-${index}`),
    escopo,
    genero: typeof r['genero'] === 'string' ? r['genero'] : null,
    tema: {
      theme_id: asNumber(tema['theme_id']),
      rotulo: asString(tema['rotulo'], 'Tema'),
      categoria: asString(tema['categoria']),
      polaridade,
    },
    frase: asString(r['frase']),
    jogos_exemplo: Array.isArray(r['jogos_exemplo'])
      ? r['jogos_exemplo'].map((item) => {
          const g = asRecord(item);
          return {
            game_id: asNumber(g['game_id']),
            titulo: asString(g['titulo'], 'Jogo'),
            mencoes: asNumber(g['mencoes']),
            prevalencia_no_jogo: asNumber(g['prevalencia_no_jogo']),
          };
        })
      : [],
    metricas: {
      reviews_com_tema: asNumber(metricas['reviews_com_tema']),
      total_reviews: asNumber(metricas['total_reviews']),
      prevalencia: asNumber(metricas['prevalencia']),
      wilson_low: asNumber(metricas['wilson_low']),
      wilson_high: asNumber(metricas['wilson_high']),
      jogos_distintos: asNumber(metricas['jogos_distintos']),
      total_jogos: asNumber(metricas['total_jogos']),
      votos_uteis: asNumber(metricas['votos_uteis']),
      pct_recomendadas_com_tema: asNumber(metricas['pct_recomendadas_com_tema']),
      p_value_ajustado: asNumber(metricas['p_value_ajustado']),
      log_odds: asNumber(metricas['log_odds']),
      significativo: asBoolean(metricas['significativo']),
    },
    citacoes: Array.isArray(r['citacoes']) ? r['citacoes'].map(normalizeQuote) : [],
    contexto: {
      pct_menos_2h:
        typeof contexto['pct_menos_2h'] === 'number' ? contexto['pct_menos_2h'] : undefined,
      pct_early_access:
        typeof contexto['pct_early_access'] === 'number' ? contexto['pct_early_access'] : undefined,
    },
  };
}

function normalizeFactor(raw: unknown): DecisiveFactor {
  const r = asRecord(raw);
  const modelo = asRecord(r['modelo']);
  const direcao = r['direcao'] === 'aumenta' ? 'aumenta' : 'reduz';
  return {
    genero: asString(r['genero']),
    escopo: r['escopo'] === 'global' ? 'global' : 'genero',
    feature: asString(r['feature']),
    rotulo: asString(r['rotulo'], 'Fator'),
    tipo: r['tipo'] === 'contexto' ? 'contexto' : 'tema',
    importancia: asNumber(r['importancia']),
    importancia_std: asNumber(r['importancia_std']),
    direcao,
    taxa_recomendacao_com: asNumber(r['taxa_recomendacao_com']),
    taxa_recomendacao_sem: asNumberOrNull(r['taxa_recomendacao_sem']),
    suporte: asNumber(r['suporte']),
    modelo: {
      f1_macro: asNumber(modelo['f1_macro']),
      roc_auc: asNumber(modelo['roc_auc']),
      n_amostras: asNumber(modelo['n_amostras']),
    },
  };
}

function normalizeAlert(raw: unknown): Alert {
  const r = asRecord(raw);
  const tipo = r['tipo'];
  const allowed = ['dados_insuficientes', 'primeiras_horas', 'early_access', 'nicho_exigente'] as const;
  const safe = allowed.includes(tipo as (typeof allowed)[number])
    ? (tipo as Alert['tipo'])
    : 'dados_insuficientes';
  return {
    tipo: safe,
    mensagem: asString(r['mensagem']),
    evidencia: asRecord(r['evidencia']),
  };
}

function normalizeReferenceReview(raw: unknown): ReferenceReview {
  const r = asRecord(raw);
  return {
    review_id: asNumber(r['review_id']),
    recomendada: asBoolean(r['recomendada']),
    texto: asString(r['texto']),
    votos_uteis: asNumber(r['votos_uteis']),
    votes_funny: asNumber(r['votes_funny']),
    weighted_vote_score: asNumberOrNull(r['weighted_vote_score']),
    horas_jogadas: asNumber(r['horas_jogadas']),
    idioma: typeof r['idioma'] === 'string' ? r['idioma'] : null,
    early_access: asBoolean(r['early_access']),
    resposta_desenvolvedor:
      typeof r['resposta_desenvolvedor'] === 'string' ? r['resposta_desenvolvedor'] : null,
  };
}

function normalizeReferenceGroup(raw: unknown, index: number): ReferenceReviewsByGame {
  const r = asRecord(raw);
  const jogo = asRecord(r['jogo']);
  return {
    jogo: {
      id: typeof jogo['id'] === 'number' ? jogo['id'] : index,
      titulo: asString(jogo['titulo'], 'Jogo'),
      steam_appid: asNumberOrNull(jogo['steam_appid']),
    },
    positivas: Array.isArray(r['positivas']) ? r['positivas'].map(normalizeReferenceReview) : [],
    negativas: Array.isArray(r['negativas']) ? r['negativas'].map(normalizeReferenceReview) : [],
  };
}

function normalizeSimilar(raw: unknown, index: number): SimilarGame {
  const r = asRecord(raw);
  return {
    id: typeof r['id'] === 'number' ? r['id'] : index,
    steam_appid: asNumberOrNull(r['steam_appid']),
    titulo: asString(r['titulo'], 'Jogo similar'),
    descricao: asString(r['descricao']),
    preco_brl: asNumberOrNull(r['preco_brl']),
    release_year: asNumberOrNull(r['release_year']),
    review_score_desc: typeof r['review_score_desc'] === 'string' ? r['review_score_desc'] : null,
    total_reviews_steam: asNumberOrNull(r['total_reviews_steam']),
    pct_positivas: asNumberOrNull(r['pct_positivas']),
    similaridade: asNumber(r['similaridade']),
  };
}

function normalizeDashboard(raw: unknown): EvidenceDashboard {
  const r = asRecord(raw);
  const destaques = asRecord(r['destaques']);
  return {
    destaques: {
      elogios: Array.isArray(destaques['elogios'])
        ? destaques['elogios'].map(normalizeHighlight)
        : [],
      reclamacoes: Array.isArray(destaques['reclamacoes'])
        ? destaques['reclamacoes'].map(normalizeHighlight)
        : [],
    },
    fatores_decisivos: Array.isArray(r['fatores_decisivos'])
      ? r['fatores_decisivos'].map(normalizeFactor)
      : [],
    alertas: Array.isArray(r['alertas']) ? r['alertas'].map(normalizeAlert) : [],
    reviews_referencia: Array.isArray(r['reviews_referencia'])
      ? r['reviews_referencia'].map(normalizeReferenceGroup)
      : [],
    jogos_similares: Array.isArray(r['jogos_similares'])
      ? r['jogos_similares'].map(normalizeSimilar)
      : [],
  };
}

function normalizeNarrated(raw: unknown, index: number): NarratedHighlight {
  const r = asRecord(raw);
  return {
    id: asString(r['id'], `destaque-${index}`),
    frase: asString(r['frase']),
    fonte: r['fonte'] === 'modelo' ? 'modelo' : 'gemini',
  };
}

function normalizeNarrativa(raw: unknown): DashboardNarrative {
  const r = asRecord(raw);
  const validacao = asRecord(r['validacao']);
  return {
    resumo: asString(r['resumo']),
    destaques: Array.isArray(r['destaques']) ? r['destaques'].map(normalizeNarrated) : [],
    fonte: r['fonte'] === 'gemini' ? 'gemini' : 'fallback',
    validacao: {
      frases_substituidas: asNumber(validacao['frases_substituidas']),
      motivos: asStringArray(validacao['motivos']),
    },
  };
}

function normalizeCobertura(raw: unknown): Cobertura {
  const r = asRecord(raw);
  return {
    reviews_analisadas_similares: asNumber(r['reviews_analisadas_similares']),
    reviews_analisadas_genero: asNumber(r['reviews_analisadas_genero']),
    temas_disponiveis: asNumber(r['temas_disponiveis']),
  };
}

/** Normaliza a resposta bruta de POST /api/report para o contrato v3. */
export function normalizeFullReport(raw: unknown): FullReport {
  const r = asRecord(raw);
  const jogo = asRecord(r['jogo']);
  const evidenciasRaw = r['evidencias'];
  let evidencias: Record<string, string> | undefined;
  if (evidenciasRaw && typeof evidenciasRaw === 'object') {
    evidencias = {};
    for (const [k, v] of Object.entries(evidenciasRaw as Record<string, unknown>)) {
      if (typeof v === 'string') {
        evidencias[k] = v;
      }
    }
  }

  return {
    status: asString(r['status'], 'sucesso'),
    modo: 'pre-lancamento',
    jogo: {
      titulo: asString(jogo['titulo']),
      descricao: asString(jogo['descricao']),
      genres: asStringArray(jogo['genres']),
    },
    dashboard: normalizeDashboard(r['dashboard']),
    narrativa: normalizeNarrativa(r['narrativa']),
    cobertura: normalizeCobertura(r['cobertura']),
    evidencias,
  };
}
