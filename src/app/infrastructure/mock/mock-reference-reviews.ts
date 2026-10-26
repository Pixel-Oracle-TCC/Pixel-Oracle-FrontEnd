import type { ReferenceReview, ReferenceReviewsByGame } from '../../domain/entities/full-report';

function review(
  data: Pick<ReferenceReview, 'review_id' | 'texto' | 'votos_uteis' | 'horas_jogadas'> &
    Partial<ReferenceReview>,
  recomendada: boolean,
): ReferenceReview {
  return {
    recomendada,
    votes_funny: 0,
    weighted_vote_score: null,
    idioma: 'portuguese',
    early_access: false,
    resposta_desenvolvedor: null,
    ...data,
  };
}

function grupo(
  jogo: ReferenceReviewsByGame['jogo'],
  positivas: ReferenceReview[],
  negativas: ReferenceReview[],
): ReferenceReviewsByGame {
  return { jogo, positivas, negativas };
}

const hollowKnight = grupo(
  { id: 3, titulo: 'Hollow Knight', steam_appid: 367520 },
  [
    review(
      {
        review_id: 881,
        texto:
          'Um reino inteiro para se perder. O combate é justo, a trilha marca cada área e a história só se entrega a quem explora. Passei de sessenta horas e ainda acho cantos novos.',
        votos_uteis: 412,
        horas_jogadas: 63.5,
        idioma: 'english',
        weighted_vote_score: 0.93,
      },
      true,
    ),
    review(
      {
        review_id: 884,
        texto:
          'Cada desvio do caminho principal esconde um atalho, um chefe ou um pedaço de lore. A exploração recompensa a curiosidade de verdade, sem encher o mapa de marcadores.',
        votos_uteis: 276,
        horas_jogadas: 38,
      },
      true,
    ),
    review(
      {
        review_id: 886,
        texto:
          'Os personagens cabem em poucas falas e mesmo assim ficam. A história não é contada: ela é montada pelo que você encontra, e isso funciona.',
        votos_uteis: 241,
        horas_jogadas: 27.4,
        idioma: 'english',
      },
      true,
    ),
    review(
      {
        review_id: 890,
        texto:
          'O combate pede precisão, mas quase nunca parece injusto. Quando eu morria, entendia o porquê. A curva de dificuldade acompanha quem persiste.',
        votos_uteis: 198,
        horas_jogadas: 19.6,
      },
      true,
    ),
    review(
      {
        review_id: 893,
        texto:
          'A atmosfera carrega o jogo sozinha. Áreas silenciosas, uma trilha que muda com o lugar e a sensação constante de que o mapa ainda tem um andar embaixo.',
        votos_uteis: 164,
        horas_jogadas: 44.1,
        idioma: 'english',
      },
      true,
    ),
  ],
  [
    review(
      {
        review_id: 990,
        texto:
          'O mapa é lindo, mas passei as primeiras horas sem saber para onde ir e sem feedback claro quando errava o pulo. Desisti antes de entender o jogo.',
        votos_uteis: 128,
        horas_jogadas: 2.2,
        resposta_desenvolvedor:
          'Obrigado pelo relato. Estamos revisando as placas das primeiras áreas para deixar a direção mais legível sem tirar a exploração.',
      },
      false,
    ),
    review(
      {
        review_id: 994,
        texto:
          'O controle nas primeiras duas horas parece impreciso. Morri para o pulo, não para o inimigo. Depois melhora, mas muita gente não chega lá.',
        votos_uteis: 111,
        horas_jogadas: 1.6,
        idioma: 'english',
      },
      false,
    ),
    review(
      {
        review_id: 997,
        texto:
          'Voltar de um banco até o chefe, repetidas vezes, cansa. A dificuldade seria justa se o caminho de volta não punisse tanto.',
        votos_uteis: 97,
        horas_jogadas: 8.4,
      },
      false,
    ),
    review(
      {
        review_id: 1002,
        texto:
          'Sem um mapa mais claro no começo, a exploração vira labirinto. Gostei da ideia, mas as primeiras áreas não explicam o bastante para quem nunca jogou o gênero.',
        votos_uteis: 86,
        horas_jogadas: 3.1,
      },
      false,
    ),
    review(
      {
        review_id: 1008,
        texto:
          'Há um muro de dificuldade cedo demais. Quem busca uma aventura contemplativa encontra uma sequência de mortes sem orientação.',
        votos_uteis: 74,
        horas_jogadas: 4.8,
        idioma: 'english',
      },
      false,
    ),
  ],
);

