import type { FullReport } from '../../domain/entities/full-report';
import type { GamePitch } from '../../domain/entities/game-pitch';
import { MOCK_REFERENCE_REVIEWS } from './mock-reference-reviews';

const MODELO = { f1_macro: 0.74, roc_auc: 0.83, n_amostras: 900 };

function emptyDashboard(): FullReport['dashboard'] {
  return {
    destaques: { elogios: [], reclamacoes: [] },
    fatores_decisivos: [],
    alertas: [],
    reviews_referencia: [],
    jogos_similares: [],
  };
}

function similares(): FullReport['dashboard']['jogos_similares'] {
  return [
    {
      id: 3,
      steam_appid: 367520,
      titulo: 'Hollow Knight',
      descricao: 'Ação e exploração 2D em um reino de insetos, com combate preciso e segredos.',
      preco_brl: 46.99,
      release_year: 2017,
      review_score_desc: 'Extremamente positivas',
      total_reviews_steam: 318420,
      pct_positivas: 0.97,
      similaridade: 0.86,
    },
    {
      id: 8,
      steam_appid: 1145360,
      titulo: 'Hades',
      descricao: 'Roguelike de ação com narrativa que avança a cada tentativa e combate ágil.',
      preco_brl: 79.9,
      release_year: 2020,
      review_score_desc: 'Extremamente positivas',
      total_reviews_steam: 214110,
      pct_positivas: 0.98,
      similaridade: 0.79,
    },
    {
      id: 12,
      steam_appid: 367450,
      titulo: 'Ori and the Blind Forest',
      descricao: 'Plataforma com exploração, plataforma precisa e história emocional.',
      preco_brl: 59.0,
      release_year: 2016,
      review_score_desc: 'Muito positivas',
      total_reviews_steam: 48210,
      pct_positivas: 0.93,
      similaridade: 0.74,
    },
    {
      id: 21,
      steam_appid: 588650,
      titulo: 'Dead Cells',
      descricao: 'Roguelite de ação com exploração curta e combate que pune erro de timing.',
      preco_brl: 47.49,
      release_year: 2018,
      review_score_desc: 'Extremamente positivas',
      total_reviews_steam: 112430,
      pct_positivas: 0.96,
      similaridade: 0.71,
    },
  ];
}