const hades = grupo(
  { id: 8, titulo: 'Hades', steam_appid: 1145360 },
  [
    review(
      {
        review_id: 902,
        texto:
          'Cada morte avança a conversa com os personagens. O loop é curto, a história é longa, e o jogo respeita o tempo de quem só tem uma run por noite.',
        votos_uteis: 188,
        horas_jogadas: 41.2,
        weighted_vote_score: 0.88,
      },
      true,
    ),
    review(
      {
        review_id: 910,
        texto:
          'A história continua mesmo quando você morre. Cada run revela um pouco mais dos personagens, e isso transforma a repetição em narrativa.',
        votos_uteis: 173,
        horas_jogadas: 29,
      },
      true,
    ),
    review(
      {
        review_id: 914,
        texto:
          'O combate é legível e as builds mudam a run de verdade. Errar o timing é culpa minha, e o jogo deixa isso claro.',
        votos_uteis: 142,
        horas_jogadas: 22.5,
        idioma: 'english',
      },
      true,
    ),
    review(
      {
        review_id: 918,
        texto:
          'Os personagens são o motivo de voltar. Poucas linhas, muita personalidade, e a sensação de que a casa inteira lembra de você.',
        votos_uteis: 121,
        horas_jogadas: 35.8,
      },
      true,
    ),
    review(
      {
        review_id: 921,
        texto:
          'Dá para jogar em sessões curtas sem perder o fio. A história espera, o progresso fica, e a próxima tentativa começa rápido.',
        votos_uteis: 98,
        horas_jogadas: 16.2,
        idioma: 'english',
      },
      true,
    ),
  ],
  [
    review(
      {
        review_id: 940,
        texto:
          'Depois de muitas runs o cenário se repete. A história segura, mas o caminho até o fim começa a parecer o mesmo corredor.',
        votos_uteis: 84,
        horas_jogadas: 48,
      },
      false,
    ),
    review(
      {
        review_id: 944,
        texto:
          'A narrativa fica atrás de um muro de mortes. Quem não gosta de repetir o mesmo trecho não alcança o que o jogo promete.',
        votos_uteis: 77,
        horas_jogadas: 6.5,
        idioma: 'english',
      },
      false,
    ),
    review(
      {
        review_id: 948,
        texto:
          'Algumas falas voltam cedo demais. Os personagens são ótimos, mas o texto começa a girar antes da história andar.',
        votos_uteis: 63,
        horas_jogadas: 18.7,
      },
      false,
    ),
    review(
      {
        review_id: 952,
        texto:
          'A dificuldade sobe em degraus que o jogo não explica. Passei horas sem saber se eu estava errando a build ou se o jogo só queria que eu morresse mais.',
        votos_uteis: 58,
        horas_jogadas: 9.2,
      },
      false,
    ),
    review(
      {
        review_id: 956,
        texto:
          'O começo é generoso e o meio não. Quando a novidade dos personagens passa, sobra um loop que pune mais do que conta.',
        votos_uteis: 51,
        horas_jogadas: 14,
        idioma: 'english',
      },
      false,
    ),
  ],
);

export const MOCK_REFERENCE_REVIEWS: ReferenceReviewsByGame[] = [hollowKnight, hades];