export function buildMockReport(pitch: GamePitch, insufficient: boolean): FullReport {
  const jogo = {
    titulo: pitch.titulo,
    descricao: pitch.descricao,
    genres: pitch.genres,
  };

  if (insufficient) {
    return {
      status: 'sucesso',
      modo: 'pre-lancamento',
      jogo,
      dashboard: {
        ...emptyDashboard(),
        alertas: [
          {
            tipo: 'dados_insuficientes',
            mensagem:
              'Ainda não há reviews suficientes nos jogos parecidos para medir elogios e reclamações recorrentes.',
            evidencia: { reviews_analisadas_similares: 0 },
          },
        ],
        jogos_similares: similares().slice(0, 2),
      },
      narrativa: {
        resumo: `Para “${pitch.titulo}” encontramos jogos parecidos, mas a base ainda não tem reviews analisadas o bastante para afirmar o que os jogadores elogiam ou criticam.`,
        destaques: [],
        fonte: 'fallback',
        validacao: { frases_substituidas: 0, motivos: [] },
      },
      cobertura: {
        reviews_analisadas_similares: 0,
        reviews_analisadas_genero: 12,
        temas_disponiveis: 0,
      },
      evidencias: {
        fonte_similares: 'pgvector_cosine',
        fonte_temas: 'absa_gemini + cluster_agglomerative',
        fonte_reviews: 'steam_get_app_reviews (sem dados de autor)',
      },
    };
  }

  return {
    status: 'sucesso',
    modo: 'pre-lancamento',
    jogo,
    dashboard: {
      destaques: {
        elogios: [
          {
            id: 'similares:similares:12',
            escopo: 'similares',
            genero: null,
            tema: {
              theme_id: 12,
              rotulo: 'história profunda e emocionante',
              categoria: 'história',
              polaridade: 'positivo',
            },
            frase:
              'Jogadores valorizam história profunda e emocionante: o tema aparece em 23% das reviews dos jogos similares, em 4 jogos diferentes.',
            jogos_exemplo: [
              { game_id: 3, titulo: 'Hollow Knight', mencoes: 14, prevalencia_no_jogo: 0.28 },
              { game_id: 8, titulo: 'Hades', mencoes: 11, prevalencia_no_jogo: 0.22 },
            ],
            metricas: {
              reviews_com_tema: 46,
              total_reviews: 200,
              prevalencia: 0.23,
              wilson_low: 0.177,
              wilson_high: 0.293,
              jogos_distintos: 4,
              total_jogos: 5,
              votos_uteis: 1830,
              pct_recomendadas_com_tema: 0.95,
              p_value_ajustado: 0.0012,
              log_odds: 1.9,
              significativo: true,
            },
            citacoes: [
              {
                review_id: 881,
                jogo: 'Hollow Knight',
                trecho: 'the lore is incredibly deep and the characters stay with you',
                recomendada: true,
                votos_uteis: 412,
                horas_jogadas: 63.5,
              },
              {
                review_id: 902,
                jogo: 'Hades',
                trecho: 'a história que continua mesmo quando você morre — cada run revela um pouco mais',
                recomendada: true,
                votos_uteis: 188,
                horas_jogadas: 41.2,
              },
            ],
            contexto: { pct_menos_2h: 0.04, pct_early_access: 0 },
          },
          {
            id: 'genero:Indie:18',
            escopo: 'genero',
            genero: 'Indie',
            tema: {
              theme_id: 18,
              rotulo: 'exploração que recompensa a curiosidade',
              categoria: 'gameplay',
              polaridade: 'positivo',
            },
            frase:
              'No gênero Indie, exploração que recompensa a curiosidade aparece em 31% das reviews, em jogos distintos.',
            jogos_exemplo: [
              { game_id: 3, titulo: 'Hollow Knight', mencoes: 19, prevalencia_no_jogo: 0.34 },
              { game_id: 12, titulo: 'Ori and the Blind Forest', mencoes: 9, prevalencia_no_jogo: 0.27 },
            ],
            metricas: {
              reviews_com_tema: 279,
              total_reviews: 900,
              prevalencia: 0.31,
              wilson_low: 0.281,
              wilson_high: 0.341,
              jogos_distintos: 7,
              total_jogos: 18,
              votos_uteis: 4210,
              pct_recomendadas_com_tema: 0.91,
              p_value_ajustado: 0.004,
              log_odds: 1.4,
              significativo: true,
            },
            citacoes: [
              {
                review_id: 884,
                jogo: 'Hollow Knight',
                trecho: 'Cada desvio do caminho principal esconde um atalho, um chefe ou um pedaço de lore.',
                recomendada: true,
                votos_uteis: 276,
                horas_jogadas: 38,
              },
              {
                review_id: 1104,
                jogo: 'Ori and the Blind Forest',
                trecho: 'every secret path feels earned, not padded',
                recomendada: true,
                votos_uteis: 96,
                horas_jogadas: 18.4,
              },
            ],
            contexto: { pct_menos_2h: 0.08, pct_early_access: 0.02 },
          },
        ],
        reclamacoes: [
          {
            id: 'similares:similares:31',
            escopo: 'similares',
            genero: null,
            tema: {
              theme_id: 31,
              rotulo: 'controles imprecisos nas primeiras horas',
              categoria: 'controles',
              polaridade: 'negativo',
            },
            frase:
              'Jogadores reclamam de controles imprecisos nas primeiras horas: o tema aparece em 18% das reviews dos jogos similares.',
            jogos_exemplo: [
              { game_id: 21, titulo: 'Dead Cells', mencoes: 8, prevalencia_no_jogo: 0.19 },
              { game_id: 12, titulo: 'Ori and the Blind Forest', mencoes: 6, prevalencia_no_jogo: 0.16 },
            ],
            metricas: {
              reviews_com_tema: 36,
              total_reviews: 200,
              prevalencia: 0.18,
              wilson_low: 0.133,
              wilson_high: 0.239,
              jogos_distintos: 3,
              total_jogos: 5,
              votos_uteis: 640,
              pct_recomendadas_com_tema: 0.22,
              p_value_ajustado: 0.008,
              log_odds: -1.6,
              significativo: true,
            },
            citacoes: [
              {
                review_id: 994,
                jogo: 'Hollow Knight',
                trecho: 'O controle nas primeiras duas horas parece impreciso.',
                recomendada: false,
                votos_uteis: 111,
                horas_jogadas: 1.6,
              },
              {
                review_id: 1440,
                jogo: 'Dead Cells',
                trecho: 'the first two hours feel slippery — I died to the controls, not the enemy',
                recomendada: false,
                votos_uteis: 157,
                horas_jogadas: 1.4,
              },
            ],
            contexto: { pct_menos_2h: 0.61, pct_early_access: 0.05 },
          },
          {
            id: 'genero:Ação:44',
            escopo: 'genero',
            genero: 'Ação',
            tema: {
              theme_id: 44,
              rotulo: 'dificuldade sem orientação clara',
              categoria: 'dificuldade',
              polaridade: 'negativo',
            },
            frase:
              'Em Ação, dificuldade sem orientação clara aparece com recorrência, embora o intervalo ainda seja largo.',
            jogos_exemplo: [{ game_id: 3, titulo: 'Hollow Knight', mencoes: 7, prevalencia_no_jogo: 0.11 }],
            metricas: {
              reviews_com_tema: 22,
              total_reviews: 400,
              prevalencia: 0.055,
              wilson_low: 0.036,
              wilson_high: 0.082,
              jogos_distintos: 2,
              total_jogos: 9,
              votos_uteis: 210,
              pct_recomendadas_com_tema: 0.48,
              p_value_ajustado: 0.19,
              log_odds: -0.3,
              significativo: false,
            },
            citacoes: [
              {
                review_id: 990,
                jogo: 'Hollow Knight',
                trecho: 'passei as primeiras horas sem saber para onde ir',
                recomendada: false,
                votos_uteis: 128,
                horas_jogadas: 2.2,
              },
              {
                review_id: 1002,
                jogo: 'Hollow Knight',
                trecho: 'as primeiras áreas não explicam o bastante para quem nunca jogou o gênero',
                recomendada: false,
                votos_uteis: 86,
                horas_jogadas: 3.1,
              },
            ],
            contexto: { pct_menos_2h: 0.22, pct_early_access: 0 },
          },
        ],
      },
      fatores_decisivos: [
        {
          genero: pitch.genres[0] ?? 'Indie',
          escopo: 'genero',
          feature: 'tema:12',
          rotulo: 'história profunda e emocionante',
          tipo: 'tema',
          importancia: 0.062,
          importancia_std: 0.008,
          direcao: 'aumenta',
          taxa_recomendacao_com: 0.95,
          taxa_recomendacao_sem: 0.71,
          suporte: 46,
          modelo: MODELO,
        },
        {
          genero: pitch.genres[0] ?? 'Indie',
          escopo: 'genero',
          feature: 'contexto:menos_2h',
          rotulo: 'Jogou menos de 2h ao avaliar',
          tipo: 'contexto',
          importancia: 0.051,
          importancia_std: 0.007,
          direcao: 'reduz',
          taxa_recomendacao_com: 0.41,
          taxa_recomendacao_sem: 0.82,
          suporte: 118,
          modelo: MODELO,
        },
        {
          genero: pitch.genres[0] ?? 'Indie',
          escopo: 'genero',
          feature: 'tema:31',
          rotulo: 'controles imprecisos',
          tipo: 'tema',
          importancia: 0.041,
          importancia_std: 0.006,
          direcao: 'reduz',
          taxa_recomendacao_com: 0.22,
          taxa_recomendacao_sem: 0.81,
          suporte: 57,
          modelo: MODELO,
        },
        {
          genero: pitch.genres[0] ?? 'Indie',
          escopo: 'genero',
          feature: 'tema:18',
          rotulo: 'exploração que recompensa a curiosidade',
          tipo: 'tema',
          importancia: 0.033,
          importancia_std: 0.005,
          direcao: 'aumenta',
          taxa_recomendacao_com: 0.91,
          taxa_recomendacao_sem: 0.68,
          suporte: 279,
          modelo: MODELO,
        },
        {
          genero: pitch.genres[0] ?? 'Indie',
          escopo: 'genero',
          feature: 'contexto:mais_50h',
          rotulo: 'Jogou mais de 50h ao avaliar',
          tipo: 'contexto',
          importancia: 0.027,
          importancia_std: 0.004,
          direcao: 'aumenta',
          taxa_recomendacao_com: 0.93,
          taxa_recomendacao_sem: 0.74,
          suporte: 186,
          modelo: MODELO,
        },
        {
          genero: pitch.genres[0] ?? 'Indie',
          escopo: 'genero',
          feature: 'contexto:early_access',
          rotulo: 'Avaliado durante o early access',
          tipo: 'contexto',
          importancia: 0.018,
          importancia_std: 0.004,
          direcao: 'reduz',
          taxa_recomendacao_com: 0.58,
          taxa_recomendacao_sem: 0.79,
          suporte: 41,
          modelo: MODELO,
        },
      ],
      alertas: [
        {
          tipo: 'primeiras_horas',
          mensagem:
            'A reclamação sobre controles se concentra nas primeiras horas: 61% das menções vêm de quem jogou menos de 2 horas.',
          evidencia: { destaque_id: 'similares:similares:31', pct_menos_2h: 0.61 },
        },
      ],
      reviews_referencia: MOCK_REFERENCE_REVIEWS,
      jogos_similares: similares(),
    },
    narrativa: {
      resumo: `Para “${pitch.titulo}”, jogadores de jogos parecidos elogiam história e exploração com recorrência medida, e a reclamação que mais pesa contra a recomendação é controle impreciso nas primeiras horas. Nada aqui estima chance de sucesso — só o que as reviews já dizem.`,
      destaques: [
        {
          id: 'similares:similares:12',
          frase:
            'Muitos jogadores valorizam história profunda com personagens que ficam, como em Hollow Knight e Hades.',
          fonte: 'gemini',
        },
        {
          id: 'genero:Indie:18',
          frase:
            'No Indie, a exploração que recompensa a curiosidade é um elogio recorrente, presente em Hollow Knight e Ori and the Blind Forest.',
          fonte: 'gemini',
        },
        {
          id: 'similares:similares:31',
          frase:
            'Uma reclamação recorrente é o controle parecer impreciso logo no começo, como relatam jogadores de Dead Cells e Ori and the Blind Forest.',
          fonte: 'modelo',
        },
        {
          id: 'genero:Ação:44',
          frase:
            'Em jogos de ação parecidos, parte das reviews aponta dificuldade sem orientação clara nas primeiras áreas, como em Hollow Knight.',
          fonte: 'gemini',
        },
      ],
      fonte: 'gemini',
      validacao: {
        frases_substituidas: 1,
        motivos: ['similares:similares:31: citou um jogo fora dos jogos-exemplo e foi trocada pela frase do modelo'],
      },
    },
    cobertura: {
      reviews_analisadas_similares: 200,
      reviews_analisadas_genero: 900,
      temas_disponiveis: 60,
    },
    evidencias: {
      fonte_similares: 'pgvector_cosine',
      fonte_temas: 'absa_gemini + cluster_agglomerative',
      fonte_recorrencia: 'wilson + qui_quadrado + benjamini_hochberg',
      fonte_fatores: 'random_forest_permutation_importance',
      fonte_reviews: 'steam_get_app_reviews (sem dados de autor)',
    },
  };
}
